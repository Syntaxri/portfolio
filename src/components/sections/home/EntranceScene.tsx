'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLenis } from '@/components/animations/SmoothScroll'
import { WebGLErrorBoundary } from '@/components/three/WebGLErrorBoundary'
import { site } from '@/lib/data/site'

gsap.registerPlugin(ScrollTrigger)

const MosaicCanvas = dynamic(() => import('@/components/three/MosaicCanvas').then((m) => m.MosaicCanvas), {
  ssr: false,
  loading: () => null,
})

/**
 * ROOM 00 — THE ATRIUM.
 * The entrance installation. The door plate names the keeper first —
 * Akram Rihani, creative developer and digital craftsman — and the
 * museum speaks around him: the room number, the thesis, the kiln.
 * The Zellige composition is presented out of the kiln on the right:
 * warm light spilling, the camera stepping forward, pieces locking into
 * place from the outside in. When the object settles, the museum's
 * thesis is spoken; hairline orbit rings turn around it at clockwork
 * pace. A double-click fires the kiln again — the star flares, the
 * room clinks, a FIRED proof mark flashes. Scroll grinds the
 * composition apart and the visitor walks into the museum.
 */

/* the entrance choreography, in one place:
   entered = the moment the door lifts (ar:door-lift)
   + ~2.1s  the last zellige piece locks into place (0.35 + order·0.12 + 0.95)
   + ~1.4s  of stillness — then the thesis reveals */
const MOSAIC_SETTLES_MS = 2100
const THESIS_REVEAL_MS = MOSAIC_SETTLES_MS + 1400

