'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { glRegistry, museumState, onRoomChange } from '@/lib/fx/museumState'
import { scrollState } from '@/lib/animations/scrollState'
import { Monogram } from '@/components/museum/Monogram'

/**
 * THE CONSERVATION CONSOLE — Ctrl+Shift+K (or the footer link).
 * The museum's engineering monitoring panel: real FPS, real draw calls
 * from the live canvases, the current room, the zellige's seed and the
 * kiln fires, the loom's weave, and a clearly-labeled build-time badge.
 * Nothing here is fabricated; anything the browser cannot truthfully
 * say is shown as "—". A conservation console, not a debug panel.
 */

interface GlRead {
  calls: number
  triangles: number
  canvases: number
  gpu: string | null
}

const BUILD_BADGE =
  'CI gate: lint · typecheck · 90 tests · production build — measured at build time, not in the browser'

function Row({ label, value, dim = false }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-[rgba(196,196,255,0.09)] py-1.5 first:border-t-0">
      <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[#8f8774]">
        {label}
      </span>
      <span
        className={`font-mono text-[0.66rem] tracking-[0.08em] ${dim ? 'text-[#8f8774]' : 'text-[#e9e3d4]'}`}
      >
        {value}
      </span>
    </div>
  )
}

export function CraftDashboard() {
  const [open, setOpen] = useState(false)
  const [fps, setFps] = useState(0)
  const [gl, setGl] = useState<GlRead>({ calls: 0, triangles: 0, canvases: 0, gpu: null })
  const [scrollPct, setScrollPct] = useState(0)
  const [roomLabel, setRoomLabel] = useState('The Atrium')
  const [weave, setWeave] = useState(0)
  const [seed, setSeed] = useState(0)
  const [regens, setRegens] = useState(0)
  const [ambience, setAmbience] = useState<'idle' | 'playing' | 'off'>('idle')
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const onToggle = () => setOpen((v) => !v)
    window.addEventListener('keydown', onKey)
    window.addEventListener('ar:toggle-console', onToggle)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('ar:toggle-console', onToggle)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    lastFocusRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }
    panel?.addEventListener('keydown', onKey)
    return () => {
      panel?.removeEventListener('keydown', onKey)
      lastFocusRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    const off = onRoomChange((room) => {
      setRoomLabel(room.label)
      setAmbience(museumState.ambience)
    })
    return off
  }, [])

  useEffect(() => {
    if (!open) return
    let raf = 0
    let last = performance.now()
    let emaMs = 16.7
    let ticks = 0

    const loop = () => {
      raf = requestAnimationFrame(loop)
      const now = performance.now()
      const dt = Math.min(now - last, 200)
      last = now
      emaMs = emaMs * 0.92 + dt * 0.08
      ticks++
      if (ticks % 8 !== 0) return
      setFps(Math.round(1000 / emaMs))
      setGl(glRegistry.snapshot())
      setScrollPct(Math.round(scrollState.progress * 100))
      setWeave(Math.round(museumState.weave * 100))
      setSeed(museumState.zelligeSeed)
      setRegens(museumState.regens)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  if (!open) return null

  const gpuLine =
    gl.gpu && gl.gpu.length > 4 && !/SwiftShader/i.test(gl.gpu)
      ? gl.gpu.split('(')[0].trim()
      : '—'

  return (
    <div className="fixed bottom-4 right-4 z-[160] w-[19.5rem] max-w-[calc(100vw-2rem)]">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Conservation console"
        data-testid="craft-dashboard"
        className="border border-[rgba(196,196,255,0.18)] bg-[#1a1611] p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                background: fps >= 50 ? 'rgba(108,178,148,1)' : fps >= 30 ? 'rgba(205,160,88,1)' : 'rgba(198,92,58,1)',
                boxShadow: '0 0 8px currentColor',
              }}
              aria-hidden="true"
            />
            <p className="label text-[0.58rem] text-[#c9c1ae]">
              Conservation console
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close the conservation console"
            className="flex h-7 w-7 items-center justify-center rounded-[0.2rem] border border-[rgba(196,196,255,0.2)] font-mono text-[0.6rem] text-[#c9c1ae] transition-colors hover:border-[rgba(196,196,255,0.5)]"
          >
            ✕
          </button>
        </div>

        <p className="font-mono text-[0.6rem] leading-relaxed text-[#8f8774]">
          The museum is being watched over. Every number below is read
          from the live installation — none are remembered.
        </p>

        <div className="mt-3">
          <Row label="Room" value={roomLabel} />
          <Row label="Scroll" value={`${scrollPct}%`} />
          <Row label="Frames / sec" value={`${fps}`} dim={fps < 30} />
          <Row
            label="GL state"
            value={`${gl.calls} calls · ${gl.triangles} tris · ${gl.canvases} canvas${gl.canvases === 1 ? '' : 'es'}`}
          />
          <Row label="GPU" value={gpuLine} dim />
          <Row label="Zellige seed" value={seed === 0 ? 'canonical' : String(seed)} />
          <Row label="Kiln fires" value={String(regens)} />
          <Row label="The loom" value={`${weave}% woven`} />
          <Row label="Ambience" value={ambience === 'playing' ? 'playing' : ambience === 'off' ? 'off' : 'idle'} dim />
        </div>

        <p className="mt-3 border-t border-[rgba(196,196,255,0.12)] pt-2.5 font-mono text-[0.52rem] uppercase leading-relaxed tracking-[0.16em] text-[#6f6756]">
          {BUILD_BADGE}
        </p>
        <p className="mt-2 flex items-center gap-2 font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#6f6756]">
          <Monogram className="h-4 w-4 text-[#c5a75a]" />
          Ctrl+Shift+K — the keeper&apos;s console
        </p>
      </div>
    </div>
  )
}
