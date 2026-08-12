'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { starPath } from '@/lib/geometry'

/*
 * ZARBIA — the loom interlude.
 * One continuous WebGL choreography, driven by a single scroll value p ∈ [0,1]:
 *
 *   01 MATERIAL — the camera starts an arm's length from the wool. Fibres,
 *                 pile and the edge of the medallion fill the frame.
 *   02 CRAFT    — the camera pulls back; the whole Zarbia hangs and bends
 *                 like cloth suspended, unrolling to its full width.
 *   03 CULTURE  — the rug turns flat and the camera rises above it: the
 *                 pattern becomes a map and expands beyond the viewport.
 *   04 DIGITAL  — the wool lets go: the carpet crossfades into the same
 *                 geometric field this museum is woven from.
 *
 * Both faces of the rug are computed — drawn onto canvas at init, never
 * shipped as images. Pointer movement tilts the composition while it is
 * hanging; the field face keeps the museum's glaze vocabulary.
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

const GLAZES = { cobalt: '#1e4082', terra: '#aa5226', brass: '#8c6634', emerald: '#15695c' }

function fiberStroke(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, a: number) {
  ctx.strokeStyle = `rgba(28, 26, 22, ${a})`
  ctx.lineWidth = 1 + Math.random() * 0.9
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + (Math.random() - 0.5) * 1.4, y - len)
  ctx.stroke()
}

/** The wool face: a Zarbia drawn band by band, then buried under pile. */
function drawWool(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = 1024
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#ece2c8'
  ctx.fillRect(0, 0, 1024, 1024)

  /* border bands */
  ctx.fillStyle = GLAZES.cobalt
  ctx.fillRect(40, 40, 944, 944)
  ctx.fillStyle = GLAZES.terra
  ctx.fillRect(112, 112, 800, 800)
  ctx.fillStyle = '#e9dfc2'
  ctx.fillRect(150, 150, 724, 724)

  /* field stars — the eight-pointed vocabulary */
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cx = 250 + col * 131
      const cy = 250 + row * 131
      const s = 46
      ctx.fillStyle = [GLAZES.cobalt, GLAZES.emerald, GLAZES.brass][(row + col) % 3]
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(((row + col) % 2) * Math.PI / 8)
      ctx.globalAlpha = 0.82
      ctx.fill(new Path2D(starPath(0, 0, s, s * 0.42)))
      ctx.restore()
    }
  }

  /* the medallion */
  ctx.save()
  ctx.translate(512, 512)
  ctx.fillStyle = GLAZES.cobalt
  ctx.fill(new Path2D(starPath(0, 0, 215, 92)))
  ctx.rotate(Math.PI / 8)
  ctx.fillStyle = GLAZES.terra
  ctx.fill(new Path2D(starPath(0, 0, 150, 64)))
  ctx.rotate(Math.PI / 8)
  ctx.fillStyle = '#e9dfc2'
  ctx.fill(new Path2D(starPath(0, 0, 84, 34)))
  ctx.fillStyle = GLAZES.brass
  ctx.fillRect(-22, -22, 44, 44)
  ctx.restore()

  /* corner diamonds */
  ctx.fillStyle = GLAZES.emerald
  for (const [cx, cy] of [[215, 215], [809, 215], [215, 809], [809, 809]]) {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(Math.PI / 4)
    ctx.fillRect(-38, -38, 76, 76)
    ctx.restore()
  }

  /* the pile — thousands of fine threads over the pattern */
  for (let i = 0; i < 26000; i++) {
    fiberStroke(ctx, Math.random() * 1024, Math.random() * 1024, 2 + Math.random() * 5, 0.02 + Math.random() * 0.05)
  }
  return c
}

/** Monochrome pile map — same strokes, for the bump map. */
function drawPile(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = 1024
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, 1024, 1024)
  for (let i = 0; i < 26000; i++) {
    fiberStroke(ctx, Math.random() * 1024, Math.random() * 1024, 2 + Math.random() * 5, 0.03 + Math.random() * 0.06)
  }
  return c
}

