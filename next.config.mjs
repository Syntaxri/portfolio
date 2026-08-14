/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 82],
  },
  headers: async () => {
    const headers = [
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin',
      },
      /* defensive depth on top of COOP: no other origin may ever draw
         over this window, and response bodies stay same-origin */
      {
        key: 'Cross-Origin-Embedder-Policy',
        value: 'require-corp',
      },
    ]

    // Content-Security-Policy is set here (not in middleware) and keeps
    // 'unsafe-inline' in script-src — required by Next's RSC hydration
    // payloads. A strict nonce-based policy is NOT possible on Next 16
    // + Turbopack today: production SSR never emits the nonce attribute
    // on framework scripts (vercel/next.js#93094, still-open #96063),
    // so a nonce-only policy blocks every script and blanks the site.
    // Everything else stays strict: remote origins are impossible, and
    // inline scripts only exist as Next-generated hydration payloads.
    // Revisit when the upstream fix lands.
    // Skipped in `next dev`: React dev mode requires eval() for its
    // debugging features, and HMR relies on inline/eval — the strict
    // policy is a production guarantee only.
    if (process.env.NODE_ENV === 'production') {
      headers.push({
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "style-src 'self' 'unsafe-inline'",
          "script-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self' data:",
          "connect-src 'self'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'",
          "media-src 'self'",
        ].join('; '),
      })
    }

    return [
      {
        source: '/(.*)',
        headers,
      },
    ]
  },
}

export default nextConfig
