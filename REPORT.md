# Project Report — Akram Rihani Portfolio ("The Moroccan Digital Museum of Software Craftsmanship")

Repository: `github.com/Syntaxri/portfolio` (remote `origin`, SSH)
Branch: `main` · Working tree: clean at report time
Author: Akram Rihani (Viaruq, `Syntaxri`)
Report date: 2026-08-12 · First commit: 2026-03-14 · Latest commit: 2026-08-12
Commit count: **85** · Single-author history
Production domain: **https://www.akramrihani.com** (canonical, www)

---

## 1. Executive summary

A creative-developer portfolio rebuilt as **"The Moroccan digital museum of software craftsmanship"** — one continuous scroll through seven numbered "rooms" (Atrium → Fountain → Workshop → The Loom → Collection → Archive → Exit), delivered as a Next.js 16 App Router site with **two bespoke raw-Three.js WebGL installations** (the hero Zellige "kiln" mosaic and the Zarbia loom runner). Every piece of Zellige geometry — stars, walls, bands, the monogram, even the OpenGraph card — is **computed in code and never shipped as an image** (`src/lib/geometry.ts`, zero dependencies).

A hardening pipeline stands between every commit and the door: ESLint, `tsc --noEmit`, a 21-file Vitest suite (**108 tests — 107 passing, 1 failing at report time**, see §17), and a production build, all enforced by GitHub Actions CI on push to `main` and on PRs.

The museum is intentionally *interactive, not just animated*: the Zellige fires a new deterministic pattern when double-clicked ("the kiln"), the Archive is read by a cursor-following vault lamp, an ambient sound engine follows the visitor room to room (synthesized in Web Audio, zero audio files), the Loom pulses the phone's haptics as pattern segments lock, a conservation console (Ctrl+Shift+K) reports live FPS / draw calls / GPU truthfully, and typing `minttea` opens the curator's private notes.

Previous iteration (pre-rebuild): a two-mode "mode" site with password-gated Developer/Photography personas, glassmorphism, ParticleNetwork, Embla carousel and a music player — fully replaced by the museum concept (rebuild commit `9344a22`, ~10k insertions / ~5.2k deletions), and the legacy code is entirely gone from `src/`.

---

## 2. Repository & history

### 2.1 Complete commit log (85 commits, oldest → newest)

**Legacy era — the two-mode site (2026-03-14 → 2026-06-28)

| Commit | Date | Subject |
|---|---|---|
| `a4c8cb4` | 03-14 | recovered after filesystem corruption (first commit) |
| `547c3f6` | 03-14 | Mode switching — `ModeSwitcher.js` pill |
| `47fdf24` | 03-14 | Layout gate — three render states, `ModeSelector` |
| `43f7320` | 03-14 | Dynamic homepage — `<DevHero>` / `<PhotoHero>` from mode context |
| `3ae3d16` | 03-14 | layout pop up |
| `e26189e` | 03-15 | Storage validation — `readPersistedMode()`, try/catch, `VALID_MODES` |
| `b23617b` | 03-15 | Seamless switching — two-click confirm, 2.5s auto-reset, Escape cancels |
| `ddcc049` | 03-15 | Navigation updates — Navbar/RightNav read `content?.nav` |
| `f760bca` | 03-15 | Lazy loading per mode — `next/dynamic` chunks, `ssr: false` |
| `7029483` | 03-15 | Add: PhotoSection and DevSection |
| `68c86cd` | 03-15 | fix: Layout — sections appear on Home |
| `f4ed5d7` | 03-16 | Password modal for Dev → Photo switching |
| `80c1e90` | 03-16 | fix: Photography mode protected at two layers |
| `1e41b7d` | 03-16 | Inline switching — `PasswordModal.js` + `ModeSwitcher.js` |
| `8456653` | 03-16 | fix: photo-first selection verified flag |
| `17fd970` | 03-17 | Add: contact form |
| `b7e9f73` | 03-17 | fix: API route — named exports (POST/GET/PUT/DELETE), Web-standard Request/Response |
| `8b34e18` | 03-18 | globals.css — merged navy variables + accent |
| `1dc42c5` | 03-18 | modeContent.js — developer theme matched |
| `69efc0a` | 03-18 | fix: three bugs in MobileMenu rewrite |
| `c3c6ffb` | 03-18 | update: colors of the pop-up page |
| `bf9cf7e` | 03-19 | loader once per session |
| `ce13a75` | 03-19 | Add: loading page |
| `bb283d7` | 03-19 | fix: loading page bug |
| `4ef3649` | 03-19 | Add: `.env.local` with a Resend API key |
| `49a24cc` | 03-19 | fix: route.js API error |
| `c9a01ce` | 03-19 | fix: new email added |
| `930b98b` | 03-19 | fix |
| `dda84bd` | 03-20 | fix: password gate on small screens |
| `1a3ad9a` | 03-20 | Motion design system — timing-token CSS variables |
| `9229992` | 03-20 | 3D tilt effect + animated progress bars |
| `0666217` | 03-20 | DevSection — project grid with `<Stagger>` |
| `fa2981d` | 03-20 | footer social icons bounce-in keyframes (0.35/0.45/0.55s, `cubic-bezier(0.34,1.56,0.64,1)`) |
| `e2ba73b` | 03-20 | — |
| `e236796` | 03-20 | orange dots follow cursor, 18px spacing, 500ms fade |
| `83958a6` | 03-20 | switching state → loader + router navigation |
| `88b8b95` | 03-20 | Tech Stack Carousel |
| `ef6c046` | 03-21 | 26 skills across 2 rows |
| `478082e` | 03-21 | fix: carousel |
| `8ebfb28` | 03-21 | fix: carousel hover issue |
| `7fb290b` | 03-22 | DevGuy — SVG stick figure on the B of "Build things" |
| `d899e33` | 03-22 | PhotoGuy — stick figure on the C of "Capture moments" |
| `6d09849` | 03-23 | fix: path |
| `59d8941` | 03-24 | global `<Head>` favicon + meta |
| `50e1bfc` | 03-24 | fix: favicon |
| `7324326` | 03-24 | update: Instagram links |
| `58b12ae` | 03-25 | fix: builder guy removed |
| `9c58cea` | 03-25 | full Embla carousel replaces DevSection grid |
| `07f265f` | 03-25 | redeploy |
| `f0cc811` | 03-25 | fix dependencies |
| `378c3e5` | 03-28 | profile card in hero |
| `c839176` | 03-28 | responsive card, `floatAnimation` pause near navbar, `theme` prop |
| `ff2693e` | 06-22 | glassmorphism system foundation |
| `e5c33c2` | 06-28 | UI/UX redesign + projects section update |
| `c37347c` | 06-28 | CONTACT_EMAIL updated for test sends |
| `c85e51d` | 06-28 | GitHub dynamic API — `any` cast, size → distinct_size → commits?.length fallback |
| `bbc2497` | 06-28 | centered pill-shaped dock replaces full-width bottom bar |

**Museum era (2026-08-08 → 2026-08-12)**

