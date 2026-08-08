'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { processSteps } from '@/lib/data/capabilities'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.step-row'),
        { opacity: 0, x: -32 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.14,
          scrollTrigger: { trigger: el, start: 'top 72%', once: true },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} id="process" aria-label="Process" className="section-pad relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="label label-accent mb-6">05 — Process</p>
            <h2 className="fluid-h2 max-w-xl font-extrabold tracking-tight">How I build</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-secondary md:justify-self-end">
            A seven-step arc that keeps the experience coherent from first sketch
            to shipped site.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-px overflow-hidden bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <li key={step.index} className="step-row group relative bg-base p-7 transition-colors duration-500 hover:bg-white/[0.02]">
              <div className="flex items-baseline justify-between">
                <span className="label text-accent-secondary">{step.index}</span>
                <span className="block h-px w-6 bg-white/10 transition-all duration-500 group-hover:w-12 group-hover:bg-accent/60" />
              </div>
              <h3 className="mt-8 font-display text-xl font-extrabold tracking-tight text-ink">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-tertiary">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}