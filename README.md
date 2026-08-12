# Portfolio — Akram Rihani

> The Moroccan museum of engineered digital experiences.
> Akram Rihani — creative developer from Azrou: Java backends that hold,
> frontends that sing, 3D screens that breathe.

## Stack

- Next.js 16 (App Router) · TypeScript · Tailwind CSS
- Three.js on raw WebGL canvases for the installations (no R3F, no textures
  shipped — every pattern is computed)
- GSAP + ScrollTrigger + Lenis for the scroll choreography
- Resend for the contact form
- Vitest + Testing Library for the unit suite

## The rooms

**ROOM 00 — THE ATRIUM**: the Zellige composition assembles itself in WebGL; the
monogram is an arch cut into an A whose negative space is a V.

**ROOM 01 — THE FOUNTAIN**: the founding story in four steps, the seven rules
of the workshop translated into engineering laws.

**ROOM 02 — THE WORKSHOP**: four craft panels — Java Backend, TS · React ·
Next, DevOps & Security, WebGL & Motion.

**THE LOOM** (interlude between the Workshop and the Collection): a Zarbia
rug woven in WebGL. Scrolling walks four chapters — Material (macro wool),
Craft (the whole carpet hangs and bends), Culture (the pattern becomes a map
from above), Digital (the wool dissolves into the museum's own geometric
field). Both faces of the rug are drawn onto canvas at init; the camera
choreography is a single scrubbed pose path.

**ROOM 03 — THE COLLECTION**: six accessions in the arcade. WISLA hangs as
the flagship; the web builds fill the shelves.

**ROOM 04 — THE ARCHIVE**: the dark room — the engineering of the WISLA
platform, documented with field notes, role matrix and frames.

**ROOM 05 — THE EXIT**: the visitors' book. One question: have an idea worth
building?

## Design system v5

- Light museum palette: lime plaster `#EAE4D4`, Fes-cobalt glaze `#1E4082`,
  mint glaze `#15695C`, terracotta `#AA5226`, aged brass `#8C6634`.
- Archivo for signage, Fraunces for the catalogue voice, Space Mono for the
  conservation labels.
- Zellige geometry is computed, never shipped: stars, walls, bands and the
  the Zellige all come from `src/lib/geometry.ts`.
- The monogram is an arch cut into an A whose negative space is a V.
- Dark room convention: `.room-dark` overrides the palette tokens in place.

## Craft notes

- Motion is transform/opacity only; reduced motion collapses everything.
- The hero WebGL installation degrades to a flat CSS fallback.
- The contact form posts to the secured `/api/contact` endpoint with a
  `mailto:` fallback.
- Returning visitors skip the door via `ar-museum-v5`.
- Scroll choreography is Lenis + GSAP scrollState-driven.

## Commands

```bash
npm run dev        # run the museum
npm run build      # assemble everything
npm run start      # open the doors
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # vitest
```