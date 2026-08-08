import { describe, it, expect, vi, afterEach } from 'vitest'
import { validateEnv, isResendConfigured, getResendApiKey, getContactEmail } from './env'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('validateEnv', () => {
  it('reports missing variables without throwing in development', () => {
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('CONTACT_EMAIL', '')
    const result = validateEnv()
    expect(result.ok).toBe(false)
    expect(result.missing.sort()).toEqual(['CONTACT_EMAIL', 'RESEND_API_KEY'])
  })

  it('passes when everything is present', () => {
    vi.stubEnv('RESEND_API_KEY', 'k')
    vi.stubEnv('CONTACT_EMAIL', 'a@b.com')
    expect(validateEnv()).toEqual({ ok: true, missing: [] })
  })

  it('throws in production when variables are missing', () => {
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('CONTACT_EMAIL', '')
    vi.stubEnv('NODE_ENV', 'production')
    expect(() => validateEnv()).toThrow(/Missing required environment variables/)
  })
})

describe('env accessors', () => {
  it('reflects RESEND_API_KEY', () => {
    vi.stubEnv('RESEND_API_KEY', 're_secret')
    expect(isResendConfigured()).toBe(true)
    expect(getResendApiKey()).toBe('re_secret')
  })

  it('is unconfigured without a key', () => {
    vi.stubEnv('RESEND_API_KEY', '')
    expect(isResendConfigured()).toBe(false)
    expect(getResendApiKey()).toBe('')
  })

  it('reads CONTACT_EMAIL', () => {
    vi.stubEnv('CONTACT_EMAIL', 'me@example.com')
    expect(getContactEmail()).toBe('me@example.com')
  })
})