| Commit | Date | Subject |
|---|---|---|
| `9344a22` | 08-08 | **The rebuild** — portfolio as a premium creative web experience (the museum concept) |
| `3ffe3ae` | 08-08 | art-direction pass + Palais Amghass project + real screenshots |
| `bc3a683` | 08-08 | perf: eliminate scroll-time blur rasterization and canvas remounts |
| `c7fa464` | 08-08 | manifesto visibility, preloader counter, resume link |
| `1e36bc6` | 08-08 | manifesto fills the viewport |
| `5b682a6` | 08-08 | cover gradient hugs the frame bottom |
| `77b5a87` | 08-08 | chapter rail only on home |
| `2b94428` | 08-08 | hardening pass — vitest suite, TS migration, security headers, a11y, perf |
| `c40e99d` | 08-08 | canonical domain → www.akramrihani.com |
| `9089aac` | 08-08 | robots.txt sitemap → www |
| `4082c56` | 08-08 | audit findings F1–F18 — availability, WebGL isolation, motion |
| `26020d6` | 08-08 | hide chapter rail on non-home routes |
| `48c107a` | 08-08 | manifesto readability floor |
| `d63da6c` | 08-08 | Selected Work cover no zoom/shift on entrance |
| `970d437` | 08-09 | **Next 16 + React 19 + R3F v9 upgrade** — resolves high-severity audit advisories |
| `de08b1c` | 08-09 | 320px overflow — type ramps, detail h1 cap, metrics grid, experience spacing |
| `9d7c67a` | 08-10 | UI/UX audit A–F — heading spacing, manifesto dead space, rail order, cursor affordances, heading levels, form I-beam |
| `2a4eebf` | 08-11 | UI/UX audit G–L — cover band ratio, back-button scroll restore, preloader persistence, minimum type size, OG dimensions |
| `6141d2c` | 08-12 | museum redesign — Zellige mandala entrance, rooms, monogram branding; viewport-scaled mandala; pinned entrance title |
| `0be506c` | 08-12 | loom — Zarbia becomes a calm horizontal runner with a readable reading column |
| `1e21902` | 08-12 | refactor: unified monogram — single A mark with upright V |
| `8ffd0fa` | 08-12 | hardening pass — Upstash rate limiting, env fail-fast, CSP prod guard, Node 22 pin |
| `f7d02c2` | 08-12 | **interactive museum** — living mandala kiln, archive vault lamp, conservation console, curator's key, ambience, tactile loom |
| `ae69c64` | 08-12 | rename mandala → zellige; entrance hints before scroll; simplified preloader door; akramlogo favicon |
| `3b41b01` | 08-12 | preloader door builds 21-star ring sweeping from one start; logo nudged up 10% |
| `d3a791f` | 08-12 | fix: fresh loads land on the header; door flag cleared for late preloader visits |

### 2.2 Epochs in the tree

- **Pre-rebuild (`a4c8cb4` → `bbc2497`)**: Pages-Router-era `.js` components (`ModeContext`, `PasswordModal`, `DevSection`, `PhotoSection`, `ParticleNetwork`, `MusicPlayer`, Embla, glassmorphism tokens). All removed from `src/` during `9344a22`.
- **Rebuild (`9344a22`)**: the entire museum concept landed in one commit (~10k insertions / ~5.2k deletions).
- **Museum era**: continuous refinement, audits, hardening, and the interactive layer — today's tree is 100% museum-era.

---

## 3. Tech stack

### 3.1 Dependencies (package.json)

| Package | Version | Purpose | Used? |
|---|---|---|---|
| `next` | ^16.3.0 | App Router framework, RSC, metadata API | yes |
| `react` / `react-dom` | ^19.2.8 | UI runtime | yes |
| `three` | ^0.185.1 | Raw WebGL scenes (**no R3F anywhere in `src/`**) | yes (MosaicCanvas, ZarbiaCanvas) |
| `@react-three/fiber` | ^9.7.0 | declared | **never imported** |
| `@react-three/drei` | ^10.7.8 | declared | **never imported** |
| `gsap` | ^3.15.0 | ScrollTrigger choreography, tweens | yes |
| `lenis` | ^1.3.26 | smooth scrolling | yes |
| `resend` | ^4.0.0 | contact-form email delivery | yes (`src/lib/email/`) |

### 3.2 Dev dependencies

`eslint` ^9.39.5 + `eslint-config-next` ^16.3.0 (core-web-vitals), `typescript` ^6.0.3, `tailwindcss` ^3.4.19, `postcss` ^8.5.26 (+ `autoprefixer` ^10.5.0), `prettier` ^3.9.6, `vitest` ^4.1.10, `@testing-library/react` ^16.3.2 + `jest-dom` ^7 + `user-event` ^14.6.3, `jsdom` ^30.0.1, `@vitejs/plugin-react` ^6.0.5, `@types/node` ^26.0.1, `@types/react` ^19.2.18, `@types/react-dom` ^19.2.4, `@types/three` ^0.185.4.
Plus `overrides: { postcss: ^8.5.26 }` and `engines.node: ">=22"`.

### 3.3 Tooling & conventions

- Node **22** (`.nvmrc` — the single source of truth; CI reads it via `node-version-file`). Local machine runs Node 26.
- `@/*` path alias → `src/*` (tsconfig, vitest, next).
- Prettier (`.prettierrc.json`): **no semicolons, single quotes, printWidth 110, es5 trailing commas**.
- ESLint: `eslint-config-next/core-web-vitals`; global ignores `.next/**`, `out/**`, `coverage/**`, `**/*.tsbuildinfo`, `public/**`, `next-env.d.ts`.
- tsconfig: `strict`, `target es2017`, `module esnext` / `moduleResolution bundler`, `jsx react-jsx`, `incremental` (produces `tsconfig.tsbuildinfo`, gitignored), Next plugin.
- JetBrains IDE config checked in (`.idea/`).
- `.gitignore`: node_modules, `.next/`, `out/`, `.env*` (opt-in per file), `.vercel`, `*.tsbuildinfo`, `next-env.d.ts`, coverage, build, debug logs, `.DS_Store`, `*.pem`.

### 3.4 Commands

```bash
npm run dev          # next dev
npm run build        # node scripts/check-env.mjs && next build   (fail-fast env gate)
npm run start        # next start
npm run lint         # eslint .
npm run typecheck    # tsc --noEmit
npm test             # vitest run     → 21 files / 108 tests (see §17)
npm run test:watch   # vitest
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

---

## 4. Architecture

### 4.1 Route map (`src/app`)

| Route | File | Purpose |
|---|---|---|
| `/` | `page.tsx` | The museum — `EntranceScene → Fountain → Workshop → LoomRoom → Collection → Archive → ExitRoom` composed in sequence |
| `/work` | `work/page.tsx` | `redirect('/#collection')` — the arcade is on the home scroll |
| `/work/[slug]` | `work/[slug]/page.tsx` | Case-study "exhibit room"; `generateStaticParams()` from `projects`, `dynamicParams = false`, per-project `generateMetadata` |
| `/about` | `about/page.tsx` | `redirect('/#courtyard')` |
| `/contact` | `contact/page.tsx` | `redirect('/#exit')` |
| `/api/contact` | `api/contact/route.ts` | POST endpoint (+ explicit 405 for GET/PUT/DELETE) |
| — | `error.tsx` | root error boundary ("One of the tiles fell off", digest shown, reset button) |
| — | `not-found.tsx` | 404 ("Room — unnumbered", outlined 404 display type) |
| — | `sitemap.ts` | generated sitemap (home weekly 1.0 + six project pages monthly 0.7) |
| — | `opengraph-image.tsx` | generated OG image 1200×630, edge runtime, computed geometry (no raster asset) |
| — | `site.webmanifest` | PWA manifest (also duplicated in `public/`) |

Redirect routes keep legacy URLs (and any deep link) functional while the museum lives on one scroll.

### 4.2 Directory map (`src/`, 8,435 lines of code across ts/tsx/css)

```
src/
├── app/                     routes above + globals.css (750 lines, design system v5)
├── components/
│   ├── animations/          SmoothScroll (Lenis provider), CustomCursor, Magnetic,
│   │                        PageTransition, Preloader (the door)
│   ├── chrome/              Topbar, Footer, AmbienceControl, CraftDashboard
│   │                        (conservation console), CuratorsKey, StabilityFactory
│   ├── forms/               ContactForm, WaxSeal
│   ├── museum/              Room + RoomDoor, RoomDirectory (chapter rail),
│   │                        Monogram, Reveal + RevealItem, ZelligeBand
│   ├── projects/            ExhibitCover (arch frame + procedural fallback cover)
│   ├── sections/home/       EntranceScene, Fountain, Workshop, LoomRoom,
│   │                        Collection, Archive, VaultLight, ExitRoom
│   └── three/               MosaicCanvas (431 lines), ZarbiaCanvas (613 lines),
│                            WebGLErrorBoundary
├── config/                  contact.ts — rate limit + field-length constants
├── hooks/                   useQuality (high/medium/low), useMediaQuery, useIsTouch,
│                            useReducedMotion
├── lib/
│   ├── animations/          scrollState.ts — mutable Lenis↔WebGL scroll bridge (not React state)
│   ├── data/                site.ts, capabilities.ts (4 crafts + 7-rule grammar),
│   │                        projects.ts (six accessions)
│   ├── email/               index.ts — Resend client wrapper, typed error codes
│   ├── fx/                  museumState.ts (glRegistry + room observer + museumState),
│   │                        ambience.ts (Web Audio engine), interactions (test-only at the moment)
│   ├── network/             getClientIp.ts
│   ├── rateLimit/           index.ts (MemoryRateLimitStore, store selection),
│   │                        redisStore.ts (Upstash KV REST adapter)
│   ├── security/            escapeHtml.ts
│   ├── validation/          contact.ts (sanitize + validateContact + EMAIL_RE)
│   ├── env.ts               REQUIRED_VARS, validateEnv, isResendConfigured, getters
│   └── geometry.ts          the Zellige "craft dictionary" — 244 lines, zero deps
└── types/                   index.ts (Project/Challenge/PerfMetric/GalleryImage/Glaze),
                             css.d.ts (window.__entranceReady + css module decls)
