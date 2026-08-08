'use client'

import { useEffect, useRef, type ReactNode, type JSX } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouch } from '@/hooks/useIsTouch'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function Magnetic({ children, strength = 0.35, className = '', as = 'div' }: MagneticProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const isTouch = useIsTouch()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || isTouch) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      xTo(relX * strength)
      yTo(relY * strength)
    }

    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [reduced, isTouch, strength])

  const Tag = as as 'div'
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  )
}
