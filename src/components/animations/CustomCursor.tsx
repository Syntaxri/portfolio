'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouch } from '@/hooks/useIsTouch'

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-cursor]'

/**
 * The keeper's pointer: a sapphire-faceted diamond that flashes white
 * against any wall (difference blend), swelling over anything clickable
 * and becoming a brass plaque — VIEW EXHIBIT — over the collection doors.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const isTouch = useIsTouch()

  const canShow = !reduced && !isTouch

  useEffect(() => {
    if (!canShow) return
    gsap.set([dotRef.current, ringRef.current, labelRef.current], { opacity: 0 })
  }, [canShow])

  useEffect(() => {
    if (!canShow) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    document.documentElement.classList.add('no-cursor')

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3.out' })

    let visible = false
    let mode: 'default' | 'exhibit' = 'default'

    const move = (e: MouseEvent) => {
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const setExhibit = (on: boolean) => {
      if (on === (mode === 'exhibit')) return
      mode = on ? 'exhibit' : 'default'
      if (on) {
        gsap.to(ring, {
          scale: 1.9,
          background: 'rgba(140, 102, 52, 0.96)',
          borderColor: 'rgba(140, 102, 52, 0.96)',
          mixBlendMode: 'normal',
          duration: 0.22,
          ease: 'power3.out',
        })
        gsap.to(label, { opacity: 1, duration: 0.18, ease: 'power3.out' })
      } else {
        gsap.to(ring, {
          scale: 1,
          background: 'transparent',
          borderColor: 'rgba(255,255,255,0.9)',
          mixBlendMode: 'difference',
          duration: 0.32,
          ease: 'power3.out',
        })
        gsap.to(label, { opacity: 0, duration: 0.15 })
      }
    }

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(INTERACTIVE_SELECTOR) as HTMLElement | null
      if (!target) {
        gsap.to(ring, { scale: 1, duration: 0.25, ease: 'power3.out' })
        setExhibit(false)
        return
      }
      const isExhibit = target.hasAttribute('data-cursor')
      if (isExhibit) setExhibit(true)
      else {
        setExhibit(false)
        gsap.to(ring, { scale: 1.45, duration: 0.25, ease: 'power3.out' })
      }
    }

    const onLeave = () => {
      visible = false
      setExhibit(false)
      gsap.to([dot, ring, label], { opacity: 0, duration: 0.22 })
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
  }, [canShow])

  if (!canShow) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[300] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'rgba(255,255,255,0.95)', mixBlendMode: 'difference', opacity: 0 }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[300] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center border"
        style={{ borderColor: 'rgba(255,255,255,0.9)', mixBlendMode: 'difference', opacity: 0 }}
      >
        <div
          ref={labelRef}
          className="label -rotate-45 text-[0.5rem] text-[#f6f1e2]"
          style={{ opacity: 0, whiteSpace: 'nowrap' }}
        >
          View exhibit
        </div>
      </div>
    </>
  )
}