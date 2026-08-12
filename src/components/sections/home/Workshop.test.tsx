// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Workshop } from './Workshop'
import { crafts } from '@/lib/data/capabilities'

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => true,
}))

describe('Workshop', () => {
  it('is announced as the workshop', () => {
    render(<Workshop />)
    expect(screen.getByRole('heading', { name: /The Workshop\./ })).toBeTruthy()
  })

  it('hangs the four craft panels', () => {
    render(<Workshop />)
    for (const c of crafts) {
      expect(screen.getByRole('heading', { name: c.title })).toBeTruthy()
      for (const skill of c.skills.slice(0, 3)) {
        expect(screen.getByText(skill)).toBeTruthy()
      }
    }
  })
})