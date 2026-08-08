'use client'

import { useEffect, useRef, useState } from 'react'
import { useQualityTier, type QualityTier } from '@/hooks/useQuality'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { WebGLErrorBoundary } from './WebGLErrorBoundary'

type SceneComponent = React.ComponentType<{
  tier: QualityTier
  frameloop?: 'always' | 'never'
  onContextLost?: () => void
}>

/** Decorative static gradient — the persistent fallback for the hero. */
export function HeroGradientFallback() {
  return (
    <div
      data-ar-hero-gradient
      className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(139,92,246,0.16),transparent_55%)]"
    />
  )
}

/**
 * Mounts the WebGL hero eagerly but only renders while the hero is
 * on or near the viewport. Below it and with reduced motion the
 * scene stops drawing entirely, freeing the GPU.
 *
 * WebGL is a decorative enhancement: any failure (context loss,
 * renderer crash, shader compile) degrades to the static gradient
 * instead of breaking the page.
 */
export function HeroCanvas() {
  const tier = useQualityTier()
  const reduced = useReducedMotion()
  const [Scene, setScene] = useState<SceneComponent | null>(null)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    import('./HeroScene')
      .then((m) => {
        if (!cancelled) setScene(() => m.HeroScene)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
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
  const showFallback = failed || reduced || !Scene

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {showFallback ? (
        <HeroGradientFallback />
      ) : (
        <WebGLErrorBoundary onFail={() => setFailed(true)}>
          <Scene
            tier={tier}
            frameloop={isPaused ? 'never' : 'always'}
            onContextLost={() => setFailed(true)}
          />
        </WebGLErrorBoundary>
      )}
    </div>
  )
}
