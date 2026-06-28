'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

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

function ContactLink({
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
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 no-underline p-3 rounded-lg transition-all duration-200"
      style={{
        border: `1px solid ${hovered ? 'rgba(var(--accent-rgb), 0.2)' : 'rgba(255,255,255,0.06)'}`,
        background: hovered ? 'rgba(var(--accent-rgb), 0.03)' : 'rgba(255,255,255,0.02)',
      }}
    >
      <span
        className="w-8 h-8 rounded-md flex items-center justify-center text-xs shrink-0"
        style={{
          background: 'rgba(var(--accent-rgb), 0.08)',
          color: 'var(--accent)',
        }}
      >
        {icon}
      </span>
      <div>
        <p className="font-mono text-[0.5rem] tracking-widest uppercase text-white/25 mb-0.5">
          {label}
        </p>
        <p className="font-mono text-xs tracking-wider text-white/70">
          {value}
        </p>
      </div>
    </a>
  )
}

export function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState('idle')
  const isSubmitting = useRef(false)
  const emailDebounce = useRef<ReturnType<typeof setTimeout>>(undefined)

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

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setTouched((prev) => ({ ...prev, [name]: true }))
      clearTimeout(emailDebounce.current)
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    },
    []
  )

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
        setTimeout(() => {
          setForm({ name: '', email: '', message: '' })
          setErrors({})
          setTouched({})
          setStatus('idle')
        }, 3000)
      } catch {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      } finally {
        isSubmitting.current = false
      }
    },
    [form]
  )

  const isDisabled = status === 'loading' || status === 'success'

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-12 items-start pb-20">
      {/* Info */}
      <div className="px-1">
        <span
          className="font-mono text-[0.6rem] tracking-widest uppercase block mb-4"
          style={{ color: 'var(--accent)' }}
        >
          Get in touch
        </span>

        <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,3.5rem)] text-white tracking-tight leading-[1.05] mb-6">
          Let&apos;s build
          <br />
          <span
            className="text-transparent"
            style={{
              WebkitTextStroke: '1px rgba(255,255,255,0.15)',
            }}
          >
            something
          </span>
          <br />
          great.
        </h1>

        <p className="text-sm leading-relaxed text-white/45 mb-8 max-w-[400px]">
          Open to full-time roles, freelance projects, and interesting
          collaborations. Response time is usually within 24 hours.
        </p>

        <div className="space-y-3 mb-8">
          <ContactLink
            icon="✉"
            label="Email"
            value="akramrihanie@gmail.com"
            href="mailto:akramrihanie@gmail.com"
          />
          <ContactLink
            icon="◎"
            label="GitHub"
            value="github.com/Syntaxri"
            href="https://github.com/Syntaxri"
          />
          <ContactLink
            icon="◈"
            label="LinkedIn"
            value="linkedin.com/in/riihaniakram"
            href="https://linkedin.com/in/riihaniakram"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.2)',
          }}
        >
          <span
            className="w-[6px] h-[6px] rounded-full shrink-0"
            style={{
              background: '#22c55e',
              animation: 'status-pulse 2s ease-in-out infinite',
            }}
          />
          <span className="font-mono text-[0.55rem] tracking-wider uppercase text-emerald-400">
            Available for work
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="panel p-6">
        <div
          className="absolute top-0 left-[10%] right-[10%] h-[1.5px] rounded-b-sm"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--accent), transparent)',
          }}
        />

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="font-mono text-[0.55rem] tracking-widest uppercase text-white/30 block mb-1.5"
            >
              Your Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Akram Rihani"
              disabled={isDisabled}
              className="w-full px-3.5 py-3 rounded-lg font-mono text-sm text-white outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${errors.name && touched.name ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)'}`,
              }}
            />
            {errors.name && touched.name && (
              <p className="font-mono text-[0.6rem] text-red-400 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="font-mono text-[0.55rem] tracking-widest uppercase text-white/30 block mb-1.5"
            >
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
              className="w-full px-3.5 py-3 rounded-lg font-mono text-sm text-white outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${errors.email && touched.email ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)'}`,
              }}
            />
            {errors.email && touched.email && (
              <p className="font-mono text-[0.6rem] text-red-400 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="font-mono text-[0.55rem] tracking-widest uppercase text-white/30 block mb-1.5"
            >
              Message
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
              className="w-full px-3.5 py-3 rounded-lg font-mono text-sm text-white outline-none transition-all duration-200 resize-none"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${errors.message && touched.message ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)'}`,
              }}
            />
            {errors.message && touched.message && (
              <p className="font-mono text-[0.6rem] text-red-400 mt-1">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full py-3 rounded-lg font-mono text-[0.65rem] tracking-widest uppercase transition-all duration-200"
            style={{
              background: isDisabled
                ? 'rgba(var(--accent-rgb), 0.2)'
                : 'rgba(var(--accent-rgb), 0.12)',
              border: '1px solid rgba(var(--accent-rgb), 0.25)',
              color: isDisabled
                ? 'rgba(255,255,255,0.3)'
                : 'var(--accent)',
            }}
          >
            {status === 'loading' && 'Sending…'}
            {status === 'success' && '✓ Message Sent!'}
            {status === 'error' && '↺ Try Again'}
            {status === 'idle' && 'Send Message →'}
          </button>
        </form>
      </div>
    </div>
  )
}