export function EntranceScene() {
  const [glFailed, setGlFailed] = useState(false)
  const [entered, setEntered] = useState(false)
  const [thesisShown, setThesisShown] = useState(false)
  const [fireCount, setFireCount] = useState(0)
  const reduced = useReducedMotion()
  /* reduced motion: the thesis is simply part of the static room */
  const thesisVisible = reduced || thesisShown
  const sceneRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { scrollTo } = useLenis()

  const go = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith('/#')) return
    e.preventDefault()
    scrollTo(href.slice(1), { offset: -64 })
  }

  useEffect(() => {
    /* the kiln's loop waits for the door to open — announced at most
       once: the Preloader's own lift, or this fallback when it never
       plays. Re-dispatching inside the door-lift listener itself would
       recurse synchronously until the stack gave out. */
    let announced = false
    const announceLift = () => {
      if (announced) return
      announced = true
      if (!reduced) window.dispatchEvent(new Event('ar:door-lift'))
    }
    const done = () => {
      setEntered(true)
      announceLift()
    }
    if (reduced) {
      done()
      return
    }
    /* the hero waits for the door to lift (ar:door-lift) so the entrance
       choreography never plays before the ceremony hands over. The kiln
       itself is already mounted from the first paint — hidden behind the
       opaque door — so its first frame (the page's LCP) is registered
       immediately instead of waiting for the JS-driven lift on slow
       devices. */
    let fallback = window.setTimeout(done, 250)
    const toLift = () => {
      /* a door is playing: wait for its lift, capped in case it is
         lost (listener race). The door force-lifts itself after 3.5s,
         so the cap simply sits beyond that guarantee. */
      window.clearTimeout(fallback)
      fallback = window.setTimeout(done, 4500)
    }
    const onReady = toLift
    const onLift = () => {
      window.clearTimeout(fallback)
      done()
    }
    const existing = window.__entranceReady
    if (existing) {
      toLift()
    } else {
      window.addEventListener('ar:entrance-ready', onReady)
    }
    window.addEventListener('ar:door-lift', onLift)
    return () => {
      window.clearTimeout(fallback)
      window.removeEventListener('ar:entrance-ready', onReady)
      window.removeEventListener('ar:door-lift', onLift)
    }
  }, [reduced])

  useEffect(() => {
    if (!entered) return
    document.documentElement.classList.add('no-cursor')
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-reveal]',
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.3 }
      )
      /* the installation is presented, not spawned: it rises and opens
         into the room just as the door finishes clearing */
      gsap.fromTo(
        '[data-installation]',
        { y: 18, scale: 1.045, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1.3, ease: 'expo.out', delay: 0.05 }
      )
    }, sceneRef)
    return () => ctx.revert()
  }, [entered, reduced])

  /* the thesis waits until the mandala has settled, then speaks once */
  useEffect(() => {
    if (!entered || reduced) return
    const t = window.setTimeout(() => setThesisShown(true), THESIS_REVEAL_MS)
    return () => window.clearTimeout(t)
  }, [entered, reduced])

  /* the kiln announcing itself: one FIRED proof mark per firing */
  useEffect(() => {
    const onFire = () => setFireCount((c) => c + 1)
    window.addEventListener('ar:kiln-fire', onFire)
    return () => window.removeEventListener('ar:kiln-fire', onFire)
  }, [])

  useEffect(() => {
    if (reduced) return
    const content = contentRef.current
    if (!content) return
    const ctx = gsap.context(() => {
      gsap.to(content, {
        yPercent: -14,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: sceneRef.current,
          start: 'top top',
          end: 'bottom 30%',
          scrub: true,
        },
      })
    }, content)
    return () => ctx.revert()
  }, [reduced])

  /* the thesis plaque walks past with the room as the visitor leaves */
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.to('[data-place-thesis]', {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sceneRef.current,
          start: 'top top',
          end: 'bottom 30%',
          scrub: true,
        },
      })
    }, sceneRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="entrance"
      ref={sceneRef}
      aria-label="The entrance"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-bg"
    >
      <div className="zellige-wall" aria-hidden="true" />
      <div className="mashrabiya" aria-hidden="true" />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-5 pt-14 sm:px-6 sm:pt-20"
      >
        {/* the door plate — world-building, kept small so the keeper
            speaks first */}
        <div className="flex items-start justify-between gap-4" data-hero-reveal>
          <div>
            <p className="label label-accent">Room 00 — the atrium</p>
            <p className="label label-muted mt-1.5">
              The museum of software craftsmanship · Azrou, Morocco
            </p>
          </div>
          <div className="hidden items-center gap-2.5 pt-1 md:flex">
            <span className="ping-dot" aria-hidden="true" />
            <span className="label label-muted">{site.availability}</span>
          </div>
        </div>

        <div className="grid flex-1 items-center gap-y-12 py-10 lg:grid-cols-12 lg:gap-x-4 lg:gap-y-0">
          {/* the keeper's plaque — who, what, why, and the way in */}
          <div className="lg:col-span-6 xl:col-span-6">
            <h1
              data-hero-reveal
              className="text-[clamp(2.5rem,6.5vw,5.5rem)] font-extrabold uppercase leading-[0.9]"
            >
              Akram Rihani
            </h1>

            <p
              data-hero-reveal
              className="mt-4 font-sans text-[clamp(0.9rem,1.5vw,1.1rem)] font-semibold uppercase tracking-[0.12em] text-text-2"
            >
              Full-Stack Software Developer
            </p>

            <p
              data-hero-reveal
              className="serif mt-5 max-w-[54ch] text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.5] text-text-2"
            >
              I engineer robust, scalable software solutions across the full technology stack,
              from intuitive user interfaces to reliable backend systems and data infrastructure.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3" data-hero-reveal>
              <Link href="/#collection" onClick={(e) => go(e, '/#collection')} className="btn">
                Explore work
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/#exit" onClick={(e) => go(e, '/#exit')} className="btn-ghost">
                Start a project
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* the thesis — spoken once the mandala has settled */}
            <div data-place-thesis className="mt-8">
              <div
                className={`thesis-reveal ${thesisVisible ? 'is-shown' : ''}`}
                data-thesis-reveal
                style={thesisVisible ? undefined : { opacity: 0 }}
              >
                <p className="thesis-eyebrow">The museum begins</p>
                <p className="thesis-line text-[clamp(1rem,1.6vw,1.3rem)]">
                  This museum has no walls — only craft.
                </p>
              </div>
            </div>
          </div>

          {/* the installation — the room's centrepiece, on its plinth */}
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto aspect-square w-full max-w-[min(100%,66svh)]">
              {/* hairline orbit rings — instrumentation behind the artifact,
                  turning at clockwork pace, never touching the composition */}
              <div className="absolute inset-0" aria-hidden="true">
                <div className="orb-pos orb-a h-[78%] w-[78%]">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    <circle cx="50" cy="50" r="49" className="orb-circle" strokeWidth={0.55} opacity={0.32} />
                    <circle
                      cx="50"
                      cy="50"
                      r="49"
                      className="orb-circle"
                      strokeWidth={1.1}
                      opacity={0.55}
                      strokeDasharray="6 302"
                    />
                  </svg>
                </div>
                <div className="orb-pos orb-b h-[92%] w-[92%]">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    <circle cx="50" cy="50" r="49" className="orb-circle" strokeWidth={0.5} opacity={0.24} />
                    <circle
                      cx="50"
                      cy="50"
                      r="49"
                      className="orb-circle"
                      strokeWidth={1}
                      opacity={0.45}
                      strokeDasharray="8 300"
                    />
                  </svg>
                </div>
                <div className="orb-pos orb-c h-[106%] w-[106%]">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    <circle cx="50" cy="50" r="49" className="orb-circle" strokeWidth={0.45} opacity={0.16} />
                    <circle
                      cx="50"
                      cy="50"
                      r="49"
                      className="orb-circle"
                      strokeWidth={0.9}
                      opacity={0.35}
                      strokeDasharray="10 298"
                    />
                  </svg>
                </div>
              </div>

              <div className="absolute inset-0">
                <WebGLErrorBoundary onFail={() => setGlFailed(true)}>
                  {!glFailed && (
                    <div className="absolute inset-0" data-installation>
                      <MosaicCanvas />
                    </div>
                  )}
                  <div className="mosaic-fallback" aria-hidden="true" />
                </WebGLErrorBoundary>
              </div>

              {/* the kiln's proof mark — stamped over the room, then gone.
                  keyed: every firing restamps a fresh mark */}
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <span
                  key={fireCount}
                  className={`fired-mark ${fireCount ? 'is-fired' : ''}`}
                  style={fireCount ? undefined : { opacity: 0 }}
                >
                  Fired
                </span>
              </div>
            </div>

            {/* the small print under the exhibit — hints, not messaging */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 sm:flex-row sm:items-end sm:justify-between">
              <p className="label label-muted">Scroll — the zellige unlocks</p>
              {!glFailed && (
                <p className="label label-muted text-center sm:text-right">
                  <span className="sm:hidden">Double-tap</span>
                  <span className="hidden sm:inline">Double-click</span> the zellige — the kiln
                  fires a new pattern
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pointer-events-none relative z-10 flex justify-end">
          <span className="label label-muted" data-hero-reveal>
            {site.name} × {site.nickname} — {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </section>
  )
}
