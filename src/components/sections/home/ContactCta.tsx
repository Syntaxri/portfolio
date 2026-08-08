'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealText } from '@/components/animations/RevealText'
import { Magnetic } from '@/components/animations/Magnetic'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { site } from '@/lib/data/site'

gsap.registerPlugin(ScrollTrigger)

export function ContactCta() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector('.cta-inner'),
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 75%', once: true },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} id="contact" aria-label="Contact" className="relative border-t border-white/[0.06]">
      <div className="cta-inner mx-auto flex min-h-[85svh] max-w-shell flex-col items-center justify-center px-5 py-28 text-center sm:px-8">
        <p className="label label-accent mb-8">07 — Contact</p>

        <h2 className="fluid-display font-extrabold leading-[1.02] tracking-tight">
          <RevealText className="block">Let&apos;s build</RevealText>
          <RevealText className="text-outline block">something memorable</RevealText>
        </h2>

        <p className="mt-10 max-w-md text-sm leading-relaxed text-ink-secondary">
          Always open to interesting projects, collaborative conversations, and
          sharp challenges. Replies usually within 24 hours.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Magnetic strength={0.35}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-ink px-8 py-4 font-display text-base font-bold tracking-tight text-[#05060a] transition-colors duration-300 hover:bg-accent"
            >
              Start a project
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </Link>
          </Magnetic>
          <a
            href={`mailto:${site.email}`}
            className="link-underline font-mono text-[0.65rem] uppercase tracking-widest text-ink-tertiary transition-colors hover:text-ink"
          >
            {site.email}
          </a>
        </div>
      </div>
    </section>
  )
}