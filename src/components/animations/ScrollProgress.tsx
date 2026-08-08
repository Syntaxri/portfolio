'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.set(el, { scaleX: 0 })
      gsap.to(el, {
        scaleX: 1,
        ease: 'none',
        transformOrigin: 'left center',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: 0.3,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <div aria-hidden className="fixed left-0 top-0 z-[140] h-[2px] w-full bg-transparent">
      <div ref={ref} className="h-full w-full origin-left bg-accent/80" />
    </div>
  )
}