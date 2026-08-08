# Akram Rihani — Portfolio

Personal portfolio at [akramrihani.com](https://akramrihani.com): an expressive, WebGL-heavy React site documenting real project work (no fabricated clients, awards, or metrics).

## Stack

- **Next.js 14** (App Router, RSC + client islands)
- **React 19**, strict TypeScript
- **Tailwind CSS** (CSS-first theme in `src/app/globals.css`)
- **Three.js / React Three Fiber / drei** — hero scene, quality tiers
- **GSAP + ScrollTrigger + Lenis** — scroll choreography
- **Next fonts** (`Inter`, `DM Mono`, `Syne`), local cover JPGs in `public/work/<slug>/`

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm start          # serve production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # vitest (unit + component)
npm run format     # prettier --write .
npm run format:check
```

## Environment

Copy `.env.example` to `.env.local`:

| Variable         | Required | Purpose                              |
| ---------------- | -------- | ------------------------------------ |
| `RESEND_API_KEY` | prod yes | Sends contact-form emails via Resend |
| `CONTACT_EMAIL`  | prod yes | Recipient for the contact form       |

Without a key, `next dev` logs submissions instead of emailing and the API
returns `EMAIL_NOT_CONFIGURED` in production.

## Contact form pipeline

`POST /api/contact`:

1. **Validation** — server-side (`src/lib/validation/contact.ts`) mirrors the
   client rules; input sanitized (tags stripped, length capped).
2. **Honeypot** — hidden `website`/`phone` fields absorb bots.
3. **Rate limit** — sliding window per IP (`src/lib/rateLimit`), pluggable
   store; the in-memory default is best-effort on serverless — swap in a
   Redis adapter by implementing `RateLimitStore`.
4. **Email** — Resend with HTML-escaped values; failures return a generic
   message and are logged server-side (never leaked to the client).
5. **Security headers** — CSP (production), HSTS, Permissions-Policy and more
   are applied in `next.config.mjs`.

## Performance & accessibility

- WebGL quality tiers (DPR cap, particle count) based on device hardware.
- Transforms/opacity-only animation; blur effects only when not scrolling;
  marquees pause offscreen via `IntersectionObserver`.
- `prefers-reduced-motion` respected throughout.
- Mobile menu is a proper dialog (focus trap, ESC to close, aria attributes);
  form status is announced via `role="status"`.

## Testing

Unit tests (`vitest`) cover validation, rate limiting, env handling, HTML
escaping, IP extraction, the email gateway and the API route; component tests
cover the navbar dialog and contact form. CI runs lint, typecheck, tests and a
production build.

## Deployment

Deployed on Vercel from `main`. Pushed commits are auto-deployed to
akramrihani.com.
