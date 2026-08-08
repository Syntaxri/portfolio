import { describe, it, expect } from 'vitest'
import { escapeHtml } from './escapeHtml'

describe('escapeHtml', () => {
  it('escapes the dangerous characters it handles', () => {
    expect(escapeHtml(`<b>"&</b>`)).toBe('&lt;b&gt;&quot;&amp;&lt;/b&gt;')
  })

  it('leaves plain text untouched', () => {
    expect(escapeHtml('hello world')).toBe('hello world')
  })

  it('escapes repeated occurrences', () => {
    expect(escapeHtml('<<a>>')).toBe('&lt;&lt;a&gt;&gt;')
  })

  it('escapes ampersands before anything else (single pass, no double-escape of raw input)', () => {
    expect(escapeHtml('&amp;')).toBe('&amp;amp;')
  })
})
