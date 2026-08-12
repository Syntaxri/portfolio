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

const MosaicCanvas = dynamic(
  () => import('@/components/three/MosaicCanvas').then((m) => m.MosaicCanvas),
  { ssr: false, loading: () => null }
)

/**
 * ROOM 00 — THE ATRIUM.
 * The entrance installation: a Zellige mandala assembles itself out of
 * glazed geometry while the monogram hangs above the name. Scroll
 * grinds the composition apart and the visitor walks into the museum.
 */
export function EntranceScene() {
  const [glFailed, setGlFailed] = useState(false)
  const [entered, setEntered] = useState(false)
  const reduced = useReducedMotion()
  const sceneRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const done = () => setEntered(true)
    if (reduced) {
      done()
      return
    }
    /* fallback: returning visitors never fire the preloader — enter
       anyway once the scene has had a beat to settle */
    const fallback = window.setTimeout(done, 1100)
    const onReady = () => {
      window.clearTimeout(fallback)
      done()
    }
    const existing = window.__entranceReady
    if (existing) {
      window.clearTimeout(fallback)
      done()
    } else {
      window.addEventListener('ar:entrance-ready', onReady)
    }
    return () => {
      window.clearTimeout(fallback)
      window.removeEventListener('ar:entrance-ready', onReady)
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
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.1 }
      )
    }, sceneRef)
    return () => ctx.revert()
  }, [entered, reduced])

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

  return (
    <section
      id="entrance"
      ref={sceneRef}
      aria-label="The entrance"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-bg"
    >
      <div className="zellige-wall" aria-hidden="true" />
      <div className="mashrabiya" aria-hidden="true" />

      <div className="absolute inset-0" aria-hidden="true">
        <WebGLErrorBoundary onFail={() => setGlFailed(true)}>
          {!glFailed && (
            <div className="absolute inset-0">
              <MosaicCanvas />
            </div>
          )}
        </WebGLErrorBoundary>
        <div className="mosaic-fallback" aria-hidden="true" />
      </div>

      <div
        className="pointer-events-none relative z-10 w-full flex-1 px-4 pt-4 sm:px-6 sm:pt-5"
      >
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
        </div>
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-end justify-between gap-6 px-4 pb-6 sm:px-6">
        <span
          className="label-muted label hidden items-center gap-2 sm:flex"
          data-hero-reveal
          style={{ opacity: entered ? undefined : 0 }}
        >
          <span className="inline-block h-px w-6 bg-text-3" aria-hidden="true" />
          Scroll — the mandala unlocks
        </span>
        {!glFailed && (
          <span
            className="label-muted label hidden sm:block"
            data-hero-reveal
            style={{ opacity: entered ? undefined : 0 }}
          >
            Double-click the mandala — the kiln fires a new pattern
          </span>
        )}
        <span
          className="label-muted label"
          data-hero-reveal
          style={{ opacity: entered ? undefined : 0 }}
        >
          {site.name} × {site.nickname} — {new Date().getFullYear()}
        </span>
      </div>
    </section>
  )
}