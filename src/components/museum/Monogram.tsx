'use client'

import { MONOGRAM_PATHS } from '@/lib/geometry'

interface MonogramProps {
  className?: string
}

/**
 * The mark of the museum: an A cut from an arch, with a plain V in its
 * negative space. One single mark, drawn the same across the portfolio.
 */
export function Monogram({ className = '' }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 100 96"
      className={className}
      aria-hidden="true"
      fill="none"
      style={{ overflow: 'visible' }}
    >
      <path
        d={MONOGRAM_PATHS.arch}
        stroke="currentColor"
        strokeWidth={4.5}
        strokeLinejoin="round"
      />
      <path d={MONOGRAM_PATHS.vLeft} stroke="currentColor" strokeWidth={4.5} strokeLinecap="round" />
      <path d={MONOGRAM_PATHS.vRight} stroke="currentColor" strokeWidth={4.5} strokeLinecap="round" />
    </svg>
  )
}