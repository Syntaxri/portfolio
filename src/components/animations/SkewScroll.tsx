'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouch } from '@/hooks/useIsTouch'
import { scrollState } from '@/lib/animations/scrollState'

interface SkewScrollProps {
  children: ReactNode
  className?: string
  /** higher = stronger lean; kept subtle by the clamp */
  strength?: number
  /** max skew in degrees */
  max?: number
}

/**
 * Scroll-velocity skew — the element leans briefly while the page moves,
 * then settles back to zero. Visible only during movement, on fine pointers,
 * and inside the viewport. Purely decorative; transforms only.
 */
export function SkewScroll({ children, className = '', strength = 0.012, max = 5 }: SkewScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const isTouch = useIsTouch()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || isTouch) return

    const setSkew = gsap.quickSetter(el, 'skewY', 'deg')
    let inView = false
    let raf = 0

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (!inView) setSkew(0)
      },
      { rootMargin: '12% 0px 12% 0px' }
    )
    io.observe(el)

    let lastActive = 0
    const tick = () => {
      raf = 0
      if (!inView) return
      const now = performance.now()
      if (now - lastActive < 120) return
      const v = Math.max(-max, Math.min(max, scrollState.velocity * strength))
      setSkew(v)
    }
    const onFrame = () => {
      const vel = scrollState.velocity
      if (Math.abs(vel) > 0.5) lastActive = performance.now()
      if (raf) return
      raf = requestAnimationFrame(tick)
    }

    gsap.ticker.add(onFrame)
    return () => {
      gsap.ticker.remove(onFrame)
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
      setSkew(0)
    }
  }, [reduced, isTouch, strength, max])

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  )
}
