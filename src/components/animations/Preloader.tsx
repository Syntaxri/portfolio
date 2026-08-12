'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Monogram } from '@/components/museum/Monogram'
import { MONOGRAM_PATHS, starPath } from '@/lib/geometry'
import { site } from '@/lib/data/site'

/* returning visitors skip the door; sessionStorage keeps private-mode
   tabs consistent. Neither changes after first paint — a static store is
   enough. */
function subscribeStorage(): () => void {
  return () => {}
}

function readPreloaderSeen(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (localStorage.getItem('ar-museum-v5') !== null) return true
  } catch {
    /* storage unavailable — fall back to tab-only memory */
  }
  return sessionStorage.getItem('ar-museum-v5') !== null
}

const RING_POINTS = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
  a: (i * Math.PI) / 4 - Math.PI / 2,
  face: ['#1e4082', '#15695c', '#aa5226', '#8c6634'][i % 4],
}))

/**
 * THE DOOR — the entrance sequence. The monogram draws itself, the eight
 * points of the star lock around it, and the door lifts. Short, skippable
 * by returning visitors, and fully asleep under reduced motion.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)
  const reduced = useReducedMotion()
  const seen = useSyncExternalStore(subscribeStorage, readPreloaderSeen, () => false)

  const visible = !seen

  useEffect(() => {
    if (!visible || done) return
    const root = rootRef.current
    if (!root) return

    if (reduced) {
      const t = setTimeout(() => setDone(true), 0)
      return () => clearTimeout(t)
    }

    window.__entranceReady = true
    window.dispatchEvent(new Event('ar:entrance-ready'))

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.fromTo(
        '.door-draw',
        { strokeDashoffset: 190 },
        { strokeDashoffset: 0, duration: 0.85, ease: 'power2.inOut' }
      )
        .fromTo(
          '.door-star',
          { scale: 0, opacity: 0, transformOrigin: 'center' },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.2)', stagger: 0.045 },
          '-=0.5'
        )
        .to('.door-fade', { opacity: 0, y: -16, duration: 0.3, ease: 'power2.in' }, '+=0.15')
        .set(root, { pointerEvents: 'none' })
        .to(root, {
          yPercent: -100,
          duration: 0.6,
          ease: 'expo.inOut',
          onComplete: () => {
            try {
              localStorage.setItem('ar-museum-v5', '1')
            } catch {
              /* storage unavailable (private mode) — session only */
            }
            sessionStorage.setItem('ar-museum-v5', '1')
            setDone(true)
          },
        })
    }, root)

    return () => ctx.revert()
  }, [visible, done, reduced])

  if (!visible || done) return null

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-bg px-5 py-4 sm:px-8"
    >
      <div className="flex items-center justify-between border-b border-[rgba(28,26,22,0.12)] pb-3">
        <span className="label-muted label">The museum of software craftsmanship</span>
        <span className="label-muted label">©{new Date().getFullYear()}</span>
      </div>

      <div className="relative mx-auto flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {RING_POINTS.map((p, i) => (
            <path
              key={i}
              className="door-star"
              d={starPath(100 + Math.cos(p.a) * 76, 100 + Math.sin(p.a) * 76, 13, 5.2)}
              fill={p.face}
            />
          ))}
        </svg>
        <Monogram className="door-fade h-24 w-24 text-accent" />
        <svg
          viewBox="0 0 100 96"
          className="absolute inset-0 h-24 w-24"
          aria-hidden="true"
          fill="none"
        >
          <path
            className="door-draw"
            d={MONOGRAM_PATHS.arch}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeDasharray="190"
            strokeDashoffset="190"
            fill="none"
          />
        </svg>
      </div>

      <div className="door-fade border-t border-[rgba(28,26,22,0.12)] pt-3">
        <div className="flex items-center justify-between">
          <span className="label-muted label">The kiln is ready</span>
          <span className="label-muted label">{site.domain}</span>
        </div>
      </div>
    </div>
  )
}