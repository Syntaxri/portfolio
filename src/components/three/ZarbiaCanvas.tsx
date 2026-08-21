'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  Box3,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  MathUtils,
  MeshStandardMaterial,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  Timer,
  Vector3,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useQualityTier } from '@/hooks/useQuality'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { glRegistry, museumState } from '@/lib/fx/museumState'

/*
 * ZARBIA — the loom interlude, now wearing the real thing.
 * The Atlas runner itself — a hand-modelled, game-ready carpet — hangs
 * in the middle of the room. When it first enters the frame it weaves
 * itself in: a glowing ember thread sweeps the length of the pile,
 * wool lifting at the weave-front while sparks swarm the live row.
 * Afterward it simply lives — the pile breathes, gold dust drifts,
 * a slow sheen crosses the wool every half-minute — and as the visitor
 * scrolls on, the runner turns, drifts back, and lets them walk past.
 *
 * Model: "Game Ready Carpet" — Voidy Entertainment (Sketchfab),
 * CC-BY-NC-4.0 · https://sketchfab.com/VoidyAssets
 */

const MODEL_URL = '/models/zarbia.glb'

/* how wide the runner stands in the room, in world units */
const RUG_TARGET_W = 6.6
/* resting recline of the hang — near-vertical tapestry, leaning back */
const HANG_TILT = 1.31
/* seconds for the weave-in reveal */
const REVEAL_S = 3.4
/* the reveal front shares one parametrisation between both shader
   stages: zp = uReveal * (1 + 2·PAD) − PAD, so at rest nothing
   discards and nothing glows */
const REVEAL_PAD = 0.18

/* resting weave pacing: the wool breathes slowly, so a lower frame
   rate is invisible until the visitor steers */
const IDLE_FRAME_DIVISOR = 10
const ACTIVE_AFTER_MS = 1200

const PARTICLE_COUNT: Record<string, number> = { high: 650, medium: 380, low: 150 }

