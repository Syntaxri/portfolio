'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLenis } from '@/components/animations/SmoothScroll'
import { Monogram } from '@/components/museum/Monogram'
import { site, socials } from '@/lib/data/site'

const ROOMS = [
  { href: '/#collection', label: 'Collection' },
  { href: '/#craft', label: 'Craft' },
  { href: '/#archive', label: 'Archive' },
] as const

/**
 * The door plate of the museum: monogram and name on the lintel, the
 * rooms down the middle, one brass bell for starting a project. On small
 * screens it hands the floor plan over to a full-height directory.
 */
export function Topbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { scrollTo } = useLenis()
  const [lastPath, setLastPath] = useState(pathname)

  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) document.body.classList.add('overflow-hidden')
    else document.body.classList.remove('overflow-hidden')
    return () => document.body.classList.remove('overflow-hidden')
  }, [open])

  const go = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith('/#')) return
    e.preventDefault()
    setOpen(false)
    scrollTo(href.slice(1), { offset: -64 })
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-500 ${
          scrolled ? 'border-b border-[rgba(28,26,22,0.14)] bg-bg/90 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[4rem] max-w-7xl items-center justify-between px-4 sm:px-6"
        >
          <Link
            href="/"
            onClick={(e) => go(e, '/#entrance')}
            className="group flex items-center gap-3"
            aria-label={`${site.name} — the museum entrance`}
          >
            <Monogram className="h-7 w-7 text-accent-2 transition-colors group-hover:text-accent" />
            <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.24em] text-text-2 sm:inline">
              {site.name}
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {ROOMS.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                onClick={(e) => go(e, r.href)}
                className="relative py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-text-2 transition-colors hover:text-accent hover:after:absolute hover:after:inset-x-0 hover:after:-bottom-0.5 hover:after:h-px hover:after:bg-accent/60"
              >
                {r.label}
              </Link>
            ))}
            <Link
              href="/#exit"
              onClick={(e) => go(e, '/#exit')}
              className="rounded-[0.3rem] border border-accent-2/60 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-accent-2 transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
            >
              Start a project
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="room-menu"
            aria-label="Toggle the directory"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[0.3rem] border border-[rgba(28,26,22,0.25)] text-text md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 top-0 h-px w-4 bg-current transition-all duration-300 ${open ? 'top-1.5 rotate-45' : ''}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-4 bg-current transition-all duration-300 ${open ? 'bottom-1.5 -rotate-45' : ''}`}
              />
            </span>
          </button>
        </nav>
      </header>

      {open && (
        <div
          id="room-menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg/97 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Room directory"
        >
          <div className="flex h-[4rem] items-center justify-end px-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close the directory"
              className="flex h-10 w-10 items-center justify-center rounded-[0.3rem] border border-[rgba(28,26,22,0.25)] text-text"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2 px-6">
            {[
              { href: '/', label: 'The Atrium', n: '00' },
              { href: '/#courtyard', label: 'The Fountain', n: '01' },
              { href: '/#craft', label: 'The Workshop', n: '02' },
              { href: '/#collection', label: 'The Collection', n: '03' },
              { href: '/#archive', label: 'The Archive', n: '04' },
              { href: '/#exit', label: 'The Exit', n: '05' },
            ].map((r) => (
              <a
                key={r.label}
                href={r.href === '/' ? '/#entrance' : r.href}
                onClick={(e) => go(e, r.href === '/' ? '/#entrance' : r.href)}
                className="group flex items-baseline gap-4 py-2"
              >
                <span className="label-accent label shrink-0">{r.n}</span>
                <span className="font-sans text-4xl font-extrabold tracking-tight text-text-2 transition-colors group-hover:text-accent">
                  {r.label}
                </span>
              </a>
            ))}
          </div>
          <div className="border-t border-[rgba(28,26,22,0.12)] px-6 py-6">
            <p className="label-muted label mb-3">The keeper</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={`${s.label} — from the directory`}
                  className="font-mono text-[0.7rem] tracking-[0.14em] text-text-2 hover:text-accent"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}