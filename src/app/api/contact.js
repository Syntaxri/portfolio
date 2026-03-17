/**
 * /api/contact — Production contact endpoint
 * ─────────────────────────────────────────────────────────────────────────────
 * Security & reliability features:
 *  • Method guard — only POST allowed
 *  • Rate limiting — 5 requests per IP per 10 minutes (in-memory, resets on deploy)
 *  • Input sanitization — strips HTML tags, trims whitespace
 *  • Server-side validation — mirrors client-side rules
 *  • Honeypot field check — bots often fill hidden fields
 *  • Request size limit — rejects payloads over 10KB
 *  • Structured error responses — consistent JSON shape
 *  • Ready for Nodemailer / Resend integration
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── In-memory rate limiter ────────────────────────────────────────────────
// Production: replace with Redis (upstash-redis or ioredis)
const rateLimitStore = new Map(); // ip → { count, resetAt }
const RATE_LIMIT     = 5;         // max requests
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

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

// ── Sanitize: strip HTML tags, limit length ───────────────────────────────
function sanitize(str, maxLen = 1000) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/\0/g, '')        // strip null bytes
    .trim()
    .slice(0, maxLen);
}

// ── Main handler ──────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // ── Method guard
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // ── Request size guard (~10KB)
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 10_000) {
    return res.status(413).json({ error: 'Request too large.' });
  }

  // ── Rate limiting
  const ip = (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'unknown'
  ).trim();

  const { allowed, remaining, retryAfter } = checkRateLimit(ip);
  res.setHeader('X-RateLimit-Limit',     String(RATE_LIMIT));
  res.setHeader('X-RateLimit-Remaining', String(remaining ?? 0));

  if (!allowed) {
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({
      error: `Too many requests. Please wait ${retryAfter} seconds before trying again.`,
    });
  }

  // ── Parse + sanitize body
  const raw = req.body || {};
  const name    = sanitize(raw.name,    100);
  const email   = sanitize(raw.email,   254); // RFC 5321 max email length
  const message = sanitize(raw.message, 1000);
  const honeypot = raw.website || raw.phone || ''; // bots fill these

  // ── Honeypot — silent reject if filled
  if (honeypot) {
    // Return 200 to fool bots while discarding the request
    return res.status(200).json({ success: true, message: 'Message received!' });
  }

  // ── Server-side validation
  const errors = {};
  if (!name)              errors.name    = 'Name is required.';
  else if (name.length < 2) errors.name  = 'Name must be at least 2 characters.';
  if (!email)             errors.email   = 'Email is required.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Invalid email address.';
  if (!message)           errors.message = 'Message is required.';
  else if (message.length < 10) errors.message = 'Message must be at least 10 characters.';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: Object.values(errors)[0], fields: errors });
  }

  // ── Send email (uncomment and configure for production)
  try {
    /*
    // ── Option A: Nodemailer + SMTP ──────────────────────────────────────
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from:    `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to:      process.env.CONTACT_EMAIL || 'hello@akramrihani.dev',
      replyTo: email,
      subject: `New message from ${name} via portfolio`,
      text:    `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html:    `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g,'<br/>')}</p>`,
    });

    // ── Option B: Resend ─────────────────────────────────────────────────
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Portfolio <onboarding@resend.dev>',
    //   to:   process.env.CONTACT_EMAIL || 'hello@akramrihani.dev',
    //   subject: `Portfolio message from ${name}`,
    //   html: `<p>${message}</p>`,
    // });
    */

    // Development: log to console
    console.log('[Contact API]', { name, email, message: message.slice(0, 80) + '…' });

    return res.status(200).json({
      success: true,
      message: 'Message received! I\'ll get back to you within 24 hours.',
    });

  } catch (err) {
    console.error('[Contact API] Send error:', err);
    return res.status(500).json({
      error: 'Failed to send your message. Please try again or email me directly.',
    });
  }
}