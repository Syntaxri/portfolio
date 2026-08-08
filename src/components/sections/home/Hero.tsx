'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { HeroCanvas } from '@/components/three/HeroCanvas'
import { Magnetic } from '@/components/animations/Magnetic'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLenis } from '@/components/animations/SmoothScroll'
import { site } from '@/lib/data/site'

const ENTRANCE_EVENT = 'ar:entrance-ready'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const nameWrapRef = useRef<HTMLDivElement>(null)
  const rolesRef = useRef<HTMLParagraphElement>(null)
  const kickerRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollTo } = useLenis()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    if (reduced) return

    const start = () => {
      const ctx = gsap.context(() => {
        const words = el.querySelectorAll<HTMLElement>('.hero-name-line')
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
        tl.to(kickerRef.current, { y: 0, opacity: 1, duration: 0.7 }, 0)
          .to(words, { yPercent: 0, duration: 1.05, stagger: 0.12 }, 0.05)
        tl.to(rolesRef.current, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.7)
          .to(ctasRef.current, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.8)
          .to(scrollHintRef.current, { opacity: 1, duration: 0.6 }, 1.1)

        /* gentle parallax drift as the hero scrolls away */
        gsap.to(contentRef.current, {
          y: -70,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }, el)
      return () => ctx.revert()
    }

    const alreadySeen = sessionStorage.getItem('ar-preloader')
    if (alreadySeen) {
      const id = setTimeout(() => start(), 100)
      return () => clearTimeout(id)
    }

    let fallback = 0
    const startAfterEntrance = () => start()
    window.addEventListener(ENTRANCE_EVENT, startAfterEntrance, { once: true })
    fallback = window.setTimeout(startAfterEntrance, 3200)
    return () => {
      window.removeEventListener(ENTRANCE_EVENT, startAfterEntrance)
      clearTimeout(fallback)
    }
  }, [reduced])

  return (
    <section ref={sectionRef} aria-label="Introduction" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <HeroCanvas />

      <div ref={contentRef} className="relative z-10 mx-auto flex w-full max-w-shell flex-1 flex-col justify-end px-5 pb-10 pt-[calc(var(--nav-h)+4rem)] sm:px-8 sm:pb-14">
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0 flex-1">
            <p ref={kickerRef} className="label label-accent mb-6" style={{ opacity: 0 }}>
              {site.role} — {site.location}
            </p>

            <h1 className="fluid-display font-extrabold leading-none tracking-tight">
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="hero-name-line inline-block will-change-transform" style={{ transform: 'translateY(110%)' }}>
                  Akram
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="hero-name-line inline-block will-change-transform" style={{ transform: 'translateY(110%)' }}>
                  Rihani
                </span>
              </span>
            </h1>

            <p ref={rolesRef} className="mt-6 font-mono text-sm uppercase tracking-[0.18em] text-ink-tertiary" style={{ opacity: 0 }}>
              Creative Development
              <span className="mx-3 text-accent">·</span>3D Web Experience
              <span className="mx-3 text-accent">·</span>Full-Stack Engineering
            </p>
          </div>

          <p className="hidden max-w-[22rem] text-sm leading-relaxed text-ink-secondary md:block">
            {site.strapline}
          </p>
        </div>

        <div ref={ctasRef} className="mt-12 flex flex-wrap items-center gap-4" style={{ opacity: 0 }}>
          <Magnetic strength={0.3}>
            <button
              type="button"
              onClick={() => scrollTo('#work')}
              className="group inline-flex items-center gap-3 bg-ink px-6 py-3.5 font-display text-sm font-bold tracking-tight text-[#05060a] transition-colors duration-300 hover:bg-accent"
            >
              View selected work
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden>
                ↓
              </span>
            </button>
          </Magnetic>
          <Magnetic strength={0.3}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-white/15 px-6 py-3.5 font-mono text-[0.65rem] uppercase tracking-widest text-ink-secondary transition-colors duration-300 hover:border-accent/50 hover:text-ink"
            >
              Let&apos;s work together
            </Link>
          </Magnetic>
          <span className="ml-auto flex items-center gap-3 self-end">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="label hidden sm:inline">{site.availability}</span>
          </span>
        </div>
      </div>

      {/* scroll cue */}
      <div ref={scrollHintRef} className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex" aria-hidden style={{ opacity: 0 }}>
        <span className="label">Scroll</span>
        <span className="block h-12 w-px overflow-hidden bg-white/10">
          <span className="block h-1/2 w-px animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-accent" />
        </span>
      </div>
    </section>
  )
}