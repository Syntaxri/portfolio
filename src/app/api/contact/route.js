/**
 * src/app/api/contact/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * FIX: Resend client is instantiated INSIDE the POST handler, never at
 * module level. This prevents the "Missing API key" build error which happens
 * because process.env is not available during Next.js static analysis / build.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── In-memory rate limiter ─────────────────────────────────────────────────
const rateLimitStore = new Map();
const RATE_LIMIT     = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip) {
  const now    = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  if (record.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

function sanitize(val, maxLen = 1000) {
  if (typeof val !== 'string') return '';
  return val.replace(/<[^>]*>/g, '').replace(/\0/g, '').trim().slice(0, maxLen);
}

// ── POST handler ───────────────────────────────────────────────────────────
export async function POST(request) {
  // Rate limit
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = (forwarded ? forwarded.split(',')[0] : '127.0.0.1').trim();
  const { allowed, remaining, retryAfter } = checkRateLimit(ip);

  const rateHeaders = {
    'X-RateLimit-Limit':     String(RATE_LIMIT),
    'X-RateLimit-Remaining': String(remaining ?? 0),
  };

  if (!allowed) {
    return Response.json(
      { error: `Too many requests. Please wait ${retryAfter}s before retrying.` },
      { status: 429, headers: { ...rateHeaders, 'Retry-After': String(retryAfter) } }
    );
  }

  // Parse body
  let raw;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Sanitize
  const name     = sanitize(raw.name,    100);
  const email    = sanitize(raw.email,   254);
  const message  = sanitize(raw.message, 1000);
  const honeypot = raw.website || raw.phone || '';

  // Honeypot — silent reject bots
  if (honeypot) {
    return Response.json({ success: true }, { status: 200 });
  }

  // Validate
  const errors = {};
  if (!name)                      errors.name    = 'Name is required.';
  else if (name.length < 2)       errors.name    = 'Name must be at least 2 characters.';
  if (!email)                     errors.email   = 'Email is required.';
  else if (!EMAIL_RE.test(email)) errors.email   = 'Invalid email address.';
  if (!message)                   errors.message = 'Message is required.';
  else if (message.length < 10)   errors.message = 'Message must be at least 10 characters.';

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { error: Object.values(errors)[0], fields: errors },
      { status: 400, headers: rateHeaders }
    );
  }

  // ── Send email ─────────────────────────────────────────────────────────────
  try {

    // ══ OPTION A: Resend ════════════════════════════════════════════════════
    // ✅ Resend client created HERE (inside handler) — never at module level
    // This is the fix: process.env is only available at runtime, not build time
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend'); // dynamic import = runtime only
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from:    'Portfolio Contact <onboarding@resend.dev>',
        to:      process.env.CONTACT_EMAIL || 'akramrihanie@gmail.com',
        replyTo: email,
        subject: `New message from ${name} — Portfolio`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
            <h2 style="color:#ff8c42;margin-bottom:4px">New portfolio message</h2>
            <p style="color:#666;margin-top:0;font-size:13px">Via akramrihani.dev contact form</p>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p style="background:#f9f9f9;padding:12px 16px;border-radius:6px;line-height:1.6">
              ${message.replace(/\n/g, '<br/>')}
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
            <p style="font-size:12px;color:#999">Reply directly to this email to respond to ${name}.</p>
          </div>
        `,
      });
    }

    // ══ OPTION B: Nodemailer / SMTP ══════════════════════════════════════════
    // Uncomment this block and comment out Option A if you prefer SMTP
    /*
    if (process.env.SMTP_HOST) {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST,
        port:   Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({
        from:    `"Portfolio" <${process.env.SMTP_USER}>`,
        to:      process.env.CONTACT_EMAIL || 'hello@akramrihani.dev',
        replyTo: email,
        subject: `Portfolio message from ${name}`,
        text:    `Name: ${name}\nEmail: ${email}\n\n${message}`,
      });
    }
    */

    // Development fallback — logs to terminal if no email service configured
    if (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST) {
      console.log('\n📬 [Contact Form Submission]');
      console.log('   Name:   ', name);
      console.log('   Email:  ', email);
      console.log('   Message:', message.slice(0, 100) + (message.length > 100 ? '…' : ''));
      console.log('   → Add RESEND_API_KEY to .env.local to send real emails\n');
    }

    return Response.json(
      { success: true, message: "Message received! I'll get back to you within 24 hours." },
      { status: 200, headers: rateHeaders }
    );

  } catch (err) {
    console.error('[/api/contact] Error:', err?.message || err);
    return Response.json(
      { error: 'Failed to send your message. Please try again or email me directly at hello@akramrihani.dev' },
      { status: 500, headers: rateHeaders }
    );
  }
}

export async function GET()    { return Response.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function PUT()    { return Response.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function DELETE() { return Response.json({ error: 'Method not allowed.' }, { status: 405 }); }