// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EntranceScene } from './EntranceScene'

vi.mock('@/components/animations/SmoothScroll', () => ({
  useLenis: () => ({ scrollTo: vi.fn() }),
}))

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => true,
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
})