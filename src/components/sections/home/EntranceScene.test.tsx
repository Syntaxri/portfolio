// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EntranceScene } from './EntranceScene'
import { useReducedMotion } from '@/hooks/useReducedMotion'

vi.mock('@/components/animations/SmoothScroll', () => ({
  useLenis: () => ({ scrollTo: vi.fn() }),
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

  it('names the room as the page heading', () => {
    render(<EntranceScene />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Room 00/i)
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
    expect(container.querySelector('[data-hero-reveal]')).toHaveStyle({ opacity: 0 })
    act(() => {
      vi.advanceTimersByTime(8000)
    })
    expect(document.documentElement.classList.contains('no-cursor')).toBe(true)
  })

  it('enters as soon as the door lifts', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false)
    window.__entranceReady = true
    const { container } = render(<EntranceScene />)
    expect(container.querySelector('[data-hero-reveal]')).toHaveStyle({ opacity: 0 })
    act(() => {
      window.dispatchEvent(new Event('ar:door-lift'))
    })
    expect(document.documentElement.classList.contains('no-cursor')).toBe(true)
  })
})