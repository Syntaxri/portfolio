'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { site } from '@/lib/data/site'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Short directional wipe on route changes — decorative only,
 * never blocks navigation or content.
 */
export function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const prevPath = useRef(pathname)
  const reduced = useReducedMotion()

  const destination = pathname === '/' ? 'Home' : pathname.startsWith('/projects') ? (pathname === '/projects' ? 'Work' : 'Case study') : pathname === '/about' ? 'About' : 'Contact'

  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname
    const el = overlayRef.current
    if (!el || reduced) return

    gsap.fromTo(
      el,
      { yPercent: 100 },
      {
        yPercent: -100,
        duration: 0.8,
        ease: 'expo.inOut',
        onStart: () => {
          gsap.set(el, { display: 'block' })
        },
        onComplete: () => {
          gsap.set(el, { display: 'none' })
        },
      }
    )
  }, [pathname, reduced])

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[150] hidden bg-elevated"
      style={{ background: 'var(--bg-elevated)' }}
    >
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <span className="font-display text-3xl font-extrabold tracking-tight">{site.name}</span>
        <span className="label">Entering — {destination}</span>
      </div>
    </div>
  )
}