'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { capabilities } from '@/lib/data/capabilities'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.cap-row'),
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} id="capabilities" aria-label="Capabilities" className="section-pad relative">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="label label-accent mb-6">02 — Capabilities</p>
            <h2 className="fluid-h2 max-w-xl font-extrabold tracking-tight">
              What I bring to the table
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-secondary md:justify-self-end">
            A practice that spans the full journey — from the creative surface to
            the systems underneath.
          </p>
        </div>

        <div className="border-t border-white/[0.08]">
          {capabilities.map((c) => (
            <article
              key={c.index}
              className="cap-row group grid grid-cols-1 gap-6 border-b border-white/[0.08] py-10 transition-colors duration-500 hover:bg-white/[0.015] md:grid-cols-[8rem_1fr_1fr] md:items-start md:gap-10 md:px-4"
            >
              <span className="label pt-2 text-accent-secondary">{c.index}</span>

              <div>
                <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-tight text-ink transition-transform duration-500 ease-out-expo md:group-hover:translate-x-3">
                  {c.title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-secondary">
                  {c.description}
                </p>
              </div>

              <div className="flex flex-wrap content-start gap-2 md:justify-end">
                {c.skills.map((s) => (
                  <span key={s} className="tag border-white/10 px-3 py-1 font-mono text-[0.55rem] uppercase tracking-widest text-ink-tertiary transition-colors duration-300 group-hover:border-accent/30 group-hover:text-ink-secondary">
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}