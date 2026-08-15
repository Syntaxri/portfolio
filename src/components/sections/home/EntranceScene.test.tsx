// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EntranceScene } from './EntranceScene'
import { useReducedMotion } from '@/hooks/useReducedMotion'

vi.mock('@/components/animations/SmoothScroll', () => ({
  useLenis: () => ({ scrollTo: vi.fn() }),
  NAV_SCROLL_OFFSET: 80,
}))

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => true),
}))

vi.mock('next/dynamic', () => {
  const Noop = () => null
  return {
    default: () => Noop,
  }
})

vi.mock('@/components/three/WebGLErrorBoundary', () => ({
  WebGLErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('EntranceScene', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.mocked(useReducedMotion).mockReturnValue(true)
    window.__entranceReady = false
  })

  it('names the keeper as the page heading', () => {
    render(<EntranceScene />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Akram Rihani/i)
  })

  it('renders a static fallback so the room survives without WebGL', () => {
    const { container } = render(<EntranceScene />)
    expect(container.querySelector('.mosaic-fallback')).not.toBeNull()
  })

  it('is calm for reduced motion users: content present without choreography', () => {
    const { container } = render(<EntranceScene />)
    expect(container.querySelectorAll('[data-hero-reveal]').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
  })

  it('enters despite a stale door flag when no lift event ever comes', () => {
    vi.useFakeTimers()
    vi.mocked(useReducedMotion).mockReturnValue(false)
    window.__entranceReady = true
    const { container } = render(<EntranceScene />)
    /* the hero is painted from the first paint, hidden behind the door —
       the entrance never waits for JS timing to register its LCP */
    expect(container.querySelector('[data-hero-reveal]')).not.toHaveStyle({ opacity: 0 })
    act(() => {
      vi.advanceTimersByTime(8000)
    })
    expect(document.documentElement.classList.contains('no-cursor')).toBe(true)
  })

  it('enters as soon as the door lifts', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false)
    window.__entranceReady = true
    const { container } = render(<EntranceScene />)
    expect(container.querySelector('[data-hero-reveal]')).not.toHaveStyle({ opacity: 0 })
    act(() => {
      window.dispatchEvent(new Event('ar:door-lift'))
    })
    expect(document.documentElement.classList.contains('no-cursor')).toBe(true)
  })

  it('keeps the thesis hidden until the mandala has settled, then speaks it', () => {
    vi.useFakeTimers()
    vi.mocked(useReducedMotion).mockReturnValue(false)
    const { container } = render(<EntranceScene />)
    const thesis = container.querySelector('[data-thesis-reveal]')
    expect(thesis).not.toBeNull()
    expect(thesis).toHaveStyle({ opacity: 0 })
    act(() => {
      window.dispatchEvent(new Event('ar:door-lift'))
    })
    /* ~3.9s after the door lifts the composition has settled and the
       thesis reveal begins */
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(thesis?.classList.contains('is-shown')).toBe(true)
    expect(thesis).not.toHaveStyle({ opacity: 0 })
  })

  it('shows the thesis immediately when motion is reduced', () => {
    const { container } = render(<EntranceScene />)
    const thesis = container.querySelector('[data-thesis-reveal]')
    expect(thesis).not.toHaveStyle({ opacity: 0 })
    expect(screen.getByText(/only craft\./)).toBeVisible()
  })

  it('stamps the FIRED proof mark when the kiln fires', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false)
    const { container } = render(<EntranceScene />)
    const mark = container.querySelector('.fired-mark')
    expect(mark).toHaveStyle({ opacity: 0 })
    act(() => {
      window.dispatchEvent(new Event('ar:kiln-fire'))
    })
    const restamped = container.querySelector('.fired-mark')
    expect(restamped).not.toHaveStyle({ opacity: 0 })
    expect(restamped?.classList.contains('is-fired')).toBe(true)
  })
})
