// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Manifesto } from './Manifesto'

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

describe('Manifesto', () => {
  beforeEach(() => setReducedMotion(true))
  afterEach(() => cleanup())

  it('shows the statement, supporting copy and coda under reduced motion', () => {
    const { container } = render(<Manifesto />)

    const quote = container.querySelector('.ms-quote') as HTMLElement
    const support = container.querySelector('.ms-support') as HTMLElement
    const coda = container.querySelector('.ms-coda') as HTMLElement

    expect(quote.textContent ?? '').toContain('I')
    expect(support.style.opacity).not.toBe('0')
    expect(coda.style.opacity).not.toBe('0')
  })

  it('never permanently hides the supporting copy in the static DOM', () => {
    render(<Manifesto />)
    const support = document.querySelector('.ms-support') as HTMLElement
    expect(support.style.opacity).not.toBe('0')
  })
})
