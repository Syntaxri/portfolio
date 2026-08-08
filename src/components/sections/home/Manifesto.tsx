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
 * 0 the statement resolves up into place
 * 1 words surface left to right
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

    let ctx: gsap.Context | undefined
    try {
      ctx = gsap.context(() => {
        const words = Array.from(wordRefs.current.values())

        /* stage start states — applied only when the timeline runs; the
           default DOM state (no-JS / reduced motion) is fully visible */
        gsap.set('.ms-quote', { y: 48, opacity: 0.85 })
        gsap.set(words, { opacity: 0.1, y: 14 })
        gsap.set('.ms-support', { y: 24, opacity: 0 })
        gsap.set('.ms-coda', { y: 20, opacity: 0 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        })

        /* stage 0 — the statement resolves up into place */
        tl.fromTo(
          '.ms-quote',
          { y: 48, opacity: 0.85 },
          { y: 0, opacity: 1, duration: 0.18, ease: 'power2.out' }
        )

        /* stage 1 — words surface left to right */
        tl.fromTo(words, { opacity: 0.1, y: 14 }, { opacity: 0.6, y: 0, duration: 0.4, stagger: 0.03 }, 0.08)

        /* stage 2 — accent words swell, supporting words recede */
        tl.to(
          words.filter((_, i) => STATEMENT[i].accent),
          { opacity: 1, scale: 1.04, duration: 0.18 },
          0.5
        )
        tl.to(
          words.filter((_, i) => !STATEMENT[i].accent),
          { opacity: 0.42, scale: 0.99, duration: 0.18 },
          0.5
        )

        /* stage 3 — the supporting line surfaces under the statement */
        tl.fromTo(
          '.ms-support',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.16, ease: 'power2.out' },
          0.64
        )

        /* stage 4 — statement recedes, the next chapter announces itself */
        tl.to('.ms-quote', { y: -36, opacity: 0.3, scale: 1.03, duration: 0.16 }, 0.82)
        tl.fromTo(
          '.ms-coda',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.12, ease: 'power2.out' },
          0.9
        )
      }, section)
    } catch {
      ctx?.revert()
      return
    }

    return () => ctx?.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      aria-label="About"
      className="relative overflow-hidden"
      style={{ height: '190vh' }}
    >
      <div ref={stickyRef} className="sticky top-0 flex min-h-[100svh] flex-col justify-center px-5 sm:px-8">
        <div className="mx-auto w-full max-w-shell">
          <div className="flex items-center justify-between">
            <p className="label mb-8 text-accent-secondary">01 — Transmission</p>
            <p className="label mb-8 hidden text-ink-tertiary sm:block">Scroll to focus</p>
          </div>

          <p className="ms-quote fluid-quote max-w-5xl font-extrabold leading-[1.05] tracking-tight text-ink">
            {STATEMENT.map((word, i) => (
              <span key={`${word.word}-${i}`} className="mr-[0.22em] inline-block whitespace-nowrap">
                <span
                  ref={(n) => {
                    if (n) wordRefs.current.set(i, n)
                  }}
                  className="inline-block will-change-transform"
                  style={word.accent ? { color: 'var(--accent-secondary)' } : undefined}
                >
                  {word.word}
                </span>
              </span>
            ))}
          </p>

          <p className="ms-support mt-10 max-w-xl text-base leading-relaxed text-ink-secondary">
            From the backend domains that quietly hold a product together, to the WebGL surfaces that open a
            story — I build the full journey, and care about the last 1% of craft: timing, typography,
            performance.
          </p>

          <p className="ms-coda label mt-16">Next — Capabilities</p>
        </div>
      </div>
    </section>
  )
}
