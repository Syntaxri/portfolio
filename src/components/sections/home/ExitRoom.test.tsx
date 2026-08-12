// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ExitRoom } from './ExitRoom'
import { socials } from '@/lib/data/site'

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => true,
}))

describe('ExitRoom', () => {
  it('closes the museum with the one question that matters', () => {
    render(<ExitRoom />)
    expect(screen.getByRole('heading', { name: /Have an idea worth building/i })).toBeTruthy()
    expect(screen.getByText(/Let's turn it into something/)).toBeTruthy()
  })

  it('keeps every door of the keeper open', () => {
    render(<ExitRoom />)
    for (const s of socials) {
      const link = screen.getAllByRole('link', { name: new RegExp(s.label) })[0]
      expect(link.getAttribute('href')).toBe(s.href)
    }
    expect(screen.getAllByRole('link').some((l) => l.getAttribute('href') === 'mailto:hello@akramrihani.com')).toBe(true)
  })

  it('ends the exhibition on the monogram and a final invitation', () => {
    render(<ExitRoom />)
    expect(screen.getByText(/the exhibition has ended/i)).toBeTruthy()
    expect(screen.getByText(/Write to the keeper/).closest('a')?.getAttribute('href')).toBe(
      'mailto:hello@akramrihani.com'
    )
  })
})