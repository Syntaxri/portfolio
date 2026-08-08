'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { engineered } from '@/lib/data/engineered'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Under the hood" — a type-driven index of what this site itself
 * is built to do. Every row is a true property of the shipped
 * implementation, communicated plainly.
 */
export function Engineered() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.eng-row'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 76%', once: true },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      aria-label="Engineering"
      className="section-pad relative border-t border-white/[0.06]"
    >
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <p className="label label-accent mb-6">07 — Under the hood</p>
        <h2 className="fluid-h2 max-w-3xl font-extrabold tracking-tight">
          Built with the <span className="text-outline">engineer&apos;s</span> restraint
        </h2>

        <div className="mt-14 grid grid-cols-1 border-t border-white/[0.08] md:grid-cols-2">
          {engineered.map((item, i) => (
            <article
              key={item.index}
              className="eng-row group border-b border-white/[0.08] py-8 pr-4 transition-colors duration-500 hover:bg-white/[0.015] md:py-10"
            >
              <div className="flex items-baseline gap-5">
                <span className="label text-accent-secondary">{item.index}</span>
                <h3 className="text-[clamp(1.5rem,2.4vw,2.2rem)] font-extrabold tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                  {item.title}
                </h3>
              </div>
              <p className="mt-4 max-w-md pr-4 text-sm leading-relaxed text-ink-secondary">{item.detail}</p>
            </article>
          ))}
        </div>

        <p className="label mt-10 text-ink-tertiary">
          Every claim above is verifiable in this repository — run the build, inspect the shader, toggle
          reduced motion.
        </p>
      </div>
    </section>
  )
}
