import { describe, expect, it } from 'vitest'
import { mandalaPieces, mulberry32, starPoints } from '@/lib/geometry'

describe('mulberry32', () => {
  it('is deterministic for the same seed', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    expect(Array.from({ length: 8 }, () => a())).toEqual(Array.from({ length: 8 }, () => b()))
  })

  it('diverges for different seeds', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    expect(a()).not.toBe(b())
  })
})

describe('mandalaPieces', () => {
  it('seed 0 is the canonical composition (desktop)', () => {
    const pieces = mandalaPieces(false, 0)
    expect(pieces).toHaveLength(33)
    expect(pieces[0]).toMatchObject({ kind: 'star', radius: 0, glaze: 'cobalt', rotation: 0 })
    /* eight diamonds, eight ivory squares, sixteen studs */
    expect(pieces.filter((p) => p.kind === 'diamond')).toHaveLength(8)
    expect(pieces.filter((p) => p.kind === 'square' && p.scale > 0.5)).toHaveLength(8)
    expect(pieces.filter((p) => p.kind === 'square' && p.scale < 0.5)).toHaveLength(16)
  })

  it('is deterministic: same seed, same composition', () => {
    const a = mandalaPieces(false, 7)
    const b = mandalaPieces(false, 7)
    expect(a).toEqual(b)
  })

  it('different seeds produce different compositions', () => {
    const a = mandalaPieces(false, 7)
    const b = mandalaPieces(false, 8)
    expect(a).not.toEqual(b)
  })

  it('keeps the mobile composition canonical at seed 0', () => {
    const pieces = mandalaPieces(true, 0)
    expect(pieces).toHaveLength(17)
    expect(pieces.filter((p) => p.kind === 'diamond')).toHaveLength(8)
  })

  it('never lets the rings cross radii on any seed', () => {
    for (let seed = 0; seed < 24; seed++) {
      const pieces = mandalaPieces(false, seed)
      const diamond = Math.max(...pieces.filter((p) => p.kind === 'diamond').map((p) => p.radius))
      const square = Math.min(...pieces.filter((p) => p.kind === 'square' && p.scale > 0.5).map((p) => p.radius))
      const squareMax = Math.max(...pieces.filter((p) => p.kind === 'square' && p.scale > 0.5).map((p) => p.radius))
      const stud = Math.min(...pieces.filter((p) => p.kind === 'square' && p.scale < 0.5).map((p) => p.radius))
      expect(diamond).toBeLessThan(square)
      expect(squareMax).toBeLessThan(stud)
    }
  })

  it('only ever uses the kiln glazes', () => {
    const glazes = new Set(mandalaPieces(false, 11).map((p) => p.glaze))
    for (const g of glazes) {
      expect(['cobalt', 'teal', 'terra', 'ivory', 'brass']).toContain(g)
    }
  })

  it('keeps the central star as the lock on every seed', () => {
    for (let seed = 0; seed < 12; seed++) {
      expect(mandalaPieces(false, seed)[0]).toMatchObject({ kind: 'star', radius: 0, glaze: 'cobalt' })
    }
  })

  it('starPoints stay a closed, valid eight-point star', () => {
    const pts = starPoints(10, 4)
    expect(pts).toHaveLength(16)
    expect(pts[0]).toEqual(pts[0])
  })
})
