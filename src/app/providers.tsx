'use client'

import { SmoothScrollProvider } from '@/components/animations/SmoothScroll'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>
}