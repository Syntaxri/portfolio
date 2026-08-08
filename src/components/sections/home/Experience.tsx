'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '@/lib/data/experience'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Editorial timeline — each entry surfaces through its own read position:
 * approaching entries sit quiet and compressed, the one being read grows
 * to full voice, and a node travels the line as you pass.
 */
export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      const rows = el.querySelectorAll('.exp-row')

      gsap.fromTo(rows, { opacity: 0.35, scale: 0.94, y: 30 }, {
        opacity: 1,
        scale: 1,
        y: 0,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 55%', scrub: 0.4 },
      } as gsap.TweenVars)

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 60%', scrub: 0.3 },
        }
      )

      /* the node walks the line as entries surface */
      if (listRef.current && nodeRef.current) {
        gsap.fromTo(
          nodeRef.current,
          { y: 0, opacity: 1 },
          {
            y: listRef.current.offsetHeight,
            ease: 'none',
            scrollTrigger: {
              trigger: listRef.current,
              start: 'top 70%',
              end: 'bottom 55%',
              scrub: 0.4,
            },
          }
        )
      }
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
            Self-taught, then contract, then platform architecture — every role informed the next.
          </p>
        </div>

        <div className="relative grid grid-cols-[1.25rem_1fr] gap-x-5 sm:grid-cols-[4rem_1fr] sm:gap-x-8">
          <div className="relative">
            <div className="h-full w-px bg-white/[0.06]" />
            <div
              ref={lineRef}
              className="absolute inset-y-0 left-0 w-px bg-white/70"
              style={{ transform: 'scaleY(0)' }}
            />
            <span
              ref={nodeRef}
              aria-hidden
              className="absolute -left-[3px] top-0 h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_14px_rgba(139,92,246,0.9)]"
            />
          </div>

          <div ref={listRef} className="space-y-16">
            {experience.map((item, i) => (
              <article key={item.year} className="exp-row">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[7rem_1fr] sm:gap-8">
                  <div className="flex items-baseline gap-4 sm:block">
                    <p className="label text-ink-tertiary" aria-hidden>
                      {String(i + 1).padStart(2, '0')} — {item.company}
                    </p>
                    <h3
                      className="text-6xl font-extrabold tracking-tight text-outline sm:mt-2 sm:text-7xl"
                      aria-hidden
                    >
                      {item.year}
                    </h3>
                  </div>
                  <div className="pt-1 sm:pt-2">
                    <h4 className="fluid-title font-extrabold tracking-tight">{item.role}</h4>
                    <p className="label mt-1 text-accent-secondary">{item.company}</p>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-secondary">{item.desc}</p>
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
