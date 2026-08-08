const REQUIRED_VARS = ['RESEND_API_KEY', 'CONTACT_EMAIL'] as const

export type RequiredEnvVar = (typeof REQUIRED_VARS)[number]

export interface EnvValidationResult {
  ok: boolean
  missing: RequiredEnvVar[]
}

/**
 * Validates the server-side environment. Throws in production when
 * required variables are missing so the boot fails loudly; in
 * development/test it reports so the API can fall back to logging.
 */
export function validateEnv(env: NodeJS.ProcessEnv = process.env): EnvValidationResult {
  const missing = REQUIRED_VARS.filter((key) => !env[key])
  if (missing.length > 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
    return { ok: false, missing }
  }
  return { ok: true, missing: [] }
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

export function getResendApiKey(): string {
  return process.env.RESEND_API_KEY || ''
}

export function getContactEmail(): string {
  return process.env.CONTACT_EMAIL || ''
}
