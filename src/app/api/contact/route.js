import { validateEnv, isResendConfigured } from '@/lib/env';
import { sendContactEmail } from '@/lib/email';
import { sanitize, validateContact } from '@/lib/validation/contact';
import { checkRateLimit, getRateHeaders } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/network/getClientIp';
import { MAX_NAME_LENGTH, MAX_MESSAGE_LENGTH } from '@/config/contact';

const isDev = process.env.NODE_ENV === 'development';

function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers });
}

export async function POST(request) {
  validateEnv();

  const ip = getClientIp(request);
  const rateResult = checkRateLimit(ip);
  const rateHeaders = getRateHeaders(rateResult);

  if (!rateResult.allowed) {
    return json(
      { success: false, error: { code: 'RATE_LIMITED', message: `Too many requests. Please wait ${rateResult.retryAfter}s before retrying.` } },
      429,
      { ...rateHeaders, 'Retry-After': String(rateResult.retryAfter) },
    );
  }

  let raw;
  try {
    raw = await request.json();
  } catch {
    return json({ success: false, error: { code: 'INVALID_JSON', message: 'Invalid request body.' } }, 400, rateHeaders);
  }

  const name = sanitize(raw.name, MAX_NAME_LENGTH);
  const email = sanitize(raw.email, 254);
  const message = sanitize(raw.message, MAX_MESSAGE_LENGTH);
  const honeypot = raw.website || raw.phone || '';

  if (honeypot) {
    return json({ success: true, message: 'Message received.' }, 200, rateHeaders);
  }

  const errors = validateContact({ name, email, message });
  if (Object.keys(errors).length > 0) {
    return json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: Object.values(errors)[0], fields: errors } },
      400,
      rateHeaders,
    );
  }

  try {
    if (!isResendConfigured()) {
      if (isDev) {
        console.log('\n[Contact Form Submission]');
        console.log('  Name:   ', name);
        console.log('  Email:  ', email);
        console.log('  Message:', message.slice(0, 100));
        console.log('  → Set RESEND_API_KEY in .env.local to send real emails\n');
      } else {
        return json(
          { success: false, error: { code: 'EMAIL_NOT_CONFIGURED', message: 'Email service is not configured.' } },
          500,
          rateHeaders,
        );
      }
    } else {
      await sendContactEmail({ name, email, message });
    }

    return json(
      { success: true, message: "Message received! I'll get back to you within 24 hours." },
      200,
      rateHeaders,
    );
  } catch (err) {
    const code = err?.code || 'UNKNOWN';
    const msg = err?.message || err || 'An unexpected error occurred.';
    console.error('[/api/contact] Error:', { code, message: msg });
    return json(
      { success: false, error: { code, message: 'Failed to send your message. Please try again or email me directly at hello@akramrihani.dev' } },
      500,
      rateHeaders,
    );
  }
}

export async function GET() { return json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' } }, 405); }
export async function PUT() { return json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' } }, 405); }
export async function DELETE() { return json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' } }, 405); }
