'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '@/lib/data/experience'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      const rows = el.querySelectorAll('.exp-row')
      gsap.fromTo(
        rows,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 70%', once: true },
        }
      )
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 70%', scrub: 0.3 },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} id="experience" aria-label="Experience" className="section-pad relative">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="label label-accent mb-6">04 — Experience</p>
            <h2 className="fluid-h2 max-w-xl font-extrabold tracking-tight">The road so far</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-secondary md:justify-self-end">
            Self-taught, then contract, then platform architecture — every role
            informed the next.
          </p>
        </div>

        <div className="relative grid grid-cols-[1.5rem_1fr] gap-x-6 sm:grid-cols-[4rem_1fr]">
          <div className="relative">
            <div className="h-full w-px bg-white/[0.06]" />
            <div ref={lineRef} className="absolute inset-y-0 left-0 w-px bg-accent" style={{ transform: 'scaleY(0)' }} />
          </div>

          <div className="space-y-12">
            {experience.map((item) => (
              <article key={item.year} className="exp-row">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[6rem_1fr]">
                  <h3 className="text-5xl font-extrabold tracking-tight text-outline sm:text-6xl" aria-hidden>
                    {item.year.slice(2)}
                  </h3>
                  <div className="pt-1 sm:pt-2">
                    <h4 className="fluid-title font-extrabold tracking-tight">{item.role}</h4>
                    <p className="label mt-1 text-accent-secondary">{item.company}</p>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-secondary">{item.desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}