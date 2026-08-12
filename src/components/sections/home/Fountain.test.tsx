// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Fountain } from './Fountain'
import { grammar } from '@/lib/data/capabilities'

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => true,
}))

describe('Fountain', () => {
  it('tells the founding story in four steps', () => {
    render(<Fountain />)
    expect(screen.getByRole('heading', { name: /The Fountain\./ })).toBeTruthy()
    for (const word of ['Curiosity', 'Engineering', 'Projects', 'Products']) {
      expect(screen.getByText(word)).toBeTruthy()
    }
    expect(screen.getByText(/Open for freelance/)).toBeTruthy()
  })

  it('teaches the grammar of the workshop', () => {
    render(<Fountain />)
    const heading = screen.getByRole('heading', { name: /Seven rules/i })
    expect(heading).toBeTruthy()
    for (const g of grammar) {
      expect(screen.getByText(g.craft)).toBeTruthy()
      expect(screen.getByText(g.engineering)).toBeTruthy()
    }
  })
})