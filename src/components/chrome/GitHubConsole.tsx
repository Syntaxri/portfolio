'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { site } from '@/lib/data/site'

/**
 * THE KEEPER'S LEDGER — Ctrl+Shift+G.
 * The museum's second console: the live GitHub record behind the work.
 * Reaches /api/github (a cached proxy — the browser never talks to
 * GitHub itself), polls every minute while open, and shows exactly what
 * came back: the profile, the repos that were pushed last, and the
 * recent commits. Anything the API cannot truthfully say is "—".
 */

interface ConsoleData {
  profile: {
    login: string | null
    name: string | null
    avatarUrl: string | null
    location: string | null
    bio: string | null
    followers: number
    publicRepos: number
  } | null
  repos: { name: string; description: string | null; language: string | null; stars: number; pushedAt: string | null; url: string | null }[]
  events: { repo: string; createdAt: string | null; commits: { message: string | null; sha: string | null }[]; size: number }[]
}

function ago(iso: string | null): string {
  if (!iso) return '—'
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const sha7 = (sha: string | null) => (sha ? sha.slice(0, 7) : null)

function Row({ label, value, dim = false }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-[rgba(196,196,255,0.09)] py-1.5 first:border-t-0">
      <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[#8f8774]">
        {label}
      </span>
      <span
        className={`font-mono text-[0.66rem] tracking-[0.08em] ${dim ? 'text-[#8f8774]' : 'text-[#e9e3d4]'}`}
      >
        {value}
      </span>
    </div>
  )
}

export function GitHubConsole() {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<ConsoleData | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'ready'>('idle')
  const [since, setSince] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)

  const load = useCallback(async () => {
    setState('loading')
    try {
      const res = await fetch('/api/github')
      const json = (await res.json()) as ConsoleData
      if (!res.ok || !json.repos) throw new Error('github unavailable')
      setData(json)
      setSince(Date.now())
      setState('ready')
    } catch {
      setState('error')
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const onToggle = () => setOpen((v) => !v)
    window.addEventListener('keydown', onKey)
    window.addEventListener('ar:toggle-github', onToggle)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('ar:toggle-github', onToggle)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    lastFocusRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }
    panel?.addEventListener('keydown', onKey)
    /* the first poll defers a tick so the dialog's opening render is
       never cascaded by the setState inside the fetch */
    const first = window.setTimeout(load, 0)
    const id = window.setInterval(load, 60_000)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(id)
      panel?.removeEventListener('keydown', onKey)
      lastFocusRef.current?.focus()
    }
  }, [open, load])

  const close = useCallback(() => setOpen(false), [])

  if (!open) return null

  return (
    <div className="fixed bottom-4 left-4 z-[160] w-[20rem] max-w-[calc(100vw-2rem)]">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="The keeper's ledger"
        className="border border-[rgba(196,196,255,0.18)] bg-[#1a1611] p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  state === 'ready' ? 'rgba(108,178,148,1)' : state === 'error' ? 'rgba(198,92,58,1)' : 'rgba(205,160,88,1)',
                boxShadow: '0 0 8px currentColor',
              }}
              aria-hidden="true"
            />
            <p className="label text-[0.58rem] text-[#c9c1ae]">The keeper&apos;s ledger</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={load}
              aria-label="Refresh the ledger"
              disabled={state === 'loading'}
              className="flex h-7 w-7 items-center justify-center rounded-[0.2rem] border border-[rgba(196,196,255,0.2)] font-mono text-[0.6rem] text-[#c9c1ae] transition-colors hover:border-[rgba(196,196,255,0.5)] disabled:opacity-40"
            >
              ↻
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close the keeper's ledger"
              className="flex h-7 w-7 items-center justify-center rounded-[0.2rem] border border-[rgba(196,196,255,0.2)] font-mono text-[0.6rem] text-[#c9c1ae] transition-colors hover:border-[rgba(196,196,255,0.5)]"
            >
              ✕
            </button>
          </div>
        </div>

        <p className="font-mono text-[0.6rem] leading-relaxed text-[#8f8774]">
          The ledger is read live from the keeper&apos;s GitHub. It refreshes every minute —
          followed by exactly the commits that landed.
        </p>

        {state === 'loading' && !data && (
          <p className="mt-3 font-mono text-[0.62rem] tracking-[0.12em] text-[#c9c1ae]">
            Reading from Azrou…
          </p>
        )}

        {state === 'error' && !data && (
          <p className="mt-3 font-mono text-[0.62rem] leading-relaxed text-[#c65c3a]">
            The ledger is sealed — GitHub did not answer.
          </p>
        )}

        {data && (
          <>
            <div className="mt-3 flex items-center gap-3 border-b border-[rgba(196,196,255,0.12)] pb-3">
              {data.profile?.avatarUrl ? (
                <Image
                  src={data.profile.avatarUrl}
                  alt=""
                  width={36}
                  height={36}
                  unoptimized
                  className="h-9 w-9 rounded-full border border-[rgba(196,196,255,0.25)]"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(196,196,255,0.25)] font-mono text-[0.6rem] text-[#8f8774]">
                  —
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-mono text-[0.72rem] tracking-[0.1em] text-[#e9e3d4]">
                  {data.profile?.name ?? data.profile?.login ?? '—'}
                </p>
                <p className="truncate font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#8f8774]">
                  {data.profile?.login ?? '—'} · github.com
                </p>
              </div>
            </div>

            <div className="mt-2">
              <Row label="Repositories" value={data.profile ? String(data.profile.publicRepos) : '—'} />
              <Row label="Followers" value={data.profile ? String(data.profile.followers) : '—'} />
              <Row label="Location" value={data.profile?.location ?? '—'} dim />
              {data.profile?.bio && <Row label="Bio" value={data.profile.bio} dim />}
            </div>

            <p className="mt-3 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-[#8f8774]">
              Pushed most recently
            </p>
            <ul className="mt-1">
              {data.repos.slice(0, 5).map((r) => (
                <li key={r.name} className="border-t border-[rgba(196,196,255,0.09)] py-1.5 first:border-t-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <a
                      href={r.url ?? '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate font-mono text-[0.66rem] tracking-[0.06em] text-[#c4c4ff] transition-opacity hover:opacity-75"
                    >
                      {r.name}
                    </a>
                    <span className="shrink-0 font-mono text-[0.56rem] text-[#8f8774]">
                      {r.stars ? `★ ${r.stars} ` : ''}
                      {r.language ?? '—'} · {ago(r.pushedAt)}
                    </span>
                  </div>
                  {r.description && (
                    <p className="mt-0.5 truncate font-mono text-[0.56rem] text-[#6f6756]">
                      {r.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            <p className="mt-3 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-[#8f8774]">
              Last pushes
            </p>
            <ul className="mt-1">
              {data.events.length === 0 && (
                <li className="border-t border-[rgba(196,196,255,0.09)] py-1.5 font-mono text-[0.56rem] text-[#6f6756]">
                  Nothing on the ledger yet.
                </li>
              )}
              {data.events.slice(0, 4).map((e, i) => (
                <li key={`${e.repo}-${i}`} className="border-t border-[rgba(196,196,255,0.09)] py-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate font-mono text-[0.62rem] tracking-[0.05em] text-[#e9e3d4]">
                      {e.repo}
                    </span>
                    <span className="shrink-0 font-mono text-[0.54rem] text-[#8f8774]">
                      {e.size ? `${e.size} commit${e.size === 1 ? '' : 's'} · ` : ''}
                      {ago(e.createdAt)}
                    </span>
                  </div>
                  {e.commits[0]?.message && (
                    <p className="mt-0.5 truncate font-mono text-[0.56rem] text-[#6f6756]">
                      {sha7(e.commits[0].sha)} {e.commits[0].message.replace(/\s+/g, ' ').trim()}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            <p className="mt-2 border-t border-[rgba(196,196,255,0.12)] pt-2 font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#6f6756]">
              Synced {since ? ago(new Date(since).toISOString()) : '—'} · polls every 60s
            </p>
          </>
        )}

        <p className="mt-2 flex items-center gap-2 font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#6f6756]">
          <span className="inline-block h-1 w-1 rotate-45 bg-[#c5a75a]" aria-hidden="true" />
          Ctrl+Shift+G — {site.githubUsername} on GitHub
        </p>
      </div>
    </div>
  )
}