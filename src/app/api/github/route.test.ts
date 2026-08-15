import { describe, it, expect, vi, beforeEach } from 'vitest'
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
    expect(res.headers.get('cache-control')).toContain('s-maxage=300')
  })

  it('fails honestly (502) when GitHub is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(respond(null, false))))
    const res = await GET()
    expect(res.status).toBe(502)
  })
})