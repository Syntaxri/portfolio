'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { WebGLErrorBoundary } from '@/components/three/WebGLErrorBoundary'
import { Monogram } from '@/components/museum/Monogram'
import { site } from '@/lib/data/site'

gsap.registerPlugin(ScrollTrigger)

const MosaicCanvas = dynamic(() => import('@/components/three/MosaicCanvas').then((m) => m.MosaicCanvas), {
  ssr: false,
  loading: () => null,
})

/**
 * ROOM 00 — THE ATRIUM.
 * The entrance installation: after the preloader door lifts, a Zellige
 * composition is presented out of the kiln — warm light spilling, the
 * camera stepping forward, pieces locking into place from the outside
 * in. When the object settles, the museum's thesis is spoken; hairline
 * orbit rings turn around it at clockwork pace. A double-click fires
 * the kiln again — the star flares, the room clinks, a FIRED proof mark
 * flashes. Scroll grinds the composition apart and the visitor walks
 * into the museum.
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

  useEffect(() => {
    const done = () => setEntered(true)
    if (reduced) {
      done()
      return
    }
    /* the hero waits for the door to lift (ar:door-lift) so the WebGL
       kiln never fights the preloader for the main thread. Returning
       visitors skip the door entirely — a short paint beat only, so
       the entrance opens as soon as the page is ready, never behind
       an artificial wait. */
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

      {/* hairline orbit rings — instrumentation behind the artifact,
          turning at clockwork pace, never touching the composition */}
      <div className="orbs" aria-hidden="true">
        <div className="orb-pos orb-a h-[58vmin] w-[58vmin]">
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
        <div className="orb-pos orb-b h-[71vmin] w-[71vmin]">
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
        <div className="orb-pos orb-c h-[84vmin] w-[84vmin]">
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

      <div className="absolute inset-0" aria-hidden="true">
        <WebGLErrorBoundary onFail={() => setGlFailed(true)}>
          {!glFailed && entered && (
            <div className="absolute inset-0" data-installation>
              <MosaicCanvas />
            </div>
          )}
        </WebGLErrorBoundary>
        <div className="mosaic-fallback" aria-hidden="true" />
      </div>

      {/* the kiln's proof mark — stamped over the room, then gone.
          keyed: every firing restamps a fresh mark */}
      <div className="pointer-events-none absolute inset-x-0 top-[56%] z-20 flex justify-center">
        <span
          key={fireCount}
          className={`fired-mark ${fireCount ? 'is-fired' : ''}`}
          style={fireCount ? undefined : { opacity: 0 }}
        >
          Fired
        </span>
      </div>

      {/* the museum's thesis — spoken once the mandala has settled */}
      <div
        data-place-thesis
        className="pointer-events-none absolute inset-x-0 top-[70%] z-10 px-4 text-center"
      >
        <div
          className={`thesis-reveal ${thesisVisible ? 'is-shown' : ''}`}
          data-thesis-reveal
          style={thesisVisible ? undefined : { opacity: 0 }}
        >
          <p className="thesis-eyebrow">The museum begins</p>
          <p className="thesis-line">This museum has no walls — only craft.</p>
        </div>
      </div>

      <div className="pointer-events-none relative z-10 w-full flex-1 px-4 pt-4 sm:px-6 sm:pt-5">
        <div ref={contentRef} className="max-w-4xl">
          <div
            className="flex items-center gap-4"
            data-hero-reveal
            style={{ opacity: entered ? undefined : 0 }}
          >
            <Monogram className="h-12 w-12 text-accent-2" />
            <div>
              <h1 className="label-accent label">Room 00 — the atrium</h1>
              <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-text-3">
                The museum of software craftsmanship · Azrou, Morocco
              </p>
            </div>
          </div>
          <div
            className="mt-4 flex flex-col items-start gap-1.5"
            data-hero-reveal
            style={{ opacity: entered ? undefined : 0 }}
          >
            <p className="label-muted label flex items-center gap-2">
              <span className="inline-block h-px w-6 bg-text-3" aria-hidden="true" />
              Scroll — the zellige unlocks
            </p>
            {!glFailed && (
              <p className="label-muted label">
                <span className="sm:hidden">Double-tap</span>
                <span className="hidden sm:inline">Double-click</span> the zellige — the kiln fires a new
                pattern
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-end justify-end px-4 pb-6 sm:px-6">
        <span className="label-muted label" data-hero-reveal style={{ opacity: entered ? undefined : 0 }}>
          {site.name} × {site.nickname} — {new Date().getFullYear()}
        </span>
      </div>
    </section>
  )
}
