'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const STATEMENTS = [
  { words: ['I', 'design'], accent: false },
  { words: ['and', 'engineer'], accent: false },
  { words: ['digital'], accent: true },
  { words: ['experiences'], accent: true },
  { words: ['that', 'move'], accent: false },
  { words: ['people.'], accent: false },
]

/**
 * Scrollytelling — a tall sticky viewport whose words
 * resolve from blurred/muted to sharp white as the reader scrolls.
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
      words.forEach((w) => {
        gsap.fromTo(
          w,
          {
            opacity: 0.08,
            rotateX: 6,
            filter: 'blur(6px)',
          },
          {
            opacity: 1,
            rotateX: 0,
            filter: 'blur(0px)',
            clearProps: 'filter',
            ease: 'none',
            stagger: 1,
            scrollTrigger: {
              trigger: stickyRef.current,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 0.4,
            },
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} aria-label="About" className="relative" style={{ height: '220vh' }}>
      <div
        ref={stickyRef}
        className="sticky top-0 flex min-h-[100svh] flex-col justify-center px-5 sm:px-8"
      >
        <div className="mx-auto w-full max-w-shell">
          <p className="label mb-8 text-accent-secondary">01 — About</p>

          <p
            className="fluid-quote max-w-5xl font-extrabold leading-[1.08] tracking-tight text-ink [transform-style:preserve-3d]"
            style={{ perspective: '800px' }}
          >
            {STATEMENTS.map((group, gi) => (
              <span key={gi} className="mr-[0.22em] inline-block whitespace-nowrap">
                {group.words.map((word, wi) => {
                  const id = gi * 10 + wi
                  return (
                    <span
                      key={id}
                      ref={(n) => {
                        if (n) wordRefs.current.set(id, n)
                      }}
                      className="inline-block will-change-transform"
                      style={group.accent ? { color: 'var(--accent-secondary)' } : undefined}
                    >
                      {word}
                    </span>
                  )
                })}
              </span>
            ))}
          </p>

          <p className="mt-10 max-w-xl text-base leading-relaxed text-ink-secondary">
            From the backend domains that quietly hold a product together, to the
            WebGL surfaces that open a story — I build the full journey, and care
            about the last 1% of craft: timing, typography, performance.
          </p>
        </div>
      </div>
    </section>
  )
}