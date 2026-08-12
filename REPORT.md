# Project Report — Akram Rihani Portfolio ("The Museum of Software Craftsmanship")

Repository: `github.com/Syntaxri/portfolio` (remote `origin`, SSH)
Branch: `main` · Working tree: clean
Author: Akram Rihani (Viaruq)
Report date: 2026-08-12 · First commit: 2026-03-14 · Latest commit: 2026-08-12
Commit count: 80 · Single-author history

---

## 1. Executive summary

A creative developer portfolio rebuilt as **"The Moroccan digital museum of software
craftsmanship"** — a single continuous scroll through seven "rooms" delivered as a
Next.js 16 App Router site with two bespoke WebGL installations. All Zellige geometry
(stars, walls, bands, zellige, monogram) is **computed in code, never shipped as
images**. The project passes a hardening pipeline — ESLint, `tsc --noEmit`, 83 Vitest
tests, production build — enforced by GitHub Actions CI.

Current production domain: `https://www.akramrihani.com` (canonical, www).
Previous iteration (pre-rebuild): a two-mode "mode" site split into
Developer/Photography personas with password-gated switching; fully replaced by the
museum concept (rebuild commit `9344a22`, ~10k insertions / ~5.2k deletions).

---

## 2. Tech stack

### Dependencies (package.json)
| Package | Version | Purpose |
|---|---|---|
| `next` | ^16.3.0 | App Router framework, RSC, metadata API |
| `react` / `react-dom` | ^19.2.8 | UI |
| `three` | ^0.185.1 | WebGL scenes (raw, used directly — **no R3F**) |
| `@react-three/fiber` | ^9.7.0 | **Declared but NOT imported anywhere in `src/`** |
| `@react-three/drei` | ^10.7.8 | **Declared but NOT imported anywhere in `src/`** |
| `gsap` | ^3.15.0 | ScrollTrigger choreography, tweens |
| `lenis` | ^1.3.26 | Smooth scrolling |
| `resend` | ^4.0.0 | Contact-form email delivery |

### Dev dependencies
`eslint` 9 + `eslint-config-next` (core-web-vitals), `typescript` ^6.0.3,
`tailwindcss` ^3.4.19, `postcss` 8 (+ `autoprefixer`), `prettier` 3,
`vitest` ^4.1.10, `@testing-library/react`/`jest-dom`/`user-event`, `jsdom` 30,
`@vitejs/plugin-react`, `@types/three` — plus `overrides: { postcss: ^8.5.26 }`.

### Tooling
- Node v26.7.0 / npm 12.0.2 (CI runs Node 22)
- `@/*` path alias → `src/*` throughout
- Prettier: no semicolons, single quotes, printWidth 110, es5 trailing commas
- ESLint ignores: `.next`, `out`, `coverage`, tsbuildinfo, `public`, `next-env.d.ts`
- JetBrains IDE config checked in (`.idea/`)