/** The digital face: the geometric field behind the whole museum. */
function drawField(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = 1024
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#1b1712'
  ctx.fillRect(0, 0, 1024, 1024)

  const grid = 96
  for (let gx = 0; gx < 1024; gx += grid) {
    for (let gy = 0; gy < 1024; gy += grid) {
      const cx = gx + 48
      const cy = gy + 48
      const t = ((gx / grid + gy / grid) % 2) * 0.6 + 0.3
      ctx.strokeStyle = `rgba(196, 196, 255, ${0.05 + t * 0.09})`
      ctx.lineWidth = 1.6
      ctx.stroke(new Path2D(starPath(cx, cy, 30, 13)))
      if ((gx / grid + gy / grid) % 2 === 1) {
        ctx.fillStyle = `rgba(197, 149, 76, ${0.05 + t * 0.07})`
        ctx.fillRect(cx - 7, cy - 7, 14, 14)
      }
    }
  }
  ctx.strokeStyle = 'rgba(205, 160, 88, 0.08)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 1024; i += grid / 2) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, 1024)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(1024, i)
    ctx.stroke()
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
    camera.position.set(0, 0.62, 1.15)

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

    const geo = new THREE.PlaneGeometry(5, 3.2, 96, 64)
    const base = new Float32Array(geo.attributes.position.array)
    const uv = geo.attributes.uv.array as Float32Array

    const wool = new THREE.CanvasTexture(drawWool())
    wool.anisotropy = 4
    const pile = new THREE.CanvasTexture(drawPile())
    const field = new THREE.CanvasTexture(drawField())
    field.anisotropy = 4

    const rugMat = new THREE.MeshStandardMaterial({
      map: wool,
      bumpMap: pile,
      bumpScale: 0.055,
      roughness: 1,
      metalness: 0,
      transparent: true,
      depthWrite: true,
    })
    const fieldMat = new THREE.MeshStandardMaterial({
      map: field,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      roughness: 0.85,
      metalness: 0.08,
    })
    const rug = new THREE.Mesh(geo, rugMat)
    root.add(rug)
    const fieldMesh = new THREE.Mesh(geo, fieldMat)
    fieldMesh.position.z = 0.03
    root.add(fieldMesh)

    /* pointer parallax */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    /* camera key poses for the four chapters */
    const POSES = [
      { x: 0, y: 0.62, z: 1.15, lx: 0, ly: 0.5, lz: 0 }, // 01 material — arm's length from the wool
      { x: 0, y: 0.42, z: 4.7, lx: 0, ly: 0, lz: 0 }, // 02 craft — the whole rug hangs
      { x: 0, y: 5.4, z: 1.9, lx: 0, ly: 0, lz: 0 }, // 03 culture — above, pattern as map
      { x: 0, y: 6.0, z: 1.0, lx: 0, ly: 0, lz: 0 }, // 04 digital — into the field
    ]

    /* pause when the loom is offscreen */
    let visible = true
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { rootMargin: '15% 0px 15% 0px' }
    )
    io.observe(canvas)

    let raf = 0
    const clock = new THREE.Clock()
    const pos = new THREE.Vector3()
    const look = new THREE.Vector3()

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime
      if (!visible) {
        renderer.render(scene, camera)
        return
      }

      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 2.4)
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 2.4)

      const p = control.current.p
      const ch1 = clamp01(p * 4)
      const ch2 = clamp01((p - 0.25) * 4)
      const ch3 = clamp01((p - 0.5) * 4)
      const ch4 = clamp01((p - 0.75) * 4)
      const u = Math.min(2.999, p * 3)
      const seg = Math.floor(u)
      const f = smooth(u - seg)
      const A = POSES[seg]
      const B = POSES[Math.min(3, seg + 1)]
      pos.set(
        A.x + (B.x - A.x) * f,
        A.y + (B.y - A.y) * f,
        A.z + (B.z - A.z) * f
      )
      look.set(
        A.lx + (B.lx - A.lx) * f,
        A.ly + (B.ly - A.ly) * f,
        A.lz + (B.lz - A.lz) * f
      )

      /* hanging parallax while the rug still faces the visitor */
      const hang = 1 - ch3
      camera.position.x = pos.x + pointer.x * 0.32 * hang
      camera.position.y = pos.y + pointer.y * 0.18 * hang
      camera.position.z = pos.z
      camera.lookAt(look.x, look.y, look.z)

      /* the rug: unrolls, bends, then lies flat and expands */
      root.rotation.x = -ch3 * (Math.PI / 2) - ch4 * 0.28
      root.rotation.y = (pointer.x * 0.14 - pointer.y * 0.05) * hang - ch3 * 0.24 - ch4 * 0.18
      root.rotation.z = pointer.x * 0.05 * hang + ch4 * 0.1
      root.scale.x = (0.3 + 0.7 * ch2) * (1 + 1.55 * ch3)
      root.scale.y = 1 + 1.55 * ch3
      root.scale.z = 1 + 1.4 * ch3
      root.position.x = -ch3 * 1.7 - ch4 * 0.9
      root.position.y = -0.18 - ch3 * 0.35

      /* cloth bend: the suspended sag, then a slow living wave */
      const sag = 0.3 * ch2
      const wave = 0.05 * Math.sin(t * 0.7) * (1 - ch4 * 0.7)
      const arr = geo.attributes.position.array as Float32Array
      for (let i = 0; i < arr.length; i += 3) {
        const vi = i / 3
        const ny = uv[vi * 2 + 1]
        const nx = uv[vi * 2] * 2 - 1
        arr[i + 1] = base[i + 1] - sag * Math.pow(1 - ny, 1.5) - wave * Math.sin(ny * Math.PI) * Math.sin(nx * Math.PI * 1.8 + t * 0.9)
      }
      geo.attributes.position.needsUpdate = true
      geo.computeVertexNormals()

      /* digital handover */
      const alpha = smooth(ch4)
      rugMat.opacity = 1 - alpha
      fieldMat.opacity = alpha
      rugMat.bumpScale = 0.055 * (1 - alpha)

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
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', resize)
      geo.dispose()
      wool.dispose()
      pile.dispose()
      field.dispose()
      rugMat.dispose()
      fieldMat.dispose()
      renderer.dispose()
    }
  }, [reduced, control])

  if (reduced) return null

  return <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
}
