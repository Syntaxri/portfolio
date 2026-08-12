'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Monogram } from '@/components/museum/Monogram'

function roomLabel(pathname: string): string {
  if (pathname === '/') return 'The museum'
  if (pathname.startsWith('/work/')) return 'An exhibit room'
  return 'The museum'
}

/**
 * A door leaf between rooms: the wall slides up and down behind the
 * route change so the frame cut reads as walking from one room into the
 * next. Decorative only — it never intercepts navigation.
 */
export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return

    gsap.killTweensOf(el)
    gsap.fromTo(
      el,
      { yPercent: 100, display: 'flex' },
      {
        yPercent: -100,
        duration: 0.55,
        ease: 'expo.inOut',
        onStart: () => {
          gsap.set(el, { display: 'flex' })
        },
        onComplete: () => {
          gsap.set(el, { display: 'none' })
        },
      }
    )
  }, [pathname, reduced])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[150] hidden items-center justify-center bg-bg"
    >
      <div className="flex flex-col items-center gap-4">
        <Monogram className="h-10 w-10 text-accent" />
        <span className="label-accent label">{roomLabel(pathname)}</span>
      </div>
    </div>
  )
}