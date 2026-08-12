import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from '@/config/contact'
import { RedisRateLimitStore, isRedisConfigured } from './redisStore'

/**
 * Token-bucket rate limiting with a pluggable store.
 *
 * In production, the shared Redis (Upstash KV REST) store enforces the
 * limit across every serverless instance. Without Redis configured the
 * in-memory store is used: correct per instance, best-effort at fleet
 * level — that is also the local-development and test-path behavior.
 */
export interface RateLimitRecord {
  count: number
  resetAt: number
}

export interface RateLimitStore {
  check(key: string, limit: number, windowMs: number): Promise<RateLimitResult>
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

  async check(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const now = Date.now()
    const record = this.get(key)

    if (!record || now > record.resetAt) {
      this.set(key, { count: 1, resetAt: now + windowMs })
      return { allowed: true, remaining: limit - 1 }
    }

    if (record.count >= limit) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000)
      return { allowed: false, remaining: 0, retryAfter }
    }

    record.count++
    this.set(key, record)
    return { allowed: true, remaining: limit - record.count }
  }
}

export const defaultRateLimitStore = new MemoryRateLimitStore()

let redisStore: RedisRateLimitStore | null = null

/** Shared store: Redis when configured, otherwise per-instance memory. */
export function getRateLimitStore(env: NodeJS.ProcessEnv = process.env): RateLimitStore {
  if (isRedisConfigured(env)) {
    redisStore ??= new RedisRateLimitStore({
      url: env.UPSTASH_REDIS_KV_REST_API_URL as string,
      token: env.UPSTASH_REDIS_KV_REST_API_TOKEN as string,
    })
    return redisStore
  }
  if (redisStore) {
    // Environment changed (e.g. tests re-running) — keep it simple, reset.
    redisStore = null
  }
  return defaultRateLimitStore
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter?: number
}

export async function checkRateLimit(
  ip: string,
  store: RateLimitStore = getRateLimitStore()
): Promise<RateLimitResult> {
  return store.check(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)
}

export function getRateHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
    'X-RateLimit-Remaining': String(result.remaining),
  }
}