```

### 4.3 Root layout (`layout.tsx`)

- Three Google fonts **self-hosted via `next/font/google`** (`display: swap`): **Archivo** (`--font-sans`), **Fraunces** normal+italic (`--font-serif`), **Space Mono** 400/700 (`--font-mono`).
- Body: `no-cursor` class (custom cursor owns the pointer), `suppressHydrationWarning`.
- Composition order inside `SmoothScrollProvider`: `StabilityFactory` → `Topbar` → `<main id="main" tabIndex={-1}>` (skip-target) → `Footer` → `RoomDirectory` → `.grain` overlay → `CustomCursor` → `Preloader` → `PageTransition` → `CraftDashboard` → `CuratorsKey`.
- `viewport`: themeColor `#eae4d4`, `colorScheme: light`, `maximumScale: 5`.
- `metadata`: title template `%s · Akram Rihani`, default title `Akram Rihani — The Museum of Software Craftsmanship`, description = `site.strapline`, 13 keywords, `category: portfolio`, canonical `/` with `metadataBase` www, OG (`/opengraph-image`, 1200×630) and Twitter `summary_large_image` cards, robots `index/follow` + googleBot `max-snippet: -1`, `max-image-preview: large`, `max-video-preview: -1`, `sameAs` JSON string (GitHub/LinkedIn/Instagram), `og:image:alt`.
- `icons`: `/akramlogo.png` (any size) + apple-touch-icon.

---

## 5. Design system v5 — "Dar El Zellij, the museum at dawn"

Defined wholly in `src/app/globals.css` (750 lines), wired to Tailwind through `tailwind.config.mjs`.

### 5.1 Palette (RGB channel triplets → Tailwind `<alpha-value>` compatible)

| Token | Triplet | Meaning |
|---|---|---|
| `--bg` | 238 232 218 | lime plaster |
| `--bg-2` | 230 223 207 | plaster in shadow |
| `--surface` | 247 243 234 | paper / tadelakt highlight |
| `--text` | 28 26 22 | ink |
| `--text-2` | 82 76 65 | muted ink |
| `--text-3` | 111 102 86 | faint ink |
| `--accent` | 30 64 130 | Fes-cobalt glaze |
| `--accent-2` | 140 102 52 | aged brass |
| `--gold` | 168 122 54 | gold |
| `--emerald` | 21 105 92 | mint glaze |
| `--terra` | 170 82 38 | terracotta glaze |
| `--ivory` | 233 227 212 | ivory |
| `--walnut` | 27 23 18 | walnut |
| `--ok` / `--err` | 21 105 92 / 168 74 44 | form states |

Composed tokens (`--bg: rgb(var(--bg-rgb))` …) let every `var()` consumer follow the room.
**Dark-room convention**: `.room-dark` re-declares the channel triplets *and re-substitutes the composed tokens* (CSS custom properties resolve `var()` at declaration site — the comment explains the double substitution is required). Archive overrides: `--accent` becomes 196 196 255 (periwinkle glaze), `--accent-2` 197 149 76, `--gold` 205 160 88, `--ok` 108 178 148, plus walnut/ivory swap of all surfaces.

### 5.2 Tailwind mapping

- Colors: `bg, bg-2, surface, text, text-2, text-3, accent, gold, emerald, terra, ivory, walnut, ok, err` — all `rgb(var(--x-rgb) / <alpha-value>)`.
- Font families: `sans/mono/serif/display` → CSS vars.
- Shadows: `brass` (0 4px 26px rgba(140,102,52,.22)), `azul` (0 4px 26px rgba(30,64,130,.2)), `arch-ink` (0 24px 60px -30px rgba(50,40,20,.5)).
- Easing tokens: `out-expo` / `in-out-expo` → `--ease-out-expo: cubic-bezier(0.16,1,0.3,1)` / `--ease-in-out-expo: cubic-bezier(0.87,0,0.13,1)`.
- `--nav-h: 4rem`.

### 5.3 Typography ramp (utilities)

- `display-title`: Archivo 800, `clamp(3rem, 9vw, 7.75rem)`, line-height .94, `-0.04em`, `font-variation-settings 'wdth' 112`.
- `room-title`: `clamp(2rem, 4.6vw, 3.9rem)`, lh 1, `-0.03em`.
- `exhibit-title`: 700, `clamp(1.6rem, 3.4vw, 3rem)`, lh 1.02.
- `lede`: Fraunces, `clamp(1.25rem, 2.2vw, 1.85rem)`, lh 1.35, `'opsz' 60`.
- `label`: Space Mono 0.65rem, `0.2em` tracking, uppercase, `--text-2` (variants `label-muted`, `label-accent`).
- Base: headings 800 / `-0.025em` / lh .98 / `text-wrap: balance`; body `font-feature-settings: 'kern' 1, 'cv02' 1, 'ss01' 1`; `text-outline` (transparent color + 1.5px stroke); `.serif` / `.serif-italic`; scrollbars styled thin.

### 5.4 Component classes

