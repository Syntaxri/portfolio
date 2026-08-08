'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { processSteps } from '@/lib/data/capabilities'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Process as a journey — seven stations along one ruled line.
 * A master line travels with the reader and each station holds
 * the focus only while it is being read.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const masterLineRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        masterLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: el, start: 'top 72%', end: 'bottom 45%', scrub: 0.3 },
        }
      )

      gsap.fromTo(
        el.querySelectorAll('.step-row'),
        { opacity: 0.4, y: 44 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 76%', end: 'bottom 40%', scrub: 0.35 },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-label="Process"
      className="section-pad ambient-top relative border-t border-white/[0.06]"
    >
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="label label-accent mb-6">05 — Process</p>
            <h2 className="fluid-h2 max-w-xl font-extrabold tracking-tight">Seven stations, one arc</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-secondary md:justify-self-end">
            A single through-line from first sketch to shipped site — each station hands off to the next.
          </p>
        </div>

        <div className="relative grid grid-cols-[1rem_1fr] gap-x-6 sm:grid-cols-[3.5rem_1fr]">
          <div className="relative">
            <div className="h-full w-px bg-white/[0.07]" />
            <div
              ref={masterLineRef}
              className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-accent to-accent-secondary"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          <ol>
            {processSteps.map((step) => (
              <li
                key={step.index}
                className="step-row group relative border-b border-white/[0.07] py-9 transition-colors duration-500 last:border-b-0 hover:bg-white/[0.015]"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[6rem_1fr_1fr] md:items-baseline md:gap-10">
                  <span className="label text-ink-tertiary transition-colors duration-300 group-hover:text-accent-secondary">
                    {step.index}
                  </span>
                  <h3 className="text-[clamp(1.9rem,4.2vw,3.4rem)] font-extrabold tracking-tight text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
                    {step.title}
                  </h3>
                  <p className="max-w-md text-sm leading-relaxed text-ink-tertiary transition-colors duration-300 group-hover:text-ink-secondary md:justify-self-end">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
