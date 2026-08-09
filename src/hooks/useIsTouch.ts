'use client'

import { useMediaQuery } from '@/hooks/useMediaQuery'

export function useIsTouch(): boolean {
  return useMediaQuery('(pointer: coarse)')
}
