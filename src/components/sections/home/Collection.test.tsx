// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Collection } from './Collection'
import { projects } from '@/lib/data/projects'

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => true,
}))

describe('Collection', () => {
  it('is announced as the collection', () => {
    render(<Collection />)
    expect(screen.getByRole('heading', { name: /The Collection\./ })).toBeTruthy()
  })

  it('heads every permanent piece into its exhibit room', () => {
    render(<Collection />)
    for (const p of projects) {
      const links = screen.getAllByRole('link', { name: new RegExp(p.title) })
      expect(links.length).toBeGreaterThan(0)
      expect(links.some((l) => l.getAttribute('href') === `/work/${p.slug}`)).toBe(true)
    }
  })

  it('flags WISLA as the flagship and offers the way in', () => {
    render(<Collection />)
    expect(screen.getByText(/Flagship accession/)).toBeTruthy()
    expect(screen.getByText(/Enter the exhibit/).closest('a')?.getAttribute('href')).toBe(
      '/work/wisla-platform'
    )
  })

  it('shows live doors for running builds', () => {
    render(<Collection />)
    for (const p of projects.filter((p) => p.liveUrl)) {
      const link = screen.getByRole('link', { name: new RegExp(`^${p.title} — case study$`) })
      expect(link).toBeTruthy()
      expect(screen.getAllByRole('link', { name: /Live/ }).length).toBeGreaterThan(0)
    }
  })
})