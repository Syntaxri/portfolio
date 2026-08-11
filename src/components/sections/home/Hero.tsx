'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroCanvas } from '@/components/three/HeroCanvas'
import { Magnetic } from '@/components/animations/Magnetic'
import { SkewScroll } from '@/components/animations/SkewScroll'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLenis } from '@/components/animations/SmoothScroll'
import { site } from '@/lib/data/site'

gsap.registerPlugin(ScrollTrigger)

const ENTRANCE_EVENT = 'ar:entrance-ready'

/**
 * Hero — asymmetric editorial composition. The WebGL core sits off-axis,
 * the name owns the left column, and the whole block compresses and
 * recedes as the manifesto takes over (one continuous descent).
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLSpanElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)
  const failSafeRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const reduced = useReducedMotion()
  const { scrollTo } = useLenis()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const teardown = () => {
      clearTimeout(failSafeRef.current)
      ctxRef.current?.revert()
      ctxRef.current = null
    }

    /* reduced motion — no hidden states, content fully visible */
    if (reduced) {
      teardown()
      return
    }

    const start = () => {
      if (ctxRef.current) return

      const ctx = gsap.context(() => {
        /* entrance start states are applied only when animation actually
           runs — the default DOM/CSS state is fully visible */
        gsap.set('.hero-kicker, .hero-strapline, .hero-meta, .hero-rail, .hero-hint', { opacity: 0 })
        gsap.set('.hero-name-line', { yPercent: 110 })

        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

        tl.fromTo('.hero-kicker', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.05)
          .fromTo('.hero-name-line', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.14 }, 0.12)
          .fromTo('.hero-strapline', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.55)
          .fromTo('.hero-meta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.7)
          .fromTo('.hero-rail', { opacity: 0 }, { opacity: 1, duration: 1 }, 0.8)
          .fromTo('.hero-hint', { opacity: 0 }, { opacity: 1, duration: 0.7 }, 1.0)

        /* scroll-out: the hero physically recedes into the manifesto */
        gsap.to('.hero-compress', {
          scale: 0.94,
          y: -60,
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: '90% top',
            scrub: true,
          },
        })
        gsap.to(ghostRef.current, {
          xPercent: 7,
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
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
      ctxRef.current = ctx

      /* fail-safe: if the timeline stalls for any reason, force content
         visible so availability never depends on animation completing */
      failSafeRef.current = setTimeout(() => {
        gsap.to(el.querySelectorAll('.hero-kicker, .hero-strapline, .hero-meta, .hero-rail, .hero-hint'), {
          opacity: 1,
          duration: 0.4,
          overwrite: 'auto',
        })
        gsap.to(el.querySelectorAll('.hero-name-line'), {
          yPercent: 0,
          duration: 0.4,
          overwrite: 'auto',
        })
      }, 6000)
    }

    let alreadySeen = sessionStorage.getItem('ar-preloader')
    if (!alreadySeen) {
      try {
        alreadySeen = localStorage.getItem('ar-preloader')
      } catch {
        /* storage unavailable (private mode) — session result stands */
      }
    }
    if (alreadySeen) {
      const id = setTimeout(() => start(), 100)
      return () => {
        clearTimeout(id)
        teardown()
      }
    }

    const startAfterEntrance = () => start()
    window.addEventListener(ENTRANCE_EVENT, startAfterEntrance, { once: true })
    const fallback = window.setTimeout(startAfterEntrance, 3200)
    return () => {
      window.removeEventListener(ENTRANCE_EVENT, startAfterEntrance)
      clearTimeout(fallback)
      teardown()
    }
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <HeroCanvas />

      {/* ghost word — scale difference behind the composition */}
      <span
        ref={ghostRef}
        aria-hidden
        className="hero-rail pointer-events-none absolute -right-6 top-[16%] z-[1] hidden select-none font-display text-[clamp(10rem,24vw,22rem)] font-extrabold leading-none tracking-tighter text-outline opacity-[0.07] xl:block"
      >
        AKRAM
      </span>

      {/* vertical rail — editorial annotation */}
      <span
        aria-hidden
        className="hero-rail absolute right-8 top-1/2 z-[1] hidden origin-right -translate-y-1/2 rotate-90 font-mono text-[0.65rem] uppercase tracking-[0.34em] text-ink-tertiary xl:block"
      >
        3D — Motion — Engineering
      </span>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-shell flex-1 flex-col px-5 pt-[calc(var(--nav-h)+2.5rem)] sm:px-8"
      >
        <div className="hero-kicker flex items-center justify-between">
          <p className="label label-accent">
            {site.role} — {site.location}
          </p>
          <p className="label hidden items-center gap-2 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {site.availability}
          </p>
        </div>

        <div className="hero-compress mt-auto pb-12 sm:pb-16">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <h1 className="text-[clamp(2.75rem,8.5vw,8rem)] font-extrabold leading-[0.9] tracking-tight">
              <SkewScroll>
                <span className="block overflow-hidden pb-[0.09em]">
                  <span className="hero-name-line inline-block will-change-transform">Akram</span>
                </span>
              </SkewScroll>
              <SkewScroll strength={0.008}>
                <span className="block overflow-hidden pb-[0.12em]">
                  <span className="hero-name-line text-outline-strong inline-block will-change-transform">
                    Rihani
                  </span>
                </span>
              </SkewScroll>
            </h1>

            <p className="hero-strapline max-w-[21rem] text-sm leading-relaxed text-ink-secondary">
              {site.strapline}
            </p>
          </div>

          <div className="hero-meta mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t border-white/[0.08] pt-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-tertiary">
              Creative Development
              <span className="mx-3 text-accent">·</span>3D Web Experience
              <span className="mx-3 text-accent">·</span>Full-Stack Engineering
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Magnetic strength={0.35}>
                <button
                  type="button"
                  onClick={() => scrollTo('#work')}
                  className="group inline-flex items-center gap-3 bg-ink px-7 py-4 font-display text-sm font-bold tracking-tight text-[#05060a] transition-colors duration-300 hover:bg-accent"
                >
                  View selected work
                  <span
                    className="inline-block transition-transform duration-300 group-hover:translate-y-0.5"
                    aria-hidden
                  >
                    ↓
                  </span>
                </button>
              </Magnetic>
              <Magnetic strength={0.25}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 border border-white/15 px-7 py-4 font-mono text-[0.65rem] uppercase tracking-widest text-ink-secondary transition-colors duration-300 hover:border-accent/50 hover:text-ink"
                >
                  Let&apos;s work together
                </Link>
              </Magnetic>
              <a
                href="/Akram-Rihani-CV.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-white/15 px-7 py-4 font-mono text-[0.65rem] uppercase tracking-widest text-ink-secondary transition-colors duration-300 hover:border-accent/50 hover:text-ink"
              >
                Resume
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        className="hero-hint pointer-events-none absolute bottom-9 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
        aria-hidden
      >
        <span className="label">Scroll</span>
        <span className="block h-12 w-px overflow-hidden bg-white/10">
          <span className="block h-1/2 w-px animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-accent" />
        </span>
      </div>
    </section>
  )
}
