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

  useEffect(() => {
    /* reduced motion — Lenis is never constructed */
    if (reduced) {
      lenisRef.current = null
      return
    }

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
    /* intentional global tuning: Lenis drives the ticker, so lag-smoothing
       would double-smooth input latency — do not restore per unmount, the
       whole app either runs on Lenis or (reduced motion) never sets it */
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

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
    if (!lenisRef.current) {
      /* reduced motion / no Lenis — native instant scroll to the target,
         never an arbitrary jump to the page top */
      if (typeof target === 'string') {
        document.querySelector(target)?.scrollIntoView({ behavior: 'auto', block: 'start' })
      } else {
        window.scrollTo({ top: target, behavior: 'auto' })
      }
      return
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
    lenisRef.current.scrollTo(target as never, opts as never)
  }

  const stop = () => lenisRef.current?.stop()
  const start = () => lenisRef.current?.start()

  return <LenisContext.Provider value={{ scrollTo, stop, start }}>{children}</LenisContext.Provider>
}
