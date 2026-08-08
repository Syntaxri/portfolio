// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Hero } from './Hero'

vi.mock('@/components/three/HeroScene', () => ({ HeroScene: () => null }))
vi.mock('@/components/animations/SmoothScroll', () => ({
  useLenis: () => ({ scrollTo: vi.fn(), stop: vi.fn(), start: vi.fn() }),
}))

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

describe('Hero', () => {
  beforeEach(() => {
    setReducedMotion(true)
    sessionStorage.clear()
  })

  afterEach(() => cleanup())

  it('leaves all important content visible under reduced motion (no inline hidden states)', () => {
    const { container } = render(<Hero />)

    const kicker = container.querySelector('.hero-kicker') as HTMLElement
    const strapline = container.querySelector('.hero-strapline') as HTMLElement
    const meta = container.querySelector('.hero-meta') as HTMLElement
    const hint = container.querySelector('.hero-hint') as HTMLElement
    const nameLines = container.querySelectorAll<HTMLElement>('.hero-name-line')

    expect(kicker.style.opacity).not.toBe('0')
    expect(strapline.style.opacity).not.toBe('0')
    expect(meta.style.opacity).not.toBe('0')
    expect(hint.style.opacity).not.toBe('0')
    nameLines.forEach((line) => expect(line.style.transform).not.toContain('translateY(110%)'))
    expect(nameLines.length).toBe(2)
  })

  it('exposes the primary copy without JavaScript-driven gating', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('h1')?.textContent).toContain('Akram')
    expect(container.querySelector('.hero-strapline')?.textContent?.length).toBeGreaterThan(0)
  })

  it('removes the entrance listener and GSAP context on unmount', () => {
    setReducedMotion(false)
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<Hero />)

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('ar:entrance-ready', expect.any(Function))
  })
})
