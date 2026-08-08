'use client'

import { useState, useEffect } from 'react'

export type QualityTier = 'high' | 'medium' | 'low'

function detectTier(): QualityTier {
  if (typeof window === 'undefined') return 'high'
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency || 4
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory
  if (coarse && (cores <= 4 || (memory !== undefined && memory <= 4))) return 'low'
  if (cores <= 4 || (memory !== undefined && memory <= 4)) return 'medium'
  return 'high'
}

export function useQualityTier(): QualityTier {
  const [tier, setTier] = useState<QualityTier>('high')
  useEffect(() => setTier(detectTier()), [])
  return tier
}

export const qualityDefaults: Record<QualityTier, { dpr: [number, number]; particles: number }> = {
  high: { dpr: [1, 1.75], particles: 900 },
  medium: { dpr: [1, 1.25], particles: 500 },
  low: { dpr: [1, 1], particles: 250 },
}