- `.btn` / `.btn-ghost`: brass-filled / ink-ghost mono buttons (0.68rem, 0.14em tracking); hover lifts 1px, brass → cobalt.
- `.plaque` / `.plaque-accent`: museum label boxes.
- `.tile-tag`: glazed skill stamps with an inline **SVG star bullet** (data-URI, cobalt — the dark room swaps it to periwinkle).
- `.arch-frame`: the horseshoe arch (`border-radius: 50% 50% 0.7rem 0.7rem / 135% 135% ...`), inner brass inset ring via `::after`, morphs to a rectangle on hover; transition disabled under reduced motion.
- `.zellige-wall`: CSS-only tileable star grid behind content (data-URI, 96px tile; dark variant swaps ink colors).
- `.mashrabiya`: blurred carved-screen shadow pattern (140px tile, blur 14px).
- `.grain`: fixed plaster-noise SVG turbulence overlay, `opacity: .028`, z-90, pointer-events none.
- `.ping-dot`: availability dot with exponential ping ring.
- `.rv-ready/.rv-in/.rv-done`: Reveal house transitions (translateY 26px → 0, 0.7s out-expo; reduced motion → instant).
- `.wax-seal`: radial wax gradients + `wax-stamp` stamps animation + `wax-ring` ring pulse.
- `.zellige-band`: living band — 9s linear light-drift sheen, hover-triggered ripple.
- `.mosaic-fallback`: hero WebGL fallback — three soft radial gradients (cobalt/emerald/terra).
- `.no-cursor`: hides native cursor except over `input/textarea` (which stay I-beam); restored automatically on `pointer: coarse` devices.
- `.loom-card`: fades up when a chapter turns.
- Keyframes: `spin` (80s fountain), `ping`, `caret-blink`, `wax-stamp`, `wax-ring`, `band-drift`, `band-ripple`, `loom-card-in`.
- Global reduced-motion kill-switch: `* { animation-duration: .01ms !important; transition-duration: .01ms !important }` + `scroll-behavior: auto`.

---

## 6. The geometry library (`src/lib/geometry.ts` — 244 lines, zero dependencies)

The single source of truth for every star, wall, band, and the monogram — consumed by SVG, CSS data-URIs, the OpenGraph card, the hero WebGL and the preloader door.

| Export | Detail |
|---|---|
| `starPoints(outer, inner, points=8, phase=-π/2)` | alternating-radius star polygon vertices |
| `starPath(cx, cy, outer, inner, points)` | SVG path string, 3-decimal precision |
| `starGlyph(size=10, fill, stroke)` | single-star SVG string for data-URIs |
| `zelligeWallSvg(size=96, ink)` | tileable wall: interlocked 8-point stars (one rotated 22.5° — "the two squares" grammar) + brass seams `rgba(140,102,52,0.07)` |
| `zelligeBandSvg(count, tile, colors)` | woven separator band, 6-color fallback palette (`#C4A05C #E6DFCA #2E5F87 #15695C #AA5226 #E6DFCA`) |
| `MONOGRAM_PATHS` | the mark: `arch` `M8 88 C8 42 36 12 50 12 C64 12 92 42 92 88` + `vLeft` `M33 30 L50 83` + `vRight` `M67 30 L50 83` — one A cut from an arch whose negative space is a **V** (refactor `1e21902` dropped the old keystone + floor line) |
| `monogramSolidPath(w, h)` | solid arch wedge for plaque engraving |
| `rotateSquares(size)` | `[size*0.52, size*0.28]` — the two-square construction halves used by WebGL |
| `mulberry32(seed)` | deterministic PRNG — same seed, same stream everywhere (SSR, WebGL, tests) |
| `zelligePieces(onMobile, seed)` | the hero composition as data: central cobalt star (order 0); **desktop** — ring 1: eight teal/terracotta diamonds (r 3.05, staggered `1 + i*0.3`), ring 2: eight ivory squares (r 3.85, scale 0.62, `3 + i*0.25`), ring 3: sixteen brass studs (r 4.75, scale 0.3, `5 + i*0.12`, every 3rd→cobalt); **mobile** — heart + one diamond ring (r 3.05) + one ivory ring (r 3.95, scale 0.55). `order` drives the staggered assembly |
| `GLAZE_HEX` | the five glazes + `Dark` variants (`#1e4082/#122c5c`, `#15695c/#0c453d`, `#aa5226/#77361a`, `#f4efe2/#dcd5c0`, `#8c6634/#5f4523`) |

**The kiln seed system (`zelligePieces` seed param)**: seed 0 is the canonical first firing (byte-identical composition); any other seed rotates the whole composition by a quarter-star step, shifts the glaze phase, varies the stud "motive" (every 3rd / every 4th / every 5th), and adds jitter (±0.1–0.2 radius, ±0.05 scale, ±16° stud rotation) — rings never cross radii, glazes stay in the kiln palette, the central star is always the lock.

---

## 7. The museum — room-by-room

`page.tsx`: **EntranceScene → Fountain → Workshop → LoomRoom → Collection → Archive → ExitRoom**. Every `Room` (via `Room.tsx`) is a `<section id={...}>` with the numbered door plate (`RoomDoor`): `label-accent "Room 0X"` + brass rule + `room-title` + Fraunces catalogue line.

### 7.1 ROOM 00 — THE ATRIUM (`EntranceScene.tsx`)

- Full-viewport section with `zellige-wall` + `mashrabiya` layers; the WebGL MosaicCanvas is **dynamically imported, `ssr: false`**, wrapped in `WebGLErrorBoundary`; the `.mosaic-fallback` gradients sit underneath and take over if GL fails (`glFailed`).
- **Entrance choreography coordination with the door**: the hero listens for `ar:entrance-ready` (preloader began) and `ar:door-lift` (door lifted). If no door is playing it enters after a 1150 ms settle; if a door is playing it waits for lift with a 7000 ms cap (covers background tabs / throttled frames). A stale `window.__entranceReady` flag no longer deadlocks the entrance (fix `d3a791f`).
- On entry: `data-hero-reveal` elements rise (1s power3.out, stagger 0.09) and `no-cursor` is set.
- Scrolling grinds the hero content (yPercent -14, opacity → 0.25, scrub, `top top → bottom 30%`).
- Content: Room-00 label + monogram (top-left, pinned), `Scroll — the zellige unlocks` hint, `Double-click the zellige — the kiln fires a new pattern` hint (only while GL lives), bottom-right `{name} × {nickname} — {year}`.

### 7.2 ROOM 01 — THE FOUNTAIN (`Fountain.tsx`)

- Left column: **the founding story in four steps** — 01 Curiosity / 02 Engineering / 03 Projects / 04 Products (Fraunces lines), each on a hairline rule with `Reveal` stagger 0.14.
- Availability card (`.ping-dot` + `site.availability` = "Open for freelance"): "Concept → architecture → development → experience → deployment. One person carrying the whole build…".
- Right column (sticky top-28): `FountainArt` — 24 stars on a 80 s rotating ring (`spin-slow`), palette `#1e4082 #15695c #aa5226 #e9e2cf #8c6634`, ivory hub with brass circle + cobalt center star, overlaid "Founded in Azrou · Kiln 2020 — present".
- **THE GRAMMAR** — seven workshop rules → engineering laws (`capabilities.ts`): Geometry→Architecture, Modularity→Components, Repetition→Systems, Symmetry→Consistency, Hierarchy→Information, Precision→Correctness, Patience→Craft; each card has number, star icon, engineering label in accent, note.
- Closed by a `ZelligeBand` (72 tiles × 12px, muted).

### 7.3 ROOM 02 — THE WORKSHOP (`Workshop.tsx`)

Four craft panels as "cedar doors" (`crafts` data): **Craft I Java Backend** (cobalt) — Spring Boot, Spring Security, RBAC, JPA, MySQL, REST; **Craft II TS·React·Next** (teal) — RSC, Tailwind, Accessibility, Performance; **Craft III DevOps & Security** (terra) — Linux, Git, CI/CD, Deployment, Auth, Security, Monitoring; **Craft IV WebGL & Motion** (brass) — Three.js, React Three Fiber (named in the skills list despite R3F being unused in this repo), GSAP, ScrollTrigger, Lenis, WebGL. Each: index numeral + star that rotates 22.5° on hover, glaze-colored `--glaze` CSS var, skills as `tile-tag`s, serif "plate" line over a glaze-tinted rule.

### 7.4 THE LOOM — the interlude (`LoomRoom.tsx` + `ZarbiaCanvas.tsx`)

