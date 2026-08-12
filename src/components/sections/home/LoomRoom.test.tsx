// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LoomRoom } from './LoomRoom'

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

describe('LoomRoom', () => {
  it('introduces the loom and the four chapters', () => {
    render(<LoomRoom />)
    expect(screen.getAllByText(/The Loom/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Material/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Craft/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Culture/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Departure/).length).toBeGreaterThan(0)
  })

  it('weaves the museum voice', () => {
    render(<LoomRoom />)
    expect(screen.getAllByText(/Before the code there is the thread/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/pattern outlives the visit/).length).toBeGreaterThan(0)
  })

  it('keeps all chapters readable for reduced-motion visitors', () => {
    const { container } = render(<LoomRoom />)
    expect(container.querySelectorAll('[data-chapter]').length).toBe(4)
  })
})