'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealText } from '@/components/animations/RevealText'
import { SkewScroll } from '@/components/animations/SkewScroll'
import { Magnetic } from '@/components/animations/Magnetic'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { site } from '@/lib/data/site'
import type { ExperienceEntry } from '@/lib/data/experience'
import { stack } from '@/lib/data/capabilities'

gsap.registerPlugin(ScrollTrigger)

export function AboutClient({ experience }: { experience: ExperienceEntry[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = rootRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>('.about-reveal').forEach((node) => {
        gsap.fromTo(
          node,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: { trigger: node, start: 'top 88%', once: true },
          }
        )
      })
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={rootRef} className="pt-[calc(var(--nav-h)+2.5rem)]">
      <section className="mx-auto max-w-shell px-5 sm:px-8">
        <p className="label label-accent mb-8">About</p>
        <SkewScroll>
          <h1 className="fluid-display max-w-5xl font-extrabold leading-[1.02] tracking-tight">
            <RevealText>Engineering,</RevealText>{' '}
            <RevealText className="block text-outline">with taste.</RevealText>
          </h1>
        </SkewScroll>

        <div className="mt-16 grid grid-cols-1 gap-12 pb-24 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-base leading-relaxed text-ink md:text-lg">
              I&apos;m {site.name} — a developer whose roots run through backend architecture and whose
              obsessions run through interface craft. I speak fluent Java, Spring Boot and API design, and
              equally fluent React, TypeScript and WebGL.
            </p>
            <p className="mt-6 text-base leading-relaxed text-ink-secondary">
              That&apos;s an unusual combination for a reason: the best digital experiences feel effortless
              because the system underneath is boring-efficient. I build both halves.
            </p>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <p className="label mb-4">Currently</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-sm text-ink">{site.availability}</span>
              </li>
              <li className="text-sm text-ink-secondary">
                {site.location} · {site.email}
              </li>
            </ul>
            <div className="mt-10 border-t border-white/[0.08] pt-8">
              <p className="label mb-4">Stack</p>
              <div className="flex flex-wrap gap-2">
                {stack.slice(0, 8).map((entry) => (
                  <span
                    key={entry.tech}
                    className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink-tertiary"
                  >
                    {entry.tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="border-t border-white/[0.06]" aria-label="Journey">
        <div className="mx-auto max-w-shell px-5 py-24 sm:px-8">
          <p className="label label-accent mb-16">Journey</p>
          <div className="grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-2">
            {experience.map((item) => (
              <article key={item.year} className="about-reveal">
                <p
                  className="text-outline-strong font-display text-7xl font-extrabold leading-none tracking-tight"
                  aria-hidden
                >
                  {item.year}
                </p>
                <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight">{item.role}</h2>
                <p className="label mt-1 text-accent-secondary">{item.company}</p>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-secondary">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-shell flex-col items-start justify-between gap-10 px-5 py-24 sm:px-8 md:flex-row md:items-center">
          <div>
            <p className="label label-accent mb-6">Next</p>
            <h2 className="fluid-h2 max-w-xl font-extrabold tracking-tight">Have a project in mind?</h2>
          </div>
          <Magnetic strength={0.35}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-ink px-8 py-4 font-display text-base font-bold tracking-tight text-[#05060a] transition-colors duration-300 hover:bg-accent"
            >
              Let&apos;s talk
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
          </Magnetic>
        </div>
      </section>
    </div>
  )
}
