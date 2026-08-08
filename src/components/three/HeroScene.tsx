'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sparkles, Float } from '@react-three/drei'
import * as THREE from 'three'
import { qualityDefaults, type QualityTier } from '@/hooks/useQuality'
import { scrollState, pointerState } from '@/lib/animations/scrollState'
import { auroraVertexShader, auroraFragmentShader, createAuroraUniforms } from './shaders'

const SCALE_BY_TIER: Record<QualityTier, number> = { high: 1, medium: 0.85, low: 0.7 }

function Nebula({ tier }: { tier: QualityTier }) {
  const mesh = useRef<THREE.Mesh>(null)
  const uniforms = useRef(createAuroraUniforms())

  useFrame(({ clock }) => {
    const u = uniforms.current
    u.uTime.value = clock.elapsedTime
    u.uDetail.value = tier === 'medium' ? 0.5 : 1
    u.uMouse.value.x = THREE.MathUtils.lerp(u.uMouse.value.x, pointerState.x + 0.5, 0.04)
    u.uMouse.value.y = THREE.MathUtils.lerp(u.uMouse.value.y, -pointerState.y + 0.5, 0.04)
    u.uProgress.value = THREE.MathUtils.lerp(u.uProgress.value, scrollState.progress, 0.06)

    /* as the visitor leaves the hero the atmosphere sinks past the core
       and flattens — the pages keeps one continuous sky */
    if (mesh.current) {
      const s = scrollState.progress
      mesh.current.position.y = 0.4 + s * 2.6
      mesh.current.rotation.z = s * 0.16
    }
  })

  if (tier === 'low') return null

  return (
    <mesh ref={mesh} position={[0, 0.4, -16]}>
      <planeGeometry args={[22, 11]} />
      <shaderMaterial
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        uniforms={uniforms.current}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function Core({ tier }: { tier: QualityTier }) {
  const group = useRef<THREE.Group>(null)
  const material = useRef<{ emissiveIntensity: number; opacity: number } | null>(null)

  useFrame(({ clock, camera }, delta) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointerState.x * 0.3, 0.03)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointerState.y * 0.15, 0.03)
    camera.lookAt(0, 0, 0)

    const g = group.current
    if (!g) return
    const t = clock.elapsedTime
    const s = scrollState.progress
    const v = THREE.MathUtils.clamp(Math.abs(scrollState.velocity) * 0.012, 0, 1)

    /* dissolve + drift off-axis as the manifesto takes over */
    const heroFade = THREE.MathUtils.clamp(1 - s * 3.2, 0, 1)

    g.position.x = 1.35 - s * 1.1
    g.position.y = Math.sin(t * 0.32) * 0.16 + s * 0.5
    g.rotation.y += delta * (0.12 + v * 1.6)
    g.rotation.x = Math.sin(t * 0.2) * 0.07

    const scale = 1.05 * SCALE_BY_TIER[tier] * (1 + s * 0.5)
    g.scale.setScalar(scale)

    if (material.current) {
      material.current.emissiveIntensity = (0.42 + s * 0.3) * heroFade
      material.current.opacity = heroFade
    }
    g.visible = heroFade > 0.01
  })

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.1}>
        <mesh>
          <icosahedronGeometry args={[1.35, 3]} />
          <MeshDistortMaterial
            ref={(m) => {
              material.current = m as { emissiveIntensity: number; opacity: number } | null
            }}
            color="#8b85d8"
            emissive="#5b21b6"
            emissiveIntensity={0.55}
            roughness={0.16}
            metalness={0.9}
            transparent
            opacity={1}
            distort={0.4}
            speed={1.7}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.62, 1]} />
          <meshBasicMaterial wireframe color="#8b5cf6" transparent opacity={0.14} />
        </mesh>
      </Float>
    </group>
  )
}

function Dust({ tier }: { tier: QualityTier }) {
  return (
    <Sparkles
      count={qualityDefaults[tier].particles}
      scale={[16, 9, 7]}
      size={1.4}
      speed={0.22}
      opacity={0.4}
      color="#a78bfa"
    />
  )
}

interface HeroSceneProps {
  tier: QualityTier
  frameloop?: 'always' | 'never'
}

export function HeroScene({ tier, frameloop = 'always' }: HeroSceneProps) {
  return (
    <Canvas
      frameloop={frameloop}
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      dpr={qualityDefaults[tier].dpr}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="!absolute inset-0"
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 4]} intensity={2.4} color="#8b5cf6" />
      <pointLight position={[-5, -2, 2]} intensity={1.8} color="#4338ca" />
      <Nebula tier={tier} />
      <Core tier={tier} />
      <Dust tier={tier} />
    </Canvas>
  )
}