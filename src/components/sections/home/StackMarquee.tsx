'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function StackMarquee({ items }: { items: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const track = trackRef.current
    if (!track || reduced) return

    const half = track.scrollWidth / 2
    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -half,
        duration: 60,
        ease: 'none',
        repeat: -1,
      })
    }, track)

    return () => ctx.revert()
  }, [reduced])

  const doubled = [...items, ...items]

  return (
    <div className="mt-12 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]" aria-hidden={!reduced}>
      <div ref={trackRef} className="flex w-max gap-10 whitespace-nowrap will-change-transform">
        {doubled.map((tech, i) => (
          <span
            key={i}
            className="text-outline font-display text-[clamp(4rem,10vw,9rem)] font-extrabold uppercase leading-none tracking-tight transition-[color] duration-500 hover:text-ink"
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}