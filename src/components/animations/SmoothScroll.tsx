'use client'

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { setScrollStats } from '@/lib/animations/scrollState'

gsap.registerPlugin(ScrollTrigger)

interface LenisContextValue {
  scrollTo: (target: string | number, opts?: Record<string, unknown>) => void
  stop: () => void
  start: () => void
}

const LenisContext = createContext<LenisContextValue | null>(null)

export function useLenis() {
  const ctx = useContext(LenisContext)
  if (!ctx) throw new Error('useLenis must be used inside <SmoothScroll>')
  return ctx
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const reduced = useReducedMotion()
  const pathname = usePathname()
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced

  useEffect(() => {
    if (reducedRef.current) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const onScroll = ({ scroll, limit, velocity }: { scroll: number; limit: number; velocity: number }) => {
      const progress = limit > 0 ? scroll / limit : 0
      setScrollStats(scroll, progress, velocity)
    }
    lenis.on('scroll', onScroll)

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  /* stop/reposition on route change so anchors reset without warping */
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    lenis.stop()
    ScrollTrigger.clearScrollMemory?.()
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
      lenis.start()
    }, 40)
    return () => clearTimeout(timer)
  }, [pathname])

  const scrollTo = (target: string | number, opts: Record<string, unknown> = {}) => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    lenisRef.current?.scrollTo(target as never, opts as never)
  }

  const stop = () => lenisRef.current?.stop()
  const start = () => lenisRef.current?.start()

  return <LenisContext.Provider value={{ scrollTo, stop, start }}>{children}</LenisContext.Provider>
}
