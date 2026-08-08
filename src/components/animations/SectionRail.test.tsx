// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { SectionRail } from './SectionRail'

const mockPathname = { current: '/' }

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname.current,
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('@/components/animations/SmoothScroll', () => ({
  useLenis: () => ({ scrollTo: vi.fn(), stop: vi.fn(), start: vi.fn() }),
}))

function mockMatchMedia(queryMatches: Record<string, boolean>) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: queryMatches[query] ?? false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('SectionRail', () => {
  beforeEach(() => {
    mockPathname.current = '/'
    mockMatchMedia({ '(min-width: 768px)': true, '(prefers-reduced-motion: reduce)': false })
  })

  afterEach(() => cleanup())

  it('shows the chapter rail on the home page (desktop, motion allowed)', () => {
    render(<SectionRail />)
    expect(screen.getByRole('button', { name: 'Go to Intro' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to Work' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to Practice' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to Process' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to Contact' })).toBeInTheDocument()
  })

  it('is removed on any other route instead of leaving dead chapter buttons', () => {
    const { rerender } = render(<SectionRail />)
    expect(screen.queryByRole('button', { name: 'Go to Work' })).not.toBeNull()

    mockPathname.current = '/contact'
    rerender(<SectionRail />)

    expect(screen.queryByRole('button', { name: 'Go to Intro' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Go to Work' })).toBeNull()
    expect(screen.queryByRole('label', { name: /section navigation/i })).toBeNull()
  })

  it('stays hidden when navigating back to the home page is still correct', () => {
    mockPathname.current = '/'
    mockMatchMedia({ '(min-width: 768px)': false, '(prefers-reduced-motion: reduce)': false })
    render(<SectionRail />)
    expect(screen.queryByRole('button', { name: 'Go to Intro' })).toBeNull()
  })
})
