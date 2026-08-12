/**
 * GEOMETRY — the craft dictionary of the museum.
 *
 * Pure geometry functions that generate the Zellige vocabulary: the
 * eight-pointed star (two interlocked squares), the diamond socket, the
 * grid that tiles a whole wall, and the A/V monogram cut from an arch.
 *
 * Everything here is deterministic and dependency-free so the same star
 * can appear in SVG, in a CSS data-URI, on the OpenGraph card, and in the
 * WebGL installation without ever shipping an image.
 */

export interface Pt {
  x: number
  y: number
}

/** Points of a regular star polygon: alternate outer/inner radius. */
export function starPoints(outer: number, inner: number, points = 8, phase = -Math.PI / 2): Pt[] {
  const pts: Pt[] = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i * Math.PI) / points + phase
    pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r })
  }
  return pts
}

/** SVG path string for a star polygon centered at (cx, cy). */
export function starPath(cx: number, cy: number, outer: number, inner: number, points = 8): string {
  const pts = starPoints(outer, inner, points)
  return (
    `M ${pts.map((p) => `${(cx + p.x).toFixed(3)} ${(cy + p.y).toFixed(3)}`).join(' L ')} Z`
  )
}

/** One eight-pointed star glyph as an SVG string (used for data-URIs). */
export function starGlyph(size = 10, fill = '%231e4082', stroke = '0'): string {
  const s = size / 2
  return (
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size} ${size}'>` +
    `<path d='${starPath(s, s, s * 0.9, s * 0.36)}' fill='${fill}' stroke-width='${stroke}'/>` +
    `</svg>`
  )
}

