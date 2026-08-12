import { validateEnv, missingEnvVars, isResendConfigured, type EnvValidationResult } from '@/lib/env'
import { sendContactEmail } from '@/lib/email'
import {
  sanitize,
  validateContact,
  MAX_NAME_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_EMAIL_LENGTH,
} from '@/lib/validation/contact'
import { checkRateLimit, getRateHeaders, getRateLimitStore } from '@/lib/rateLimit'
import { getClientIp } from '@/lib/network/getClientIp'
import { site } from '@/lib/data/site'

const isDev = process.env.NODE_ENV === 'development'

interface ContactPayload {
  name?: unknown
  email?: unknown
  message?: unknown
  website?: unknown
  phone?: unknown
}

interface ApiErrorEnvelope {
  success: false
  error: {
    code: string
    message: string
    fields?: Record<string, string>
  }
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(data, { status, headers })
}

function errorEnvelope(code: string, message: string, fields?: Record<string, string>): ApiErrorEnvelope {
  return { success: false, error: { code, message, ...(fields ? { fields } : {}) } }
}

/** Never leak internal exception details to the client — log them, return safe copy. */
function logFailure(context: string, err: unknown) {
  console.error(`[api/contact] ${context}:`, {
    code: err instanceof Error && 'code' in err ? (err as Error & { code?: string }).code : 'UNKNOWN',
    detail: err instanceof Error ? err.message : String(err),
  })
}

export async function POST(request: Request): Promise<Response> {
  // Misconfigured deploys must not crash with an opaque 500 — log loudly
  // and answer a structured 503 so visitors get a real message.
  let env: EnvValidationResult
  try {
    env = validateEnv()
  } catch {
    env = { ok: false, missing: missingEnvVars() }
  }
  if (!env.ok) {
    console.error(`[api/contact] Email service not configured: missing ${env.missing.join(', ')}`)
    return json(
      errorEnvelope(
        'SERVICE_NOT_CONFIGURED',
        'Email service is not configured yet. Please try again later, or email me directly at ' +
          `${site.email}.`
      ),
      503,
      { 'Retry-After': '60' }
    )
  }

  const ip = getClientIp(request)
  const rateResult = await checkRateLimit(ip, getRateLimitStore())
  const rateHeaders = getRateHeaders(rateResult)

  if (!rateResult.allowed) {
    return json(
      errorEnvelope(
        'RATE_LIMITED',
        `Too many requests. Please wait ${rateResult.retryAfter}s before retrying.`
      ),
      429,
      { ...rateHeaders, 'Retry-After': String(rateResult.retryAfter) }
    )
  }

  let raw: ContactPayload
  try {
    raw = (await request.json()) as ContactPayload
  } catch {
    return json(errorEnvelope('INVALID_JSON', 'Invalid request body.'), 400, rateHeaders)
  }

  const name = sanitize(raw.name, MAX_NAME_LENGTH)
  const email = sanitize(raw.email, MAX_EMAIL_LENGTH)
  const message = sanitize(raw.message, MAX_MESSAGE_LENGTH)
  const honeypot = raw.website || raw.phone || ''

  if (honeypot) {
    return json({ success: true, message: 'Message received.' }, 200, rateHeaders)
  }

  const errors = validateContact({ name, email, message })
  if (Object.keys(errors).length > 0) {
    return json(
      errorEnvelope('VALIDATION_ERROR', Object.values(errors)[0] as string, errors),
      400,
      rateHeaders
    )
  }

  try {
    if (!isResendConfigured()) {
      if (isDev) {
        console.log('\n[Contact Form Submission]')
        console.log('  Name:   ', name)
        console.log('  Email:  ', email)
        console.log('  Message:', message.slice(0, 100))
        console.log('  → Set RESEND_API_KEY in .env.local to send real emails\n')
      } else {
        return json(
          errorEnvelope('EMAIL_NOT_CONFIGURED', 'Email service is not configured.'),
          500,
          rateHeaders
        )
      }
    } else {
      await sendContactEmail({ name, email, message })
    }

    return json(
      { success: true, message: "Message received! I'll get back to you within 24 hours." },
      200,
      rateHeaders
    )
  } catch (err) {
    console.error('[/api/contact] Error sending email:', {
      code:
        err instanceof Error && 'code' in err ? String((err as Error & { code?: string }).code) : 'UNKNOWN',
      detail: err instanceof Error ? err.message : String(err),
    })
    return json(
      errorEnvelope(
        'EMAIL_SEND_FAILED',
        `Failed to send your message. Please try again or email me directly at ${site.email}.`
      ),
      500,
      rateHeaders
    )
  }
}

export async function GET(_request: Request) {
  return json(errorEnvelope('METHOD_NOT_ALLOWED', 'Method not allowed.'), 405)
}

export async function PUT(_request: Request) {
  return json(errorEnvelope('METHOD_NOT_ALLOWED', 'Method not allowed.'), 405)
}

export async function DELETE(_request: Request) {
  return json(errorEnvelope('METHOD_NOT_ALLOWED', 'Method not allowed.'), 405)
}