### Commands
```bash
npm run dev          # next dev
npm run build        # next build
npm run start        # next start
npm run lint         # eslint .
npm run typecheck    # tsc --noEmit
npm test             # vitest run  (18 files, 83 tests, all green)
npm run test:watch   # vitest
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

---

## 3. Architecture

### Route map (src/app — App Router)
| Route | File | Purpose |
|---|---|---|
| `/` | `page.tsx` | The museum — 7 rooms composed sequentially |
| `/work` | `work/page.tsx` | Collection index |
| `/work/[slug]` | `work/[slug]/page.tsx` | Case-study detail (dynamic, `generateStaticParams`-style via projects data) |
| `/about` | `about/page.tsx` | About |
| `/contact` | `contact/page.tsx` | Contact with the form |
| `/api/contact` | `api/contact/route.ts` | POST contact endpoint (+ explicit 405 for GET/PUT/DELETE) |
| `error.tsx` | — | Root error boundary |
| `not-found.tsx` | — | 404 page |
| `sitemap.ts` | — | Generated sitemap |
| `opengraph-image.tsx` | — | Generated OG image (computed geometry, no raster assets) |
| `favicon.svg`, `site.webmanifest` | — | Icons & manifest (also duplicated in `public/`) |

### Directory map (src/)
```
src/
├── app/                 routes (above)
├── components/
│   ├── animations/      SmoothScroll, CustomCursor, Magnetic, PageTransition, Preloader
│   ├── chrome/          Topbar, Footer, StabilityFactory
│   ├── forms/           ContactForm
│   ├── museum/          Room, RoomDirectory, Monogram, Reveal, ZelligeBand
│   ├── projects/        ExhibitCover (case-study cover band)
│   ├── sections/home/   EntranceScene, Fountain, Workshop, LoomRoom, Collection, Archive, ExitRoom
│   └── three/           MosaicCanvas, ZarbiaCanvas, WebGLErrorBoundary
├── config/              contact limits (RATE_LIMIT_MAX=5 / 10min, MAX_NAME=100, MAX_MSG=1000, MAX_EMAIL=254)
├── hooks/               useQuality, useMediaQuery, useIsTouch, useReducedMotion
├── lib/
│   ├── animations/      scrollState (Lenis+GSAP shared scroll state)
│   ├── data/            projects, capabilities, site
│   ├── email/           Resend client wrapper
│   ├── network/         getClientIp
│   ├── rateLimit/       in-memory token bucket per IP
│   ├── security/        escapeHtml
│   ├── validation/      contact validation + sanitize
│   ├── env.ts           required-env validation
│   └── geometry.ts      the Zellige "craft dictionary" (pure, dependency-free)
└── types/               Project/Challenge/PerfMetric/GalleryImage/Glaze + css.d.ts
```

### Root layout
- Three Google fonts self-hosted via `next/font`: **Archivo** (`--font-sans`),
  **Fraunces** normal+italic (`--font-serif`), **Space Mono** 400/700 (`--font-mono`)
- Custom cursor (native cursor hidden via `.no-cursor`), grain overlay, Preloader,
  PageTransition, SmoothScrollProvider, Topbar, Footer, RoomDirectory (keyboard /
  chapter rail), StabilityFactory
- `viewport`: themeColor `#eae4d4`, `colorScheme: light`, `maximumScale: 5`
- Rich metadata: title template `%s · Akram Rihani`, OG/Twitter `summary_large_image`
  cards, robots directives, `sameAs` JSON, keywords, canonical `www.akramrihani.com`
- `<main id="main" tabIndex={-1}>` for skip-target a11y

---

## 4. Design system v5 ("Dar El Zellij — the museum at dawn")

### Palette (CSS channel triplets → Tailwind-compatible)
| Token | Value | Meaning |
|---|---|---|
| `--bg` | 238 232 218 | lime plaster |
| `--bg-2` | 230 223 207 | plaster in shadow |
| `--surface` | 247 243 234 | paper / tadelakt highlight |
| `--accent` | 30 64 130 | Fes-cobalt glaze |
| `--accent-2` | 140 102 52 | aged brass |
| `--emerald` | 21 105 92 | mint glaze |
| `--terra` | 170 82 38 | terracotta glaze |
| `--gold` | 168 122 54 | – |
| `--ivory` | 233 227 212 | – |
| `--walnut` | 27 23 18 | – |
| `--ok` / `--err` | 21 105 92 / 168 74 44 | form states |

- **Dark room convention**: `.room-dark` re-declares the channel triplets *and*
  re-substitutes the composed `var()` tokens (the Archive room is walnut + ivory;
  dark accents: `--accent: 196 196 255`)
- Tailwind maps tokens to named utilities (`bg-bg`, `text-accent`, shadows `brass`,
  `azul`, `arch-ink`; eased timing tokens `out-expo` / `in-out-expo`)
- Type ramp: headings Archivo 800 / `-0.025em` tracking / `line-height 0.98`, text
  `text-wrap: balance`; mono for "conservation labels"; `font-feature-settings` kern+alternates

### The geometry library (`src/lib/geometry.ts` — 218 lines, zero deps)
- `starPoints` / `starPath` — regular 8-point star polygons (alternating radii)
- `starGlyph` — star as inline SVG data-URI
- `zelligeWallSvg` — tileable wall: two interlocked stars + brass seam grid
- `zelligeBandSvg` — woven star band (section separators)
- **Monogram**: `MONOGRAM_PATHS` — one A without a center line, arch top, whose
  negative space is a V; plus `monogramSolidPath` (plaque engraving variant)
- `rotateSquares` — star construction halves for WebGL
- `zelligePieces(onMobile)` — hero composition: central cobalt star (order 0),
  ring 1 eight teal/terracotta diamonds (r=3.05), ring 2 eight ivory squares
  (r=3.85, scale 0.62), ring 3 sixteen brass studs (r=4.75, scale 0.3) — mobile
  collapses to heart + one quiet ring
- `GLAZE_HEX` — hex map for the five glazes, each with a dark variant

---

## 5. The museum — rooms of the home page