/** A tileable zellige wall: interlocked eight-point stars + brass seams. */
export function zelligeWallSvg(size = 96, ink = 'rgba(30,64,130,0.08)'): string {
  const s = size / 2
  const star = starPath(s, s, s * 0.58, s * 0.26)
  const star2 = starPath(s, s, s * 0.58, s * 0.26)
  const seams =
    `M${s} ${size} V${s} M${s} 0 V${s - 0.001} M${size} ${s} H${s} M0 ${s} H${s - 0.001}`
  return (
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>` +
    `<g fill='none' stroke-width='1'>` +
    `<path d='${star}' stroke='${ink}'/>` +
    `<path d='${star2}' stroke='${ink}' transform='rotate(22.5 ${s} ${s})'/>` +
    `<path d='${seams}' stroke='rgba(140,102,52,0.07)'/>` +
    `</g></svg>`
  )
}

/** A small woven band of alternating stars — the section separators. */
export function zelligeBandSvg(count = 24, tile = 14, colors: string[] = []): string {
  const fallback = ['%23C4A05C', '%23E6DFCA', '%232E5F87', '%2315695C', '%23AA5226', '%23E6DFCA']
  const parts: string[] = []
  for (let i = 0; i < count; i++) {
    const c = colors[i] || fallback[i % fallback.length]
    const cx = i * tile + tile / 2
    parts.push(`<path d='${starPath(cx, tile / 2, tile * 0.31, tile * 0.13)}' fill='${c}'/>`)
  }
  return (
    `<svg xmlns='http://www.w3.org/2000/svg' width='${count * tile}' height='${tile}' viewBox='0 0 ${count * tile} ${tile}' ` +
    `preserveAspectRatio='xMidYMid meet'>${parts.join('')}</svg>`
  )
}

/* ---------------------------------------------------------------------------
 * THE MONOGRAM — an arch cut into an A, whose negative space is a V.
 * The apex carries a keystone diamond, like the boss of a carved door.
 * ------------------------------------------------------------------------- */

/** Outline variant: arch ring + V + keystone, drawn as stroked paths. */
export const MONOGRAM_PATHS = {
  arch: 'M8 88 C8 42 36 12 50 12 C64 12 92 42 92 88 L85 88 C85 44 64 18 50 18 C36 18 15 44 15 88 Z',
  vLeft: 'M50 30 L33 83',
  vRight: 'M50 30 L67 83',
  keystone: 'M50 3 L56 11 L50 19 L44 11 Z',
  floor: 'M18 92 H82',
} as const

/** Solid variant: a solid arch wedge (plaque engraving). */
export function monogramSolidPath(w = 100, h = 96, wRatio = 0.1): string {
  const t = 8
  const wt = w * wRatio
  return (
    `M${t} ${h - t} C${t} ${h * 0.42} ${w * 0.36} ${t * 1.4} ${w / 2} ${t * 1.4} ` +
    `C${w * 0.64} ${t * 1.4} ${w - t} ${h * 0.42} ${w - t} ${h - t} ` +
    `L${w - t - wt} ${h - t} C${w - t - wt} ${h * 0.47} ${w * 0.64} ${t * 2.5} ${w / 2} ${t * 2.5} ` +
    `C${w * 0.36} ${t * 2.5} ${t + wt} ${h * 0.47} ${t + wt} ${h - t} Z`
  )
}

/* The two squares whose overlap forms the 8-fold star (for WebGL). */
export function rotateSquares(size: number): number[] {
  /* returns [outer square half, inner square half] used to construct star geometry */
  return [size * 0.52, size * 0.28]
}

/* ---------------------------------------------------------------------------
 * THE HERO MANDALA — the composition of the entrance installation.
 * Unit space is world units in the WebGL scene (camera at z≈9.5, fov 42).
 * ------------------------------------------------------------------------- */

export interface MandalaPiece {
  kind: 'star' | 'diamond' | 'square' | 'cross'
  /** polar position around the centre (radius, angle in radians, rotation) */
  radius: number
  angle: number
  rotation: number
  scale: number
  glaze: 'cobalt' | 'teal' | 'terra' | 'ivory' | 'brass'
  /** stagger used by the assembly animation */
  order: number
}

export function mandalaPieces(onMobile: boolean): MandalaPiece[] {
  const pieces: MandalaPiece[] = []

  /* the central star — the lock of the whole composition */
  pieces.push({ kind: 'star', radius: 0, angle: 0, rotation: 0, scale: 1, glaze: 'cobalt', order: 0 })

  if (onMobile) {
    /* mobile keeps the heart and one quiet ring */
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4
      pieces.push({
        kind: 'diamond',
        radius: 3.05,
        angle: a,
        rotation: Math.PI / 4,
        scale: 1,
        glaze: i % 2 ? 'teal' : 'terra',
        order: 2 + i * 0.3,
      })
    }
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + Math.PI / 8
      pieces.push({
        kind: 'square',
        radius: 3.95,
        angle: a,
        rotation: Math.PI / 4,
        scale: 0.55,
        glaze: 'ivory',
        order: 4 + i * 0.25,
      })
    }
    return pieces
  }

  /* ring 1 — eight diamond sockets (teal / terracotta glazes) */
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4
    pieces.push({
      kind: 'diamond',
      radius: 3.05,
      angle: a,
      rotation: Math.PI / 4,
      scale: 1,
      glaze: i % 2 ? 'teal' : 'terra',
      order: 1 + i * 0.3,
    })
  }

  /* ring 2 — eight ivory squares on the diagonals between the stars */
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + Math.PI / 8
    pieces.push({
      kind: 'square',
      radius: 3.85,
      angle: a,
      rotation: Math.PI / 4,
      scale: 0.62,
      glaze: 'ivory',
      order: 3 + i * 0.25,
    })
  }

  /* ring 3 — sixteen small brass studs along the outer edge */
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 + Math.PI / 16
    const stud = (i * Math.PI) / 8
    pieces.push({
      kind: 'square',
      radius: 4.75,
      angle: a,
      rotation: stud,
      scale: 0.3,
      glaze: i % 3 === 1 ? 'cobalt' : 'brass',
      order: 5 + i * 0.12,
    })
  }

  return pieces
}

export const GLAZE_HEX = {
  cobalt: '#1e4082',
  cobaltDark: '#122c5c',
  teal: '#15695c',
  tealDark: '#0c453d',
  terra: '#aa5226',
  terraDark: '#77361a',
  ivory: '#f4efe2',
  ivoryDark: '#dcd5c0',
  brass: '#8c6634',
  brassDark: '#5f4523',
} as const