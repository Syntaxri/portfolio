import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET } from './route'

type FetchResult = {
  ok: boolean
  status: number
  json: () => Promise<unknown>
}

function respond(body: unknown, ok = true): FetchResult {
  return { ok, status: ok ? 200 : 404, json: () => Promise.resolve(body) }
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: string | URL | Request) => {
      const url = String(input)
      if (url.includes('/repos?')) {
        return Promise.resolve(
          respond([
            { name: 'zellige', description: 'tiles', language: 'TypeScript', stargazers_count: 3, pushed_at: '2026-08-15T10:00:00Z', html_url: 'https://github.com/Syntaxri/zellige' },
            { name: 'loom', language: null, stargazers_count: 0, pushed_at: '2026-08-01T10:00:00Z', html_url: 'https://github.com/Syntaxri/loom' },
          ])
        )
      }
      if (url.includes('/events/public?')) {
        return Promise.resolve(
          respond([
            {
              type: 'PushEvent',
              repo: { name: 'Syntaxri/zellige' },
              created_at: '2026-08-15T09:59:00Z',
              payload: { size: 2, commits: [{ message: 'fix: glaze the studs', sha: 'abc123' }] },
            },
            { type: 'WatchEvent', repo: { name: 'someone/else' }, created_at: '2026-08-14T00:00:00Z' },
          ])
        )
      }
      return Promise.resolve(
        respond({
          login: 'Syntaxri',
          name: 'Akram Rihani',
          avatar_url: 'https://avatars.example/me.png',
          followers: 12,
          public_repos: 14,
          location: 'Azrou, Morocco',
          bio: 'craft',
        })
      )
    })
  )
})

describe('GET /api/github', () => {
  it('serves the keeper’s profile, repos and recent pushes', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const body = (await res.json()) as {
      profile: { login: string; name: string }
      repos: { name: string }[]
      events: { repo: string; commits: { message: string }[] }[]
    }
    expect(body.profile.login).toBe('Syntaxri')
    expect(body.repos).toHaveLength(2)
    /* only pushes reach the console, and non-push noise is dropped */
    expect(body.events).toHaveLength(1)
    expect(body.events[0].repo).toBe('Syntaxri/zellige')
    expect(body.events[0].commits[0].message).toBe('fix: glaze the studs')
  })

  it('carries a short cache so browser polls never touch GitHub directly', async () => {
    const res = await GET()
    expect(res.headers.get('cache-control')).toContain('s-maxage=600')
  })

  it('fails honestly (502) when GitHub is unreachable and nothing was served before', async () => {
    /* a fresh module instance carries no memory of a good reading */
    vi.resetModules()
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(respond(null, false))))
    const { GET: freshGet } = await import('./route')
    const res = await freshGet()
    expect(res.status).toBe(502)
  })

  it('serves the last good reading when GitHub goes quiet after a success', async () => {
    /* the earlier success seeded the memory; now every call fails */
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(respond(null, false))))
    const res = await GET()
    expect(res.status).toBe(200)
    const body = (await res.json()) as { profile: { login: string } }
    expect(body.profile.login).toBe('Syntaxri')
  })

  it('carries the token when one is configured', async () => {
    vi.resetModules()
    vi.stubEnv('GITHUB_TOKEN', 'ghp_test')
    const fetchMock = vi.fn((input: string | URL | Request, init?: RequestInit) => {
      const url = String(input)
      const body = url.includes('/repos?')
        ? []
        : url.includes('/events/public?')
          ? []
          : { login: 'Syntaxri', name: 'Akram Rihani', avatar_url: 'https://avatars.example/me.png', followers: 1, public_repos: 1 }
      return Promise.resolve(respond(body))
    })
    vi.stubGlobal('fetch', fetchMock)
    const { GET: tokenGet } = await import('./route')
    await tokenGet()
    const init = fetchMock.mock.calls[0][1] as unknown as { headers?: { Authorization?: string } }
    expect(init?.headers?.Authorization).toBe('Bearer ghp_test')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })
})