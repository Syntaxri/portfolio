import { site } from '@/lib/data/site'

/**
 * GET /api/github — the keeper's ledger, read live.
 * Proxies the public GitHub API for the portfolio's console: profile,
 * the most recently pushed repos, and the latest public events (pushes,
 * forks, stars…). The GitHub API is rate-limited per IP (~60/h
 * unauthenticated), so the route caches upstream behind `revalidate`
 * and hands the browser stale-while-revalidate headers — the console
 * polls /api/github freely without ever touching GitHub itself.
 * A GITHUB_TOKEN (fine-grained, repository: read) raises the ceiling
 * to 5000 requests an hour; without one the ledger reads public data
 * only. When GitHub fails after a good reading, the route serves the
 * last known payload so the console never blanks.
 */

const GH_API = 'https://api.github.com'
const GH_HEADERS = {
  'User-Agent': 'portfolio',
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}
const REVALIDATE_SECONDS = 600

const TOKEN = process.env.GITHUB_TOKEN
const ghHeaders = TOKEN ? { ...GH_HEADERS, Authorization: `Bearer ${TOKEN}` } : GH_HEADERS

interface GhProfile {
  login?: unknown
  name?: unknown
  avatar_url?: unknown
  followers?: unknown
  public_repos?: unknown
  location?: unknown
  bio?: unknown
}

interface GhRepo {
  name?: unknown
  description?: unknown
  language?: unknown
  stargazers_count?: unknown
  pushed_at?: unknown
  html_url?: unknown
}

interface GhEvent {
  type?: unknown
  repo?: { name?: unknown }
  created_at?: unknown
  payload?: { commits?: unknown[]; ref?: unknown; action?: unknown; size?: unknown }
}

interface LedgerPayload {
  profile: {
    login: string | null
    name: string | null
    avatarUrl: string | null
    location: string | null
    bio: string | null
    followers: number
    publicRepos: number
  } | null
  repos: { name: string | null; description: string | null; language: string | null; stars: number; pushedAt: string | null; url: string | null }[]
  events: { repo: string | null; createdAt: string | null; commits: { message: string | null; sha: string | null }[]; size: number }[]
}

/* the last fully-good reading, for when GitHub goes quiet */
let lastGood: LedgerPayload | null = null

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${GH_API}${path}`, {
      headers: ghHeaders,
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

const str = (v: unknown): string | null => (typeof v === 'string' && v.length ? v : null)
const num = (v: unknown): number => (typeof v === 'number' ? v : 0)

export async function GET(): Promise<Response> {
  const u = site.githubUsername
  const [profile, repos, events] = await Promise.all([
    gh<GhProfile>(`/users/${u}`),
    gh<GhRepo[]>(`/users/${u}/repos?sort=pushed&per_page=8&type=owner`),
    gh<GhEvent[]>(`/users/${u}/events/public?per_page=30`),
  ])

  const payload: LedgerPayload = {
    profile: profile
      ? {
          login: str(profile.login),
          name: str(profile.name),
          avatarUrl: str(profile.avatar_url),
          location: str(profile.location),
          bio: str(profile.bio),
          followers: num(profile.followers),
          publicRepos: num(profile.public_repos),
        }
      : null,
    repos: (repos ?? [])
      .map((r) => ({
        name: str(r.name),
        description: str(r.description),
        language: str(r.language),
        stars: num(r.stargazers_count),
        pushedAt: str(r.pushed_at),
        url: str(r.html_url),
      }))
      .filter((r) => r.name),
    events: (events ?? [])
      .filter((e) => e.type === 'PushEvent')
      .slice(0, 8)
      .map((e) => ({
        repo: str(e.repo?.name),
        createdAt: str(e.created_at),
        commits: Array.isArray(e.payload?.commits)
          ? e.payload!.commits!.slice(0, 3).map((c) => ({
              message: str((c as { message?: unknown }).message),
              sha: str((c as { sha?: unknown }).sha),
            }))
          : [],
        size: num(e.payload?.size),
      })),
  }

  /* only a fully-good reading refreshes the memory; a total silence
     falls back to it so the ledger keeps its face */
  if (profile && repos && events) lastGood = payload
  const served: LedgerPayload | null = profile || repos || events ? payload : lastGood

  return Response.json(served, {
    status: served ? 200 : 502,
    headers: {
      'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=3600`,
    },
  })
}