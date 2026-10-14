/**
 * Privacy-friendly analytics — Plausible Analytics integration.
 *
 * Plausible is a lightweight, open-source, cookie-less analytics platform
 * that doesn't collect personal data and is GDPR compliant by default.
 *
 * Set VITE_PLAUSIBLE_DOMAIN (or NEXT_PUBLIC_PLAUSIBLE_DOMAIN) in your
 * environment to enable. No cookies, no personal data, no consent banner.
 */

export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || ''

export function isAnalyticsEnabled(): boolean {
  return Boolean(PLAUSIBLE_DOMAIN) && process.env.NODE_ENV === 'production'
}

/**
 * Track a custom event (e.g., button clicks, form submissions).
 * Only sends if analytics is enabled.
 */
export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
): void {
  if (!isAnalyticsEnabled()) return

  // Plausible's custom event API
  const data = {
    name: eventName,
    url: window.location.pathname,
    domain: PLAUSIBLE_DOMAIN,
    props,
  }

  // Send via sendBeacon for reliability
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  navigator.sendBeacon('https://plausible.io/api/event', blob)
}

/**
 * Track a pageview (for client-side navigation).
 */
export function trackPageview(): void {
  if (!isAnalyticsEnabled()) return

  const data = {
    url: window.location.pathname,
    domain: PLAUSIBLE_DOMAIN,
    referrer: document.referrer || '',
  }

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  navigator.sendBeacon('https://plausible.io/api/event', blob)
}
