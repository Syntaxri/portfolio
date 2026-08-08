'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { site } from '@/lib/data/site'
import { Magnetic } from '@/components/animations/Magnetic'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const NAV_ITEMS = [
  { href: '/', label: 'Work', active: ['/projects', '/projects/'] as string[] },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

function isActive(pathname: string, item: (typeof NAV_ITEMS)[number]) {
  if (item.href === '/') return pathname === '/' || pathname.startsWith('/projects')
  return pathname === item.href || pathname.startsWith(item.href)
}

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const lastY = useRef(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      const dir = y > lastY.current ? 'down' : 'up'
      lastY.current = y
      if (reduced || menuOpen) {
        setHidden(false)
        return
      }
      setHidden(y > 320 && dir === 'down')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduced, menuOpen, pathname])

  useEffect(() => {
    const el = headerRef.current
    if (!el || reduced) return
    gsap.to(el, { yPercent: hidden ? -110 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
  }, [hidden, reduced])

  /* close menu on navigation */
  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    const el = menuRef.current
    if (!el) return
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      if (reduced) {
        gsap.set(el, { display: 'flex' })
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.001 })
        return
      }
      const labels = el.querySelectorAll('.menu-item')
      gsap
        .timeline()
        .set(el, { display: 'flex' })
        .fromTo(
          el,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' }
        )
        .fromTo(
          labels,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power4.out', stagger: 0.06 },
          '-=0.35'
        )
    } else {
      document.body.style.overflow = ''
      if (reduced) {
        gsap.set(el, { display: 'none' })
        return
      }
      gsap.to(el, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.5,
        ease: 'expo.inOut',
        onComplete: () => gsap.set(el, { display: 'none' }),
      })
    }
  }, [menuOpen, reduced])

  /* a11y: dialog semantics, focus management, Escape + Tab trapping */
  useEffect(() => {
    if (!menuOpen) return
    const menu = menuRef.current
    if (!menu) return

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const getFocusables = () =>
      Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])'))

    const focusables = getFocusables()
    focusables[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setMenuOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = getFocusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [menuOpen])

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-[120] transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled
            ? 'border-b border-white/[0.06] bg-base/70 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-[var(--nav-h)] max-w-shell items-center justify-between px-5 sm:px-8">
          <Link href="/" className="group flex items-baseline gap-3" aria-label={`${site.name} — home`}>
            <span className="font-display text-lg font-extrabold tracking-tight text-ink">
              {site.initials}
            </span>
            <span className="label hidden text-ink-tertiary transition-colors duration-300 group-hover:text-ink-secondary sm:inline">
              {site.name}
            </span>
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`label relative transition-colors duration-300 hover:text-ink ${
                  isActive(pathname, item) ? 'text-accent-secondary' : 'text-ink-tertiary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic strength={0.3} as="div">
              <Link
                href="/contact"
                className="hidden items-center gap-2 border border-white/10 px-4 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-ink-secondary transition-colors duration-300 hover:border-accent/40 hover:text-ink md:inline-flex"
              >
                Let&apos;s talk
              </Link>
            </Magnetic>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 md:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 top-0 h-px w-full bg-ink transition-transform duration-300 ${menuOpen ? 'top-1/2 rotate-45' : ''}`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-300 ${menuOpen ? 'bottom-auto top-1/2 -rotate-45' : ''}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="fixed inset-0 z-[110] hidden items-end bg-base md:hidden"
        style={{ clipPath: 'inset(0 0 100% 0)' }}
      >
        <nav
          className="flex w-full flex-col gap-2 px-8 pb-[max(3rem,env(safe-area-inset-bottom))] pt-24"
          aria-label="Mobile"
        >
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`menu-item font-display text-5xl font-extrabold tracking-tight ${
                isActive(pathname, item) ? 'text-accent' : 'text-ink'
              }`}
            >
              <span className="label mr-4 align-super text-base">{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </Link>
          ))}
          <div className="menu-item mt-10 space-y-3">
            <a href={`mailto:${site.email}`} className="label block text-ink-secondary">
              {site.email}
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="label block text-ink-tertiary"
            >
              GitHub ↗
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="label block text-ink-tertiary"
            >
              LinkedIn ↗
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
