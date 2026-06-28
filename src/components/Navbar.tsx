'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
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

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />
      <div className="relative w-[min(320px,85vw)] h-full bg-[#070a12]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col px-8 py-16 shadow-2xl">
        <p className="font-display font-bold text-xl tracking-wider text-white mb-12 flex items-center gap-1">
          <span className="text-[var(--accent)]">{'{'}</span> AR{' '}
          <span className="text-[var(--accent)]">{'}'}</span>
        </p>

        <nav className="flex-1 flex flex-col gap-5">
          {NAV_ITEMS.map((link, i) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center justify-between font-display text-2xl tracking-tight transition-all duration-300 ${
                  isActive
                    ? 'text-[var(--accent)] translate-x-2'
                    : 'text-white hover:text-white/80 hover:translate-x-1'
                }`}
              >
                {link.label}
                <span className="font-mono text-[10px] tracking-widest text-white/20">
                  0{i + 1}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (!mounted) return null

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1200px] z-50">
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

          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
              />
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="mailto:akramrihanie@gmail.com"
              className="hidden md:inline-flex glass-button glass-button-primary"
            >
              Hire me
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex flex-col justify-center items-center gap-[4px]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              aria-label="Toggle menu"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block h-[1.5px] bg-white rounded transition-all duration-300"
                  style={{
                    width: i === 1 && mobileOpen ? '0px' : '16px',
                    transform:
                      mobileOpen && i === 0
                        ? 'translateY(5.5px) rotate(45deg)'
                        : mobileOpen && i === 2
                          ? 'translateY(-5.5px) rotate(-45deg)'
                          : 'none',
                    opacity: mobileOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
