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

/* how far a room's top sits below the floating glass bar when it sticks:
   bar height 4rem + its 12–16px stick gap. Every anchor jump through the
   site (nav, hero CTAs, the floor plan) lands with this much headroom. */
export const NAV_SCROLL_OFFSET = 80

/* scroll positions per route — remembered so browser back/forward can
   restore the page where the reader left it (Next doesn't restore it for
   us on history traversal) */
const scrollPositions = new Map<string, number>()

export function useLenis() {
  const ctx = useContext(LenisContext)
  if (!ctx) throw new Error('useLenis must be used inside <SmoothScroll>')
  return ctx
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const reduced = useReducedMotion()
  const pathname = usePathname()
  const prevPathRef = useRef(pathname)
  const isPopRef = useRef(false)
  const trackingPausedRef = useRef(false)

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

  /* flag history traversal — forward pushes never emit popstate */
  useEffect(() => {
    const onPop = () => {
      isPopRef.current = true
      /* the browser and Lenis fire correction scrolls right after a pop —
         ignore them so remembered positions survive until restore below */
      trackingPausedRef.current = true
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  /* fresh loads must land on the header. With the browser's automatic
     restoration left on, reloading a deep-scrolled project page reopens
     it at the footer; the app restores positions itself on popstate. */
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  /* remember where each route is left — in-memory, cheap */
  useEffect(() => {
    const onScroll = () => {
      if (trackingPausedRef.current) return
      scrollPositions.set(location.pathname, Math.round(window.scrollY))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* stop/reposition on route change so anchors reset without warping */
  useEffect(() => {
    const lenis = lenisRef.current
    const pop = isPopRef.current
    isPopRef.current = false
    const arrivedBack = pop && prevPathRef.current !== pathname
    prevPathRef.current = pathname

    if (!lenis) {
      /* reduced motion — no Lenis; restore natively, never an arbitrary jump */
      if (arrivedBack) {
        const saved = scrollPositions.get(pathname)
        if (typeof saved === 'number') window.scrollTo({ top: saved, behavior: 'auto' })
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
      trackingPausedRef.current = false
      return
    }

    lenis.stop()
    ScrollTrigger.clearScrollMemory?.()
    const timer = setTimeout(() => {
      if (arrivedBack) {
        const saved = scrollPositions.get(pathname)
        /* force: Lenis is still stopped here; immediate: no visible animation */
        if (typeof saved === 'number') lenis.scrollTo(saved, { immediate: true, force: true })
      } else if (window.scrollY > 0) {
        /* fresh navigation (or a reload the browser re-scrolled): land on
           the header, never on the footer */
        window.scrollTo({ top: 0, behavior: 'auto' })
        lenis.scrollTo(0, { immediate: true, force: true })
      }
      ScrollTrigger.refresh()
      lenis.start()
      trackingPausedRef.current = false
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
