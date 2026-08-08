import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendContactEmail, ContactEmailError, EMAIL_ERROR_CODES } from './index'

vi.mock('resend', () => {
  const sendMock = vi.fn(() => ({ data: { id: 'email_default' }, error: null }))
  return {
    Resend: class {
      emails = { send: sendMock }
    },
    __sendMock: sendMock,
  }
})

import { Resend, __sendMock } from 'resend'
import type { Mock } from 'vitest'

declare module 'resend' {
  export const __sendMock: Mock
}

const emails = { send: __sendMock }

describe('sendContactEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('RESEND_API_KEY', 're_secret_key')
    vi.stubEnv('CONTACT_EMAIL', 'me@example.com')
    expect(typeof Resend).toBe('function')
  })

  it('rejects empty input with a specific code', async () => {
    await expect(sendContactEmail({ name: '', email: '', message: '' })).rejects.toMatchObject({
      name: 'ContactEmailError',
      code: EMAIL_ERROR_CODES.INVALID_INPUT,
    })
  })

  it('fails with RESEND_NOT_CONFIGURED when the API key is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    await expect(
      sendContactEmail({ name: 'Jane', email: 'jane@x.com', message: 'hello message here' })
    ).rejects.toMatchObject({ code: EMAIL_ERROR_CODES.RESEND_NOT_CONFIGURED })
  })

  it('fails with MISSING_RECIPIENT when CONTACT_EMAIL is missing', async () => {
    vi.stubEnv('CONTACT_EMAIL', '')
    await expect(
      sendContactEmail({ name: 'Jane', email: 'jane@x.com', message: 'hello message here' })
    ).rejects.toMatchObject({ code: EMAIL_ERROR_CODES.MISSING_RECIPIENT })
  })

  it('sends an HTML-escaped email to the configured recipient and returns the id', async () => {
    emails.send.mockResolvedValueOnce({ data: { id: 'email_123' }, error: null })

    const { id } = await sendContactEmail({
      name: '<b>Jane</b>',
      email: 'jane@x.com',
      message: 'Hello <script>alert(1)</script>',
    })

    expect(id).toBe('email_123')
    expect(emails.send).toHaveBeenCalledTimes(1)
    const [payload] = emails.send.mock.calls[0]
    expect(payload.to).toBe('me@example.com')
    expect(payload.replyTo).toBe('jane@x.com')
    expect(payload.html).toContain('&lt;b&gt;Jane&lt;/b&gt;')
    expect(payload.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(payload.html).not.toContain('<script>')
  })

  it('maps a Resend failure to RESEND_API_ERROR', async () => {
    emails.send.mockResolvedValueOnce({ data: null, error: { message: 'rate limited' } })
    await expect(
      sendContactEmail({ name: 'Jane', email: 'jane@x.com', message: 'hello message here' })
    ).rejects.toMatchObject({ code: EMAIL_ERROR_CODES.RESEND_API_ERROR })
  })
})

describe('ContactEmailError', () => {
  it('carries a stable code and name', () => {
    const err = new ContactEmailError(EMAIL_ERROR_CODES.RESEND_API_ERROR, 'boom')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('ContactEmailError')
    expect(err.code).toBe('RESEND_API_ERROR')
    expect(err.message).toBe('boom')
  })
})
