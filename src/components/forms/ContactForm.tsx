'use client'

import { useState } from 'react'
import { site } from '@/lib/data/site'

interface FormState {
  name: string
  email: string
  message: string
  website: string
  phone: string
}

const INITIAL: FormState = { name: '', email: '', message: '', website: '', phone: '' }

type Status = 'idle' | 'sending' | 'sent' | 'error'

function validate(f: FormState): Partial<Record<'name' | 'email' | 'message', string>> {
  const errors: Partial<Record<'name' | 'email' | 'message', string>> = {}
  if (f.name.trim().length < 2) errors.name = 'A name is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errors.email = 'A usable email is required.'
  if (f.message.trim().length < 10) errors.message = 'A few words about the idea (10+ characters).'
  return errors
}

/** mailto fallback so a note can always reach the keeper, even offline. */
function mailtoFallback(f: FormState) {
  const subject = `A project note from ${f.name}`
  const body = `${f.message}\n\n— ${f.name}\n${f.email}`
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/**
 * The visitors' book at the exit. Posts to the secured /api/contact
 * endpoint (ratelimited, sanitised, honeypot-guarded); if the wire is
 * down it folds into a mailto — the message always has a way out.
 */
export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [fieldError, setFieldError] = useState('')

  const errors = validate(form)
  const showError = (k: 'name' | 'email' | 'message') => touched[k] && errors[k]

  const set = (k: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [k]: value }))
    setTouched((t) => ({ ...t, [k]: true }))
    if (fieldError) setFieldError('')
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const currentErrors = validate(form)
    if (currentErrors.name || currentErrors.email || currentErrors.message) {
      setTouched({ name: true, email: true, message: true })
      return
    }
    setStatus('sending')
    setFieldError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          website: form.website,
          phone: form.phone,
        }),
      })
      const payload = (await res.json().catch(() => null)) as {
        success?: boolean
        error?: { message?: string; fields?: Record<string, string> }
      } | null
      if (res.ok && payload?.success) {
        setStatus('sent')
        setForm(INITIAL)
        setTouched({})
        return
      }
      if (payload?.error?.fields?.name) {
        setFieldError(payload.error.fields.name)
        setTouched((t) => ({ ...t, name: false }))
      }
      if (payload?.error?.fields?.email) {
        setFieldError(payload.error.fields.email)
        setTouched((t) => ({ ...t, email: false }))
      }
      if (payload?.error?.fields?.message) {
        setFieldError(payload.error.fields.message)
        setTouched((t) => ({ ...t, message: false }))
      }
      setStatus('error')
      if (res.status === 429) window.setTimeout(() => setStatus('idle'), 3000)
      else window.setTimeout(() => setStatus('idle'), 6000)
    } catch {
      setStatus('error')
      window.setTimeout(() => {
        setStatus('idle')
        mailtoFallback(form)
      }, 400)
    }
  }

  const input =
    'mt-2 w-full rounded-[0.3rem] border border-[rgba(28,26,22,0.2)] bg-[rgba(247,243,234,0.7)] px-4 py-3 text-sm text-text placeholder:text-text-3 focus:border-accent focus:outline-none transition-colors'

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="label">
            Your name
          </label>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => set('name')(e.target.value)}
            placeholder="The name on the commission"
            className={input}
            aria-invalid={!!showError('name')}
          />
          {showError('name') && (
            <p role="alert" className="mt-1.5 font-mono text-[0.62rem] text-err">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="cf-email" className="label">
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => set('email')(e.target.value)}
            placeholder="The address for the answer"
            className={input}
            aria-invalid={!!showError('email')}
          />
          {showError('email') && (
            <p role="alert" className="mt-1.5 font-mono text-[0.62rem] text-err">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => set('website')(e.target.value)}
        />
        <label htmlFor="cf-phone">Phone</label>
        <input
          id="cf-phone"
          name="phone"
          tabIndex={-1}
          autoComplete="off"
          value={form.phone}
          onChange={(e) => set('phone')(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="label">
          The idea
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={6}
          value={form.message}
          onChange={(e) => set('message')(e.target.value)}
          placeholder="What deserves building? A site, a system, a whole museum…"
          className={`${input} resize-y`}
          aria-invalid={!!showError('message')}
        />
        {showError('message') && (
          <p role="alert" className="mt-1.5 font-mono text-[0.62rem] text-err">
            {errors.message}
          </p>
        )}
      </div>

      {fieldError && (
        <p role="alert" className="font-mono text-[0.62rem] leading-relaxed text-err">
          {fieldError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <button type="submit" disabled={status === 'sending'} className="btn">
          {status === 'sending' ? 'Sealing the note…' : 'Send the note ↗'}
        </button>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-text-3" aria-live="polite">
          {status === 'sent' && (
            <span className="text-ok">Received — I&apos;ll answer within 24 hours.</span>
          )}
          {status === 'error' && (
            <span className="text-err">The wire slipped — your mail client will open instead.</span>
          )}
          {status === 'idle' && 'Straight to the museum office — no list, no spam.'}
        </p>
      </div>
    </form>
  )
}