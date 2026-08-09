'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { site } from '@/lib/data/site'

const TOTAL = 100

/* sessionStorage never changes after first paint — a static store is enough */
function subscribeStorage(): () => void {
  return () => {}
}

function readPreloaderSeen(): boolean {
  return typeof window !== 'undefined' && sessionStorage.getItem('ar-preloader') !== null
}

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)
  const reduced = useReducedMotion()
  const seen = useSyncExternalStore(subscribeStorage, readPreloaderSeen, () => false)

  /* the first visit shows the loader; returning visitors skip it */
  const visible = !seen

  useEffect(() => {
    if (!visible || done) return
    const root = rootRef.current
    if (!root) return

    if (reduced) {
      const t = setTimeout(() => setDone(true), 0)
      return () => clearTimeout(t)
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      const counter = {
        value: 0,
      }
      tl.to(counter, {
        value: TOTAL,
        duration: 1.7,
        ease: 'power2.inOut',
        onUpdate: () => {
          const v = Math.round(counter.value)
          if (numberRef.current) numberRef.current.textContent = `${v}%`
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${v / TOTAL})`
        },
      })
        .to(fillRef.current, { transformOrigin: 'right', scaleX: 0, duration: 0.45, ease: 'power2.inOut' })
        .to(numberRef.current, { opacity: 0, y: -14, duration: 0.35, ease: 'power2.out' }, '<')
        .set(root, { pointerEvents: 'none' })
        .to(root, {
          yPercent: -100,
          duration: 0.85,
          ease: 'expo.inOut',
          onComplete: () => {
            sessionStorage.setItem('ar-preloader', '1')
            window.dispatchEvent(new Event('ar:entrance-ready'))
            setDone(true)
          },
        })
    }, root)

    return () => ctx.revert()
  }, [visible, done, reduced])

  if (!visible || done) return null

  return (
    <div ref={rootRef} aria-hidden className="fixed inset-0 z-[200] flex flex-col justify-end bg-base">
      <div className="flex items-end justify-between px-6 pb-6 sm:px-10">
        <span className="label">{site.domain} — Akram Rihani</span>
        <span
          ref={numberRef}
          className="font-display text-[clamp(3.5rem,10vw,7rem)] font-extrabold leading-none tabular-nums text-ink"
          style={{ letterSpacing: '-0.03em' }}
        >
          0%
        </span>
      </div>
      <div className="h-px w-full bg-white/10">
        <div
          ref={fillRef}
          className="h-full w-full origin-left bg-accent"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  )
}
