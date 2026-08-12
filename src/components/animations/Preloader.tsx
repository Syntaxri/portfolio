'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Monogram } from '@/components/museum/Monogram'
import { starPath } from '@/lib/geometry'
import { site } from '@/lib/data/site'

/* returning visitors skip the door; sessionStorage keeps private-mode
   tabs consistent. Neither changes after first paint — a static store is
   enough. */
function subscribeStorage(): () => void {
  return () => {}
}

function readPreloaderSeen(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (localStorage.getItem('ar-museum-v5') !== null) return true
  } catch {
    /* storage unavailable — fall back to tab-only memory */
  }
  return sessionStorage.getItem('ar-museum-v5') !== null
}

/* twenty-one stars — one for every year of the maker — gathered as a
   ring around the mark. Their ring slots; the assembly flies them in. */
const STAR_COUNT = 21
const RING_POINTS = Array.from({ length: STAR_COUNT }, (_, i) => ({
  a: (i * Math.PI * 2) / STAR_COUNT - Math.PI / 2,
  face: ['#1e4082', '#15695c', '#aa5226', '#8c6634'][i % 4],
}))

/**
 * THE DOOR — the entrance sequence. The monogram mark while twenty-one
 * stars gather as a ring around it — one for every year of the maker —
 * then the door lifts. Short (about 3.5s in full), skippable by
 * returning visitors, and fully asleep under reduced motion.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)
  const reduced = useReducedMotion()
  const seen = useSyncExternalStore(subscribeStorage, readPreloaderSeen, () => false)

  const visible = !seen

  useEffect(() => {
    if (!visible || done) return
    const root = rootRef.current
    if (!root) return

    if (reduced) {
      const t = setTimeout(() => setDone(true), 0)
      return () => clearTimeout(t)
    }

    window.__entranceReady = true
    window.dispatchEvent(new Event('ar:entrance-ready'))

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

      const tl = gsap.timeline()
      /* the ring builds itself from the top star, one after another,
         sweeping clockwise until the circle closes — never born whole.
         Each star is hidden and tucked in toward the mark with its own
         set() first (a single staggered tween renders each star's start
         state only at its own slot, so the whole ring would flash
         visible on frame one), then launched to its slot on its own
         beat. The whole door is tuned to hand the stage over at ~2.8s
         and be fully gone by ~3.5s — an entrance, never a wait. */
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
            duration: 0.5,
            ease: 'back.out(1.8)',
          },
          i * 0.045
        )
      })
      tl.to(
        '.door-star',
        { scale: starScale * 0.985, duration: 0.4, ease: 'power1.inOut' },
        '+=0.2'
      )
        .to('.door-fade', { opacity: 0, y: -16, duration: 0.4, ease: 'power2.in' }, '+=0.4')
        .set(root, { pointerEvents: 'none' })
        /* the entrance takes the stage under the rising door — the hero
           reveal and the WebGL kiln start their work here, never while
           the door is still assembling on top of them */
        .call(() => window.dispatchEvent(new Event('ar:door-lift')))
        .to(root, {
          yPercent: -100,
          duration: 0.8,
          ease: 'expo.inOut',
          onComplete: () => {
            try {
              localStorage.setItem('ar-museum-v5', '1')
            } catch {
              /* storage unavailable (private mode) — session only */
            }
            sessionStorage.setItem('ar-museum-v5', '1')
            /* the door is done — a later visit inside this session must
               not wait for a lift that will never come */
            window.__entranceReady = false
            setDone(true)
          },
        })
    }, root)

    /* safety net: however the browser throttles or starves the tab,
       the door can never hold the museum hostage. If it has not lifted
       on its own by ~4.5s it is lifted by force — the loading screen
       never stays for five seconds. */
    const watchdog = window.setTimeout(() => {
      window.dispatchEvent(new Event('ar:door-lift'))
      window.__entranceReady = false
      setDone(true)
    }, 4500)

    return () => {
      window.clearTimeout(watchdog)
      ctx.revert()
    }
  }, [visible, done, reduced])

  if (!visible || done) return null

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
        <div className="-translate-x-[3px] -translate-y-[10%]">
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