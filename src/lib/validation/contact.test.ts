import { describe, it, expect } from 'vitest'
import { sanitize, validateContact, EMAIL_RE } from './contact'

describe('sanitize', () => {
  it('returns empty string for non-string input', () => {
    expect(sanitize(null)).toBe('')
    expect(sanitize(undefined)).toBe('')
    expect(sanitize(42)).toBe('')
    expect(sanitize({})).toBe('')
  })

  it('strips HTML tags', () => {
    expect(sanitize('<script>alert(1)</script>hello')).toBe('alert(1)hello')
    expect(sanitize('<b>bold</b>')).toBe('bold')
  })

  it('removes null bytes', () => {
    expect(sanitize('a\u0000b')).toBe('ab')
  })

  it('trims whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello')
  })

  it('caps length at maxLen', () => {
    expect(sanitize('a'.repeat(50), 10)).toBe('a'.repeat(10))
  })
})

describe('validateContact', () => {
  it('accepts a valid submission', () => {
    expect(
      validateContact({ name: 'Jane', email: 'jane@example.com', message: 'Hello, this is a message.' })
    ).toEqual({})
  })

  it('requires name', () => {
    expect(validateContact({ name: '', email: 'a@b.com', message: 'x'.repeat(12) }).name).toBe(
      'Name is required.'
    )
  })

  it('rejects too-short names', () => {
    expect(validateContact({ name: 'J', email: 'a@b.com', message: 'x'.repeat(12) }).name).toBe(
      'Name must be at least 2 characters.'
    )
  })

  it('requires a valid email', () => {
    expect(validateContact({ name: 'Jane', email: 'not-an-email', message: 'x'.repeat(12) }).email).toBe(
      'Invalid email address.'
    )
    expect(validateContact({ name: 'Jane', email: '', message: 'x'.repeat(12) }).email).toBe(
      'Email is required.'
    )
  })

  it('requires a message of at least 10 characters', () => {
    expect(validateContact({ name: 'Jane', email: 'a@b.com', message: 'short' }).message).toBe(
      'Message must be at least 10 characters.'
    )
    expect(validateContact({ name: 'Jane', email: 'a@b.com', message: '' }).message).toBe(
      'Message is required.'
    )
  })

  it('reports every failing field at once', () => {
    const errors = validateContact({ name: '', email: '', message: '' })
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name'])
  })
})

describe('EMAIL_RE', () => {
  it('accepts ordinary addresses', () => {
    expect(EMAIL_RE.test('jane@example.com')).toBe(true)
    expect(EMAIL_RE.test('a.b+c@sub.example.co.uk')).toBe(true)
  })

  it('rejects malformed addresses', () => {
    expect(EMAIL_RE.test('')).toBe(false)
    expect(EMAIL_RE.test('plain')).toBe(false)
    expect(EMAIL_RE.test('a@b')).toBe(false)
    expect(EMAIL_RE.test('a b@c.com')).toBe(false)
  })
})
