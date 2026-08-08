import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST, GET, PUT, DELETE } from './route'
import { sendContactEmail } from '@/lib/email'
import { isResendConfigured } from '@/lib/env'
import { getClientIp } from '@/lib/network/getClientIp'
import { defaultRateLimitStore } from '@/lib/rateLimit'
import { RATE_LIMIT_MAX } from '@/config/contact'
import { site } from '@/lib/data/site'

vi.mock('@/lib/email', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/email')>()),
  sendContactEmail: vi.fn(),
}))

vi.mock('@/lib/env', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/env')>()),
  validateEnv: vi.fn(() => ({ ok: true, missing: [] })),
  isResendConfigured: vi.fn(() => true),
}))

vi.mock('@/lib/network/getClientIp', () => ({
  getClientIp: vi.fn(() => '203.0.113.9'),
}))

function post(body: unknown, headers: Record<string, string> = { 'content-type': 'application/json' }) {
  return POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
  )
}

async function bodyOf(res: Response) {
  return (await res.json()) as Record<string, unknown>
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(sendContactEmail).mockResolvedValue({ id: 'email_x' })
  defaultRateLimitStore.clear()
})

describe('POST /api/contact', () => {
  it('accepts a valid submission and passes sanitized fields to the mailer', async () => {
    const res = await post({
      name: '  Jane <b>Doe</b>  ',
      email: 'jane@example.com',
      message: '  Hello there, this is a long enough message.  ',
    })

    expect(res.status).toBe(200)
    expect((await bodyOf(res)).success).toBe(true)
    expect(vi.mocked(sendContactEmail)).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello there, this is a long enough message.',
    })
  })

  it('rejects invalid input with 400 and field errors', async () => {
    const res = await post({ name: 'J', email: 'nope', message: 'short' })
    expect(res.status).toBe(400)
    const body = await bodyOf(res)
    expect(body.error).toMatchObject({ code: 'VALIDATION_ERROR' })
    expect((body.error as { fields: Record<string, string> }).fields).toBeDefined()
    expect(vi.mocked(sendContactEmail)).not.toHaveBeenCalled()
  })

  it('returns 400 INVALID_JSON for a malformed body', async () => {
    const res = await post('{"name": "unterminated', { 'content-type': 'application/json' })
    expect(res.status).toBe(400)
    expect((await bodyOf(res)).error).toMatchObject({ code: 'INVALID_JSON' })
  })

  it('silently accepts honeypot submissions without sending mail', async () => {
    const res = await post({
      name: 'Spam bot',
      email: 'bot@example.com',
      message: 'Buy my product right now',
      website: 'http://spam.example',
    })
    expect(res.status).toBe(200)
    expect((await bodyOf(res)).success).toBe(true)
    expect(vi.mocked(sendContactEmail)).not.toHaveBeenCalled()
  })

  it('rate-limits clients beyond the max with Retry-After', async () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      expect((await post({ name: 'Ann', email: 'a@b.com', message: 'x'.repeat(20) })).status).toBe(200)
    }
    const res = await post({ name: 'Ann', email: 'a@b.com', message: 'x'.repeat(20) })
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe('600')
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('0')
    expect((await bodyOf(res)).error).toMatchObject({ code: 'RATE_LIMITED' })
  })

  it('returns 500 with a safe message when mail sending fails', async () => {
    vi.mocked(sendContactEmail).mockRejectedValueOnce(new Error('SMTP broken: creds leaked in detail'))
    const res = await post({ name: 'Ann', email: 'a@b.com', message: 'x'.repeat(20) })
    expect(res.status).toBe(500)
    const body = await bodyOf(res)
    expect(body.error).toMatchObject({ code: 'EMAIL_SEND_FAILED' })
    expect(JSON.stringify(body)).not.toContain('SMTP broken')
    expect(JSON.stringify(body)).toContain(site.email)
  })

  it('returns 500 when resend is unconfigured outside development', async () => {
    vi.mocked(isResendConfigured).mockReturnValueOnce(false)
    const res = await post({ name: 'Ann', email: 'a@b.com', message: 'x'.repeat(20) })
    expect(res.status).toBe(500)
    expect((await bodyOf(res)).error).toMatchObject({ code: 'EMAIL_NOT_CONFIGURED' })
  })
})

describe('unsupported methods', () => {
  it.each([['GET'], ['PUT'], ['DELETE']])('rejects %s with 405', async (method) => {
    const handler = method === 'GET' ? GET : method === 'PUT' ? PUT : DELETE
    const res = await handler(new Request('http://localhost/api/contact', { method }))
    expect(res.status).toBe(405)
    expect((await bodyOf(res)).error).toMatchObject({ code: 'METHOD_NOT_ALLOWED' })
  })
})

describe('rate limiting applies to the real client ip', () => {
  it('keys on getClientIp output', async () => {
    vi.mocked(getClientIp).mockReturnValueOnce('198.51.100.42')
    const res = await post({ name: 'Ann', email: 'a@b.com', message: 'x'.repeat(20) })
    expect(res.status).toBe(200)
    expect(defaultRateLimitStore.get('198.51.100.42')).toBeDefined()
  })
})
