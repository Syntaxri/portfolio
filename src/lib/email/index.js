import { Resend } from 'resend';
import { isResendConfigured, getResendApiKey, getContactEmail } from '../env';
import { escapeHtml } from '../security/escapeHtml';

const ERRORS = {
  RESEND_NOT_CONFIGURED: { code: 'RESEND_NOT_CONFIGURED', message: 'Email service is not configured (missing RESEND_API_KEY).' },
  MISSING_RECIPIENT: { code: 'MISSING_RECIPIENT', message: 'Recipient email is not configured (missing CONTACT_EMAIL).' },
  RESEND_API_ERROR: { code: 'RESEND_API_ERROR', message: 'Email service returned an error.' },
  INVALID_INPUT: { code: 'INVALID_INPUT', message: 'Invalid email input.' },
};

let resendClient = null;

function getClient() {
  if (!resendClient && isResendConfigured()) {
    resendClient = new Resend(getResendApiKey());
  }
  return resendClient;
}

export async function sendContactEmail({ name, email, message }) {
  if (!name || !email || !message) {
    throw ERRORS.INVALID_INPUT;
  }

  const client = getClient();
  if (!client) {
    throw ERRORS.RESEND_NOT_CONFIGURED;
  }

  const to = getContactEmail();
  if (!to) {
    throw ERRORS.MISSING_RECIPIENT;
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  const { data, error } = await client.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to,
    replyTo: email,
    subject: `New message from ${safeName} — Portfolio`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2 style="color:#ff8c42;margin-bottom:4px">New portfolio message</h2>
        <p style="color:#666;margin-top:0;font-size:13px">Via akramrihani.dev contact form</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Message:</strong></p>
        <p style="background:#f9f9f9;padding:12px 16px;border-radius:6px;line-height:1.6">
          ${safeMessage.replace(/\n/g, '<br/>')}
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
        <p style="font-size:12px;color:#999">Reply directly to this email to respond to ${safeName}.</p>
      </div>
    `,
  });

  if (error) {
    throw { ...ERRORS.RESEND_API_ERROR, message: `Resend error: ${error.message || JSON.stringify(error)}` };
  }

  return data;
}
