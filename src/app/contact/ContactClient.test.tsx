// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactClient } from './ContactClient'

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
    update: vi.fn(),
    kill: vi.fn(),
    clearScrollMemory: vi.fn(),
  },
}))

const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ContactClient form', () => {
  it('renders the editorial side and form fields', () => {
    render(<ContactClient />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByLabelText('Your name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Project details')).toBeInTheDocument()
  })

  it('shows per-field errors on submit without calling the API', async () => {
    const user = userEvent.setup()
    render(<ContactClient />)

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText('Name is required.')).toBeInTheDocument()
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Message is required.')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('submits a valid form and announces success via a status region', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: true }), { status: 200 }))
    render(<ContactClient />)

    await user.type(screen.getByLabelText('Your name'), 'Jane Doe')
    await user.type(screen.getByLabelText('Email'), 'jane@example.com')
    await user.type(screen.getByLabelText('Project details'), 'This is a properly long message.')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/contact', expect.objectContaining({ method: 'POST' }))
    expect(await screen.findByText('Message sent successfully.')).toBeInTheDocument()
  })

  it('announces failure when the request errors and does not leak details', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: false }), { status: 500 }))
    render(<ContactClient />)

    await user.type(screen.getByLabelText('Your name'), 'Jane Doe')
    await user.type(screen.getByLabelText('Email'), 'jane@example.com')
    await user.type(screen.getByLabelText('Project details'), 'This is a properly long project.')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText('Sending failed. Please try again.')).toBeInTheDocument()
    expect(screen.queryByText(/SMTP|broken|stack/i)).not.toBeInTheDocument()
  })

  it('marks fields aria-invalid with an error message linked by aria-describedby', async () => {
    const user = userEvent.setup()
    render(<ContactClient />)

    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    fireEvent.blur(screen.getByLabelText('Email'))

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input.getAttribute('aria-describedby')).toBe('email-error')
  })
})
