'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** seconds before the entrance starts */
  delay?: number
  /** stagger between direct children */
  stagger?: number
  as?: 'div' | 'section' | 'li' | 'span' | 'p' | 'figure' | 'header'
}

/**
 * The museum's house style of entrance: content rises softly into place
 * the first time the visitor reaches it. IntersectionObserver-based —
 * zero scroll-trigger math, skipped entirely under reduced motion.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  stagger = 0.07,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (reduced) {
      root.classList.add('rv-done')
      return
    }
    const items = root.querySelectorAll<HTMLElement>('[data-rv]')
    if (!items.length) {
      root.classList.add('rv-done')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target as HTMLElement
          const i = Number(el.dataset.rvIndex || 0)
          el.style.transitionDelay = `${delay + i * stagger}s`
          el.classList.add('rv-in')
          io.unobserve(el)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )
    items.forEach((el, i) => {
      el.dataset.rvIndex = String(i)
      el.classList.add('rv-ready')
      io.observe(el)
    })
    return () => io.disconnect()
  }, [reduced, delay, stagger])

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  )
}

/** Convenience: a child node that will be revealed when its Reveal enters. */
export function RevealItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`block ${className}`} data-rv>
      {children}
    </span>
  )
}