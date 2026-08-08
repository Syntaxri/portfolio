import { Resend } from 'resend'
import { isResendConfigured, getResendApiKey, getContactEmail } from '@/lib/env'
import { escapeHtml } from '@/lib/security/escapeHtml'

export interface ContactInput {
  name: string
  email: string
  message: string
}

export const EMAIL_ERROR_CODES = {
  INVALID_INPUT: 'INVALID_INPUT',
  RESEND_NOT_CONFIGURED: 'RESEND_NOT_CONFIGURED',
  MISSING_RECIPIENT: 'MISSING_RECIPIENT',
  RESEND_API_ERROR: 'RESEND_API_ERROR',
} as const

export type EmailErrorCode = (typeof EMAIL_ERROR_CODES)[keyof typeof EMAIL_ERROR_CODES]

/**
 * Typed error for the email layer. The code is safe to expose to the API
 * consumer; the detail message is for server-side logs only.
 */
export class ContactEmailError extends Error {
  readonly code: EmailErrorCode

  constructor(code: EmailErrorCode, detail: string) {
    super(detail)
    this.name = 'ContactEmailError'
    this.code = code
  }
}

let resendClient: Resend | null = null

function getClient(): Resend | null {
  if (!resendClient && isResendConfigured()) {
    resendClient = new Resend(getResendApiKey())
  }
  return resendClient
}

export async function sendContactEmail({ name, email, message }: ContactInput): Promise<{ id: string }> {
  if (!name || !email || !message) {
    throw new ContactEmailError(EMAIL_ERROR_CODES.INVALID_INPUT, 'Missing name, email, or message.')
  }

  const client = getClient()
  if (!client) {
    throw new ContactEmailError(EMAIL_ERROR_CODES.RESEND_NOT_CONFIGURED, 'Missing RESEND_API_KEY.')
  }

  const to = getContactEmail()
  if (!to) {
    throw new ContactEmailError(EMAIL_ERROR_CODES.MISSING_RECIPIENT, 'Missing CONTACT_EMAIL.')
  }

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message)

  const { data, error } = await client.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to,
    replyTo: email,
    subject: `New message from ${safeName} — Portfolio`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2 style="color:#ff8c42;margin-bottom:4px">New portfolio message</h2>
        <p style="color:#666;margin-top:0;font-size:13px">Via akramrihani.com contact form</p>
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
  })

  if (error) {
    throw new ContactEmailError(
      EMAIL_ERROR_CODES.RESEND_API_ERROR,
      `Resend error: ${error.message || JSON.stringify(error)}`
    )
  }

  return { id: data?.id ?? '' }
}
