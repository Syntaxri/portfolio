'use client'

import { useEffect, useRef, useState } from 'react'

function useInView(opts: { threshold?: number; once?: boolean } = {}) {
  const { threshold = 0.12, once = true } = opts
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) obs.unobserve(el)
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, once])

  return [ref, inView] as const
}

function buildTransition(duration = 0.65, delay = 0) {
  return `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s`
}

export function FadeUp({
  children,
  delay = 0,
  duration = 0.65,
  distance = 36,
  className = '',
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  distance?: number
  className?: string
  [key: string]: any
}) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : `translateY(${distance}px)`,
        transition: buildTransition(duration, delay),
        willChange: 'opacity, transform',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  [key: string]: any
}) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(10px)',
        transition: buildTransition(duration, delay),
        willChange: 'opacity, transform',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function SlideLeft({
  children,
  delay = 0,
  duration = 0.65,
  distance = 40,
  className = '',
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  distance?: number
  className?: string
  [key: string]: any
}) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : `translateX(-${distance}px)`,
        transition: buildTransition(duration, delay),
        willChange: 'opacity, transform',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function SlideRight({
  children,
  delay = 0,
  duration = 0.65,
  distance = 40,
  className = '',
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  distance?: number
  className?: string
  [key: string]: any
}) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : `translateX(${distance}px)`,
        transition: buildTransition(duration, delay),
        willChange: 'opacity, transform',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.7,
  className = '',
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  [key: string]: any
}) {
  const [ref, inView] = useInView({ threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'scale(0.90) translateY(20px)',
        transition: buildTransition(duration, delay),
        willChange: 'opacity, transform',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CountUp({
  end,
  suffix = '',
  duration = 1200,
  ...props
}: {
  end: number
  suffix?: string
  duration?: number
  [key: string]: any
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parsed = parseFloat(String(end).replace(/[^0-9.]/g, '')) || 0
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.unobserve(el)
        const start = performance.now()
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(eased * parsed))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} {...props}>
      {val}
      {suffix}
    </span>
  )
}
