'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { site, socials } from '@/lib/data/site'
import { Magnetic } from '@/components/animations/Magnetic'

function useMoroccoTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Africa/Casablanca',
          }).format(new Date())
        )
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
      <div className="mx-auto max-w-shell px-5 pb-10 pt-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-10">
          <div>
            <p className="label mb-6">Akram Rihani — Creative Developer</p>
            <p className="fluid-display max-w-3xl font-extrabold leading-[0.95] tracking-tight">
              Available for <span className="text-outline">selected</span> projects
            </p>
          </div>

          <Magnetic strength={0.3}>
            <Link
              href="/contact"
              data-cursor-text="Open"
              className="inline-flex items-center gap-3 border border-white/15 px-7 py-4 font-mono text-[0.65rem] uppercase tracking-widest text-ink-secondary transition-colors duration-300 hover:border-accent/50 hover:text-ink"
            >
              Start a conversation
              <span aria-hidden>↗</span>
            </Link>
          </Magnetic>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
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
              <li>
                <a
                  href="/Akram-Rihani-CV.pdf"
                  download
                  className="link-underline text-sm text-ink-secondary hover:text-ink"
                >
                  Resume <span className="label">↗</span>
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="label mb-4">Elsewhere</p>
            <ul className="space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="link-underline text-sm text-ink-secondary hover:text-ink"
                  >
                    {s.label} <span className="label">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-2.5 md:items-end">
            <a
              href={`mailto:${site.email}`}
              className="link-underline font-mono text-xs tracking-widest text-ink-secondary hover:text-ink"
            >
              {site.email}
            </a>
            <p className="label flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {site.availability}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-8">
          <p className="label">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="label hidden sm:block">
            Designed &amp; built by {site.name} — every section, by hand
          </p>
          <p className="label flex items-center gap-2">
            {time && (
              <span>
                {site.location} · {time}
              </span>
            )}
            <span className="h-px w-6 bg-white/15" />
            <span>{site.domain}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
