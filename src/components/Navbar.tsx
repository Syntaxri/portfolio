'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/about',
    label: 'About',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13 2 4" />
      </svg>
    ),
  },
]

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`relative font-mono text-[0.6rem] uppercase tracking-[0.12em] px-1 py-1.5 transition-all duration-300 group ${
        isActive ? 'text-[var(--accent)]' : 'text-white/30 hover:text-white/70'
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[1.5px] rounded-full transition-all duration-300 bg-[var(--accent)] ${
          isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-40'
        }`}
        style={isActive ? { boxShadow: '0 0 8px rgba(var(--accent-rgb), 0.4)' } : undefined}
      />
    </Link>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Desktop nav */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1200px] z-50 hidden md:block">
        <div
          className="rounded-2xl px-5 py-2.5 flex items-center justify-between"
          style={{
            background: 'rgba(7,10,18,0.8)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 12px 40px -12px rgba(0,0,0,0.5)',
          }}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{
                background: 'rgba(var(--accent-rgb), 0.1)',
                border: '1px solid rgba(var(--accent-rgb), 0.25)',
              }}
            >
              <span
                className="font-bold font-display text-xs"
                style={{ color: 'var(--accent)' }}
              >
                AR
              </span>
            </div>
            <span className="font-display font-semibold text-sm tracking-wide text-white hidden sm:block">
              Akram Rihani
            </span>
          </Link>

          <nav className="flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
              />
            ))}
          </nav>

          <a
            href="mailto:akramrihanie@gmail.com"
            className="glass-button glass-button-primary"
          >
            Hire me
          </a>
        </div>
      </header>

      {/* Mobile floating dock */}
      <nav
        className="fixed z-50 md:hidden"
        style={{
          bottom: 'max(1.25rem, calc(0.5rem + env(safe-area-inset-bottom)))',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div
          className="flex items-center gap-1 px-3 py-2 rounded-2xl"
          style={{
            background: 'rgba(7,10,18,0.65)',
            backdropFilter: 'blur(48px) saturate(200%)',
            WebkitBackdropFilter: 'blur(48px) saturate(200%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className="relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300"
                style={{
                  color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
                }}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-xl transition-all duration-300"
                    style={{
                      background: 'rgba(var(--accent-rgb), 0.1)',
                      boxShadow: '0 0 24px rgba(var(--accent-rgb), 0.15)',
                    }}
                  />
                )}
                <span className="relative flex items-center justify-center">
                  <Icon />
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
