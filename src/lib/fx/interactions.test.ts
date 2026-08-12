import { describe, expect, it } from 'vitest'
import { weavePulse } from '@/components/sections/home/LoomRoom'
import { appendPhrase } from '@/components/chrome/CuratorsKey'

describe('weavePulse', () => {
  it('pulses lightly on ordinary fibre transitions', () => {
    expect(weavePulse(1)).toBe(7)
    expect(weavePulse(17)).toBe(7)
  })

  it('pulses firmly when a quarter of the runner locks', () => {
    for (const step of [0, 16, 32, 48, 64]) {
      expect(weavePulse(step)).toBe(24)
    }
  })
})

describe('appendPhrase', () => {
  it('unlocks when the secret is completed', () => {
    let { buffer, unlocked } = appendPhrase('', 'm')
    for (const ch of 'inttea') {
      const next = appendPhrase(buffer, ch)
      buffer = next.buffer
      unlocked = next.unlocked
    }
    expect(unlocked).toBe(true)
  })

  it('is case-insensitive', () => {
    const done = appendPhrase('MINTTE', 'A')
    expect(done.unlocked).toBe(true)
  })

  it('forgets characters beyond the secret length', () => {
    const out = appendPhrase('abcdefgh', 'i')
    expect(out.buffer).toBe('cdefghi')
  })

  it('ignores non-printable keys', () => {
    const out = appendPhrase('mint', 'Shift')
    expect(out.buffer).toBe('mint')
    expect(out.unlocked).toBe(false)
  })
})
