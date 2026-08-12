import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const REQUIRED = ['RESEND_API_KEY', 'CONTACT_EMAIL']

function loadDotEnvLocal() {
  const path = resolve('.env.local')
  if (!existsSync(path)) return {}
  const env = {}
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const cleaned = line.trim()
    if (!cleaned || cleaned.startsWith('#')) continue
    const eq = cleaned.indexOf('=')
    if (eq === -1) continue
    env[cleaned.slice(0, eq).trim()] = cleaned.slice(eq + 1).trim()
  }
  return env
}

const local = loadDotEnvLocal()
const missing = REQUIRED.filter((key) => !process.env[key] && !local[key])

if (missing.length > 0) {
  const hint =
    'Set them in .env.local or on the deploy platform ' +
    '(e.g. Vercel → Project Settings → Environment Variables).'
  if (process.env.CI === 'true') {
    console.error(`[check-env] Missing required environment variables: ${missing.join(', ')}`)
    console.error(`[check-env] ${hint}`)
    process.exit(1)
  }
  console.warn(`[check-env] Missing required environment variables: ${missing.join(', ')}`)
  console.warn(`[check-env] ${hint}`)
  console.warn('[check-env] Continuing locally; the contact endpoint will answer 503 in production.')
}