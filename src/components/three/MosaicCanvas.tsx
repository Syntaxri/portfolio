'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { zelligePieces, starPoints, GLAZE_HEX, type ZelligePiece } from '@/lib/geometry'
import { glRegistry, museumState } from '@/lib/fx/museumState'

/*
 * MOSAIC — the entrance installation.
 * A full eight-fold Zellige, assembled from raw geometry: one
 * cobalt star bound by eight glazed diamonds, ivory squares between the
 * points, brass studs on the rim. On arrival the pieces fly in from the
 * far ring and lock into place; pointer movement leans the whole
 * composition; scrolling grinds it slowly apart as the visitor walks on.
 *
 * The Zellige is alive: every settled star feels the cursor — scales a
 * little toward it, leans its glaze, turns with a slow inertia. A
 * double-click (or double-tap, or Enter with focus) fires the kiln
 * again: a new deterministic seed recomposes the whole pattern in the
 * same geometry language, never the same room twice.
 * No textures, no images — cut ceramic, computed.
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

function starGeometry(outer: number, inner: number, depth: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape(starPoints(outer, inner, 8).map((p) => new THREE.Vector2(p.x, p.y)))
  shape.closePath()
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.028,
    bevelSegments: 1,
  })
}

function diamondGeometry(size: number, depth: number): THREE.ExtrudeGeometry {
  const s = new THREE.Shape()
  s.moveTo(0, size)
  s.lineTo(size, 0)
  s.lineTo(0, -size)
  s.lineTo(-size, 0)
  s.closePath()
  return new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.028,
    bevelSegments: 1,
  })
}

function squareGeometry(size: number, depth: number): THREE.ExtrudeGeometry {
  const s = new THREE.Shape()
  s.moveTo(-size, -size)
  s.lineTo(size, -size)
  s.lineTo(size, size)
  s.lineTo(-size, size)
  s.closePath()
  return new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.024,
    bevelSegments: 1,
  })
}

/** lazily resolved GPU label — guarded, and only on demand */
function gpuLabel(renderer: THREE.WebGLRenderer): string | null {
  try {
    const gl = renderer.getContext()
    const ext = gl.getExtension('WEBGL_debug_renderer_info') as {
      UNMASKED_RENDERER_WEBGL?: number
    } | null
    if (!ext || ext.UNMASKED_RENDERER_WEBGL === undefined) return null
    const name = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
    return typeof name === 'string' && name.length > 0 ? name : null
  } catch {
    return null
  }
}

interface RigidPiece {
  group: THREE.Group
  mesh: THREE.Mesh
  material: THREE.MeshStandardMaterial
  baseColor: THREE.Color
  glowColor: THREE.Color
  start: THREE.Vector3
  final: THREE.Vector3
  startRot: number
  finalRot: number
  delay: number
  duration: number
  drift: number
  phase: number
  /** deterministic depth band under the composition (front → back):
   *  star 0.50–0.66, studs 0.34–0.48, squares 0.18–0.32, diamonds 0–0.16.
   *  The rings interlock in plan (zellige), but their extruded bands must
   *  never share a plane — identical depths with overlapping XY extents
   *  produce coplanar faces and depth-buffer striping. */
  z: number
  /** inertia state for the star's idle turn */
  rotVel: number
  targetRot: number
}

/** depth band per ring, so no two overlapping faces ever share a z-plane */
function layerZ(p: ZelligePiece): number {
  if (p.kind === 'star') return 0.5
  if (p.kind === 'diamond') return 0
  /* studs are small squares riding the outer rim */
  return p.scale < 0.5 ? 0.34 : 0.18
}

/** how close the cursor has to be (world units) before a star feels it */
const NEAR_RADIUS = 3.4
/** the strongest the composition leans, per piece */
const NEAR_STRENGTH = 0.07

