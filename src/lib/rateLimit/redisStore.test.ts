import { describe, it, expect, vi, afterEach } from 'vitest'
import { RedisRateLimitStore, isRedisConfigured } from './redisStore'
import { getRateLimitStore, defaultRateLimitStore } from './index'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

function pipelineResponse(results: unknown[]) {
  return new Response(JSON.stringify(results.map((result) => ({ result }))), { status: 200 })
}

const fetchMock = vi.fn()

describe('isRedisConfigured', () => {
  it('requires both the URL and the write token', () => {
    vi.stubEnv('UPSTASH_REDIS_KV_REST_API_URL', 'https://x.upstash.io')
    expect(isRedisConfigured()).toBe(false)
    vi.stubEnv('UPSTASH_REDIS_KV_REST_API_TOKEN', 'tok')
    expect(isRedisConfigured()).toBe(true)
  })
})

describe('RedisRateLimitStore', () => {
  it('increments and expires via the pipeline, staying allowed while under the limit', async () => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValueOnce(pipelineResponse([1, 1]))

    const store = new RedisRateLimitStore({ url: 'https://x.upstash.io/', token: 'tok' })
    const result = await store.check('203.0.113.7', 5, 600_000)

    expect(result).toEqual({ allowed: true, remaining: 4 })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://x.upstash.io/pipeline')
    expect(init.headers).toMatchObject({ Authorization: 'Bearer tok' })
    expect(JSON.parse(init.body as string)).toEqual([
      ['INCR', 'rl:contact:203.0.113.7'],
      ['EXPIRE', 'rl:contact:203.0.113.7', '600'],
    ])
  })

  it('blocks once the shared counter exceeds the limit and reports TTL as retryAfter', async () => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValueOnce(pipelineResponse([6, 1]))
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ result: 480 }), { status: 200 }))

    const store = new RedisRateLimitStore({ url: 'https://x.upstash.io', token: 'tok' })
    const result = await store.check('203.0.113.7', 5, 600_000)

    expect(result).toEqual({ allowed: false, remaining: 0, retryAfter: 480 })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const ttlCall = fetchMock.mock.calls[1] as [string, RequestInit]
    expect(ttlCall[0]).toBe('https://x.upstash.io/TTL/rl%3Acontact%3A203.0.113.7')
  })

  it('fails open with a warning when Redis is unreachable', async () => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockRejectedValueOnce(new Error('ECONNREFUSED'))
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const store = new RedisRateLimitStore({ url: 'https://x.upstash.io', token: 'tok' })
    const result = await store.check('203.0.113.7', 5, 600_000)

    expect(result).toEqual({ allowed: true, remaining: 4 })
    expect(warn).toHaveBeenCalled()
  })

  it('surfaces pipeline-level errors as failures (and fail-open in use)', async () => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify([{ error: 'ERR bad command' }]), { status: 200 })
    )

    const store = new RedisRateLimitStore({ url: 'https://x.upstash.io', token: 'tok' })
    const result = await store.check('203.0.113.7', 5, 600_000)
    expect(result.allowed).toBe(true)
  })
})

describe('getRateLimitStore', () => {
  it('returns Redis when configured, the memory store otherwise', () => {
    expect(getRateLimitStore()).toBe(defaultRateLimitStore)
    vi.stubEnv('UPSTASH_REDIS_KV_REST_API_URL', 'https://x.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_KV_REST_API_TOKEN', 'tok')
    expect(getRateLimitStore()).toBeInstanceOf(RedisRateLimitStore)
  })
})