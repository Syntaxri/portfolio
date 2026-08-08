'use client'

import { useEffect, useRef, Fragment, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface RevealTextProps {
  children: ReactNode
  className?: string
  delay?: number
  /** seconds between words */
  stagger?: number
  /** adds a blur-to-sharp pass */
  blur?: boolean
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div'
}

/**
 * Word-by-word masked text reveal on scroll into view.
 * Renders words server-side (no plugin, no flash) — JS only animates.
 */
export function RevealText({
  children,
  className = '',
  delay = 0,
  stagger = 0.045,
  blur = false,
  as = 'span',
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const words = String(children).split(/\s+/).filter(Boolean)
  const revealsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const el = ref.current
    const targets = revealsRef.current
    if (!el || targets.length === 0) return

    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.set(targets, {
        yPercent: 115,
        rotate: 2,
        transformOrigin: '0% 50%',
        opacity: 1,
        ...(blur ? { filter: 'blur(10px)' } : {}),
      })
      gsap.to(targets, {
        yPercent: 0,
        rotate: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger,
        delay,
        ...(blur ? { filter: 'blur(0px)' } : {}),
        scrollTrigger: {
          trigger: el,
          start: 'top 86%',
          once: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [reduced, stagger, delay, blur])

  const Tag = as as 'span'

  return (
    <Tag ref={ref as never} className={className} style={{ display: 'inline-block' }}>
      {words.map((word, i) => (
        <span key={i} className="reveal-mask inline-block align-bottom">
          <span
            ref={(n) => {
              revealsRef.current[i] = n
            }}
            className="inline-block will-change-transform"
          >
            {word}
          </span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  )
}
