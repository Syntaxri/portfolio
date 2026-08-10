'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stack } from '@/lib/data/capabilities'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Marquee from './StackMarquee'

gsap.registerPlugin(ScrollTrigger)

/**
 * Editorial technology index — one disciplined row per tool.
 * Hovering a row makes it dominant; the rest recede.
 * No badge walls, no pill collections.
 */
export function StackSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.stack-row'),
        { y: 46, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: 'top 76%', once: true },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      aria-label="Technology"
      className="section-pad relative border-t border-white/[0.06]"
    >
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label label-accent mb-6">06 — Technology</p>
            <h2 className="fluid-h2 max-w-2xl font-extrabold tracking-tight">
              The tools, <span className="text-outline">and why</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-secondary">
            Chosen for restraint, not collection — each one earns its place in the stack.
          </p>
        </div>

        <div className="grid grid-cols-1 border-t border-white/[0.08] md:grid-cols-2">
          {stack.map((entry, i) => (
            <article
              key={entry.tech}
              className={`stack-row group flex flex-wrap items-baseline justify-between gap-x-5 gap-y-3 border-b border-white/[0.08] py-5 transition-opacity duration-300 md:py-6 sm:gap-x-6 ${
                i % 2 === 1 ? 'md:pl-14' : ''
              }`}
            >
              <div className="flex items-baseline gap-5">
                <span className="label text-ink-tertiary transition-colors duration-300 group-hover:text-accent-secondary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-extrabold tracking-tight text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                  {entry.tech}
                </h3>
              </div>
              <p className="ml-auto max-w-[16rem] min-w-0 text-right font-mono text-[0.54rem] uppercase tracking-[0.18em] text-ink-tertiary transition-colors duration-300 group-hover:text-ink-secondary sm:block sm:text-[0.58rem]">
                {entry.note}
              </p>
            </article>
          ))}
        </div>
      </div>

      <Marquee items={stack.map((s) => s.tech)} />
    </section>
  )
}
