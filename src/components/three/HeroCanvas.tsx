'use client'

import { useEffect, useRef, useState } from 'react'
import { useQualityTier, type QualityTier } from '@/hooks/useQuality'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type SceneComponent = React.ComponentType<{ tier: QualityTier; frameloop?: 'always' | 'never' }>

/**
 * Mounts the WebGL hero eagerly but only renders while the hero is
 * on or near the viewport. Below it and with reduced motion the
 * scene stops drawing entirely, freeing the GPU.
 */
export function HeroCanvas() {
  const tier = useQualityTier()
  const reduced = useReducedMotion()
  const [Scene, setScene] = useState<SceneComponent | null>(null)
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    import('./HeroScene').then((m) => {
      if (!cancelled) setScene(() => m.HeroScene)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: '240px 0px',
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isPaused = reduced || !active

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {Scene ? (
        <Scene tier={tier} frameloop={isPaused ? 'never' : 'always'} />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(139,92,246,0.16),transparent_55%)]" />
      )}
      {reduced && (
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(139,92,246,0.16),transparent_55%)]" />
      )}
    </div>
  )
}