`page.tsx` composes: **EntranceScene → Fountain → Workshop → LoomRoom → Collection →
Archive → ExitRoom**.

1. **ROOM 00 — THE ATRIUM** (`EntranceScene`): Zellige assembles in WebGL
   (staggered `order`), entrance title pinned top-left, scales to viewport.
2. **ROOM 01 — THE FOUNTAIN** (`Fountain`): founding story in four steps; seven
   workshop rules translated into engineering laws ("the grammar").
3. **ROOM 02 — THE WORKSHOP** (`Workshop`): four craft panels — Java Backend,
   TS·React·Next, DevOps & Security, WebGL & Motion (`capabilities.ts`).
4. **THE LOOM** (`LoomRoom` + `ZarbiaCanvas`, interlude): a Zarbia rug woven in
   WebGL. Scrolling walks four chapters — Material (macro wool), Craft (carpet
   hangs/bends), Culture (pattern becomes a map from above), Digital (wool
   dissolves into the museum's geometric field). Both rug faces drawn at init;
   camera choreography is a single scrubbed pose path. Latest commits made it a
   calm horizontal runner with a readable reading column.
5. **ROOM 03 — THE COLLECTION** (`Collection`): six accessions in an arcade
   (data in `projects.ts`), WISLA as flagship.
6. **ROOM 04 — THE ARCHIVE** (`Archive`): dark room — WISLA engineering notes,
   role matrix, frames.
7. **ROOM 05 — THE EXIT** (`ExitRoom`): visitors' book — "have an idea worth
   building?"

### The Collection — six projects (src/lib/data/projects.ts)
| # | Project | Year | Category | Glaze | Extras |
|---|---|---|---|---|---|
| INV. I | WISLA Platform | 2024 | Enterprise Application | cobalt | flagship (`featured`), role Backend Engineering, 3 challenges + metrics (19/20 grade), 8 screenshots |
| INV. II | Palais Amghass | 2025 | Hotel Experience | brass | live `palais-amghass.vercel.app`, og 2-image gallery, WebGL orbit room, "image budget for valley bandwidth" |
| INV. III | NextHobby | 2025 | Web Platform | teal | live `nexthobby.vercel.app`, 3-image gallery, rentals/payments |
| INV. IV | Auto-École Michlifen | 2026 | Local Business | terra | live, phone-first lead capture |
| INV. V | Azrou Design | 2026 | Business Web | cobalt | live studio portfolio |
| INV. VI | Le Sapin | 2026 | Local Business | ivory | live establishment site |

`getProject`, `getNextProject` (wrap-around next case study), `isFlagship`
helpers; detail page at `/work/[slug]` renders gallery with intrinsic
width/height (reserved space → no CLS), challenges/solutions, metrics, cover band.

### The two WebGL canvases (raw Three.js)
- `MosaicCanvas.tsx` (313 lines) — the hero Zellige installation
- `ZarbiaCanvas.tsx` (600 lines) — the Loom rug; two-side rendering, scrubbed
  pose path, dissolve into geometric field
- Both wrapped by `WebGLErrorBoundary` (flat CSS fallback on failure), quality
  tiering via `useQuality` (dpr + particle budgets per tier), WebGL feature
  detection, reduced-motion collapse

---

## 6. Contact pipeline (defense in depth)

`ContactForm.tsx` → `POST /api/contact`:

1. `validateEnv()` — throws in production if `RESEND_API_KEY`/`CONTACT_EMAIL` missing
2. `getClientIp(request)` — IP extraction (X-Forwarded-For aware)
3. **Rate limit** — `MemoryRateLimitStore` token bucket: 5 requests / 10 min per IP;
   `429` + `Retry-After` + `X-RateLimit-*` headers
4. JSON parse guarded (`400 INVALID_JSON`)
5. `sanitize()` every field (type coercion + max-length truncation)
6. **Honeypot**: hidden `website`/`phone` fields — bots silently get `200 success`
7. `validateContact()` — required fields, `EMAIL_RE` check, per-field error map
   (`400 VALIDATION_ERROR` with `fields`)
8. Send via Resend (`sendContactEmail`) — configured check; in dev it logs the
   submission and suggests `.env.local`; production returns `500 EMAIL_NOT_CONFIGURED`
9. Errors are logged with error codes, clients get safe copy (no internals leaked) —
   e.g. `EMAIL_SEND_FAILED` with the direct email as fallback
10. `mailto:` link fallback in the UI; client-side validation mirrors the server rules

Error envelope: `{ success:false, error:{ code, message, fields? } }`
Client form: full validation states, `--ok`/`--err` colors, I-beam cursor on
inputs (recent UX audit), 220 lines + tests.

Env files present: `.env.local` (Resend key `re_ZbjV3gJY…`, `CONTACT_EMAIL=kssakram92@gmail.com`),
`.env.example` (RESEND_API_KEY, CONTACT_EMAIL, GITHUB_TOKEN).

---

## 7. Security & performance

### Headers (next.config.mjs, applied to `/(.*)`)
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: camera/mic/geo/payment/usb all `()` blocked
- `Strict-Transport-Security`: 1y, includeSubDomains, preload
- **Production CSP**: `default-src 'self'`; `style-src`/`script-src` allow
  `'unsafe-inline'` (required by Next RSC runtime; noted in comments); `img-src
  'self' data: blob:`; `connect-src 'self'`; `frame-ancestors 'none'`;
  `form-action 'self'`; `object-src 'none'` — explicitly skipped in dev for HMR
- Image config: `formats: ['image/avif','image/webp']`, `qualities: [75, 82]`

### Performance & motion discipline
- Motion is **transform/opacity only**; `prefers-reduced-motion` collapses
  everything (`useReducedMotion`)
- Quality tiers: `useQuality` → `high/medium/low` (dpr + particle budgets) +
  `useMediaQuery` / `useIsTouch` for canvas complexity
- Image components with intrinsic dimensions (no CLS); AVIF/WebP negotiation;
  no blur-scroll rasterization (history: `bc3a683 perf` removed it)
- WebGL error boundary → static CSS fallback; canvas remounts eliminated
- History fix `4082c56`: WebGL isolation, availability handling, motion handling

---

## 8. SEO & metadata

- Canonical domain: **www.akramrihani.com** (history: `c40e99d` fixed
  `viaruq.dev` → www; `9089aac` pointed robots.txt sitemap at www)
- `sitemap.ts` (generated), `robots.txt`, `site.webmanifest`, `favicon.svg`
- OG image **generated in code** (`opengraph-image.tsx`) from the computed
  geometry — no raster OG asset (audit G–L fixed its 1200×630 dimensions)
- Full metadata block: OG/Twitter cards, keywords, `sameAs` (GitHub/LinkedIn/Instagram),
  `publisher/creator/authors`, `category: portfolio`
- Static PDF resume: `public/Akram-Rihani-CV.pdf`

---

## 9. Testing & CI

- **Vitest 4** (`vitest.config.ts`: `environment: 'node'`, globals, `@` alias,
  `vitest.setup.ts` mocks IntersectionObserver, `matchMedia`, `scrollTo`)
- **18 test files, 83 tests — all passing** (7.4s), covering: the API route
  (134-line test), ContactForm, all 7 home sections, RoomDirectory, WebGL error
  boundary, SmoothScroll, env, email, getClientIp, rateLimit, escapeHtml, contact
  validation
- **GitHub Actions** (`.github/workflows/ci.yml`): on push to `main` / PRs —
  checkout + Node 22 + `npm ci` → lint → typecheck → test → build; concurrency
  cancel-in-progress; injects `RESEND_API_KEY`/`CONTACT_EMAIL` secrets for build
- `vitest` v4 supports configLoader native warning: vitest.config.ts ESM-as-CJS
  notice (harmless today, noted by Vite as future default)

---

## 10. Recent work history (late commits)

| Commit | Change |
|---|---|
| `1e21902` | refactor: unify monogram — single A mark with upright V, drop keystone + floor line |
| `0be506c` | feat: loom — Zarbia becomes calm horizontal runner with readable reading column |
| `6141d2c` | feat: museum redesign — Zellige entrance, rooms, monogram branding; scale Zellige to viewport; pin entrance title top-left |
| `2a4eebf` | fix: UI/UX audit G–L — cover band ratio, back-button scroll restore, preloader persistence, minimum type size, og.png dimensions |
| `9d7c67a` | fix: UI/UX audit A–F — heading spacing, RM manifesto dead space, rail order, cursor affordances, heading levels, form I-beam |
| `de08b1c` | fix: 320px overflow — h1/h2 ramps, detail h1 cap + metrics grid, experience spacing |
| `970d437` | feat: upgrade to Next 16, React 19, R3F v9 — resolves high-severity audit advisories |
| `d63da6c` | fix: Selected Work cover entrance no longer zooms/shifts |
| `48c107a` | fix: manifesto readability floor |
| `26020d6` | fix: hide chapter rail on non-home routes |
| `4082c56` | fix: audit F1–F18 — availability, WebGL isolation, motion |
| `c40e99d` / `9089aac` | canonical domain + robots sitemap → www |
| `2b94428` | hardening pass — vitest suite, TS migration, security headers, a11y, perf |
| `9344a22` | **rebuild**: premium creative web experience (museum) — the big pivot |
| pre-`9344a22` | legacy two-mode site: password-gated Dev/Photography personas, mode context, lazy chunk loading, ParticleNetwork, glassmorphism, Embla carousel, MusicPlayer, stick-figure SVG animations |

---

## 11. Observations & notes

- `@react-three/fiber` and `@react-three/drei` are declared dependencies but
  never imported — raw Three.js is used everywhere; the dep could be removed
  (or is kept intentionally as the R3F v9 audit fix mentions).
- `GITHUB_TOKEN` remains in `.env.example` — legacy from the older dynamic
  GitHub-API integration (the `any`-cast commit `c85e51d`); now unused.
- `.env.local` contains a live Resend secret — **not committed** (gitignored).
- `tsconfig.tsbuildinfo` is present (incremental builds) though ignored.
- `RoomDirectory` (keyboard/chapter rail) renders only on home (fix `26020d6`,
  `77b5a87`).
- LEGACY leftovers in commit history (Embla, mode switching, Particles) are gone
  from `src/` — the tree is fully museum-era.
- No `prefers-color-scheme` dark mode — site is deliberately light-museum with
  the Archive's `.room-dark` exception.

---

## 12. Security hardening pass (2026-08-12)

Three of the five audit findings were addressed in code:

### #3 — Misconfigured deploys no longer crash opaquely
- `src/lib/env.ts` now exports `REQUIRED_VARS` and `missingEnvVars()`; the
  throw-in-prod contract is unchanged and still tested.
- `/api/contact` catches the misconfiguration and answers a structured
  **503 SERVICE_NOT_CONFIGURED** (with `Retry-After: 60` and a loud server
  log naming the missing vars) instead of an opaque 500 — covered by a new
  route test (suite now 84 tests).
- New `scripts/check-env.mjs` runs before `next build` (package.json): fails
  CI builds with a clear, actionable message when secrets are missing;
  warns and continues locally (does not read `.env.local` into the process).

### #4 — Strict CSP: attempted, blocked by the framework, documented
- A nonce-based middleware implementation was built and tested end-to-end
  (per-request nonce, `x-nonce` + CSP on request and response headers,
  force-dynamic probe page, production build + curl). Result: **zero nonce
  attributes land on any script** — Next 16.3.0 production SSR (Turbopack)
  never attaches the nonce (`vercel/next.js#93094`, still-open `#96063`),
  and nonces cannot be injected into statically prerendered pages anyway
  (per the official Next 16 CSP guide).
- Enforcing the nonce-only policy would block every script and blank the
  site. The middleware and probe page were therefore removed; the CSP
  remains the strict-by-construction policy in `next.config.mjs` with a
  comment citing the upstream issue and the revisit condition. All other
  hardening headers are unchanged and verified in production (`curl` check).

### #5 — Node version now has a single source of truth
- `.nvmrc` (Node 22, matching CI) added; CI reads it via
  `node-version-file`; `package.json` declares `engines.node: >=22`.
  Local Node 26 remains compatible; CI and deploy run the pinned LTS.

### #2 — Rate limiting is now shared across all instances (Upstash KV)
- New `src/lib/rateLimit/redisStore.ts`: a Redis-backed store over the
  Upstash REST API (`/pipeline` INCR+EXPIRE, `/TTL`) — zero new npm
  dependencies, 2s timeout, **fail-open** on Redis outage (warn + allow,
  never block real visitors).
- `RateLimitStore` contract became async (`check(key, limit, windowMs)`);
  the in-memory store is unchanged in behavior and stays the default.
  `getRateLimitStore()` picks Redis when it is configured, memory
  otherwise — the route calls `await checkRateLimit(ip, getRateLimitStore())`.
- Upstash credentials verified live against the real store in able-osprey
  (limit hit + retryAfter + cleanup); tests use a stubbed `fetch`.
  Suite: **20 files, 90 tests + 1 skipped integration (env-gated)**.
- `.env.local` / `.env.example` gained the five `UPSTASH_REDIS_KV_*` vars
  (REST URL + write token are the only ones the code reads); test runs
  force the memory store so the suite never touches the network.
- Design note: every request refreshes the TTL (activity-anchored window)
  — a blocked client keeps its own block alive by continuing to try.