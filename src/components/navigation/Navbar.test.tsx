// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar } from './Navbar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/projects',
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
    update: vi.fn(),
    kill: vi.fn(),
    clearScrollMemory: vi.fn(),
  },
}))

beforeEach(() => {
  document.body.style.overflow = ''
})

describe('Navbar', () => {
  it('marks the current section as active', () => {
    render(<Navbar />)
    const work = screen.getByRole('link', { name: 'Work' }).closest('a') as HTMLElement
    expect(work).toHaveClass('text-accent-secondary')
  })

  it('opens the mobile menu as a dialog with focus moved to the first link', () => {
    render(<Navbar />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu')
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(document.activeElement).toBe(screen.getByRole('link', { name: /01\s*work/i }))
  })

  it('closes on Escape and restores focus to the toggle', () => {
    render(<Navbar />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    toggle.focus()
    fireEvent.click(toggle)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('traps focus inside the open menu', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))

    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    const links = dialog.querySelectorAll('a[href]')
    const last = links[links.length - 1] as HTMLElement

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last)

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
  })
})
