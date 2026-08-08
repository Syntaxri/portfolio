'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/components/animations/SmoothScroll'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { chapters } from '@/lib/data/engineered'

gsap.registerPlugin(ScrollTrigger)

/**
 * Right-edge chapter rail — a piece with scroll position, not a scrollbar:
 * the active chapter expands, older chapters recede, and clicking scrolls.
 *
 * Only exists on the home page — the chapters are home sections, so on any
 * other route the targets don't exist and the rail would no-op.
 */
export function SectionRail() {
  const railRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [enabled, setEnabled] = useState(false)
  const reduced = useReducedMotion()
  const { scrollTo } = useLenis()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/') return
    if (window.matchMedia('(min-width: 768px)').matches && !reduced) setEnabled(true)
  }, [reduced, pathname])

  useEffect(() => {
    if (!enabled) return
    const rail = railRef.current
    if (!rail) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rail,
        { opacity: 0, x: 18 },
        { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', delay: 1.2 }
      )
      if (fillRef.current) {
        gsap.fromTo(
          fillRef.current,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } }
        )
      }
    }, rail)
    return () => ctx.revert()
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    const markers = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (markers.length === 0) return

    const onScroll = () => {
      const mid = window.innerHeight * 0.42
      let idx = 0
      for (let i = 0; i < markers.length; i++) {
        const top = markers[i].getBoundingClientRect().top
        if (top <= mid) idx = i
      }
      setActive(idx)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={railRef}
      className="fixed right-7 top-1/2 z-[130] hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
      style={{ opacity: 0 }}
    >
      <div aria-hidden className="relative h-40 w-px overflow-hidden bg-white/[0.08]">
        <div ref={fillRef} className="absolute inset-0 w-px origin-top bg-accent" style={{ transform: 'scaleY(0)' }} />
      </div>

      <ul className="flex flex-col gap-3.5" aria-label="Section navigation">
        {chapters.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => scrollTo(`#${c.id}`)}
              aria-label={`Go to ${c.label}`}
              className={`group flex items-center gap-2 transition-opacity duration-300 ${i === active ? 'opacity-100' : 'opacity-35 hover:opacity-70'}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${i === active ? 'scale-125 bg-accent' : 'bg-white/40 group-hover:bg-white/70'}`}
              />
              <span className="label hidden lg:inline">{c.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}