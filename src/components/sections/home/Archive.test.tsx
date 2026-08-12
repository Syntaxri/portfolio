// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Archive } from './Archive'
import { getProject } from '@/lib/data/projects'

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => true,
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))

describe('Archive', () => {
  it('is announced as the archive, in the dark', () => {
    render(<Archive />)
    expect(screen.getByRole('heading', { name: /The Archive\./ })).toBeTruthy()
  })

  it('documents the flagship as an enterprise backend build', () => {
    render(<Archive />)
    const wisla = getProject('wisla-platform')!
    expect(screen.getByRole('heading', { name: /WISLA Platform\./ })).toBeTruthy()
    expect(screen.getByText(/backend engineering/i)).toBeTruthy()
    expect(screen.getByText(/Enter the exhibit/).closest('a')?.getAttribute('href')).toBe(
      '/work/wisla-platform'
    )
    for (const c of wisla.challenges ?? []) {
      expect(screen.getByRole('heading', { name: c.title })).toBeTruthy()
    }
  })

  it('shows the three identities of the platform', () => {
    render(<Archive />)
    for (const role of ['Company', 'Faculty', 'Student']) {
      expect(screen.getByRole('heading', { name: role })).toBeTruthy()
    }
  })
})