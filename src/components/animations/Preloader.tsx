'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Monogram } from '@/components/museum/Monogram'
import { starPath } from '@/lib/geometry'
import { site } from '@/lib/data/site'

/**
 * THE DOOR — the entrance sequence. The monogram mark while twenty-one
 * stars gather as a ring around it — one for every year of the maker —
 * then the door lifts. Short (about 3s in full, skippable with any
 * click or key), always refired on every site load, and fully asleep
 * under reduced motion.
 */

/* twenty-one stars — one for every year of the maker — gathered as a
   ring around the mark. Their ring slots; the assembly flies them in. */
const STAR_COUNT = 21
const RING_POINTS = Array.from({ length: STAR_COUNT }, (_, i) => ({
  a: (i * Math.PI * 2) / STAR_COUNT - Math.PI / 2,
  face: ['#1e4082', '#15695c', '#aa5226', '#8c6634'][i % 4],
}))

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (done) return
    const root = rootRef.current
    if (!root) return

    if (reduced) {
      const t = setTimeout(() => setDone(true), 0)
      return () => clearTimeout(t)
    }

    window.__entranceReady = true
    window.dispatchEvent(new Event('ar:entrance-ready'))

    /* whether the door finished on its own, was skipped by the visitor,
       or was force-lifted by the watchdog — one shared completion */
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      window.__entranceReady = false
      setDone(true)
    }

    const tl = gsap.timeline()
    const ctx = gsap.context(() => {
      /* the door is refired each day: the same door, a different weave —
         the glaze ring starts at a different point and the studs sit a
         hair smaller or wider. Deterministic for the whole day, so
         nothing ever flickers. */
      const variant = Math.floor(Date.now() / 86_400_000) % 3
      const faces = ['#1e4082', '#15695c', '#aa5226', '#8c6634']
      const rotated = [...faces.slice(variant), ...faces.slice(0, variant)]
      const starScale = variant === 2 ? 0.96 : 1.04
      root.querySelectorAll<SVGPathElement>('.door-star').forEach((el, i) => {
        gsap.set(el, { fill: rotated[i % rotated.length] })
      })

      /* the ring builds itself from the top star, one after another,
         sweeping clockwise until the circle closes — never born whole.
         Each star is hidden and tucked in toward the mark with its own
         set() first (a single staggered tween renders each star's start
         state only at its own slot, so the whole ring would flash
         visible on frame one), then launched to its slot on its own
         beat. The door hands the stage over at ~2.1s and is fully gone
         by ~2.9s — an entrance, never a wait. */
      root.querySelectorAll<SVGPathElement>('.door-star').forEach((el, i) => {
        const a = RING_POINTS[i].a
        gsap.set(el, {
          x: -Math.cos(a) * 76 * 0.55,
          y: -Math.sin(a) * 76 * 0.55,
          scale: 0,
          opacity: 0,
        })
        tl.to(
          el,
          {
            x: 0,
            y: 0,
            scale: starScale,
            opacity: 1,
            duration: 0.45,
            ease: 'back.out(1.8)',
          },
          i * 0.03
        )
      })
      tl.to(
        '.door-star',
        { scale: starScale * 0.985, duration: 0.3, ease: 'power1.inOut' },
        '+=0.15'
      )
        .to('.door-fade', { opacity: 0, y: -16, duration: 0.35, ease: 'power2.in' }, '+=0.3')
        .set(root, { pointerEvents: 'none' })
        /* the entrance takes the stage under the rising door — the hero
           reveal and the WebGL kiln start their work here, never while
           the door is still assembling on top of them */
        .call(() => window.dispatchEvent(new Event('ar:door-lift')))
        .to(root, {
          yPercent: -100,
          duration: 0.7,
          ease: 'expo.inOut',
          onComplete: finish,
        })
    }, root)

    /* nothing may hold the entrance hostage: a click or any key jumps
       straight to the lift, and a watchdog force-lifts at 3.5s even if
       the browser throttles the ceremony into a stall. The visitor's
       first gesture is always enough. */
    const liftByForce = () => {
      if (finished) return
      window.clearTimeout(watchdog)
      window.__entranceReady = false
      window.dispatchEvent(new Event('ar:door-lift'))
      tl?.kill()
      gsap.to(root, {
        yPercent: -100,
        duration: 0.4,
        ease: 'expo.inOut',
        onComplete: finish,
      })
    }
    const skip = () => liftByForce()
    const watchdog = window.setTimeout(liftByForce, 3500)
    window.addEventListener('pointerdown', skip)
    window.addEventListener('keydown', skip)

    return () => {
      window.clearTimeout(watchdog)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
      ctx.revert()
    }
  }, [done, reduced])

  if (done) return null

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-bg px-5 py-4 sm:px-8"
    >
      <div className="flex items-center justify-between border-b border-[rgba(28,26,22,0.12)] pb-3">
        <span className="label-muted label">The museum of software craftsmanship</span>
        <span className="label-muted label">©{new Date().getFullYear()}</span>
      </div>

      <div className="relative mx-auto flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {RING_POINTS.map((p, i) => (
            <path
              key={i}
              className="door-star"
              d={starPath(100 + Math.cos(p.a) * 76, 100 + Math.sin(p.a) * 76, 13, 5.2)}
              fill={p.face}
            />
          ))}
        </svg>
        {/* the mark's drawn content sits a touch high of its box — the
            nudge sits its centroid exactly on the ring's centre */}
        <div className="-translate-x-[1%] -translate-y-[10%]">
          <Monogram className="door-fade h-24 w-24 text-accent" />
        </div>
      </div>

      <div className="door-fade border-t border-[rgba(28,26,22,0.12)] pt-3">
        <div className="flex items-center justify-between">
          <span className="label-muted label">The kiln is ready</span>
          <span className="label-muted label">{site.domain}</span>
        </div>
      </div>
    </div>
  )
}