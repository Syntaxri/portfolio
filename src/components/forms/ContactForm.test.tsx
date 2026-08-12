// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ContactForm } from './ContactForm'

const okFetch = vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => ({ success: true, message: 'Received.' }),
})

function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/Your name/i), { target: { value: 'Yasmine' } })
  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { value: 'yasmine@example.com' },
  })
  fireEvent.change(screen.getByLabelText(/The idea/i), {
    target: { value: 'A commission for a booking system.' },
  })
}

describe('ContactForm', () => {
  it('refuses an empty note without touching the wire', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    render(<ContactForm />)
    fireEvent.click(screen.getByRole('button', { name: /Send the note/ }))
    await waitFor(() => expect(screen.getByText(/A name is required/)).toBeTruthy())
    expect(fetchSpy).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('posts to the secured API and celebrates the send', async () => {
    vi.stubGlobal('fetch', okFetch)
    render(<ContactForm />)
    fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: /Send the note/ }))
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({ method: 'POST' })
      )
    )
    await waitFor(() =>
      expect(
        screen.getByText(/Received — sealed with the keeper's mark\. Answer within 24 hours\./i)
      ).toBeTruthy()
    )
    vi.unstubAllGlobals()
  })

  it('recovers when the wire refuses the note', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ success: false, error: { message: 'Failed.' } }),
      })
    )
    render(<ContactForm />)
    fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: /Send the note/ }))
    await waitFor(() =>
      expect(screen.getByText(/The wire slipped/)).toBeTruthy()
    )
    vi.unstubAllGlobals()
  })
})