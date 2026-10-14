# Security

## Production Vulnerabilities

**0** — `npm audit --omit=dev` reports zero production vulnerabilities.

## Build-Toolchain Advisories

9 advisories exist in dev dependencies (chokidar, fast-glob, micromatch, braces, postcss-selector-parser, postcss-nested). These are build-time only — no runtime exposure, no action needed.

## Contact Form

- Rate limited: 5 requests / 10 min per IP (memory or Upstash KV)
- Honeypot fields for bot detection
- Input sanitization + server-side validation
- HTML escaping on all email content

## Build Tooling

- `overrides.postcss: ^8.5.26` pins a single PostCSS version across the Tailwind/PostCSS pipeline — prevents duplicate installs and version conflicts.

## Headers

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Content-Security-Policy` (production only)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`
