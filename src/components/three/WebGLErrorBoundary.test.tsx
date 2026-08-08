// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { WebGLErrorBoundary } from './WebGLErrorBoundary'

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

describe('WebGLErrorBoundary', () => {
  afterEach(() => cleanup())

  it('renders its children when nothing fails', () => {
    const { container } = render(
      <WebGLErrorBoundary onFail={vi.fn()}>
        <div data-testid="canvas-ok" />
      </WebGLErrorBoundary>
    )
    expect(container.querySelector('[data-testid="canvas-ok"]')).not.toBeNull()
  })

  it('swallows a WebGL crash instead of bubbling to the root error boundary', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const onFail = vi.fn()
    const err = new Error('Error creating WebGL context.')

    const Bomb = () => {
      throw err
    }

    render(
      <WebGLErrorBoundary onFail={onFail}>
        <Bomb />
      </WebGLErrorBoundary>
    )

    expect(onFail).toHaveBeenCalledWith(err)
    consoleSpy.mockRestore()
  })
})

describe('HeroCanvas failure isolation', () => {
  beforeEach(() => setReducedMotion(false))

  vi.mock('@/components/three/HeroScene', () => ({
    HeroScene: () => {
      throw new Error('Error creating WebGL context.')
    },
  }))

  afterEach(() => cleanup())

  it('degrades to the static gradient when the scene render throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { act } = await import('react')
    const { HeroCanvas } = await import('./HeroCanvas')
    const { container } = render(<HeroCanvas />)

    /* wait for the lazy scene import to resolve and attempt a render */
    await act(async () => {})

    expect(container.querySelector('[data-ar-hero-gradient]')).not.toBeNull()
    expect(container.querySelector('canvas')).toBeNull()
    consoleSpy.mockRestore()
  })
})
