import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from '@/config/contact'

/**
 * Sliding-window rate limiting with a pluggable store.
 *
 * The default store is in-memory: correct for a single instance, but on
 * serverless platforms (Vercel) each instance has its own memory, so the
 * limit is best-effort per instance. Swap in a shared adapter (Redis /
 * Upstash KV) when cross-instance enforcement is required — keep the
 * RateLimitStore contract and the route stays untouched.
 */
export interface RateLimitRecord {
  count: number
  resetAt: number
}

export interface RateLimitStore {
  get(key: string): RateLimitRecord | undefined
  set(key: string, record: RateLimitRecord): void
  clear?(): void
}

export class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, RateLimitRecord>()

  get(key: string): RateLimitRecord | undefined {
    return this.store.get(key)
  }

  set(key: string, record: RateLimitRecord): void {
    this.store.set(key, record)
  }

  clear(): void {
    this.store.clear()
  }
}

export const defaultRateLimitStore = new MemoryRateLimitStore()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter?: number
}

export function checkRateLimit(ip: string, store: RateLimitStore = defaultRateLimitStore): RateLimitResult {
  const now = Date.now()
  const record = store.get(ip)

  if (!record || now > record.resetAt) {
    store.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000)
    return { allowed: false, remaining: 0, retryAfter }
  }

  record.count++
  store.set(ip, record)
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count }
}

export function getRateHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
    'X-RateLimit-Remaining': String(result.remaining),
  }
}
