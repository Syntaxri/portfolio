import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkRateLimit, getRateHeaders, MemoryRateLimitStore } from './index'
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from '@/config/contact'

describe('MemoryRateLimitStore', () => {
  it('round-trips records', () => {
    const store = new MemoryRateLimitStore()
    store.set('ip', { count: 3, resetAt: 123 })
    expect(store.get('ip')).toEqual({ count: 3, resetAt: 123 })
    store.clear()
    expect(store.get('ip')).toBeUndefined()
  })
})

describe('checkRateLimit', () => {
  let store: MemoryRateLimitStore

  beforeEach(() => {
    store = new MemoryRateLimitStore()
    vi.useFakeTimers()
  })

  it('allows requests up to the max and counts them', () => {
    for (let i = 1; i <= RATE_LIMIT_MAX; i++) {
      const result = checkRateLimit('1.2.3.4', store)
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(RATE_LIMIT_MAX - i)
    }
  })

  it('blocks once the max is reached and reports retryAfter', () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) checkRateLimit('1.2.3.4', store)
    const blocked = checkRateLimit('1.2.3.4', store)
    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
    expect(blocked.retryAfter).toBe(RATE_LIMIT_WINDOW_MS / 1000)
  })

  it('resets after the window elapses', () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) checkRateLimit('1.2.3.4', store)
    vi.advanceTimersByTime(RATE_LIMIT_WINDOW_MS + 1)
    const result = checkRateLimit('1.2.3.4', store)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(RATE_LIMIT_MAX - 1)
  })

  it('tracks keys independently', () => {
    checkRateLimit('a', store)
    checkRateLimit('a', store)
    expect(checkRateLimit('b', store).remaining).toBe(RATE_LIMIT_MAX - 1)
  })
})

describe('getRateHeaders', () => {
  it('exposes limit and remaining', () => {
    expect(getRateHeaders({ allowed: true, remaining: 3 })).toEqual({
      'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
      'X-RateLimit-Remaining': '3',
    })
  })
})
