'use client'

import { useEffect } from 'react'

/*
 * Sits inside the root layout and performs the one-time, client-side
 * stabilisation that cannot run during SSR: marks the document as
 * hydrated (staggered reveals read this flag), and hands the cursor
 * back to the OS for keyboard and assistive users — the pointer is
 * decorative, the museum stays navigable without it.
 */
export function StabilityFactory() {
  useEffect(() => {
    const html = document.documentElement
    if (html.dataset.stable === 'true') return
    html.dataset.stable = 'true'
    html.classList.add('stabled')
  }, [])

  return null
}