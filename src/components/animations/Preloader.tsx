'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const TOTAL = 100

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const [done, setDone] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (sessionStorage.getItem('ar-preloader')) {
      setDone(true)
      return
    }
    const id = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!visible || done) return
    const root = rootRef.current
    if (!root) return

    if (reduced) {
      setDone(true)
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      const counter = {
        value: 0,
      }
      tl.to(counter, {
        value: TOTAL,
        duration: 1.05,
        ease: 'power2.inOut',
        onUpdate: () => {
          const v = Math.round(counter.value)
          setProgress(v)
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${v / TOTAL})`
        },
      })
        .to(fillRef.current, { transformOrigin: 'right', scaleX: 0, duration: 0.45, ease: 'power2.inOut' })
        .to(numberRef.current, { opacity: 0, y: -14, duration: 0.35, ease: 'power2.out' }, '<')
        .set(root, { pointerEvents: 'none' })
        .to(root, {
          yPercent: -100,
          duration: 0.85,
          ease: 'expo.inOut',
          onComplete: () => {
            sessionStorage.setItem('ar-preloader', '1')
            window.dispatchEvent(new Event('ar:entrance-ready'))
            setDone(true)
          },
        })
    }, root)

    return () => ctx.revert()
  }, [visible, done, reduced])

  if (!visible || done) return null

  return (
    <div ref={rootRef} aria-hidden className="fixed inset-0 z-[200] flex flex-col justify-end bg-base">
      <div className="flex items-end justify-between px-6 pb-6 sm:px-10">
        <span className="label">Portfolio</span>
        <span
          ref={numberRef}
          className="font-display text-[clamp(3.5rem,10vw,7rem)] font-extrabold leading-none tabular-nums text-ink"
          style={{ letterSpacing: '-0.03em' }}
        >
          {progress}%
        </span>
      </div>
      <div className="h-px w-full bg-white/10">
        <div ref={fillRef} className="h-full w-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
      </div>
    </div>
  )
}