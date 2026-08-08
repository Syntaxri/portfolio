'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
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
      <div className="flex h-full items-center justify-center">
        <span className="label">Akram Rihani</span>
      </div>
    </div>
  )
}