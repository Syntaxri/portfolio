'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealText } from '@/components/animations/RevealText'
import { Magnetic } from '@/components/animations/Magnetic'
import { SkewScroll } from '@/components/animations/SkewScroll'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { site } from '@/lib/data/site'

gsap.registerPlugin(ScrollTrigger)

/**
 * The final movement — the statement grows in scale as it is reached
 * and the section darkens behind it: one intentional climax.
 */
export function ContactCta() {
  const sectionRef = useRef<HTMLElement>(null)
  const ghostRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector('.cta-inner'),
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 72%', once: true },
        }
      )
      gsap.to(ghostRef.current, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 0.4 },
      })
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact"
      className="relative overflow-hidden border-t border-white/[0.06]"
    >
      {/* afterglow — atmosphere returning for the finale */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 115%, rgba(139,92,246,0.16), transparent 62%), radial-gradient(40% 34% at 18% 12%, rgba(56,189,248,0.05), transparent 60%)',
        }}
      />

      <span
        ref={ghostRef}
        aria-hidden
        className="pointer-events-none absolute -right-4 top-[10%] select-none font-display text-[clamp(8rem,20vw,18rem)] font-extrabold leading-none tracking-tighter text-outline opacity-[0.06]"
      >
        AR
      </span>

      <div className="cta-inner relative mx-auto flex min-h-[88svh] max-w-shell flex-col items-center justify-center px-5 py-28 text-center sm:px-8">
        <p className="label label-accent mb-8">08 — Contact</p>

        <SkewScroll strength={0.01}>
          <h2 className="fluid-display font-extrabold leading-[1.0] tracking-tight">
            <RevealText className="block" blur>
              Let&apos;s build
            </RevealText>
            <RevealText className="text-outline block" delay={0.12}>
              something memorable
            </RevealText>
          </h2>
        </SkewScroll>

        <p className="mt-10 max-w-md text-sm leading-relaxed text-ink-secondary">
          Always open to interesting projects, collaborative conversations, and
          sharp challenges. Replies usually within 24 hours.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Magnetic strength={0.4}>
            <Link
              href="/contact"
              data-cursor-text="Open"
              className="group inline-flex items-center gap-3 bg-ink px-9 py-5 font-display text-base font-bold tracking-tight text-[#05060a] transition-colors duration-300 hover:bg-accent"
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
          <a
            href="/Akram-Rihani-CV.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-mono text-[0.65rem] uppercase tracking-widest text-ink-tertiary transition-colors hover:text-ink"
          >
            Resume ↗
          </a>
        </div>
      </div>
    </section>
  )
}