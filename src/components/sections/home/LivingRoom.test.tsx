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

  it('hangs every live build in the rack', () => {
    render(<LivingRoom />)
    for (const title of ['Palais Amghass', 'NextHobby', 'Auto-École Michlifen', 'Azrou Design', 'Le Sapin']) {
      expect(screen.getByRole('button', { name: new RegExp(`${title} — hang this build in the frame`) })).toBeTruthy()
    }
  })

  it('swaps the frame when another door is picked', async () => {
    render(<LivingRoom />)
    /* nexthobby reports locked — the stage tells the truth about it */
    fireEvent.click(screen.getByRole('button', { name: /NextHobby — hang this build in the frame/ }))
    expect(await screen.findByText('NextHobby lives at its own address.')).toBeTruthy()
    /* and the palais door answers again */
    fireEvent.click(screen.getByRole('button', { name: /Palais Amghass — hang this build in the frame/ }))
    expect(await screen.findByRole('button', { name: /Palais Amghass — enter the living room/ })).toBeTruthy()
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