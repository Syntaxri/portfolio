import { projects } from '@/lib/data/projects'

/**
 * GET /api/live — the wall of live builds, probed.
 * Each project that ships a live URL answers whether akramrihani.com is
 * allowed to frame it: reads X-Frame-Options and the CSP frame-ancestors
 * directive from the site's response headers and reports the verdict.
 * Cached like the ledger (`revalidate` + stale-while-revalidate), so the
 * Living Room checks the wall without ever touching the projects' own
 * servers from the browser.
 */

const ORIGIN = 'https://akramrihani.com'
const REVALIDATE_SECONDS = 60

async function probe(url: string): Promise<{ embeddable: boolean; reason: string }> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return { embeddable: false, reason: `answers ${res.status}` }

    const xfo = (res.headers.get('x-frame-options') ?? '').toLowerCase()
    if (xfo.includes('deny')) return { embeddable: false, reason: 'x-frame-options denies' }
    if (xfo.startsWith('sameorigin')) return { embeddable: false, reason: 'same-origin only' }

    const csp = res.headers.get('content-security-policy') ?? ''
    const directive = csp
      .split(';')
      .map((d) => d.trim())
      .find((d) => d.startsWith('frame-ancestors'))
    if (!directive) return { embeddable: true, reason: 'no frame restrictions' }
    if (directive.includes("'none'")) return { embeddable: false, reason: 'frame-ancestors none' }
    if (directive.includes(ORIGIN)) return { embeddable: true, reason: 'invited by the palace' }
    return { embeddable: false, reason: 'only other origins invited' }
  } catch {
    return { embeddable: false, reason: 'did not answer' }
  }
}

export async function GET(): Promise<Response> {
  const wall = projects
    .filter((p) => p.liveUrl)
    .map((p) => ({ slug: p.slug, title: p.title, url: p.liveUrl as string }))

  const verdicts = await Promise.all(wall.map((w) => probe(w.url)))

  return Response.json(
    wall.map((w, i) => ({ ...w, ...verdicts[i] })),
    {
      headers: {
        'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=3600`,
      },
    }
  )
}