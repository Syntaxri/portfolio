// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { FeaturedWork } from './FeaturedWork'

function setReducedMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('FeaturedWork', () => {
  beforeEach(() => setReducedMotion(true))
  afterEach(() => cleanup())

  it('renders covers in their final visual state — no animation-origin transform in the static DOM', () => {
    const { container } = render(<FeaturedWork />)

    const covers = container.querySelectorAll<HTMLElement>('.fw-cover-inner')
    expect(covers.length).toBeGreaterThan(0)
    covers.forEach((cover) => {
      expect(cover.style.transform).not.toContain('translateY(14%)')
      expect(cover.style.transform).not.toContain('scale(1.12)')
    })
  })

  it('exposes all rows and metadata statically', () => {
    const { container } = render(<FeaturedWork />)
    expect(container.querySelectorAll('.fw-row').length).toBeGreaterThan(0)
    expect(container.textContent ?? '').toContain('Case studies')
  })
})
