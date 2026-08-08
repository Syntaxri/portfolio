import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

/* ---- jsdom gaps used by GSAP / IntersectionObserver-based components ---- */

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = [0]
  readonly scrollMargin = ''
  private callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  // Simulate an entry so gated animations (marquee, reveals) start "visible".
  trigger(entries: IntersectionObserverEntry[]): void {
    this.callback(entries as unknown as IntersectionObserverEntry[], this)
  }
}

if (!('IntersectionObserver' in globalThis)) {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    value: MockIntersectionObserver,
    writable: true,
  })
}

if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  }
  if (!window.scrollTo) window.scrollTo = vi.fn()
}
