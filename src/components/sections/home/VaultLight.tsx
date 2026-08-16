'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * THE LAMP — the Archive's vault light.
 * The room is near-black; the visitor carries a soft lamp that reveals
 * the engineering documentation as it passes. One blurred disc, its
 * shadow cast by a giant box-shadow — composited on the GPU, no repaints
 * while it follows the pointer. On touch devices the lamp rests on the
 * last tap and, between touches, walks a slow patrol so the room is
 * never locked shut. It is fully disabled under reduced motion, and it
 * moves to whatever a keyboard visitor focuses.
 */

interface VaultLightProps {
  /** fallback label read by assistive tech instead of the visual veil */
  rootId: string
}

const DARK = 'rgba(14, 11, 8, 0.93)'
const DARK_OFFSET = 'rgba(14, 11, 8, 0.5)'

export function VaultLight({ rootId }: VaultLightProps) {
  const reduced = useReducedMotion()
  const lampRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    const lamp = lampRef.current
    const root = document.getElementById(rootId)
    if (!lamp || !root) return

    /* the lamp's smoothed position, in viewport coordinates */
    const pos = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.42 }
    const target = { x: pos.x, y: pos.y }
    const rootRect = () => root.getBoundingClientRect()

    let raf = 0
    let lastInteraction = performance.now()
    let patrolT = 0
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    const idlePatrolMs = 2600

    /* the vault light never burns frames for a room the visitor has
       left: the loop rests entirely while the Archive is offscreen */
    let near = false
    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting
      },
      { rootMargin: '12% 0px 12% 0px' }
    )
    io.observe(root)

    const lerp = (a: number, b: number, k: number) => a + (b - a) * k

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!near) return
      const now = performance.now()
      if (now - lastInteraction > idlePatrolMs) {
        /* the lamp never leaves a visitor stranded: a slow circuit of
           the vault while no one is steering it */
        patrolT += 0.0022
        const cx = window.innerWidth * 0.5
        const cy = window.innerHeight * 0.46
        target.x = cx + Math.cos(patrolT) * window.innerWidth * 0.3
        target.y = cy + Math.sin(patrolT * 1.4) * window.innerHeight * 0.24
      }
      const k = Math.min(1, 0.13 * 1.8)
      pos.x = lerp(pos.x, target.x, k)
      pos.y = lerp(pos.y, target.y, k)
      const r = rootRect()
      lamp.style.transform = `translate3d(${pos.x - r.left - 170}px, ${pos.y - r.top - 170}px, 0)`
    }

    const steer = (x: number, y: number) => {
      target.x = x
      target.y = y
      lastInteraction = performance.now()
    }
    const onPointerMove = (e: PointerEvent) => steer(e.clientX, e.clientY)
    const onPointerDown = (e: PointerEvent) => steer(e.clientX, e.clientY)
    const onFocus = (e: FocusEvent) => {
      /* keyboard visitors carry the lamp themselves */
      const el = e.target as HTMLElement | null
      if (!el || !root.contains(el)) return
      const r = el.getBoundingClientRect()
      steer(r.left + r.width / 2, r.top + r.height / 2)
    }

    /* single pointer listeners on the root only: cheap, and the lamp
       never needs to know about anything outside the vault */
    root.addEventListener('pointermove', onPointerMove, { passive: true })
    root.addEventListener('pointerdown', onPointerDown, { passive: true })
    root.addEventListener('focusin', onFocus, { passive: true })
    root.addEventListener('focusout', onFocus, { passive: true })

    if (isCoarse) {
      /* touch: settle the lamp over the first reading column so the room
         opens with something already lit */
      target.x = window.innerWidth * 0.5
      target.y = window.innerHeight * 0.4
    }

    frame()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      root.removeEventListener('pointermove', onPointerMove)
      root.removeEventListener('pointerdown', onPointerDown)
      root.removeEventListener('focusin', onFocus)
      root.removeEventListener('focusout', onFocus)
    }
  }, [reduced, rootId])

  if (reduced) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30"
      aria-hidden="true"
      style={{ overflow: 'hidden' }}
    >
      <p className="label absolute right-4 top-4 hidden text-[#a89c85] sm:block">
        The lamp is in your hand — move to read
      </p>
      {/* The lamp itself — the lit hole is the element, the dark of the
          vault is its cast shadow. Blurred once; then only transformed. */}
      <div
        ref={lampRef}
        className="absolute left-0 top-0 h-[340px] w-[340px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 216, 150, 0.16), rgba(255, 198, 128, 0.07) 42%, transparent 62%)',
          boxShadow: `0 0 0 220vmax ${DARK}, 0 90px 70px 30px ${DARK_OFFSET}`,
          filter: 'blur(26px)',
          willChange: 'transform',
        }}
      />
      {/* a second, uniform dimness so the far corners read as depth,
          not a flat curtain over the lamp */}
      <div className="absolute inset-0" style={{ background: 'rgba(8, 6, 4, 0.34)' }} />
    </div>
  )
}
