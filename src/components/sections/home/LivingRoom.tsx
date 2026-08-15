'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Reveal, RevealItem } from '@/components/museum/Reveal'
import { Room, RoomDoor } from '@/components/museum/Room'
import { ZelligeBand } from '@/components/museum/ZelligeBand'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { projects } from '@/lib/data/projects'
import type { Project } from '@/types'
import { Monogram } from '@/components/museum/Monogram'

interface WallEntry {
  slug: string
  title: string
  url: string
  embeddable: boolean
  reason: string
}

/**
 * ROOM 05 — THE LIVING ROOM.
 * The museum's arcade of things that are still running: every live build
 * hangs on the wall, inside the frame it really lives in. One stage, one
 * rack — pick a door and the wall answers with that build, running as it
 * runs on the internet. Builds that keep their own door hang at it.
 */
export function LivingRoom() {
  const [wall, setWall] = useState<WallEntry[]>([])
  const [inView, setInView] = useState(false)
  const [lit, setLit] = useState(false)
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(false)
  const reduced = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const [current, setCurrent] = useState<Project>(projects.find((p) => p.liveUrl)!)
  const rack = projects.filter((p) => p.liveUrl)
  const currentLive = wall.find((w) => w.slug === current.slug)
  const locked = currentLive !== undefined && !currentLive.embeddable

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  /* the projector only runs while the visitor is in the room: the frame
     mounts as the room is approached, and rests once it is left behind.
     Reduced motion visitors get the framed door and the live link — no
     running page under their hand. */
  const near = inView && !reduced
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let awayTimer: number | undefined
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            window.clearTimeout(awayTimer)
            setInView(true)
            continue
          }
          awayTimer = window.setTimeout(() => {
            setInView(false)
            setLit(false)
          }, 500)
        }
      },
      { threshold: 0.15 }
    )
    io.observe(stage)
    return () => {
      window.clearTimeout(awayTimer)
      io.disconnect()
    }
  }, [])

  useEffect(() => {
    let alive = true
    fetch('/api/live')
      .then((r) => r.json())
      .then((d: WallEntry[]) => {
        if (alive) setWall(d)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const dotState = locked ? 'locked' : lit ? 'lit' : 'warm'
  const dotLabel =
    dotState === 'locked'
      ? 'Behind its own door'
      : dotState === 'lit'
        ? 'Running live'
        : 'Warming up'

  /* hanging another build: the wall swaps frames without ceremony */
  const switchTo = (next: Project) => {
    if (next.slug === current.slug) return
    setLit(false)
    setCurrent(next)
  }

  return (
    <Room id="living" number="05" name="THE LIVING ROOM" className="bg-bg">
      <div className="zellige-wall" aria-hidden="true" />
      <div className="section-pad mx-auto max-w-7xl px-4 sm:px-6">
        <RoomDoor
          number="05"
          name="The Living Room."
          catalog="No photographs — the real thing. The live builds hang on the wall, each running exactly as it runs on the internet; the nearest one first."
        />

        {/* the projector — the nearest live build, running */}
        <Reveal>
          <div data-rv>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="label-accent label flex items-center gap-2.5">
                <span className={`living-dot ${dotState === 'lit' ? 'is-lit' : ''}`} aria-hidden="true" />
                {dotLabel}
              </p>
              <p className="label-muted label">Pick any door — the wall answers live</p>
            </div>

            <div
              ref={stageRef}
              data-cursor="exhibit"
              className="projector-bezel group/shadow relative border-[2px] border-[rgba(197,165,90,0.4)] bg-[#241a10] p-2 shadow-[0_30px_70px_-30px_rgba(60,40,10,0.45)] sm:p-3"
            >
              {/* the plaque bar — knock to raise the room */}
              {mobile || locked ? (
                <a
                  href={current.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 border-b border-[rgba(197,165,90,0.25)] px-2 pb-2.5"
                  aria-label={`${current.title} — open live`}
                >
                  <span className="flex w-6 shrink-0 items-center justify-center rounded-[0.2rem] border border-[rgba(197,165,90,0.5)] p-1 text-[0.95rem] leading-none text-[#c5a75a]">
                    {current.title.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[#e9e3d4]">
                    {current.title}
                  </span>
                  <span className="shrink-0 font-mono text-[0.6rem] text-[#c5a75a]">Open live ↗</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="flex w-full items-center justify-between gap-3 border-b border-[rgba(197,165,90,0.25)] px-2 pb-2.5 text-left transition-colors hover:bg-[rgba(197,165,90,0.06)]"
                  aria-label={`${current.title} — enter the living room`}
                >
                  <span className="flex w-6 shrink-0 items-center justify-center rounded-[0.2rem] border border-[rgba(197,165,90,0.5)] p-1 text-[0.95rem] leading-none text-[#c5a75a]">
                    {current.title.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[#e9e3d4]">
                    {current.title} · {current.liveUrl?.replace('https://', '')}
                  </span>
                  <span className="shrink-0 font-mono text-[0.6rem] text-[#c5a75a]">Enter the living room ↗</span>
                </button>
              )}

              {/* the stage */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#14100b]">
                {current.cover && (
                  <Image
                    src={current.cover}
                    alt={`${current.title} — the front door, waiting for the live page`}
                    fill
                    sizes="(min-width: 1280px) 1200px, 92vw"
                    priority={near}
                    loading={near ? undefined : 'lazy'}
                    decoding="async"
                    className="object-cover"
                  />
                )}

                {!mobile && !locked && near && !open && (
                  <iframe
                    key={`${current.liveUrl}-stage`}
                    src={current.liveUrl}
                    title={`${current.title} — live build (opens inside the frame)`}
                    aria-label={`${current.title} — live build (opens inside the frame)`}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    onLoad={() => setLit(true)}
                    className={`living-frame ${lit ? 'is-lit' : ''}`}
                  />
                )}

                {!mobile && locked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#14100b]/85 p-6 text-center">
                    <p className="label label-muted">The door is kept from this side</p>
                    <p className="max-w-[34ch] font-sans text-lg font-bold tracking-tight text-[#e9e3d4]">
                      {current.title} lives at its own address.
                    </p>
                    <a href={current.liveUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                      Open live ↗
                    </a>
                  </div>
                )}

                {/* the warming beam — a quiet street lamp until the page answers */}
                <div className={`living-beam ${lit ? 'is-lit' : ''}`} aria-hidden="true" />
              </div>

              <p className="label-muted label px-2 pt-2.5 text-center sm:text-left">
                A live build — real HTML, real server, real hand. The frame forgets nothing you do.
              </p>

              {/* the rack — every live build, one touch away */}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[rgba(197,165,90,0.2)] pt-3 sm:grid-cols-3 lg:grid-cols-5">
                {rack.map((p) => {
                  const w = wall.find((x) => x.slug === p.slug)
                  const active = p.slug === current.slug
                  return (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => switchTo(p)}
                      aria-pressed={active}
                      aria-label={`${p.title} — hang this build in the frame`}
                      className={`group relative overflow-hidden rounded-sm border text-left transition-all duration-300 ${
                        active
                          ? 'border-[rgba(197,165,90,0.7)] shadow-[0_0_18px_-6px_rgba(197,165,90,0.55)]'
                          : 'border-[rgba(197,165,90,0.18)] hover:border-[rgba(197,165,90,0.55)]'
                      }`}
                    >
                      <span className="relative block aspect-[16/9] overflow-hidden bg-[#14100b]">
                        {p.cover && (
                          <Image
                            src={p.cover}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 220px, 45vw"
                            loading="lazy"
                            decoding="async"
                            className={`object-cover transition-opacity duration-500 ${
                              active ? 'opacity-95' : 'opacity-45 group-hover:opacity-80'
                            }`}
                          />
                        )}
                      </span>
                      <span className="flex items-center gap-1.5 px-2 py-1.5">
                        <span
                          className={`living-dot ${
                            w?.embeddable === true ? 'is-lit' : w?.embeddable === false ? 'is-locked' : ''
                          }`}
                          aria-hidden="true"
                        />
                        <span className="truncate font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#e9e3d4]">
                          {p.title}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              {!mobile && !locked && (
                <button type="button" onClick={() => setOpen(true)} className="btn">
                  Enter the room — scroll the real thing
                </button>
              )}
              <a
                href={current.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="label transition-colors hover:text-accent"
              >
                {current.liveUrl?.replace('https://', '')} ↗
              </a>
            </div>
          </div>
        </Reveal>

        <p className="serif-italic mt-16 max-w-[52ch] text-lg leading-relaxed text-text-3">
          Every door above stays open: the builds keep running after the
          exhibition ends, which is the only honest way to end.
        </p>
      </div>

      <ZelligeBand className="mt-4 w-full" aria-hidden="true" tile={12} count={72} muted />

      {/* the projector rises — the room-sized window */}
      {open && !mobile && (
        <div
          className="living-pop fixed inset-0 z-[170] flex items-center justify-center p-3 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${current.title} — live`}
        >
          <div
            className="absolute inset-0 bg-[#120f0a]/85 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="projector-bezel relative w-full max-w-[min(96vw,1600px)] border-[2px] border-[rgba(197,165,90,0.45)] bg-[#241a10] p-2 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] sm:p-3">
            <div className="flex items-center justify-between gap-3 border-b border-[rgba(197,165,90,0.25)] px-2 pb-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className={`living-dot ${lit ? 'is-lit' : ''}`} aria-hidden="true" />
                <p className="truncate font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[#e9e3d4]">
                  {current.title} · {current.liveUrl?.replace('https://', '')}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={current.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 items-center rounded-[0.2rem] border border-[rgba(197,165,90,0.4)] px-3 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#c5a75a] transition-colors hover:border-[#c5a75a]"
                >
                  Open live ↗
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close the living room"
                  className="flex h-8 w-8 items-center justify-center rounded-[0.2rem] border border-[rgba(197,165,90,0.4)] font-mono text-[0.7rem] text-[#c5a75a] transition-colors hover:border-[#c5a75a]"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="relative mt-2 aspect-[16/9.5] max-h-[76vh] overflow-hidden bg-[#14100b]">
              {current.cover && (
                <Image
                  src={current.cover}
                  alt={`${current.title} — the door behind the live page`}
                  fill
                  sizes="96vw"
                  priority
                  className="object-cover"
                />
              )}
              <iframe
                key={`${current.liveUrl}-room`}
                src={current.liveUrl}
                title={`${current.title} — live`}
                aria-label={`${current.title} — live`}
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setLit(true)}
                className={`living-frame ${lit ? 'is-lit' : ''} border-0`}
              />
              <div className={`living-beam ${lit ? 'is-lit' : ''}`} aria-hidden="true" />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-[rgba(197,165,90,0.2)] pt-3 sm:grid-cols-3 lg:grid-cols-5">
              {rack.map((p) => {
                const active = p.slug === current.slug
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => {
                      switchTo(p)
                    }}
                    aria-pressed={active}
                    className={`truncate px-2 py-1.5 text-left font-mono text-[0.55rem] uppercase tracking-[0.14em] transition-colors ${
                      active
                        ? 'bg-[rgba(197,165,90,0.12)] text-[#c5a75a]'
                        : 'text-[#8f8774] hover:text-[#e9e3d4]'
                    }`}
                  >
                    {p.title}
                  </button>
                )
              })}
            </div>

            <p className="label-muted label px-2 pt-2.5 text-center">
              The room is open — walk it, scroll it, leave it. It keeps living in the background.
            </p>
          </div>
        </div>
      )}

      {/* a quiet mark in the corner of the room */}
      <div className="pointer-events-none absolute bottom-6 right-6 hidden opacity-25 lg:block" aria-hidden="true">
        <Monogram className="h-10 w-10 text-accent-2" />
      </div>
    </Room>
  )
}