export function MosaicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return

    const tier = detectTier()
    const mobile = window.innerWidth < 768

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(tier)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60)
    camera.position.set(0, 0.25, 16.9)
    camera.lookAt(0, 0, 0)

    const warm = new THREE.DirectionalLight(0xffe8c8, 2.1)
    warm.position.set(4, 5.5, 7)
    scene.add(warm)
    const azul = new THREE.DirectionalLight(0x8fb0ff, 0.9)
    azul.position.set(-6, -2.5, 5)
    scene.add(azul)
    const fill = new THREE.AmbientLight(0xfff6e6, 0.85)
    scene.add(fill)

    const root = new THREE.Group()
    scene.add(root)

    const DEPTH = { star: 0.16, diamond: 0.16, square: 0.14 }

    let rigids: RigidPiece[] = []

    const disposePieces = () => {
      for (const r of rigids) {
        root.remove(r.group)
        r.mesh.geometry.dispose()
        r.material.dispose()
      }
      rigids = []
    }

    const build = (seed: number) => {
      disposePieces()
      museumState.zelligeSeed = seed
      const pieces = zelligePieces(mobile, seed)
      museumState.zelligePieces = pieces.length

      for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i]
        const group = new THREE.Group()
        group.position.set(
          Math.cos(p.angle) * p.radius,
          Math.sin(p.angle) * p.radius - 0.15,
          0
        )
        group.rotation.z = p.rotation

        const hex = GLAZE_HEX[p.glaze]
        const dark = GLAZE_HEX[`${p.glaze}Dark` as keyof typeof GLAZE_HEX]
        const material = new THREE.MeshStandardMaterial({
          color: hex,
          flatShading: true,
          roughness: 0.55,
          metalness: p.glaze === 'brass' ? 0.55 : 0.1,
          emissive: dark,
          emissiveIntensity: 0.12,
        })
        let geometry: THREE.BufferGeometry
        switch (p.kind) {
          case 'star':
            geometry = starGeometry(2.4, 1.05, DEPTH.star)
            break
          case 'diamond':
            geometry = diamondGeometry(1.5, DEPTH.diamond)
            break
          default:
            geometry = squareGeometry(0.75, DEPTH.square)
        }
        const mesh = new THREE.Mesh(geometry, material)
        mesh.scale.setScalar(p.scale)
        group.add(mesh)
        root.add(group)

        const final = group.position.clone()
        const start = new THREE.Vector3().copy(final).multiplyScalar(2.35)
        const baseColor = new THREE.Color(hex)
        rigids.push({
          group,
          mesh,
          material,
          baseColor,
          glowColor: baseColor.clone().lerp(new THREE.Color('#fff8ea'), 0.22),
          start,
          final,
          startRot: p.rotation + (Math.PI / 2) * (i % 2 === 0 ? 1 : -1),
          finalRot: p.rotation,
          delay: 0.5 + p.order * 0.14,
          duration: 1.05,
          drift: 0.035 + (i % 5) * 0.012,
          phase: i * 1.7,
          z: layerZ(p),
          rotVel: 0,
          targetRot: p.rotation,
        })
      }
    }

    build(0)

    /* pointer parallax */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    /* the visitor's hand, in the Zellige's world units */
    const hand = { x: 0, y: 0 }

    /* firing the kiln: double-click, double-tap, or Enter on the canvas */
    let lastFire = 0
    const taps = { t: 0, x: 0, y: 0 }
    const fireKiln = () => {
      const now = performance.now()
      if (now - lastFire < 700) return
      lastFire = now
      museumState.regens += 1
      build(Math.floor(Math.random() * 0x7fffffff))
    }
    const onPointerDown = (e: PointerEvent) => {
      const now = performance.now()
      const d = Math.hypot(e.clientX - taps.x, e.clientY - taps.y)
      if (now - taps.t < 480 && d < 80) {
        taps.t = 0
        fireKiln()
        return
      }
      taps.t = now
      taps.x = e.clientX
      taps.y = e.clientY
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        fireKiln()
      }
    }
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('keydown', onKeyDown)

    /* scroll breakup */
    let scroll = 0
    const onScroll = () => {
      scroll = Math.min(window.scrollY / window.innerHeight, 1.25)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    /* pause when the entrance is offscreen */
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
      gpu: () => gpuLabel(renderer),
    }
    glRegistry.register(glSource)

    let raf = 0
    const clock = new THREE.Clock()
    const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime

      if (!visible) {
        renderer.render(scene, camera)
        return
      }

      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 2.2)
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 2.2)
      hand.x = pointer.x * 5.2
      hand.y = pointer.y * 4.6

      for (const r of rigids) {
        /* pieces fly in from the far ring, outside in, then settle */
        const local = Math.min(1, Math.max(0, (t - r.delay) / r.duration))
        if (local < 1) {
          const e = easeOutExpo(local)
          r.group.position.lerpVectors(r.start, r.final, e)
          r.group.position.z = r.z
          r.group.rotation.z = r.startRot + (r.finalRot - r.startRot) * e
          r.group.scale.setScalar(Math.max(0.01, e))
        } else {
          /* settled: gentle float + pointer depth */
          const near = Math.max(0, 1 - Math.hypot(r.final.x - hand.x, r.final.y - hand.y) / NEAR_RADIUS)
          const nearK = near * near * (3 - 2 * near)
          const lift = Math.sin(t * 0.7 + r.phase) * r.drift
          r.group.position.y = r.final.y + lift - pointer.y * 0.18 + scroll * 1.6
          r.group.position.x = r.final.x + pointer.x * 0.14
          /* the ring's own depth band rides the scroll drift as one */
          r.group.position.z = r.z + scroll * 4.2

          /* the star feels the visitor: a little bigger, a little warmer,
             turning with a slow inertia that never leaves the pattern */
          r.group.scale.setScalar(1 + nearK * NEAR_STRENGTH)
          r.targetRot =
            r.finalRot +
            pointer.x * 0.05 * Math.max(0, 1 - near / 6) +
            nearK * 0.12
          r.rotVel += (r.targetRot - r.group.rotation.z) * Math.min(1, dt * 8)
          r.rotVel *= 1 - Math.min(1, dt * 2.6)
          r.group.rotation.z += r.rotVel * Math.min(1, dt * 4)

          r.material.color.copy(r.baseColor).lerp(r.glowColor, nearK * 0.5)
          r.material.emissiveIntensity = 0.12 + nearK * 0.35
        }
      }

      /* the roll on scroll is safe: rotation about z never changes a
         piece's depth. The pointer yaw/pitch must stay small enough that
         a ring piece's depth swing (radius · sin θ) never crosses the
         z-band gaps (0.16–0.18) — otherwise a yawed diamond or square
         physically rides in front of the star and rasterizes across its
         tips. The parallax feel lives in the camera offsets below. */
      root.rotation.z = scroll * 0.16
      root.rotation.y = -pointer.x * 0.028
      root.rotation.x = pointer.y * 0.02
      root.position.y = -scroll * 0.9
      root.position.z = scroll * 5.4
      root.scale.setScalar(1 - scroll * 0.28)

      camera.position.x = pointer.x * 0.7
      camera.position.y = -pointer.y * 0.34 + 0.25
      camera.lookAt(0, 0, 0)

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
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('keydown', onKeyDown)
      disposePieces()
      renderer.dispose()
    }
  }, [reduced])

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      tabIndex={0}
      role="img"
      aria-label="The Zellige composition. Double-click it, or press Enter, to fire the kiln and weave a new pattern."
      className="h-full w-full touch-manipulation focus:outline-none"
    />
  )
}
