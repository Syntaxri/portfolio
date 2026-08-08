'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const STATEMENT = [
  { word: 'I', accent: false },
  { word: 'design', accent: false },
  { word: 'and', accent: false },
  { word: 'engineer', accent: false },
  { word: 'digital', accent: true },
  { word: 'experiences', accent: true },
  { word: 'that', accent: false },
  { word: 'move', accent: true },
  { word: 'people.', accent: false },
]

/**
 * Cinematic scrollytelling — one master timeline, five stages:
 * 0 arrive (inherit the hero's compressed scale, resolve blur)
 * 1 words sharpen in sequence
 * 2 accent words swell, supporting words recede
 * 3 the supporting sentence surfaces
 * 4 the statement recedes into the next chapter
 */
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<Map<number, HTMLElement>>(new Map())
  const reduced = useReducedMotion()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (reduced) return

    const ctx = gsap.context(() => {
      const words = Array.from(wordRefs.current.values())
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })

      /* stage 0 — the statement arrives from the hero's scale/blur */
      tl.fromTo(
        '.ms-quote',
        { scale: 0.9, filter: 'blur(16px)', opacity: 0.5 },
        { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 0.12 },
        0
      )

      /* stage 1 — words resolve left to right */
      tl.fromTo(
        words,
        { opacity: 0.07, rotateX: 8, filter: 'blur(7px)' },
        { opacity: 0.55, rotateX: 0, filter: 'blur(0px)', clearProps: 'filter', duration: 0.38, stagger: 0.028 },
        0.08
      )

      /* stage 2 — accent words dominate, supporting words recede */
      tl.to(
        words.filter((_, i) => !STATEMENT[i].accent),
        { opacity: 0.35, scale: 0.98, duration: 0.22 },
        0.5
      )

      /* stage 3 — the supporting line surfaces under the statement */
      tl.fromTo(
        '.ms-support',
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.16, ease: 'power2.out' },
        0.68
      )

      /* stage 4 — statement recedes, the next chapter announces itself */
      tl.to(
        '.ms-quote',
        { scale: 1.05, opacity: 0.25, filter: 'blur(8px)', duration: 0.14 },
        0.88
      )
      tl.fromTo(
        '.ms-coda',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.12, ease: 'power2.out' },
        0.94
      )
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} aria-label="About" className="relative overflow-hidden" style={{ height: '280vh' }}>
      <div
        ref={stickyRef}
        className="sticky top-0 flex min-h-[100svh] flex-col justify-center px-5 sm:px-8"
      >
        <div className="mx-auto w-full max-w-shell">
<div className="flex items-center justify-between">
            <p className="label mb-8 text-accent-secondary">01 — Transmission</p>
            <p className="label mb-8 hidden sm:block">Section 02 — 08</p>
          </div>

<p
            className="ms-quote fluid-quote max-w-6xl font-extrabold leading-[1.08] tracking-tight text-ink [transform-style:preserve-3d]"
            style={{ perspective: '800px' }}
          >
            {STATEMENT.map((word, i) => (
              <span key={`${word.word}-${i}`} className="inline-block whitespace-nowrap">
                <span
                  ref={(n) => {
                    if (n) wordRefs.current.set(i, n)
                  }}
                  className="inline-block will-change-transform"
                  style={word.accent ? { color: 'var(--accent-secondary)' } : undefined}
                >
                  {word.word}
                </span>
                {i < STATEMENT.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>

          <p className="ms-support mt-10 max-w-xl text-base leading-relaxed text-ink-secondary" style={{ opacity: 0 }}>
            From the backend domains that quietly hold a product together, to the
            WebGL surfaces that open a story — I build the full journey, and care
            about the last 1% of craft: timing, typography, performance.
          </p>

          <p className="ms-coda label mt-16" style={{ opacity: 0 }}>
            Next — Capabilities
          </p>
        </div>
      </div>
    </section>
  )
}