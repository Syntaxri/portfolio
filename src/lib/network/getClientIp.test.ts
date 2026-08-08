import { describe, it, expect } from 'vitest'
import { getClientIp } from './getClientIp'

function requestWith(headers: Record<string, string>): Request {
  return new Request('http://localhost/api/contact', { headers })
}

describe('getClientIp', () => {
  it('takes the first address from x-forwarded-for', () => {
    const req = requestWith({ 'x-forwarded-for': '203.0.113.9, 70.41.3.18, 150.172.238.178' })
    expect(getClientIp(req)).toBe('203.0.113.9')
  })

  it('falls back to x-real-ip', () => {
    const req = requestWith({ 'x-real-ip': '198.51.100.7' })
    expect(getClientIp(req)).toBe('198.51.100.7')
  })

  it('prefers x-forwarded-for over x-real-ip', () => {
    const req = requestWith({ 'x-forwarded-for': '203.0.113.9', 'x-real-ip': '198.51.100.7' })
    expect(getClientIp(req)).toBe('203.0.113.9')
  })

  it('defaults to loopback when no headers are present', () => {
    expect(getClientIp(new Request('http://localhost/api/contact'))).toBe('127.0.0.1')
  })
})
