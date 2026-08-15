// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { LivingRoom } from './LivingRoom'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as never
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify([
            { slug: 'palais-amghass', embeddable: true },
            { slug: 'nexthobby', embeddable: false },
          ]),
          { status: 200 }
        )
      )
    )
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('LivingRoom', () => {
  it('opens the room with the living title and the projector plaque', () => {
    render(<LivingRoom />)
    expect(screen.getByRole('heading', { name: /The Living Room\./ })).toBeTruthy()
    expect(screen.getAllByText(/Palais Amghass/).length).toBeGreaterThan(0)
  })

  it('ranks the other live builds in the stalls', () => {
    render(<LivingRoom />)
    /* the hero hangs first; the other live builds follow in the stalls */
    expect(screen.getByText(/every other live build/)).toBeTruthy()
    for (const title of ['NextHobby', 'Auto-École Michlifen', 'Azrou Design', 'Le Sapin']) {
      expect(screen.getByText(title)).toBeTruthy()
    }
  })

  it('lets the visitor into the room-sized window and out again', async () => {
    render(<LivingRoom />)
    fireEvent.click(screen.getByRole('button', { name: /enter the living room/i }))
    expect(
      await screen.findByRole('dialog', { name: /Palais Amghass — live/ })
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /close the living room/i }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})