'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Reactive matchMedia subscription.
 *
 * `useSyncExternalStore` guarantees hydration-safe reads: the server
 * snapshot is `false` and the client first render matches, so no
 * mismatch warnings — the real value arrives right after hydration.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onStoreChange)
      return () => mq.removeEventListener('change', onStoreChange)
    },
    [query]
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}
