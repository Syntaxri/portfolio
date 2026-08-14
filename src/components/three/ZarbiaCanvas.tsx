'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useQualityTier } from '@/hooks/useQuality'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { glRegistry, museumState } from '@/lib/fx/museumState'

/*
 * ZARBIA — the loom interlude.
 * A wide handwoven runner hangs in the middle of the room. The camera
 * never moves: the wool breathes, the light plays, and as the visitor
 * scrolls on the runner turns slowly, drifts back and lets them walk
 * past — the pattern holding its geometry at every distance.
 *
 * The wool face is an Atlas Zarbia: a deep crimson field, a thick
 * ivory/royal-blue geometric border, one small blue Berber lozenge in
 * the centre — drawn onto canvas at init, never shipped as images.
 */

function detectTier() {
  const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches
  const cores =
    typeof navigator !== 'undefined' && navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency
      : 8
  if (coarse) return Math.min(window.devicePixelRatio, 1.5)
  if (cores <= 4) return Math.min(window.devicePixelRatio, 1.5)
  return Math.min(window.devicePixelRatio, 2)
}

/* the zarbia's woven palette — warm, deep, traditional */
const PAL = {
  red: '#b71f2e',
  redDark: '#8e1a26',
  redLight: '#c93341',
  ivory: '#e9dec0',
  ivoryDark: '#d5c7a1',
  blue: '#22418c',
  navy: '#16294f',
  olive: '#6d6e35',
  rust: '#b4552b',
} as const

/* the same design, in wool-grays, to light the bump map */
const PILE: Record<keyof typeof PAL, string> = {
  red: '#3a3430',
  redDark: '#2c2825',
  redLight: '#453e38',
  ivory: '#8a8178',
  ivoryDark: '#6f685f',
  blue: '#4a4540',
  navy: '#262320',
  olive: '#3c3833',
  rust: '#373330',
}

type RugPalette = typeof PAL | typeof PILE

function fiberStroke(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number,
  a: number
) {
  ctx.strokeStyle = `rgba(28, 26, 22, ${a})`
  ctx.lineWidth = 1 + Math.random() * 0.9
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + (Math.random() - 0.5) * 1.4, y - len)
  ctx.stroke()
}

function wavyRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  amp = 4
) {
  const seg = 5
  ctx.beginPath()
  for (let e = 0; e < 4; e++) {
    for (let s = 0; s <= seg; s++) {
      const t = s / seg
      let px: number
      let py: number
      if (e === 0) {
        px = x + w * t
        py = y
      } else if (e === 1) {
        px = x + w
        py = y + h * t
      } else if (e === 2) {
        px = x + w * (1 - t)
        py = y + h
      } else {
        px = x
        py = y + h * (1 - t)
      }
      /* the weaver's hand: each edge wanders a little */
      const jo = (Math.random() - 0.5) * 2 * amp
      if (e === 0 || e === 2) py += jo
      else px += jo
      if (s === 0 && e === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
  }
  ctx.closePath()
}

function rhombus(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rot = 0
) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(rot)
  ctx.beginPath()
  ctx.moveTo(0, -ry)
  ctx.lineTo(rx, 0)
  ctx.lineTo(0, ry)
  ctx.lineTo(-rx, 0)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function zigzagX(
  ctx: CanvasRenderingContext2D,
  y: number,
  x0: number,
  x1: number,
  teeth: number,
  amp: number
) {
  const w = x1 - x0
  ctx.beginPath()
  ctx.moveTo(x0, y)
  for (let i = 1; i <= teeth * 2; i++) {
    ctx.lineTo(x0 + (w * i) / (teeth * 2), y + (i % 2 ? -amp : amp))
  }
  ctx.lineTo(x1, y)
  ctx.stroke()
}

function zigzagY(
  ctx: CanvasRenderingContext2D,
  x: number,
  y0: number,
  y1: number,
  teeth: number,
  amp: number
) {
  const h = y1 - y0
  ctx.beginPath()
  ctx.moveTo(x, y0)
  for (let i = 1; i <= teeth * 2; i++) {
    ctx.lineTo(x + (i % 2 ? -amp : amp), y0 + (h * i) / (teeth * 2))
  }
  ctx.lineTo(x, y1)
  ctx.stroke()
}

/* motif stamp — a diamond with its tribal companion */
function stampDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rot: number,
  F: RugPalette,
  withRust: boolean
) {
  ctx.fillStyle = F.ivory
  rhombus(ctx, cx, cy, 11, 15, rot)
  ctx.fillStyle = F.rust
  rhombus(ctx, cx, cy + (rot ? -15 : 15) * 0.9, 4, 6, rot)
  if (withRust) {
    ctx.fillStyle = F.olive
    rhombus(ctx, cx + 14, cy, 3.4, 5, rot)
  }
}

/* the whole runner — bands, motifs, field, medallion. Drawn with a
   palette so the same loom paints both the colour face and the pile map.
   Canvas is 1536 × 1024, the long Atlas proportion. */
function rugPaint(ctx: CanvasRenderingContext2D, F: RugPalette, fringe: boolean) {
  /* the woven base — deep crimson, everywhere */
  ctx.fillStyle = F.red
  ctx.fillRect(0, 0, 1536, 1024)

  /* short ivory fringe at both ends */
  if (fringe) {
    ctx.strokeStyle = F.ivory
    for (let i = 0; i < 240; i++) {
      const x = Math.random() * 1536
      const top = Math.random() < 0.5
      const y = top ? 4 + Math.random() * 26 : 994 + Math.random() * 26
      const len = 10 + Math.random() * 14
      ctx.lineWidth = 1.4 + Math.random() * 0.9
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + (Math.random() - 0.5) * 3, y + (top ? -len : len))
      ctx.stroke()
    }
  }

  /* 2 — thick natural-wool ivory band */
  ctx.fillStyle = F.ivory
  wavyRect(ctx, 84, 61, 1368, 902, 5)
  ctx.fill()
  ctx.globalAlpha = 0.35
  for (let i = 0; i < 350; i++) {
    ctx.fillStyle = F.ivoryDark
    ctx.fillRect(88 + Math.random() * 1360, 65 + Math.random() * 894, 1 + Math.random() * 2, 1 + Math.random() * 3)
  }
  ctx.globalAlpha = 1

  /* 3 — royal-blue geometric border */
  ctx.fillStyle = F.blue
  wavyRect(ctx, 168, 99, 1200, 826, 4)
  ctx.fill()

  /* ivory zigzag running through the blue border, all four sides */
  ctx.strokeStyle = F.ivory
  ctx.lineWidth = 5
  zigzagX(ctx, 116, 190, 1346, 42, 8)
  zigzagX(ctx, 908, 190, 1346, 42, 8)
  zigzagY(ctx, 212, 108, 916, 20, 8)
  zigzagY(ctx, 1324, 108, 916, 20, 8)

  /* tribal diamonds + rust/olive accents marching down the blue border */
  ctx.lineWidth = 1
  for (let i = 0; i < 68; i++) {
    const t = (i + 0.5) / 68
    const jit = (Math.random() - 0.5) * 6
    const band = Math.random()
    if (band < 0.16) {
      ctx.fillStyle = F.rust
      rhombus(ctx, 190 + t * 1160, 134 + jit, 6, 9)
    } else if (band < 0.3) {
      ctx.fillStyle = F.olive
      rhombus(ctx, 190 + t * 1160, 890 + jit, 4, 6)
    } else {
      stampDiamond(ctx, 190 + t * 1160, 134 + jit, 0, F, false)
      stampDiamond(ctx, 190 + t * 1160, 890 + jit, 0, F, false)
    }
  }
  for (let i = 0; i < 30; i++) {
    const t = (i + 0.5) / 30
    const jit = (Math.random() - 0.5) * 6
    ctx.fillStyle = F.ivory
    rhombus(ctx, 248 + jit, 116 + t * 792, 9, 12, Math.PI / 2)
    rhombus(ctx, 1288 + jit, 116 + t * 792, 9, 12, Math.PI / 2)
    if (i % 3 === 0) {
      ctx.fillStyle = F.rust
      rhombus(ctx, 190 + jit, 116 + t * 792, 4.5, 7, Math.PI / 2)
      rhombus(ctx, 1346 + jit, 116 + t * 792, 4.5, 7, Math.PI / 2)
    }
  }

  /* 4 — ivory ground with sharp tribal geometry: navy zigzags,
     triangle teeth, sparse rust and olive accents */
  ctx.fillStyle = F.ivory
  wavyRect(ctx, 252, 136, 1032, 752, 3.5)
  ctx.fill()

  ctx.strokeStyle = F.navy
  ctx.lineWidth = 4
  zigzagX(ctx, 148, 268, 1268, 34, 6)
  zigzagX(ctx, 158, 268, 1268, 34, 6)
  zigzagX(ctx, 866, 268, 1268, 34, 6)
  zigzagX(ctx, 876, 268, 1268, 34, 6)
  zigzagY(ctx, 268, 144, 880, 20, 6)
  zigzagY(ctx, 278, 144, 880, 20, 6)
  zigzagY(ctx, 1258, 144, 880, 20, 6)
  zigzagY(ctx, 1268, 144, 880, 20, 6)

  /* triangle teeth pointing into the band, navy */
  ctx.fillStyle = F.navy
  for (let i = 0; i < 66; i++) {
    const x = 268 + i * 15.2
    const y = 146 + (i % 2) * 9
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 7, y)
    ctx.lineTo(x + 3.5, y - 9)
    ctx.closePath()
    ctx.fill()
  }
  for (let i = 0; i < 66; i++) {
    const x = 268 + i * 15.2
    const y = 878 - (i % 2) * 9
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 7, y)
    ctx.lineTo(x + 3.5, y + 9)
    ctx.closePath()
    ctx.fill()
  }

  /* sparse rust diamonds on the ivory band */
  ctx.fillStyle = F.rust
  for (let i = 0; i < 40; i++) {
    if (i % 2 === 0) continue
    rhombus(ctx, 280 + i * 24, 168 + (i % 4) * 18, 4.5, 6.5)
    rhombus(ctx, 280 + i * 24, 856 - (i % 4) * 18, 4.5, 6.5)
  }

  /* 5 — thin dark-navy framing line around the field */
  ctx.fillStyle = F.navy
  wavyRect(ctx, 333, 172, 870, 680, 2.5)
  ctx.fill()

  /* 6 — very thin olive lines hugging the field edge */
  ctx.strokeStyle = F.olive
  ctx.lineWidth = 2.5
  zigzagX(ctx, 162, 356, 1180, 32, 4.5)
  zigzagX(ctx, 862, 356, 1180, 32, 4.5)
  zigzagY(ctx, 344, 178, 846, 30, 4.5)
  zigzagY(ctx, 1192, 178, 846, 30, 4.5)

  /* 7 — the central field: uninterrupted crimson, lived-in */
  ctx.fillStyle = F.red
  wavyRect(ctx, 354, 181, 828, 662, 3)
  ctx.fill()

  /* subtle warp-and-weft tone variation across the red */
  ctx.lineWidth = 1
  for (let i = 0; i < 350; i++) {
    const x = 358 + Math.random() * 820
    const y = 185 + Math.random() * 654
    const len = 8 + Math.random() * 26
    ctx.globalAlpha = 0.06 + Math.random() * 0.05
    ctx.strokeStyle = Math.random() < 0.5 ? F.redDark : F.redLight
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + (Math.random() - 0.5) * 2, y + len)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  /* sparse corner marks — the weaver's quiet signatures */
  ctx.fillStyle = F.navy
  rhombus(ctx, 390, 216, 7, 10)
  rhombus(ctx, 1146, 216, 7, 10)
  rhombus(ctx, 390, 808, 7, 10)
  rhombus(ctx, 1146, 808, 7, 10)
  ctx.fillStyle = F.rust
  rhombus(ctx, 372, 200, 5, 7)
  rhombus(ctx, 1164, 200, 5, 7)
  rhombus(ctx, 372, 824, 5, 7)
  rhombus(ctx, 1164, 824, 5, 7)

  /* the medallion: the compact Berber lozenge, small against the runner */
  const cx = 768
  const cy = 512
  ctx.fillStyle = F.ivory
  rhombus(ctx, cx, cy, 120, 160)
  ctx.fillStyle = F.ivoryDark
  ctx.globalAlpha = 0.5
  rhombus(ctx, cx + 5, cy + 6, 99, 132)
  ctx.globalAlpha = 1
  ctx.fillStyle = F.blue
  rhombus(ctx, cx, cy, 92, 126)
  ctx.fillStyle = F.red
  rhombus(ctx, cx, cy, 42, 58)
  ctx.fillStyle = F.navy
  rhombus(ctx, cx, cy, 13, 19)

  /* tribal marks around the lozenge */
  ctx.fillStyle = F.rust
  rhombus(ctx, cx, cy - 178, 7, 10)
  rhombus(ctx, cx, cy + 178, 7, 10)
  ctx.fillStyle = F.navy
  rhombus(ctx, cx - 133, cy, 6, 9)
  rhombus(ctx, cx + 133, cy, 6, 9)
  ctx.fillStyle = F.olive
  rhombus(ctx, cx - 146, cy, 3.5, 5)
  rhombus(ctx, cx + 146, cy, 3.5, 5)
  ctx.fillStyle = F.blue
  rhombus(ctx, cx - 94, cy - 130, 18, 24)
  rhombus(ctx, cx + 94, cy - 130, 18, 24)
  rhombus(ctx, cx - 94, cy + 130, 18, 24)
  rhombus(ctx, cx + 94, cy + 130, 18, 24)
  ctx.fillStyle = F.rust
  rhombus(ctx, cx - 94, cy - 130, 6, 9)
  rhombus(ctx, cx + 94, cy - 130, 6, 9)
  rhombus(ctx, cx - 94, cy + 130, 6, 9)
  rhombus(ctx, cx + 94, cy + 130, 6, 9)
}

