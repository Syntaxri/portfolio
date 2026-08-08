'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { site, socials } from '@/lib/data/site'

function useMoroccoTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      try {
        setTime(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Casablanca' }).format(new Date()))
      } catch {
        setTime('')
      }
    }
    update()
    const id = window.setInterval(update, 60_000)
    return () => window.clearInterval(id)
  }, [])

  return time
}

export function Footer() {
  const time = useMoroccoTime()

  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-shell grid-cols-1 gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-display text-3xl font-extrabold tracking-tight">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-secondary">{site.strapline}</p>
          <p className="label mt-6 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {site.availability}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 md:justify-items-end">
          <nav aria-label="Footer">
            <p className="label mb-4">Navigate</p>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/projects', label: 'Work' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline text-sm text-ink-secondary hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label mb-4">Elsewhere</p>
            <ul className="space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="link-underline text-sm text-ink-secondary hover:text-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-8">
          <p className="label">© {new Date().getFullYear()} {site.name}</p>
          <p className="label hidden sm:block">Designed &amp; built by {site.name}</p>
          <p className="label flex items-center gap-2">
            {time && <span>{site.location} · {time}</span>}
            <span className="h-px w-6 bg-white/15" />
            <span>viaruq.dev</span>
          </p>
        </div>
      </div>
    </footer>
  )
}