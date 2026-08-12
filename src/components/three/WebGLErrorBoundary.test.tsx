// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { WebGLErrorBoundary } from './WebGLErrorBoundary'

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
