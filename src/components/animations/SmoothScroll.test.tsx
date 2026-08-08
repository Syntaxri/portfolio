// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { SmoothScrollProvider, useLenis } from './SmoothScroll'

const { lenisInstances, LenisMock } = vi.hoisted(() => {
  const lenisInstances: unknown[] = []
  function LenisMock() {
    const instance = {
      on: vi.fn(),
      destroy: vi.fn(),
      raf: vi.fn(),
      scrollTo: vi.fn(),
      stop: vi.fn(),
      start: vi.fn(),
    }
    lenisInstances.push(instance)
    return instance
  }
  return { lenisInstances, LenisMock }
})

vi.mock('lenis', () => ({ default: LenisMock }))

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

function ConnectionProbe({ label }: { label: string }) {
  const { scrollTo } = useLenis()
  return (
    <button type="button" onClick={() => scrollTo(`#${label}`)}>
      {label}
    </button>
  )
}

describe('SmoothScrollProvider', () => {
  afterEach(() => {
    cleanup()
    lenisInstances.length = 0
  })

  it('never constructs Lenis for reduced-motion users', () => {
    setReducedMotion(true)
    render(
      <SmoothScrollProvider>
        <ConnectionProbe label="work" />
      </SmoothScrollProvider>
    )
    expect(lenisInstances).toHaveLength(0)
  })

  it('constructs a single Lenis instance for normal motion users', () => {
    setReducedMotion(false)
    render(
      <SmoothScrollProvider>
        <ConnectionProbe label="work" />
      </SmoothScrollProvider>
    )
    expect(lenisInstances).toHaveLength(1)
  })

  it('destroys Lenis and clears the ref on unmount', () => {
    setReducedMotion(false)
    const { unmount } = render(
      <SmoothScrollProvider>
        <ConnectionProbe label="work" />
      </SmoothScrollProvider>
    )
    const lenis = lenisInstances[0] as { destroy: ReturnType<typeof vi.fn> }
    unmount()
    expect(lenis.destroy).toHaveBeenCalled()
  })

  it('reduced-motion anchors scroll to the requested element natively, not the page top', () => {
    setReducedMotion(true)
    const target = document.createElement('section')
    target.id = 'work'
    document.body.appendChild(target)
    const scrollIntoView = vi.fn()
    target.scrollIntoView = scrollIntoView
    const scrollToSpy = vi.spyOn(window, 'scrollTo')

    const { getByText } = render(
      <SmoothScrollProvider>
        <ConnectionProbe label="work" />
      </SmoothScrollProvider>
    )

    getByText('work').click()

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
    expect(scrollToSpy).not.toHaveBeenCalled()
    target.remove()
  })

  it('normal-motion anchors route through Lenis', () => {
    setReducedMotion(false)
    const { getByText } = render(
      <SmoothScrollProvider>
        <ConnectionProbe label="work" />
      </SmoothScrollProvider>
    )
    getByText('work').click()
    const lenis = lenisInstances[0] as { scrollTo: ReturnType<typeof vi.fn> }
    expect(lenis.scrollTo).toHaveBeenCalledWith('#work', {})
  })

  it('objects to using the hook outside the provider', () => {
    setReducedMotion(true)
    expect(() => render(<ConnectionProbe label="work" />)).toThrow(/useLenis must be used/)
  })
})
