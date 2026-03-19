/**
 * src/app/api/contact/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * App Router API Route — uses Web Request/Response API (not req/res).
 * 
 * Features:
 *  • Rate limiting — 5 req / IP / 10 min (in-memory; swap for Redis in prod)
 *  • Input sanitization — strips HTML, null bytes, enforces max lengths
 *  • Honeypot spam protection — silent 200 for bots
 *  • Server-side validation — mirrors client rules independently
 *  • Ready for Nodemailer / Resend (commented examples included)
 */
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── In-memory rate limiter ─────────────────────────────────────────────────
// Production: replace with Upstash Redis or similar
const rateLimitStore = new Map();
const RATE_LIMIT     = 5;
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

// ── Sanitize input ─────────────────────────────────────────────────────────
function sanitize(val, maxLen = 1000) {
  if (typeof val !== 'string') return '';
  return val.replace(/<[^>]*>/g, '').replace(/\0/g, '').trim().slice(0, maxLen);
}

// ── POST handler ───────────────────────────────────────────────────────────
export async function POST(request) {
  // Rate limit by IP
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
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Sanitize
  const name     = sanitize(raw.name,    100);
  const email    = sanitize(raw.email,   254);
  const message  = sanitize(raw.message, 1000);
  const honeypot = raw.website || raw.phone || '';

  // Honeypot — silent reject
  if (honeypot) {
    return Response.json({ success: true, message: 'Message received!' }, { status: 200 });
  }

  // Validate
  const errors = {};
  if (!name)             errors.name    = 'Name is required.';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';
  if (!email)            errors.email   = 'Email is required.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Invalid email address.';
  if (!message)          errors.message = 'Message is required.';
  else if (message.length < 10) errors.message = 'Message must be at least 10 characters.';

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { error: Object.values(errors)[0], fields: errors },
      { status: 400, headers: rateHeaders }
    );
  }

  // Send email
  try {
    /*
    // ── Nodemailer ──────────────────────────────────────────────────────────
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from:    `"Portfolio" <${process.env.SMTP_USER}>`,
      to:      process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text:    `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    // ── Resend ──────────────────────────────────────────────────────────────
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Portfolio <noreply@akramrihani.dev>',
    //   to:   process.env.CONTACT_EMAIL,
    //   subject: `Portfolio message from ${name}`,
    //   html: `<p><b>${name}</b> (${email})</p><p>${message}</p>`,
    // });
    */

    await resend.emails.send({
      from:    'Portfolio <onboarding@resend.dev>',
      to:      process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <h2>New portfolio message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    return Response.json(
      { success: true, message: "Message received! I'll get back to you within 24 hours." },
      { status: 200, headers: rateHeaders }
    );
  } catch (err) {
    console.error('[/api/contact] send error:', err);
    return Response.json(
      { error: 'Failed to send message. Please try again or email me directly.' },
      { status: 500, headers: rateHeaders }
    );
  }
}

// All other methods → 405
export async function GET()    { return Response.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function PUT()    { return Response.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function DELETE() { return Response.json({ error: 'Method not allowed.' }, { status: 405 }); }