/**
 * Redis-backed rate-limit store for shared, cross-instance enforcement.
 *
 * Talks to the Upstash Redis REST API (URL + bearer token — the same
 * endpoint Vercel KV uses), so no extra npm dependency is required.
 * Verified command formats (this project's store, 2026-08-12):
 *   POST /pipeline        body [["INCR","key"],["EXPIRE","key",600]]
 *   POST /ttl/<key>
 *
 * Race characteristics: INCR+EXPIRE are queued in one pipeline; the limit
 * check happens against the returned counter, so concurrent bursts still
 * converge on the same shared counter. Every request refreshes the TTL
 * (activity-anchored window), which self-locks abusers: each extra hit
 * extends their block by the full window.
 *
 * Failure mode is fail-open (allow + warn): a Redis outage must never
 * block real visitors — it degrades to the per-instance best effort
 * already accepted before this store existed.
 */
import type { RateLimitResult } from './index'

export interface RedisStoreConfig {
  url: string
  token: string
}

export function isRedisConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.UPSTASH_REDIS_KV_REST_API_URL && env.UPSTASH_REDIS_KV_REST_API_TOKEN)
}

interface UpstashResponse {
  result?: unknown
  error?: string
}

function extractResult(item: UpstashResponse): unknown {
  if (item === null || item === undefined) return null
  if ('error' in item && typeof item.error === 'string') {
    throw new Error(`Upstash error: ${item.error}`)
  }
  return item.result
}

export class RedisRateLimitStore {
  private readonly url: string
  private readonly token: string

  constructor(config: RedisStoreConfig) {
    this.url = config.url.replace(/\/+$/, '')
    this.token = config.token
  }

  async check(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const windowSec = Math.max(1, Math.floor(windowMs / 1000))
    const redisKey = `rl:contact:${key}`

    try {
      const results = await this.pipeline([
        ['INCR', redisKey],
        ['EXPIRE', redisKey, String(windowSec)],
      ])
      const count = Number(results[0] ?? 0)

      if (count <= limit) {
        return { allowed: true, remaining: Math.max(0, limit - count) }
      }

      const ttl = await this.command(['TTL', redisKey])
      return { allowed: false, remaining: 0, retryAfter: Math.max(1, Number(ttl ?? windowSec)) }
    } catch (err) {
      console.warn(
        '[rateLimit] Redis store unavailable — failing open:',
        err instanceof Error ? err.message : err
      )
      return { allowed: true, remaining: Math.max(0, limit - 1) }
    }
  }

  private async command(cmd: string[]): Promise<unknown> {
    const res = await this.post(`/${cmd.map(encodeURIComponent).join('/')}`)
    return extractResult(Array.isArray(res) ? res[0] : res)
  }

  private async pipeline(commands: string[][]): Promise<unknown[]> {
    const res = await this.post('/pipeline', JSON.stringify(commands))
    return Array.isArray(res) ? res.map(extractResult) : []
  }

  private async post(path: string, body?: string): Promise<UpstashResponse | UpstashResponse[]> {
    const res = await fetch(`${this.url}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        ...(body ? { 'content-type': 'application/json' } : {}),
      },
      body,
      signal: AbortSignal.timeout(2000),
    })
    if (!res.ok) throw new Error(`Upstash responded ${res.status}`)
    return (await res.json()) as UpstashResponse | UpstashResponse[]
  }
}