- A 420vh scroll tunnel with a sticky `100svh` compose: the rug hangs as a backdrop; **desktop** shows a paper reading column (left, inset to `max(1.5rem, (100vw−80rem)/2+1.5rem)`) while **mobile** shows one `loom-card` per chapter (keyed remount → entrance animation) or, in static view (reduced motion / GL failed), all four chapters static.
- Chapters (renamed from README's "Digital" to **Departure**): 01 Material — "Close to the wool…"; 02 Craft — "The whole Zarbia at once…"; 03 Culture — "The weave holds its geometry at every distance…"; 04 Departure — "The runner stays behind as you walk on…". `aria-current="step"` on the active chapter.
- GSAP `timeline` with `scrub: 0.5`, `start 'top top' / end 'bottom bottom'`, tweening a ref-only `ZarbiaControl.p` 0→1 (no React renders per scroll frame); `museumState.weave` published for the console.
- **Haptics**: `weavePulse(step)` — 24 ms pulse when `step % 16 === 0` (a quarter of the 64-step runner locks), else 7 ms; throttled to one pulse / 90 ms shared module-wide (`museumState.lastPulseAt`), only when `navigator.vibrate` exists.
- `staticView = reduced || glFailed` swaps to `.mosaic-fallback` + static chapters.

### 7.5 ROOM 03 — THE COLLECTION (`Collection.tsx`, data in `projects.ts`)

The arcade in three tiers:

1. **Flagship** (WISLA, `isFlagship`): full-width 7/5 grid, `ExhibitCover` with `priority`, "Flagship accession" plaque, description, first six tags, `data-cursor="exhibit"` brass CTA "Enter the exhibit ↗".
2. **Featured arcade** (Palais Amghass, NextHobby): alternating-order rows, `btn-ghost` "Read the case study →" + "Live ↗" external links.
3. **The shelves** (Auto-École Michlifen, Azrou Design, Le Sapin — live client builds): 3-col grid of covers + titles.

### 7.6 ROOM 04 — THE ARCHIVE (`Archive.tsx` + `VaultLight.tsx`)

The dark room (`dark`, `room-dark`, `bg-walnut`):
- `VaultLight` — the visitor carries a lamp: one 340px radial-gradient disc whose **shadow is a single `box-shadow 0 0 0 220vmax`** (GPU-composited, zero repaints while following the pointer; lerp factor `0.13*1.8`, rAF loop). Idle-patrols after 2.6 s of pointer silence (Lissajous circuit ±30% × ±24% viewport); follows `focusin/focusout` for keyboard visitors; coarse pointers settle it over the first reading column; fully absent under reduced motion. A second `rgba(8,6,4,0.34)` veil adds depth.
- Copy: "The deep exhibit" — WISLA longDescription as `lede`; **field notes** = the three challenges with brass border-l solutions; **"One platform, three keys to the door"** role matrix (Company / Faculty / Student rows, star icons, connector line, brass accents); **ledger** of four metrics; **"Frames from the field"** — four WISLA screenshots in `arch-frame`s with captions ("The student room, in light mode", "The same museum, after dark"…).
- `role="list"` semantics and `aria-current` used on the loom; VaultLight is `aria-hidden` with a visible-but-contrasted fallback label column.

### 7.7 ROOM 05 — THE EXIT (`ExitRoom.tsx`)

- Display headline "Have an idea worth building?", Fraunces lede "Let's turn it into something *real*."
- The visitors' book card (`bg-surface`, cobalt border) hosting `ContactForm`, beside "Or find the keeper directly" socials list + mailto + closing serif para.
- Closing band (bordered top): Monogram, "The exhibition has ended — the door stays open.", `Write to the keeper ↗` button, final `ZelligeBand`.

---

## 8. The two WebGL canvases (raw Three.js)

### 8.1 `MosaicCanvas.tsx` — the entrance kiln (431 lines)

- **Quality tiering** (`detectTier`): coarse pointer → dpr ≤1.5; ≤4 hardware threads → dpr ≤1.5; else ≤2.
- Extruded geometry (all beveled: `bevelThickness 0.035/0.03`, `bevelSegments 1`) — `starGeometry` (8-point star from `starPoints`), `diamondGeometry`, `squareGeometry`.
- Scene: `PerspectiveCamera(42, z=16.9)`; three lights — warm `0xffe8c8` 2.1 directional, azul `0x8fb0ff` 0.9 from below-left, `0xfff6e6` ambient 0.85.
- **Layer discipline**: `layerZ()` assigns exclusive depth bands (star 0.50, diamonds 0, studs 0.34, squares 0.18) so coplanar z-fighting can never occur; the comment documents exactly why (identical depths + overlapping XY = depth-buffer striping).
- Assembls all 33 pieces (staggered `0.5 + order*0.14`, duration 1.05, expo ease), then the composition **lives**: settled pieces float (`sin(t*0.7+phase)*drift`), lean toward the pointer, the star grows (scale +0.07 max), warms (color lerps 22% toward `#fff8ea`, emissive 0.12→0.47), and rotates with inertia (`rotVel` spring, `dt*8` / `dt*2.6` damping).
- **Scroll breakup**: scroll 0→1.25 × viewport powering root roll (`rotation.z 0.16`), drift, scale to 0.72, depth push; pointer pitch/yaw deliberately tiny (`y 0.028`, `x 0.02`) — the inline comment proves why larger angles would cross the z-band gaps.
- **The kiln**: double-click / double-tap (<480 ms, <80 px apart) / Enter / Space on the canvas fires `build(randomSeed)` — capsule rebuilt, glazes re-shuffled, geometry disposed cleanly (`disposePieces` disposes geometry + materials); 700 ms debounce; `museumState.regens++` and seed published.
- Visor: IntersectionObserver with 15% rootMargin pauses everything offscreen; `renderer.info` draw calls + triangles and the lazily-read GPU string (via `WEBGL_debug_renderer_info`, SwiftShader-filtered by the console later) are pushed into `glRegistry`.
- Canvas is a focusable, labelled `role="img"` with keyboard firing.

### 8.2 `ZarbiaCanvas.tsx` — the loom runner (613 lines)

- A 1536×1024 **Atlas Zarbia drawn onto two offscreen canvases at init** — the color face (`PAL`: crimson `#b71f2e`, ivory `#e9dec0`, royal `#22418c`, navy, olive, rust) and a monochrome pile map (`PILE` grays) as bump source. Painted by `rugPaint()`: deep crimson field, ivory fringe (520 strokes), natural-wool ivory band with 900 fibre flecks, blue border with zigzags on all four sides, 68 marching tribal diamonds + rust/olive accents, navy triangle teeth (66+66), corner "weaver's signatures", and the medallion — a compact Berber lozenge (ivory/blue/red/navy nested rhombi with tribal marks above/below/side).
- **The pile**: 20,000 `fiberStroke`s on the wool face, 16,000 on the pile map — "no texture file was ever shipped; the loom draws every thread."
- Mesh: `PlaneGeometry(6.4×3.2, 96×48)` with a baked hash-based woven displacement (±0.03 + subtle sinus), `MeshStandardMaterial` with `map` (anisotropy 4) + `bumpMap` (bumpScale 0.055), roughness 1, transparent with depthWrite.
- Lights: warm kiln light `0xffe9c9` 2.4 + cool `0x8fb0ff` 0.8 rim from behind + warm ambient.
- **Camera never moves** (locked 2.4 s pointer-lerp sway only); the root turns `(p−0.5)*0.4`, drifts back `p*1.1`, scales to 0.4 minimum; the paper gently "breathes" (per-vertex sinus wave, `computeVertexNormals` each frame); the rug fades `smooth((p−0.55)/0.45)` to 0.28 opacity as the visitor walks on.
- Registers stats with `glRegistry` (GPU = null — never probes), unregisters on unmount with full disposal (`geo/wool/pile/rugMat/renderer`).

---

## 9. The interactive systems layer (`src/lib/fx/` + chrome components)

### 9.1 `museumState.ts` — shared, deliberately non-React state

- `glRegistry`: a `Set<GlSource>` of live-canvas reporters; `snapshot()` sums draw calls + triangles, counts canvases, lazily fetches one GPU string (`canvases` grows during the entrance only while hero GL is alive).
- `museumState`: `roomLabel/roomId` (IntersectionObserver-driven), `regens`, `zelligeSeed`, `zelligePieces`, `weave`, `ambience`, `lastPulseAt` (shared haptic throttle).
- **Room watch**: one IntersectionObserver on `#main section[id]` (thresholds 0.15/0.4/0.65/0.9) picks the most-visible room and fans out to `onRoomChange` listeners (used by AmbienceControl and the dashboard); auto-disconnects when the last listener leaves.

### 9.2 `ambience.ts` — synthesized Web Audio (no audio files)

- Two acoustic rooms: **the museum** — bandpass 620 Hz / Q 0.45 white-noise air + highpass 60 Hz floor + a 0.06 Hz LFO "tide" (gain modulation ±0.0005); **the archive** — brown-noise rumble (integrated noise) through lowpass 150 Hz + a 320 Hz / Q 1.4 bandpass "press" whose frequency is LFO-modulated at 0.14 Hz (±110 Hz) — "a distant machine, not a beat".
- `ensureAmbience()` is the only gate: requires a user gesture (`pointerdown`/`keydown`, once), prefers `webkitAudioContext` fallback, builds the graph, fades museum bus to 0.5, resumes.
- `setAmbientRoom(id)`: crossfade museum 0.5↔0.28 / archive 0↔1 over 1.2 s (`setTargetAtTime`).
- `setAmbience(false)` fades master to 0 over 0.4 s then suspends the context after 1.2 s; pref persisted as `ar-ambience` (`'on'` only); `visibilitychange` suspends/resumes silently; reduced-motion users start silent but can still opt in.

### 9.3 `AmbienceControl.tsx` — one brass button

`aria-pressed`, read pref on mount, follows room changes while on, "Ambience on/off" label with glowing dot. Rendered in the Topbar (desktop) and the mobile directory.

### 9.4 `CraftDashboard.tsx` — the conservation console

- Opens with **Ctrl/Cmd+Shift+K** or the footer "Conservation console" link (`ar:toggle-console` event); Escape closes; focus-trapped-lite (restores focus to the trigger).
- Live loop (8-frame cadence) reading FPS (EMA with α 0.08), `glRegistry.snapshot()`, scroll % (`scrollState.progress`), weave %, zellige seed, kiln fires, ambience state — **"nothing here is fabricated; anything the browser cannot truthfully say is shown as —"** (GPU is masked when it's a SwiftShader string).
- FPS dot color: ≥50 green `rgba(108,178,148,1)`, ≥30 brass `rgba(205,160,88,1)`, else ember `rgba(198,92,58,1)`.
- Build-time badge: "CI gate: lint · typecheck · 90 tests · production build — measured at build time, not in the browser" (⚠ stale count — the suite is now 108 tests, see §17).

### 9.5 `CuratorsKey.tsx` — the staff door

- Type **`minttea`** anywhere (letters only, case-insensitive, ignores modifier keys and form fields) and the notes overlay opens; `appendPhrase` is pure & exported for tests (last-7 window buffer).
- Eight handwritten "notes" tilt-cards on ruled stationery (repeating 28px line gradient), wax-tack dot per card, each one a real detail from the build: geometry grammar, the 33-piece kiln, "20,000 fibre strokes", the box-shadow vault lamp, the guarded visitors' book, "90 tests … that is the craft", transform/opacity-only motion under reduced motion, the 24 ms loom pulse.
- Sign-off: "The museum has no locked rooms — only doors you haven't knocked on yet."

### 9.6 Chrome details

- `Topbar`: sticky, blur + hairline after 24 px scroll; logo = Monogram + name; desktop nav = Collection / Craft / Archive links + "Start a project" pill + AmbienceControl; mobile = hamburger → full-height directory dialog (rooms 00–05, `role="dialog"`, Escape closes, body scroll-locked). Anchors go through `useLenis().scrollTo(href.slice(1), { offset: -64 })`; route changes close the menu.
- `RoomDirectory`: right-edge chapter rail (desktop, `lg:` only), IntersectionObserver with `-30%/-45%` root margins tracks the current room, sapphire stud scales ×1.25 when active; hidden off-home and for reduced motion.
- `CustomCursor`: dot (1.5px, difference-blend) + rotated-square ring (difference-blend) with `gsap.quickTo` (dot 0.08 s, ring 0.38 s); over interactive elements the ring swells to 1.45; over `[data-cursor]` (the exhibit doors) it becomes a solid brass plaque — "View exhibit" — and the label flips in. Reverts `no-cursor` on unmount; touch & reduced-motion users never see it (hook `useIsTouch` = `(pointer: coarse)`).
- `Magnetic`: pointer-relative offset, strength 0.35 default, disabled for touch/reduced motion (wraps the exit's CTA etc.).
- `PageTransition`: decorative door-leaf sweep (yPercent 100→−100, 0.55 s expo.inOut) on route change, monogram + room label; never intercepts navigation.
- `Preloader` (the door): see §10.
- `StabilityFactory`: sets `html[data-stable]` + `.stabled` once after hydration (Reveal reads the flag), is the doc's one-time client stabilizer.
- `Footer`: three columns — thesis + `{name} × {nickname}`; the visitor book (socials with handle); the keeper's hours with a **live Azrou clock** (`Intl.DateTimeFormat` en-GB in `Africa/Casablanca`, 30 s tick, "Azrou — ticking" guard). Bottom bar: © line, `hello@akramrihani.com`, "Back to the entrance ↑", and the Conservation console trigger.

---

## 10. The preloader door (`Preloader.tsx`)

- **Returning visitors skip it**: `ar-museum-v5` checked in localStorage first, sessionStorage as the private-mode fallback, via `useSyncExternalStore` (static read — never changes post-paint).
- The door: **21 stars — one for every year of the maker** — placed on a ring (RING_POINTS: 21 slots × `2π/21`, faces cycling cobalt/teal/terra/brass), each drawn from `starPath(r=76, 13/5.2)`.
- **Daily deterministic variant**: `Math.floor(Date.now()/86_400_000) % 3` rotates the glaze order (the door is "the same door, a different weave — deterministic for the whole day, so nothing ever flickers") and adjusts star scale (0.96 or 1.04).
- Assembly: every star is pre-hid and tucked toward the mark with its own `gsap.set` (so a single staggered tween never flashes the whole ring on frame one), then launched to its slot `i*0.07` s apart with `back.out(1.8)` — *sweeping clockwise from the top star until the circle closes*; a collective 0.985 settle beat; the monogram (nudged `-translate-x-[3px] -translate-y-[10%]` so its drawn centroid sits on the ring's exact center — commit `3b41b01`) and the label bars fade up, then the whole door lifts (yPercent −100, 0.9 s `expo.inOut`).
- **Events**: sets `window.__entranceReady = true` + dispatches `ar:entrance-ready` as soon as the timeline is armed; dispatches `ar:door-lift` the moment the Hero can take the stage (`pointerEvents:none` first). On complete: persists both storage flags and **clears `__entranceReady`** so a later in-session visit never waits for a lift that already happened (fix `d3a791f`).
- Reduced motion: door never renders its timeline — content done with a 0 ms timeout.
- Labels: top bar "The museum of software craftsmanship · ©year", footer "The kiln is ready · www.akramrihani.com".

---

## 11. Contact pipeline (defense in depth — `route.ts`)

`ContactForm.tsx` → `POST /api/contact`:

1. **Env gate** — `validateEnv()` (throws in prod; caught here); missing secret → structured **503 `SERVICE_NOT_CONFIGURED`** with `Retry-After: 60` and a loud server log naming the missing vars (no opaque 500).
2. **IP extraction** — `getClientIp`: first `x-forwarded-for` hop → `x-real-ip` → `127.0.0.1` (platform sanitizes proxy headers; forgery caveat documented).
3. **Rate limit** — `checkRateLimit(ip, getRateLimitStore())`: **5 requests / 10 min per IP** (`RATE_LIMIT_MAX=5`, `RATE_LIMIT_WINDOW_MS=600000`). Memory token bucket by default; **Upstash KV REST store in production** (`redisStore.ts`): keyed `rl:contact:{ip}`, `INCR`+`EXPIRE` in one `/pipeline` call (concurrent bursts converge on the shared counter), `TTL` for retryAfter, 2 s `AbortSignal.timeout`, **fail-open** (warn + allow on outage), activity-anchored window (a blocked client keeps its own block alive). Response carries `X-RateLimit-Limit/Remaining` + `Retry-After`. Over limit → **429 `RATE_LIMITED`**.
4. **JSON parse guarded** — 400 `INVALID_JSON`.
5. **Sanitize every field** — `sanitize()`: non-string → `''`, strips `<[^>]*>` tags, NUL bytes, trims, slices to max (name 100 / email 254 / message 1000).
6. **Honeypot** — hidden `website`/`phone` fields; a filled trap returns a silent **200 success** (bots never learn).
7. **Server validation** — `validateContact`: required fields, `EMAIL_RE`, min lengths (name 2, message 10); per-field error map → 400 `VALIDATION_ERROR` with `fields`.
8. **Send** — `sendContactEmail` (typed `ContactEmailError` codes `INVALID_INPUT / RESEND_NOT_CONFIGURED / MISSING_RECIPIENT / RESEND_API_ERROR`). HTML email: `escapeHtml` on every interpolated value, "Portfolio Contact <onboarding@resend.dev>" sender, `replyTo` = visitor's address, message body with `<br/>`-preserved newlines. Dev without a key → logs the submission (suggests `.env.local`); prod → 500 `EMAIL_NOT_CONFIGURED`; transit failure → 500 `EMAIL_SEND_FAILED` (client told to use `mailto:`).
9. **Error envelope** — `{ success:false, error:{ code, message, fields? } }`; server logs include code + detail, clients only get safe copy.
10. **Client** — mirrors validation rules, per-field error states with `--ok/--err` color tokens, `role="alert"`, `aria-invalid`, `noValidate`; on network failure resolves to `mailto:` fallback (subject/body encoded) after 400 ms; 429 resets after 3 s, other errors after 6 s; success shows the **WaxSeal** stamp ("Received — sealed with the keeper's mark. Answer within 24 hours.") and clears the form.

Env files: `.env.local` (gitignored; live Resend key `re_ZbjV3gJY…`, `CONTACT_EMAIL=kssakram92@gmail.com`, Upstash REST URL + write token). `.env.example` documents `RESEND_API_KEY`, `CONTACT_EMAIL`, the five `UPSTASH_REDIS_KV_*` values, and the legacy `GITHUB_TOKEN`.

---

## 12. Security & performance

### 12.1 Headers (`next.config.mjs`, applied to `/(.*)`)

- `X-Frame-Options: DENY` · `X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()` · `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
- **Production CSP** (skipped in dev — HMR/React-devtools need eval):
  `default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; media-src 'self'`.
- **The nonce story** (documented in-file): a nonce-based middleware was prototyped and tested end-to-end, then removed — Next 16.3.0 production SSR (Turbopack) never attaches the nonce to framework scripts (`vercel/next.js#93094`, still-open `#96063`), and nonces can't be injected into statically prerendered pages; a nonce-only policy would blank the site. `'unsafe-inline'` is therefore retained *only* for Next's RSC hydration payloads, with remote origins impossible. Revisit condition noted.
- Images: `formats: ['image/avif','image/webp']`, `qualities: [75, 82]`.

### 12.2 Performance & motion discipline

- Motion is **transform/opacity only**; `prefers-reduced-motion` (via `useReducedMotion`, a `useSyncExternalStore` matchMedia) collapses everything — Lenis never constructed, cursor/Reveal/PageTransition/Preloader/VaultLight/Mosaic/Zarbia all go static or vanish, CSS kill-switch shortens all animations to 0.01 ms.
- Quality tiers: `useQuality` (coarse → low; ≤4 cores or ≤4GB deviceMemory → medium; else high; defaults `{dpr, particles}` = high [1,1.75]/900, medium [1,1.25]/500, low [1,1]/250 — the canvases currently use their own inline `detectTier`, the hook's particle budget pattern remains from the audit era).
- `next/image` everywhere with intrinsic `width/height` or `fill` + `sizes` (no CLS); AVIF/WebP negotiation; lazily read GPU strings; IntersectionObserver pause for both canvases; WebGLErrorBoundary isolates GL failures so DOM content always survives (fix `4082c56`); scroll-time blur rasterization removed (`bc3a683`); canvas remount discipline.
- Vault lamp & cursor: `willChange: transform`/transform-only — zero repaints.
- Haptics: throttled, platform-gated; ambience: suspended when the tab hides.

---

## 13. SEO, metadata & PWA

- Canonical domain pinned to **www.akramrihani.com** in `site.ts` — `metadataBase`, OG URLs, sitemap, robots all derive from it (history: `c40e99d`, `9089aac` fixed `viaruq.dev`).
- `sitemap.ts`: home (priority 1.0, weekly) + six `/work/[slug]` pages (0.7, monthly); `robots.txt` references `https://www.akramrihani.com/sitemap.xml`.
- **OG image generated in code** (`opengraph-image.tsx`, edge runtime, 1200×630): plaster background, three nested rotating star strokes (cobalt/brass/mint), solid-arch monogram with ivory V strokes, "AKRAM RIHANI / I BUILD IDEAS INTO **REAL** THINGS." (outlined "REAL" via WebkitTextStroke) — verified at audit G–L for exact 1200×630.
- Icons: `public/akramlogo.png` (favicon & manifest, `sizes: any`), `icon-192/512`, `apple-touch-icon.png`; PWA manifest with `display: standalone`, plaster theme color. (`src/app/site.webmanifest` and `public/site.webmanifest` both exist.)
- Static CV: `public/Akram-Rihani-CV.pdf`.

---

## 14. Accessibility & UX details

- Skip-target `<main id="main" tabIndex={-1}>`; keyboard: all interactive elements are real buttons/links; the cursor is decorative and the DOM never loses native focus (`no-cursor` is reverted on unmount; `StabilityFactory` marks the document hydrated with `html[data-stable]` + `.stabled` — note the `.stabled` class has no CSS consumer yet, it exists as a hydration marker); VaultLight tracks `focusin`; canvas is a labelled `role="img"` fired by Enter/Space; `aria-current="step"` on loom chapters; `aria-pressed` on ambience/rail; `role="alert"` for form errors; `aria-label`s on every decorative control; `role="dialog"` + `aria-modal` on the mobile directory, console and curator notes (Escape + focus return); `maximumScale: 5` viewport (zoom allowed); fonts ≥0.6rem after audit A–F; heading levels audited (h1 per room, h2 sections, h3 panels); reduced-motion makes *everything* available, just stilled ("nothing is skipped, ever").
- Field probing UX details: I-beam cursor on inputs, animated hamburger, hover ring scales, `mashrabiya`/`grain` overlay tuned to 0.028 opacity exactly to keep text contrast.

---

## 15. Testing

### 15.1 Tooling (`vitest.config.ts` / `vitest.setup.ts`)

- Vitest 4, `environment: 'node'` default with per-file `// @vitest-environment jsdom` where needed, `globals: true`, alias `@`, React plugin; setup: `@testing-library/jest-dom/vitest`, a `MockIntersectionObserver` (no-op paths) and stubs for `matchMedia`/`scrollTo` gaps; `restoreMocks` + `clearMocks`.

### 15.2 Inventory — 21 files, 108 tests at report time

| File | Pass/Total |
|---|---|
| `env.test.ts` | 6/6 |
| `geometry.test.ts` | 10/10 |
| `SmoothScroll.test.tsx` | **5/6 — 1 failing** (§17) |
| `ContactForm.test.tsx` | 3/3 |
| `RoomDirectory.test.tsx` | 2/2 |
| `WebGLErrorBoundary.test.tsx` | 2/2 |
| `lib/email/index.test.ts` | 6/6 |
| `lib/fx/interactions.test.ts` | 6/6 (weavePulse + appendPhrase) |
| `getClientIp.test.ts` | 4/4 |
| `lib/rateLimit/index.test.ts` | 6/6 (memory store) |
| `redisStore.test.ts` | 6/6 (stubbed fetch) |
| `escapeHtml.test.ts` | 4/4 |
| `validation/contact.test.ts` | 13/13 |
| `api/contact/route.test.ts` | 12/12 (mock Resend/env/IP; covers 429, honeypot, 405s, validation, 503) |
| `Archive.test.tsx` | 3/3 |
| `Collection.test.tsx` | 4/4 |
| `EntranceScene.test.tsx` | 5/5 (incl. door-lift + stale-flag caps, fake timers) |
| `ExitRoom.test.tsx` | 3/3 |
| `Fountain.test.tsx` | 2/2 |
| `LoomRoom.test.tsx` | 3/3 |
| `Workshop.test.tsx` | 2/2 |

Full run: 8.4 s local.

### 15.3 CI (`.github/workflows/ci.yml`)

One job `lint-typecheck-test` on `ubuntu-latest` (15 min timeout): `checkout@v4` → `setup-node@v4` with `node-version-file: '.nvmrc'` (→ Node 22, npm cache) → `npm ci` → `npm run lint` → `npm run typecheck` → `npm test` → `npm run build` (injects `RESEND_API_KEY` + `CONTACT_EMAIL` secrets; `check-env.mjs` exits 1 in CI when they're absent). Concurrency: per-ref, cancel-in-progress.

---

## 16. Deployment & environment

- Hosted on Vercel (`www.akramrihani.com`); env vars live there (Resend key, CONTACT_EMAIL, Upstash REST URL+token).
- `scripts/check-env.mjs` gates `next build`: parses `.env.local` (does **not** load it into the process), fails CI builds hard with an actionable message, warns locally ("the contact endpoint will answer 503 in production").
- `.nvmrc` = `22`; `package.json` `engines.node >=22`; local dev on Node 26.

---

## 17. Known issues & observations (report time, 2026-08-12)

1. **The suite is red by one test.** `SmoothScroll.test.tsx → "reduced-motion anchors scroll to the requested element natively, not the page top"` fails: the test (line 85–105) asserts `window.scrollTo` is *never* called in the reduced-motion anchor path, but commit `d3a791f` added `window.scrollTo({ top: 0, behavior: 'auto' })` to the route-change effect (`SmoothScroll.tsx:139-141`, the "fresh loads land on the header" fix). On mount the provider now synchronously resets scroll, so the spy fires once (call `{behavior:'auto', top:0}`). **CI on `main` would currently fail at `npm test`.** The fix is a one-liner: make the assertion tolerate the header-reset call, or guard that specific effect in tests.
2. **Stale claims in the UI/README**: `CraftDashboard.BUILD_BADGE` says "90 tests" (currently 108); README says "83 tests" and calls the loom's fourth chapter "Digital" (code: **Departure**); README's stack note "no R3F" contradicts the Workshop skill chip "React Three Fiber" (intentional as a *skill* listing, but worth a comment).
3. **`@react-three/fiber` and `@react-three/drei` are declared but never imported** — raw Three.js only (`three` is the real dependency). Either ship pure Three and drop them, or keep them with an explicit comment (the `970d437` commit message references R3F v9, suggesting they may be residual).
4. **`GITHUB_TOKEN` still documented** in `.env.example` — residue of the pre-rebuild GitHub-API lab (`c85e51d`); nothing in `src/` reads it today.
5. `.env.local` holds live secrets (Resend + Upstash write token) — correctly gitignored; rotation best practice: Upstash `WRITE` token scope, `re_…` key granularity.
6. `tsconfig.tsbuildinfo` present (incremental builds, gitignored); harmless.
7. The Vitest v4 "ESM-as-CJS" configLoader notice appears on startup — harmless today, Vite flags it as a future default change.
8. No `prefers-color-scheme` dark mode by design: the site is deliberately a light museum with the Archive's `.room-dark` as the only darkness.
9. Rate-limit store design note (documented in `redisStore.ts`): TTL refresh on every request means an attacker's own retries extend their block by the full window — a feature, not a bug.
10. `useQuality`/`qualityDefaults` (particle budgets) are now orphaned by the two canvases' inline `detectTier` — kept as the canonical tiering vocabulary but not consumed; a small consolidation opportunity.

---

## 18. Appendix — data files

### 18.1 `site.ts`
`name "Akram Rihani"`, `nickname "Viaruq"`, `monogram "A/V"`, `role "Software Engineer"`, `roles [Software Engineer / Digital Product Builder / WebGL & Motion]`, `email hello@akramrihani.com`, `location "Azrou, Morocco"`, `availability "Open for freelance"`, `thesis "I build ideas into real things."`, `domain www.akramrihani.com`, `timezone Africa/Casablanca`, GitHub `Syntaxri`, LinkedIn `riihaniakram`, Instagram `viaruq`; `socials` = GitHub, LinkedIn, Instagram, Email.

### 18.2 `projects.ts` — the six accessions

| # | Project | Year | Category | Role | Glaze | Featured | Extras |
|---|---|---|---|---|---|---|---|
| INV. I | WISLA Platform | 2024 | Enterprise Application | Backend Engineering | cobalt | flagship | 3 challenges+metrics (19/20, 3 roles, Spring Boot, MySQL·JPA), 8 archive frames |
| INV. II | Palais Amghass | 2025 | Hotel Experience | Frontend · Motion | brass | yes | live `palais-amghass.vercel.app`, 2-frame gallery (1600×940), WebGL orbit, "image budget for valley bandwidth" |
| INV. III | NextHobby | 2025 | Web Platform | Design + Build | teal | yes | live `nexthobby.vercel.app`, 3-frame gallery, rentals/payments |
| INV. IV | Auto-École Michlifen | 2026 | Local Business | Design + Build | terra | no | live, phone-first lead capture |
| INV. V | Azrou Design | 2026 | Business Web | Design + Build | cobalt | no | live studio portfolio |
| INV. VI | Le Sapin | 2026 | Local Business | Design + Build | ivory | no | live establishment site |

Helpers: `getProject(slug)`, `getNextProject(slug)` (wrap-around), `isFlagship(slug)`.

### 18.3 Asset inventory (`public/`)
`akramlogo.png`, `apple-touch-icon.png`, `icon-192/512`, `next.svg` (unused scaffold), `globe.svg`, `file.svg`, `window.svg` (scaffold), `robots.txt`, `site.webmanifest`, `Akram-Rihani-CV.pdf`, and 17 work screenshots: WISLA ×8 (light/dark dashboards across roles + offers + applications), Palais Amghass ×7 (home, chambres, reservations, table, experiences, testimonial, hamam), NextHobby ×5 (home, explore, rent, payments, form).