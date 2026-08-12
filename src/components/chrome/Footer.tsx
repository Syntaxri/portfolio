'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Monogram } from '@/components/museum/Monogram'
import { site, socials } from '@/lib/data/site'

/**
 * The visitor book, at the foot of the museum: the thesis, the keeper's
 * hours and the doors that never close.
 */
export function Footer() {
  const [time, setTime] = useState('')
  const year = new Date().getFullYear()

  useEffect(() => {
    let alive = true
    const tick = () => {
      if (!alive) return
      try {
        const parts = new Intl.DateTimeFormat('en-GB', {
          timeZone: site.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).formatToParts(new Date())
        const h = parts.find((p) => p.type === 'hour')?.value ?? '--'
        const m = parts.find((p) => p.type === 'minute')?.value ?? '--'
        setTime(`${h}:${m}`)
      } catch {
        setTime('')
      }
    }
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [])

  return (
    <footer className="relative border-t border-[rgba(28,26,22,0.12)] bg-bg">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Monogram className="h-6 w-6 text-accent-2" />
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-text-2">
              {site.name} × {site.nickname}
            </span>
          </div>
          <p className="serif max-w-[28ch] text-2xl leading-snug text-text-2">
            {site.thesis}
          </p>
        </div>

        <div>
          <p className="label-muted label mb-4">The visitor book</p>
          <ul className="space-y-2.5">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="group inline-flex items-baseline gap-3 font-mono text-[0.7rem] tracking-[0.16em] text-text-2 transition-colors hover:text-accent"
                >
                  <span className="text-text-3">{s.label}</span>
                  <span className="opacity-60 transition-opacity group-hover:opacity-100">
                    {s.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-muted label mb-4">The keeper&apos;s hours</p>
          <p className="font-mono text-[0.7rem] tracking-[0.16em] text-text-2">
            Open 24 hours · {site.location}
          </p>
          <p className="mt-1 font-mono text-[0.7rem] tracking-[0.16em] text-text-3">
            {time ? `Azrou — ${time} local` : 'Azrou — ticking'}
          </p>
          <Link
            href="/#exit"
            className="mt-5 inline-block font-mono text-[0.62rem] uppercase tracking-[0.2em] text-accent transition-opacity hover:opacity-75"
          >
            The book is at the exit →
          </Link>
        </div>
      </div>

      <div className="border-t border-[rgba(28,26,22,0.1)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 sm:px-6">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-text-3">
            © {year} {site.name} — the museum of software craftsmanship
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:hello@akramrihani.com"
              className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-text-3 transition-colors hover:text-accent"
            >
              hello@akramrihani.com
            </a>
            <a
              href="#main"
              className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-text-3 transition-colors hover:text-accent"
            >
              Back to the entrance ↑
            </a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('ar:toggle-console'))}
              className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-text-3 transition-colors hover:text-accent"
            >
              Conservation console
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}