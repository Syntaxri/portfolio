// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RoomDirectory } from './RoomDirectory'

const mockScrollTo = vi.fn()
const pathnameMock = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => pathnameMock(),
}))

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}))

vi.mock('@/components/animations/SmoothScroll', () => ({
  useLenis: () => ({ scrollTo: mockScrollTo }),
  NAV_SCROLL_OFFSET: 80,
}))

describe('RoomDirectory', () => {
  it('pins the six rooms of the museum to the wall', () => {
    pathnameMock.mockReturnValue('/')
    document.getElementById = vi.fn(() => null) as never
    render(<RoomDirectory />)
    for (const room of ['Gallery of Origins', 'Hall of Living Code', 'Fountain Court', 'Workshop of Systems', 'Collection of Works', 'Archive of Memory', 'Threshold']) {
      expect(screen.getByRole('button', { name: new RegExp(room) })).toBeTruthy()
    }
  })

  it('stays away from routes that are not the museum', () => {
    cleanup()
    pathnameMock.mockReturnValue('/work/wisla-platform')
    const { container } = render(<RoomDirectory />)
    expect(container.firstChild).toBeNull()
  })
})