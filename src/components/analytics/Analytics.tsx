'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { isAnalyticsEnabled, trackPageview } from '@/lib/analytics'

/**
 * Analytics component — tracks pageviews on client-side navigation.
 * Renders nothing; just a side-effect component.
 *
 * Usage: Place in root layout, inside the SmoothScrollProvider.
 */
export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!isAnalyticsEnabled()) return
    trackPageview()
  }, [pathname])

  return null
}
