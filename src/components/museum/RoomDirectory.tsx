'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLenis, NAV_SCROLL_OFFSET } from '@/components/animations/SmoothScroll'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const PLAN = [
  { id: 'entrance', n: '00', label: 'Gallery of Origins' },
  { id: 'living', n: '01', label: 'Hall of Living Code' },
  { id: 'courtyard', n: '02', label: 'Fountain Court' },
  { id: 'craft', n: '03', label: 'Workshop of Systems' },
  { id: 'collection', n: '04', label: 'Collection of Works' },
  { id: 'archive', n: '05', label: 'Archive of Memory' },
  { id: 'exit', n: '06', label: 'Threshold' },
] as const

/**
 * The floor plan pinned to the wall: the six rooms of the museum, with a
 * sapphire stud marking the one the visitor is standing in. Desktop only —
 * small screens carry the directory in the top bar instead.
 */
export function RoomDirectory() {
  const [active, setActive] = useState('entrance')
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const { scrollTo } = useLenis()

  useEffect(() => {
    if (pathname !== '/') return
    const els = PLAN.map((p) => document.getElementById(p.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        /* the room with the most visible area becomes "current" */
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -45% 0px', threshold: [0, 0.05, 0.2, 0.5] }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  if (pathname !== '/') return null
  if (reduced) return null

  return (
    <nav
      aria-label="Room directory"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2 lg:flex"
    >
      {PLAN.map((p) => {
        const isActive = active === p.id
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => scrollTo(`#${p.id}`, { offset: -NAV_SCROLL_OFFSET })}
            className="group flex items-center gap-3 py-0.5"
            aria-pressed={isActive}
            aria-label={`Room ${p.n} — ${p.label}`}
          >
            <span
              className={`font-mono text-[0.58rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                isActive ? 'text-accent' : 'text-text-3 opacity-60'
              }`}
            >
              {p.n}
            </span>
            <span
              className={`inline-block h-1.5 w-1.5 rotate-45 transition-all duration-300 ${
                isActive
                  ? 'scale-125 bg-accent'
                  : 'bg-text/30 group-hover:bg-text/60'
              }`}
              aria-hidden="true"
            />
          </button>
        )
      })}
    </nav>
  )
}