'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouch } from '@/hooks/useIsTouch'

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, [data-cursor]'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const reduced = useReducedMotion()
  const isTouch = useIsTouch()

  useEffect(() => {
    if (reduced) {
      setEnabled(false)
      return
    }
    gsap.set(dotRef.current, { opacity: 0 })
    gsap.set(ringRef.current, { opacity: 0 })
    setEnabled(true)
  }, [reduced])

  useEffect(() => {
    if (!enabled || isTouch) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    document.documentElement.classList.add('no-cursor')

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    let visible = false
    let labelText = ''
    const move = (e: MouseEvent) => {
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { opacity: 1, duration: 0.25 })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(INTERACTIVE_SELECTOR) as HTMLElement | null
      const text = target?.dataset?.cursorText
      if (target) {
        gsap.to(ring, { scale: 2.1, duration: 0.3, ease: 'power3.out' })
      } else {
        gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power3.out' })
      }
      if (text && text !== labelText) {
        labelText = text
        label.textContent = text
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.2, ease: 'power3.out' })
        gsap.set(ring, { scale: 3.4, mixBlendMode: 'normal' })
      } else if (!text && labelText) {
        labelText = ''
        label.textContent = ''
        gsap.to(label, { opacity: 0, scale: 0.7, duration: 0.2, ease: 'power3.out' })
        gsap.set(ring, { scale: 2.1 })
      }
    }

    const onLeave = () => {
      visible = false
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
      gsap.set(label, { opacity: 0 })
    }

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      document.documentElement.classList.remove('no-cursor')
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf([dot, ring, label])
    }
  }, [enabled, isTouch])

  if (!enabled || isTouch) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[300] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ opacity: 0 }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[300] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25"
        style={{ opacity: 0, mixBlendMode: 'difference' }}
      >
        <span ref={labelRef} className="label-accent label text-center" style={{ opacity: 0 }} />
      </div>
    </>
  )
}