function detectTier() {
  const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches
  const cores =
    typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 8
  if (coarse) return Math.min(window.devicePixelRatio, 1.5)
  if (cores <= 4) return Math.min(window.devicePixelRatio, 1.5)
  return Math.min(window.devicePixelRatio, 2)
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => {
  const t = clamp01(a)
  return t * t * (3 - 2 * t)
}
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** soft round glow for the kiln-halo behind the runner */
function drawHalo(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 128)
  g.addColorStop(0, 'rgba(255, 214, 156, 0.55)')
  g.addColorStop(0.45, 'rgba(214, 140, 70, 0.18)')
  g.addColorStop(1, 'rgba(120, 60, 24, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  return c
}

export interface ZarbiaControl {
  /** scroll progress through the loom, 0..1 */
  p: number
}

export function ZarbiaCanvas({ control }: { control: React.MutableRefObject<ZarbiaControl> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const quality = useQualityTier()
  /* null once the runner is off the loom (loaded); 0..1 while loading */
  const [progress, setProgress] = useState<number | null>(0)
  const progressPct = useRef(-1)

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return

    let raf = 0
    let alive = true
    let visible = true

    const renderer = new WebGLRenderer({
      canvas,
      antialias: quality !== 'low',
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(detectTier())
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12

    const scene = new Scene()
    const camera = new PerspectiveCamera(50, 1, 0.05, 60)
    camera.position.set(0, 0.35, 4.8)
    camera.lookAt(0, 0, 0)

    /* light: a warm kiln light from the left, a cool glaze rim from the back */
    const warm = new DirectionalLight(0xffe9c9, 2.6)
    warm.position.set(3.5, 5, 6)
    scene.add(warm)
    const rim = new DirectionalLight(0x8fb0ff, 1.1)
    rim.position.set(-5, 2, -4)
    scene.add(rim)
    scene.add(new AmbientLight(0xfff3df, 0.65))

    /* stage hierarchy —
       root:   scroll turn/drift/scale + the float
       hang:   the tapestry recline; sway lives here too
       holder: the model itself, centred and scaled to the room */
    const root = new Group()
    const hang = new Group()
    const holder = new Group()
    hang.rotation.x = HANG_TILT
    root.add(hang)
    hang.add(holder)
    scene.add(root)

    /* shared weave clock — cloth, sparks and dust all read it */
    const uni = {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      /* object-space amplitudes, re-derived from the fit on resize */
      uLiftObj: { value: 0.6 },
      uWaveObj: { value: 0.25 },
      uEdgeColor: { value: new Color(1.0, 0.62, 0.28) },
      uSheenColor: { value: new Color(1.0, 0.93, 0.78) },
    }

    /* ---- the dust -------------------------------------------------------
       sparks crowd the weave-front while the loom runs; afterward they
       thin into gold motes drifting across the runner. Every particle
       is computed in the vertex shader from its seed — the CPU never
       touches them. */
    const dustCount = PARTICLE_COUNT[quality] ?? 380
    const dustGeo = new BufferGeometry()
    const dustPos = new Float32Array(dustCount * 3)
    const dustSeed = new Float32Array(dustCount * 4)
    for (let i = 0; i < dustCount * 4; i++) dustSeed[i] = Math.random()
    dustGeo.setAttribute('position', new BufferAttribute(dustPos, 3))
    dustGeo.setAttribute('aSeed', new BufferAttribute(dustSeed, 4))
    const dustUni = {
      uTime: uni.uTime,
      uReveal: uni.uReveal,
      uFade: { value: 1 },
      uHalf: { value: new Vector3(3.3, 2.15, 0) },
      uPr: { value: renderer.getPixelRatio() },
    }
    const dustMat = new ShaderMaterial({
      uniforms: dustUni,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute vec4 aSeed;
        uniform float uTime;
        uniform float uReveal;
        uniform vec3 uHalf;
        uniform float uPr;
        varying float vAlpha;
        varying float vWarm;

        void main() {
          float cycle = fract(uTime * (0.04 + aSeed.w * 0.05) + aSeed.x);

          /* resting field: spread across the whole runner */
          vec3 p = vec3(
            (aSeed.y * 2.0 - 1.0) * uHalf.x,
            cycle * (0.5 + aSeed.z * 0.7) - uHalf.y * 0.45,
            (aSeed.z * 2.0 - 1.0) * uHalf.y
          );
          p.x += sin(uTime * (0.3 + aSeed.y) + aSeed.z * 40.0) * 0.08;

          /* while the weave runs, the sparks crowd the live row */
          float sparkMix = 1.0 - smoothstep(0.72, 1.0, uReveal);
          float frontX = mix(-uHalf.x * 1.02, uHalf.x * 1.02, uReveal);
          p.x = mix(p.x, frontX + (aSeed.w * 2.0 - 1.0) * 0.55, sparkMix);
          p.y = mix(p.y, (cycle - 0.15) * (0.35 + aSeed.z * 0.5), sparkMix);
          p.z = mix(p.z, (aSeed.y * 2.0 - 1.0) * 0.25, sparkMix);

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float twinkle = 0.55 + 0.45 * sin(uTime * (1.5 + aSeed.x * 4.0) + aSeed.y * 43.0);
          float lifeIn = smoothstep(0.0, 0.12, cycle);
          float lifeOut = 1.0 - smoothstep(0.82, 1.0, cycle);
          vAlpha = lifeIn * lifeOut * twinkle * mix(0.38, 0.95, sparkMix);
          vWarm = aSeed.w;
          gl_Position = projectionMatrix * mv;
          gl_PointSize =
            (1.6 + aSeed.x * 4.2) * uPr * mix(1.0, 1.7, sparkMix) * (5.2 / max(1.0, -mv.z));
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uFade;
        varying float vAlpha;
        varying float vWarm;

        void main() {
          float d = length(gl_PointCoord - 0.5);
          float disc = smoothstep(0.5, 0.06, d);
          vec3 col = mix(vec3(1.0, 0.77, 0.47), vec3(1.0, 0.54, 0.25), vWarm);
          float a = disc * vAlpha * uFade;
          if (a < 0.003) discard;
          gl_FragColor = vec4(col, a);
        }
      `,
    })
    const dust = new Points(dustGeo, dustMat)
    dust.frustumCulled = false
    hang.add(dust)

    /* the kiln-halo: a breath of warm light behind the wool */
    const haloTex = new CanvasTexture(drawHalo())
    const haloMat = new SpriteMaterial({
      map: haloTex,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const halo = new Sprite(haloMat)
    halo.position.set(0, 0, -0.9)
    hang.add(halo)

    /* ---- responsive fit: the runner always fits the room --------------- */
    let fit = 1
    let modelS0 = 1
    let shiftX = 0
    const fitRoom = () => {
      const visH = 2 * 4.8 * Math.tan(MathUtils.degToRad(camera.fov / 2))
      const visW = visH * camera.aspect
      fit = Math.min(1, (visW * 0.92) / RUG_TARGET_W)
      /* wide rooms: the reading column owns the left wall — the runner
         leans right so text and textile share the frame */
      shiftX = camera.aspect > 1.2 ? 0.55 : 0
      root.position.x = shiftX
      /* shader amplitudes are authored in world units, expressed here
         in the carpet's own enormous object space */
      const s = Math.max(1e-4, modelS0 * fit)
      uni.uLiftObj.value = 0.055 / s
      uni.uWaveObj.value = 0.022 / s
    }
    fitRoom()

    /* ---- the runner itself --------------------------------------------- */
    const rugMats: MeshStandardMaterial[] = []
    const disposables: Set<{ dispose: () => void }> = new Set()

    let revealStart = -1
    let lastP = control.current.p
    let lastActivity = performance.now()
    let frame = 0

    const glSource = {
      stats: () => ({
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
      }),
      gpu: () => null,
    }
    glRegistry.register(glSource)

    /* pause when the loom is offscreen */
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { rootMargin: '15% 0px 15% 0px' }
    )
    io.observe(canvas)

    /* pointer parallax */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2
      lastActivity = performance.now()
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    new GLTFLoader().load(
      MODEL_URL,
      (gltf) => {
        if (!alive) return
        const rugRoot = gltf.scene as Group

        /* centre the carpet on its pivot, then size it to the room */
        const box = new Box3().setFromObject(rugRoot)
        const size = new Vector3()
        const center = new Vector3()
        box.getSize(size)
        box.getCenter(center)
        modelS0 = RUG_TARGET_W / Math.max(size.x, 1e-4)
        holder.scale.setScalar(modelS0)
        rugRoot.position.set(-center.x, -center.y, -center.z)
        holder.add(rugRoot)
        fitRoom()

        /* the halo takes the runner's measure (its depth becomes the
           hanging height once reclined) */
        halo.scale.set(size.x * modelS0 * 1.5, size.z * modelS0 * 1.9, 1)
        dustUni.uHalf.value.set((size.x * modelS0) / 2, (size.z * modelS0) / 2, 0)

        /* every surface the model brought gets the weave treatment */
        const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy())
        rugRoot.traverse((o) => {
          const mesh = o as { geometry?: { dispose(): void }; material?: unknown }
          if (!mesh.geometry) return
          disposables.add(mesh.geometry)
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          for (const mat of mats) {
            const std = mat as MeshStandardMaterial | undefined
            if (!std || !std.isMeshStandardMaterial) continue
            rugMats.push(std)
            disposables.add(std)
            for (const value of Object.values(std)) {
              if (value && typeof value === 'object' && 'isTexture' in value) {
                ;(value as { anisotropy: number }).anisotropy = maxAniso
                disposables.add(value as { dispose(): void })
              }
            }
            std.transparent = true
            std.side = DoubleSide
            /* stitch the loom into the PBR surface: the reveal sweep,
               the breathing pile, the travelling sheen */
            std.onBeforeCompile = (shader) => {
              Object.assign(shader.uniforms, uni)
              const pad = REVEAL_PAD.toFixed(4)
              const span = (1 + REVEAL_PAD * 2).toFixed(4)
              shader.vertexShader =
                `
                varying vec2 vZarbiaUv;
                uniform float uTime;
                uniform float uReveal;
                uniform float uLiftObj;
                uniform float uWaveObj;
                ` + shader.vertexShader
              shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `#include <begin_vertex>
                vZarbiaUv = uv;
                float zFront = uReveal * ${span} - ${pad};
                float zBreathe = uWaveObj * smoothstep(0.82, 1.0, uReveal)
                  * sin(vZarbiaUv.y * 6.2832 + uTime * 0.5)
                  * sin(vZarbiaUv.x * 9.4248 - uTime * 0.35);
                float zLift = exp(-pow((zFront - vZarbiaUv.x) * 8.0, 2.0));
                transformed.y += zBreathe + zLift * uLiftObj;`
              )
              shader.fragmentShader =
                `
                varying vec2 vZarbiaUv;
                uniform float uTime;
                uniform float uReveal;
                uniform vec3 uEdgeColor;
                uniform vec3 uSheenColor;
                ` + shader.fragmentShader
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <clipping_planes_fragment>',
                `#include <clipping_planes_fragment>
                float zarbiaEdge = 0.0;
                float zarbiaSheen = 0.0;
                {
                  float zFront = uReveal * ${span} - ${pad};
                  float zD = zFront - vZarbiaUv.x;
                  if (zD < 0.0) discard;
                  zarbiaEdge = smoothstep(0.13, 0.0, zD);
                  zarbiaEdge *= 0.72 + 0.28 * sin(vZarbiaUv.x * 240.0 - uTime * 24.0);
                  float zC = 1.28 - fract(uTime * 0.026) * 1.62;
                  zarbiaSheen = smoothstep(0.17, 0.0, abs(vZarbiaUv.x - zC));
                }`
              )
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <emissivemap_fragment>',
                `#include <emissivemap_fragment>
                totalEmissiveRadiance += uEdgeColor * zarbiaEdge * 1.7;
                totalEmissiveRadiance += uSheenColor * zarbiaSheen * 0.15;`
              )
            }
            std.customProgramCacheKey = () => 'zarbia-weave'
            std.needsUpdate = true
          }
        })

        setProgress(null)
      },
      (ev) => {
        if (!alive || !ev.total) return
        const pct = Math.floor((ev.loaded / ev.total) * 100)
        if (pct >= progressPct.current + 3) {
          progressPct.current = pct
          setProgress(pct / 100)
        }
      },
      (err) => {
        console.warn('[zarbia] the loom could not load the runner', err)
        if (alive) setProgress(null)
      }
    )

    const timer = new Timer()

    const tick = () => {
      raf = requestAnimationFrame(tick)
      timer.update()
      const dt = Math.min(timer.getDelta(), 0.05)
      const t = timer.getElapsed()
      /* the loom is offscreen: stop paying for it entirely */
      if (!visible) return

      const rp = revealStart < 0 ? 0 : clamp01((t - revealStart) / REVEAL_S)
      uni.uReveal.value = easeInOutCubic(rp)
      uni.uTime.value = t

      /* resting weave: low cadence until steered; the reveal always
         counts as steering — it must run at full rate */
      const p = control.current.p
      const steered =
        rp < 1 || Math.abs(p - lastP) > 0.0005 || performance.now() - lastActivity < ACTIVE_AFTER_MS
      lastP = p
      frame++
      if (!steered && frame % IDLE_FRAME_DIVISOR !== 0) return

      /* the first seen frame starts the loom */
      if (revealStart < 0) revealStart = t

      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 2.4)
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 2.4)

      museumState.weave = p

      /* the camera holds its ground — only a slow parallax lean */
      camera.position.x = pointer.x * 0.16
      camera.position.y = 0.35 + pointer.y * 0.12
      camera.lookAt(0, -0.05, 0)

      /* the float: the runner rises into place as the weave closes,
         then hangs there, swaying gently, alive */
      const settle = 1 - easeInOutCubic(rp)
      const sway = Math.sin(t * 0.32) * 0.03
      hang.rotation.x = HANG_TILT - pointer.y * 0.045 + Math.sin(t * 0.41) * 0.012
      hang.rotation.z = sway + pointer.x * 0.03
      root.rotation.y = (p - 0.5) * 0.5 + sway * 0.6 + pointer.x * 0.07
      root.position.y = Math.sin(t * 0.5) * 0.05 - 0.28 * settle
      root.position.z = p * 1.1
      root.scale.setScalar(fit * (0.94 + 0.06 * easeInOutCubic(rp)) * Math.max(0.4, 1 - p * 0.08))

      /* the runner lets the visitor walk on */
      const fade = smooth((p - 0.55) / 0.45)
      const op = 1 - fade * 0.78
      for (const m of rugMats) m.opacity = op
      haloMat.opacity = 0.16 * (1 - fade)
      dustUni.uFade.value = 1 - fade * 0.85

      renderer.render(scene, camera)
    }
    tick()

    const resize = () => {
      const w = canvas.clientWidth || 1
      const h = canvas.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      fitRoom()
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      io.disconnect()
      glRegistry.unregister(glSource)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', resize)
      disposables.forEach((d) => d.dispose())
      dustGeo.dispose()
      dustMat.dispose()
      haloTex.dispose()
      haloMat.dispose()
      renderer.dispose()
    }
  }, [reduced, control, quality])

  if (reduced) return null

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
      {progress !== null && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[12%] flex justify-center"
        >
          <div className="h-[2px] w-36 overflow-hidden rounded bg-text/10">
            <div
              className="h-full bg-gold transition-[width] duration-300 ease-out"
              style={{
                width: `${Math.max(4, Math.round(progress * 100))}%`,
                opacity: progress === 0 ? 0.25 : 0.8,
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
