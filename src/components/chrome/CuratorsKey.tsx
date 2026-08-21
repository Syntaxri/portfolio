'use client'

import { useEffect, useRef, useState } from 'react'
import { Monogram } from '@/components/museum/Monogram'

/**
 * THE CURATOR'S KEY — type `minttea` anywhere in the museum and the
 * staff door opens: the keeper's private notes, pinned behind the
 * exhibition. Handwritten stationery, real details from the build —
 * nothing invented for the door.
 */

const SECRET = 'minttea'

/** Append a typed key to the watch buffer; returns true when the secret
 *  phrase has just been completed. Pure, so the door's lock is testable. */
export function appendPhrase(buffer: string, key: string, secret = SECRET): {
  buffer: string
  unlocked: boolean
} {
  if (key.length !== 1) return { buffer, unlocked: false }
  const next = (buffer + key).toLowerCase().slice(-secret.length)
  return { buffer: next, unlocked: next === secret }
}

interface CuratorNote {
  id: string
  tag: string
  body: string
  tilt: string
}

const NOTES: CuratorNote[] = [
  {
    id: 'n1',
    tag: 'on geometry',
    body: 'The eight-pointed star is two squares — one turned 45°. That single move is the whole grammar of zellige, and one function draws every star in this museum: SVG, CSS, WebGL, even the OpenGraph card.',
    tilt: '-rotate-1',
  },
  {
    id: 'n2',
    tag: 'on the zellige',
    body: 'The hero ships zero images. 33 extruded ceramic pieces, computed on load. Double-click it — the kiln fires a new deterministic seed and the whole room re-weaves itself from the same vocabulary.',
    tilt: 'rotate-[0.6deg]',
  },
  {
    id: 'n3',
    tag: 'on the zarbia',
    body: 'The runner is a real, hand-modelled game-ready carpet — 22 triangles carrying three baked 2K maps. The loom still does the weaving: a shader sweep stitches it into the room on arrival, wool lifting at the live row.',
    tilt: '-rotate-[0.5deg]',
  },
  {
    id: 'n4',
    tag: 'on the archive',
    body: 'The vault lamp is not a light — it is one blurred box-shadow, GPU-composited, following the cursor without a single repaint. The cheapest "torch" in the museum.',
    tilt: 'rotate-1',
  },
  {
    id: 'n5',
    tag: 'on the visitors\u2019 book',
    body: 'The contact form is guarded like a storeroom: rate-limited per visitor, honeypotted, sanitised before it is ever kept. If the wire dies it folds into a mailto — the note always has a way out.',
    tilt: '-rotate-[0.4deg]',
  },
  {
    id: 'n6',
    tag: 'on the door',
    body: '111 tests stand between a commit and the door — lint, typecheck, the suite and a production build, all in CI. If the pipeline coughs, nothing ships. That is the craft.',
    tilt: 'rotate-[0.3deg]',
  },
  {
    id: 'n7',
    tag: 'on motion',
    body: 'Motion here is transform and opacity only. Under "reduce motion" every room still opens — just stilled. Nothing is skipped, ever; a museum must be visitable by everyone.',
    tilt: '-rotate-[0.7deg]',
  },
  {
    id: 'n8',
    tag: 'on the loom',
    body: 'On phones the Zarbia buzzes when a pattern segment locks into place — a 24ms pulse, throttled, off under reduced motion. You are meant to almost feel the wool.',
    tilt: 'rotate-[0.5deg]',
  },
]

export function CuratorsKey() {
  const [open, setOpen] = useState(false)
  const bufferRef = useRef('')
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.tagName === 'SELECT' ||
          t.isContentEditable)
      )
        return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const next = appendPhrase(bufferRef.current, e.key)
      bufferRef.current = next.buffer
      if (next.unlocked) {
        bufferRef.current = ''
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    lastFocusRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lastFocusRef.current?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center overflow-y-auto bg-[rgba(16,13,9,0.78)] p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="The curator's notes"
        className="relative my-auto w-full max-w-3xl border border-[rgba(233,227,212,0.2)] bg-[#efe9da] p-6 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] sm:p-9"
        style={{
          backgroundImage:
            'repeating-linear-gradient(transparent, transparent 27px, rgba(30,64,130,0.06) 27px, rgba(30,64,130,0.06) 28px)',
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close the curator's notes"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(28,26,22,0.3)] font-mono text-sm text-[#5a5142] transition-colors hover:border-[rgba(28,26,22,0.6)]"
        >
          ✕
        </button>

        <div className="mb-1 flex items-center gap-3">
          <Monogram className="h-9 w-9 text-[#aa5226]" />
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-[#8c6634]">
              The curator&apos;s key · staff only
            </p>
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[#a89c85]">
              Found by typing {SECRET} — keep it with you
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {NOTES.map((n, i) => (
            <article
              key={n.id}
              className={`relative border border-[rgba(28,26,22,0.14)] bg-[#f7f2e6] p-4 shadow-[0_10px_30px_-12px_rgba(60,45,20,0.4)] ${n.tilt}`}
            >
              <span
                className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
                style={{ background: 'radial-gradient(circle at 35% 30%, #b3542f, #7e3518)' }}
                aria-hidden="true"
              />
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[#aa5226]">
                {n.tag} · {String(i + 1).padStart(2, '0')}
              </p>
              <p className="serif-italic mt-2 text-[0.92rem] leading-relaxed text-[#3d3528]">
                {n.body}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 border-t border-dashed border-[rgba(28,26,22,0.25)] pt-4 text-center font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[#a89c85]">
          The museum has no locked rooms — only doors you haven&apos;t knocked on yet
        </p>
      </div>
    </div>
  )
}
