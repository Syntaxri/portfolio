import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'

type ProbeResult = {
  ok: boolean
  headers: Headers
}

function respond(csp: string | null, xfo: string | null, ok = true): ProbeResult {
  const headers = new Headers()
  if (csp) headers.set('content-security-policy', csp)
  if (xfo) headers.set('x-frame-options', xfo)
  return { ok, headers }
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: string | URL | Request) => {
      const url = String(input)
      if (url.includes('palais-amghass')) {
        return Promise.resolve(
          respond("default-src 'self'; frame-ancestors https://akramrihani.com", null)
        )
      }
      if (url.includes('nexthobby')) {
        return Promise.resolve(respond(null, 'DENY'))
      }
      return Promise.resolve(respond("default-src 'self'; frame-ancestors 'none'", null))
    })
  )
})

describe('GET /api/live', () => {
  it('reports the wall: who lets the museum frame them and who does not', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const body = (await res.json()) as {
      slug: string
      url: string
      embeddable: boolean
      reason: string
    }[]
    expect(body.length).toBeGreaterThan(0)
    const palais = body.find((b) => b.slug === 'palais-amghass')
    const nexthobby = body.find((b) => b.slug === 'nexthobby')
    const rest = body.find((b) => b.slug !== 'palais-amghass' && b.slug !== 'nexthobby')
    expect(palais?.embeddable).toBe(true)
    expect(nexthobby?.embeddable).toBe(false)
    expect(rest?.embeddable).toBe(false)
  })

  it('carries the same short cache discipline as the ledger', async () => {
    const res = await GET()
    expect(res.headers.get('cache-control')).toContain('s-maxage=600')
  })
})