/** The wool face: the handwoven Zarbia under a buried pile of fibres. */
function drawWool(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = 1536
  c.height = 1024
  const ctx = c.getContext('2d')!
  rugPaint(ctx, PAL, true)
  /* the pile — thousands of fine threads over the pattern */
  for (let i = 0; i < 7000; i++) {
    fiberStroke(ctx, Math.random() * 1536, Math.random() * 1024, 2 + Math.random() * 5, 0.02 + Math.random() * 0.05)
  }
  return c
}

/** Monochrome pile map — the same loom, for the bump map. */
function drawPile(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = 1536
  c.height = 1024
  const ctx = c.getContext('2d')!
  rugPaint(ctx, PILE, false)
  for (let i = 0; i < 6000; i++) {
    fiberStroke(ctx, Math.random() * 1536, Math.random() * 1024, 2 + Math.random() * 5, 0.03 + Math.random() * 0.07)
  }
  return c
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => {
  const t = clamp01(a)
  return t * t * (3 - 2 * t)
}

export interface ZarbiaControl {
  /** scroll progress through the loom, 0..1 */
  p: number
}

export function ZarbiaCanvas({ control }: { control: React.MutableRefObject<ZarbiaControl> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const quality = useQualityTier()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(detectTier())

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 60)
    camera.position.set(0, 0.35, 4.8)
    camera.lookAt(0, 0, 0)

    /* light: a warm kiln light from the left, a cool glaze rim from the back */
    const warm = new THREE.DirectionalLight(0xffe9c9, 2.4)
    warm.position.set(3.5, 5, 6)
    scene.add(warm)
    const rim = new THREE.DirectionalLight(0x8fb0ff, 0.8)
    rim.position.set(-5, 2, -4)
    scene.add(rim)
    scene.add(new THREE.AmbientLight(0xfff3df, 0.5))

    const root = new THREE.Group()
    scene.add(root)

    /* the long Atlas runner — 96 × 48 woof segments (48 × 24 on weak
       devices, where the normals recompute is halved) */
    const segW = quality === 'low' ? 48 : 96
    const segH = quality === 'low' ? 24 : 48
    const geo = new THREE.PlaneGeometry(6.4, 3.2, segW, segH)
    const flat = new Float32Array(geo.attributes.position.array)
    const baseZ = new Float32Array(geo.attributes.position.array)
    const uv = geo.attributes.uv.array as Float32Array
    /* subtle woven displacement, baked once: the surface catches light
       like dense wool, without ever looking like waves */
    const hash = (a: number, b: number) => {
      const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
      return s - Math.floor(s)
    }
    for (let i = 0; i < baseZ.length; i += 3) {
      const vi = i / 3
      const nx = uv[vi * 2]
      const ny = uv[vi * 2 + 1]
      baseZ[i + 2] =
        (hash(nx * 53, ny * 79) - 0.5) * 0.03 +
        Math.sin(nx * Math.PI * 14) * 0.004 * Math.sin(ny * Math.PI * 12)
    }

    const wool = new THREE.CanvasTexture(drawWool())
    wool.anisotropy = 4
    const pile = new THREE.CanvasTexture(drawPile())

    const rugMat = new THREE.MeshStandardMaterial({
      map: wool,
      bumpMap: pile,
      bumpScale: 0.055,
      roughness: 1,
      metalness: 0,
      transparent: true,
      depthWrite: true,
    })
    const rug = new THREE.Mesh(geo, rugMat)
    root.add(rug)

    /* pointer parallax */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    /* pause when the loom is offscreen */
    let visible = true
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { rootMargin: '15% 0px 15% 0px' }
    )
    io.observe(canvas)

    const glSource = {
      stats: () => ({
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
      }),
      gpu: () => null,
    }
    glRegistry.register(glSource)

    let raf = 0
    let normalBudget = 0
    const clock = new THREE.Clock()

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime
      /* the loom is offscreen: stop paying for it entirely — no motion,
         no normals, no render. It wakes up clean on the way back in. */
      if (!visible) {
        normalBudget = 0
        return
      }

      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 2.4)
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 2.4)

      const p = control.current.p
      museumState.weave = p

      /* the camera never moves — the room holds still around the runner */
      camera.position.x = pointer.x * 0.16
      camera.position.y = 0.35 + pointer.y * 0.12
      camera.lookAt(0, -0.05, 0)

      /* calm: a slight display tilt, a slow turn and drift as you scroll */
      root.rotation.x = 0.05 - pointer.y * 0.05
      root.rotation.y = (p - 0.5) * 0.4 + pointer.x * 0.1
      root.rotation.z = pointer.x * 0.03
      root.position.y = -0.05 + Math.sin(t * 0.45) * 0.02
      root.position.z = p * 1.1
      root.scale.setScalar(Math.max(0.4, 1 - p * 0.08))

      /* the wool breathes — a slow living wave, never exaggerated */
      const wave = 0.03 * Math.sin(t * 0.55)
      const arr = geo.attributes.position.array as Float32Array
      for (let i = 0; i < arr.length; i += 3) {
        const vi = i / 3
        const ny = uv[vi * 2 + 1]
        const nx = uv[vi * 2] * 2 - 1
        arr[i + 1] = flat[i + 1] + wave * Math.sin(ny * Math.PI) * Math.sin(nx * Math.PI * 1.8 + t * 0.7)
        arr[i + 2] = baseZ[i + 2]
      }
      geo.attributes.position.needsUpdate = true
      /* the wave is ~0.03u tall — recomputing vertex normals every frame
         is invisible and expensive; the weave gets fresh normals every
         sixth frame and the light still turns with it */
      normalBudget++
      if (normalBudget % 6 === 0) geo.computeVertexNormals()

      /* the runner lets the visitor walk on */
      const fade = smooth((p - 0.55) / 0.45)
      rugMat.opacity = 1 - fade * 0.72

      renderer.render(scene, camera)
    }
    tick()

    const resize = () => {
      const w = canvas.clientWidth || 1
      const h = canvas.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      glRegistry.unregister(glSource)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', resize)
      geo.dispose()
      wool.dispose()
      pile.dispose()
      rugMat.dispose()
      renderer.dispose()
    }
  }, [reduced, control, quality])

  if (reduced) return null

  return <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
}