'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { WebGLErrorBoundary } from '@/components/three/WebGLErrorBoundary'
import { museumState } from '@/lib/fx/museumState'
import type { ZarbiaControl } from '@/components/three/ZarbiaCanvas'

gsap.registerPlugin(ScrollTrigger)

const ZarbiaCanvas = dynamic(
  () => import('@/components/three/ZarbiaCanvas').then((m) => m.ZarbiaCanvas),
  { ssr: false, loading: () => null }
)

const CHAPTERS = [
  {
    num: '01',
    name: 'Material',
    body: 'Close to the wool. Fibre by fibre, thread by thread — this is where a build begins: the careful, dull, necessary work before the pattern can hold.',
  },
  {
    num: '02',
    name: 'Craft',
    body: 'Step back. The whole Zarbia at once — backends that hold, frontends that sing, the kiln watched at every knot.',
  },
{
    num: '03',
    name: 'Culture',
    body: 'Walk past slowly. The weave holds its geometry at every distance — rhythm, constraint, the grammar of a system held by hand.',
  },
  {
    num: '04',
    name: 'Departure',
    body: 'The runner stays behind as you walk on. The kit is packed, the loom waits — the pattern outlives the visit.',
  },
]

/**
 * THE LOOM — the interlude between the Workshop and the Collection.
 * A Zarbia is a pattern of decisions; this one is woven in software.
 * The camera never moves: the wide runner hangs, breathing, in the
 * middle of the room while the visitor scrolls slowly past it.
 * On devices that can, the loom taps the hand — a short pulse for
 * every fibre transition, a firmer one when a pattern segment locks.
 */
const PULSE_MIN_MS = 90

export function weavePulse(step: number): number | null {
  if (step % 16 === 0) return 24
  return 7
}

export function LoomRoom() {
  const reduced = useReducedMotion()
  const [glFailed, setGlFailed] = useState(false)
  const [active, setActive] = useState(0)
  /* the loom is 400vh down the page — its WebGL scene (two large canvas
     paints, a plane, shader compile) is deferred until the visitor is
     within ~two viewports of it, so a fresh load never pays for the rug
     it can't see yet */
  const [near, setNear] = useState(false)
  const control = useRef<ZarbiaControl>({ p: 0 })
  const wrapRef = useRef<HTMLDivElement>(null)
  const staticView = reduced || glFailed
  const stepRef = useRef(-1)

  useEffect(() => {
    if (reduced) return
    const wrap = wrapRef.current
    if (!wrap) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        io.disconnect()
      },
      { rootMargin: '200% 0px 200% 0px' }
    )
    io.observe(wrap)
    return () => io.disconnect()
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress
            museumState.weave = p
            setActive(Math.min(3, Math.floor(p * 4)))

            /* the weaver's hand: pulse on fibre transitions, heavier
               when a quarter of the runner locks into place. Throttled,
               silent when the platform or the visitor declines. */
            const step = Math.floor(p * 64)
            if (step !== stepRef.current) {
              stepRef.current = step
              const now = performance.now()
              if (now - museumState.lastPulseAt >= PULSE_MIN_MS) {
                const ms = weavePulse(step)
                if (ms && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                  museumState.lastPulseAt = now
                  navigator.vibrate(ms)
                }
              }
            }
          },
        },
      })
      tl.to(control.current, { p: 1, ease: 'none', duration: 1 })
    }, wrapRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="loom" aria-label="The Loom — the carpet between the work and the work" className="relative bg-bg">
      <div className="zellige-wall" aria-hidden="true" />

      <div ref={wrapRef} className="relative h-[420vh]">
        <div className="sticky top-0 grid h-[100svh] grid-cols-1 overflow-hidden lg:grid-cols-12">
          {/* the cloth */}
          <div className="absolute inset-0" aria-hidden="true">
            <WebGLErrorBoundary onFail={() => setGlFailed(true)}>
              {!glFailed && !reduced && near && <ZarbiaCanvas control={control} />}
            </WebGLErrorBoundary>
            {staticView && <div className="mosaic-fallback" aria-hidden="true" />}
          </div>

          {/* desktop: the reading column, on paper so the weave stays a backdrop */}
          <div
            className={`relative z-10 hidden flex-col justify-center lg:col-span-5 lg:flex ${
              reduced ? 'lg:px-4' : 'lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]'
            }`}
          >
            <div className="max-w-[30rem] bg-surface/[0.95] p-6 sm:p-8">
              <p className="label-accent label">The Loom</p>
              <p className="mt-3 text-[1.5rem] font-medium leading-snug text-text">
                <span className="serif-italic">Before the code there is the thread.</span>{' '}
                <span className="serif">
                  A Zarbia is a pattern of decisions — this one is woven in software.
                </span>
              </p>
              <div className="rule mt-6" aria-hidden="true" />
              <div role="list" className="mt-6 space-y-7">
                {CHAPTERS.map((c, i) => (
                  <div
                    key={c.num}
                    role="listitem"
                    data-chapter={i}
                    aria-current={active === i ? 'step' : undefined}
                    className={`transition-opacity duration-500 ${
                      active === i ? 'opacity-100' : 'opacity-45'
                    }`}
                  >
                    <p className={`label ${active === i ? 'label-accent' : ''}`}>
                      {c.num} — {c.name}
                    </p>
                    <p className="mt-2 max-w-[44ch] text-[0.95rem] leading-relaxed text-text-2">
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* mobile: one story card at a time */}
          <div className="relative z-10 mt-auto px-4 pb-8 sm:px-6 lg:hidden">
            {staticView ? (
              <div className="space-y-6 bg-surface/[0.88] p-5">
                {CHAPTERS.map((c) => (
                  <div key={c.num}>
                    <p className="label label-muted">
                      {c.num} — {c.name}
                    </p>
                    <p className="mt-2 max-w-[44ch] text-[0.95rem] leading-relaxed text-text-2">
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div key={active} className="loom-card max-w-md bg-surface/[0.88] p-5">
                <p className="label-accent label">
                  The Loom — {CHAPTERS[active].num} · {CHAPTERS[active].name}
                </p>
                <p className="mt-3 text-base leading-relaxed text-text-2">
                  {CHAPTERS[active].body}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}