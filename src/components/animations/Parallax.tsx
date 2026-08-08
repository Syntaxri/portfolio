'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxProps {
  children: ReactNode
  /** -1 to 1. 0.5 moves content slower than scroll, -0.3 opposite direction */
  speed?: number
  className?: string
  /** Applies a subtle scale so edges never show during parallax */
  scale?: number
}

export function Parallax({ children, speed = 0.25, className = '', scale }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 30 },
        {
          yPercent: speed * 30,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [reduced, speed])

  return (
    <div ref={ref} className={className} style={scale ? { transform: `scale(${scale})` } : undefined}>
      {children}
    </div>
  )
}