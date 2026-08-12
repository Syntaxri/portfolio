'use client'

import { MONOGRAM_PATHS } from '@/lib/geometry'

interface MonogramProps {
  className?: string
  /**
   * line      — thin ink strokes (nav, small marks)
   * solid     — filled brass/ink wedge (plaques, footer, loader)
   * outline   — transparent fill, visible stroke (hero signage)
   */
  variant?: 'line' | 'solid' | 'outline'
}

/**
 * The mark of the museum: an arch cut into an A whose negative space is
 * a V. Keystone diamond at the apex, a floor line beneath — a door, a
 * monogram, and an entrance all at once.
 */
export function Monogram({ className = '', variant = 'solid' }: MonogramProps) {
  const solid = variant === 'solid'
  const stroke = variant === 'outline' ? 'currentColor' : 'none'
  const fill = solid ? 'currentColor' : 'none'
  const strokeWidth = variant === 'line' ? 5.5 : 4

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
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        fill={fill}
      />
      <path
        d={MONOGRAM_PATHS.vLeft}
        stroke={variant === 'solid' ? 'var(--bg)' : 'currentColor'}
        strokeWidth={variant === 'solid' ? 7 : strokeWidth}
        strokeLinecap="round"
      />
      <path
        d={MONOGRAM_PATHS.vRight}
        stroke={variant === 'solid' ? 'var(--bg)' : 'currentColor'}
        strokeWidth={variant === 'solid' ? 7 : strokeWidth}
        strokeLinecap="round"
      />
      <path
        d={MONOGRAM_PATHS.keystone}
        stroke={stroke}
        strokeWidth={3}
        strokeLinejoin="round"
        fill={variant === 'solid' ? 'var(--bg)' : 'none'}
      />
      <path
        d={MONOGRAM_PATHS.floor}
        stroke={variant === 'solid' ? 'var(--bg)' : 'currentColor'}
        strokeWidth={fill === 'none' ? strokeWidth * 0.7 : 3.5}
        strokeLinecap="round"
      />
    </svg>
  )
}