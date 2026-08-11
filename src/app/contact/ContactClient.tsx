'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { RevealText } from '@/components/animations/RevealText'
import { Magnetic } from '@/components/animations/Magnetic'
import { site } from '@/lib/data/site'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateField(name: string, value: string) {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Name is required.'
      if (value.trim().length < 2) return 'Name must be at least 2 characters.'
      return ''
    case 'email':
      if (!value.trim()) return 'Email is required.'
      if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address.'
      return ''
    case 'message':
      if (!value.trim()) return 'Message is required.'
      if (value.trim().length < 10) return 'Message must be at least 10 characters.'
      return ''
    default:
      return ''
  }
}

function validate(form: { name: string; email: string; message: string }) {
  const errors: Record<string, string> = {}
  const nameErr = validateField('name', form.name)
  const emailErr = validateField('email', form.email)
  const messageErr = validateField('message', form.message)
  if (nameErr) errors.name = nameErr
  if (emailErr) errors.email = emailErr
  if (messageErr) errors.message = messageErr
  return errors
}

function ContactListItem({
  icon,
  label,
  value,
  href,
}: {
  icon: string
  label: string
  value: string
  href: string
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="group flex items-center gap-4 border-b border-white/[0.08] py-4 transition-colors duration-300 hover:border-accent/40"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm text-accent-secondary transition-colors duration-300 group-hover:border-accent/40">
        {icon}
      </span>
      <span>
        <span className="label block">{label}</span>
        <span className="mt-0.5 block font-mono text-xs tracking-wide text-ink-secondary">{value}</span>
      </span>
      <span
        className="label ml-auto transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-accent-secondary"
        aria-hidden
      >
        ↗
      </span>
    </a>
  )
}

const inputClass = (error: string | undefined, touched: boolean | undefined) =>
  `w-full border-b bg-transparent px-0 py-3 font-mono text-sm text-ink outline-none transition-colors duration-300 placeholder:text-ink-tertiary/40 ${
    error && touched ? 'border-red-400/60' : 'border-white/15 focus:border-accent/70'
  }`

export function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const isSubmitting = useRef(false)
  const emailDebounce = useRef<ReturnType<typeof setTimeout>>(undefined)
  const statusTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(
    () => () => {
      clearTimeout(statusTimer.current)
      clearTimeout(emailDebounce.current)
    },
    []
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setForm((prev) => ({ ...prev, [name]: value }))
      if (touched[name]) {
        if (name === 'email') {
          clearTimeout(emailDebounce.current)
          emailDebounce.current = setTimeout(() => {
            setErrors((prev) => ({ ...prev, email: validateField('email', value) }))
          }, 600)
          setErrors((prev) => ({ ...prev, email: '' }))
        } else {
          setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
        }
      }
    },
    [touched]
  )

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    clearTimeout(emailDebounce.current)
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (isSubmitting.current) return

      const allErrors = validate(form)
      setTouched({ name: true, email: true, message: true })
      setErrors(allErrors)

      if (Object.keys(allErrors).length > 0) return

      isSubmitting.current = true
      setStatus('loading')

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            message: form.message.trim(),
          }),
        })

        if (!res.ok) throw new Error('Failed to send message.')

        setStatus('success')
        statusTimer.current = setTimeout(() => {
          setForm({ name: '', email: '', message: '' })
          setErrors({})
          setTouched({})
          setStatus('idle')
        }, 3200)
      } catch {
        setStatus('error')
        statusTimer.current = setTimeout(() => setStatus('idle'), 3200)
      } finally {
        isSubmitting.current = false
      }
    },
    [form]
  )

  const isDisabled = status === 'loading' || status === 'success'

  return (
    <div className="grid grid-cols-1 gap-16 pb-28 lg:grid-cols-[1fr_minmax(24rem,26rem)]">
      {/* Editorial side */}
      <div>
        <p className="label label-accent mb-8">Contact</p>
        <h1 className="fluid-title font-extrabold tracking-tight">
          <RevealText>Say hello.</RevealText>{' '}
          <RevealText as="span" className="block text-outline">
            Start something.
          </RevealText>
        </h1>

        <p className="mt-8 max-w-md text-base leading-relaxed text-ink-secondary">
          Open to full-time roles, freelance projects, and interesting collaborations. Response time is
          usually within 24 hours.
        </p>

        <div className="mt-10 max-w-md">
          <ContactListItem icon="✉" label="Email" value={site.email} href={`mailto:${site.email}`} />
          <ContactListItem icon="⌥" label="GitHub" value="github.com/Syntaxri" href={site.github} />
          <ContactListItem
            icon="◈"
            label="LinkedIn"
            value="linkedin.com/in/riihaniakram"
            href={site.linkedin}
          />
        </div>

        <div className="mt-8 inline-flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="label">{site.availability}</span>
        </div>
      </div>

      {/* Form */}
      <div className="relative h-fit border border-white/[0.08] bg-white/[0.015] p-8 sm:p-10">
        <form onSubmit={handleSubmit} noValidate className="space-y-8" aria-label="Contact form">
          <p role="status" className="sr-only">
            {status === 'loading' && 'Sending your message…'}
            {status === 'success' && 'Message sent successfully.'}
            {status === 'error' && 'Sending failed. Please try again.'}
          </p>
          <div>
            <label htmlFor="name" className="label mb-2 block">
              Your name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Jane Doe"
              disabled={isDisabled}
              autoComplete="name"
              aria-invalid={errors.name && touched.name ? 'true' : undefined}
              aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
              className={inputClass(errors.name, touched.name)}
            />
            {errors.name && touched.name && (
              <p
                id="name-error"
                role="alert"
                className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest text-red-400"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="label mb-2 block">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
              disabled={isDisabled}
              autoComplete="email"
              aria-invalid={errors.email && touched.email ? 'true' : undefined}
              aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
              className={inputClass(errors.email, touched.email)}
            />
            {errors.email && touched.email && (
              <p
                id="email-error"
                role="alert"
                className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest text-red-400"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="label mb-2 block">
              Project details
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tell me about your project…"
              disabled={isDisabled}
              rows={4}
              aria-invalid={errors.message && touched.message ? 'true' : undefined}
              aria-describedby={errors.message && touched.message ? 'message-error' : undefined}
              className={`${inputClass(errors.message, touched.message)} resize-none`}
            />
            {errors.message && touched.message && (
              <p
                id="message-error"
                role="alert"
                className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest text-red-400"
              >
                {errors.message}
              </p>
            )}
          </div>

          <Magnetic strength={0.25}>
            <button
              type="submit"
              disabled={isDisabled}
              className={`group flex w-full items-center justify-center gap-3 py-4 font-display text-base font-bold tracking-tight transition-colors duration-300 ${
                status === 'error' ? 'bg-red-500/15 text-red-400' : 'bg-ink text-[#05060a] hover:bg-accent'
              } disabled:cursor-not-allowed`}
            >
              {status === 'loading' && (
                <>
                  <span
                    className="inline-block h-4 w-4 animate-spin-slow rounded-full border-2 border-current border-t-transparent"
                    aria-hidden
                  />
                  Sending…
                </>
              )}
              {status === 'success' && <span>✓ Message sent — talk soon</span>}
              {status === 'error' && <span>↺ Something went wrong — try again</span>}
              {status === 'idle' && (
                <>
                  Send message
                  <span
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  >
                    →
                  </span>
                </>
              )}
            </button>
          </Magnetic>

          <p className="label text-center" style={{ opacity: 0.5 }}>
            Or email me directly at {site.email}
          </p>
        </form>
      </div>
    </div>
  )
}
