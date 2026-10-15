'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { site } from '@/lib/data/site'
import { Monogram } from '@/components/museum/Monogram'

/**
 * SHORTCUT MODAL — appears on every site load.
 *
 * Three shortcut cards:
 *   1. Ctrl+Shift+K  — Conservation Console (live FPS/GPU stats)
 *   2. Ctrl+Shift+G  — Keeper's Ledger (owner's GitHub activity)
 *   3. Alt+Shift+D   — Download Resume (triggers PDF download)
 *
 * Modal reopens with Alt+Shift+R.
 *
 * All shortcuts are mutually exclusive, ignore editable elements,
 * and use preventDefault to avoid browser conflicts where possible.
 * Respects prefers-reduced-motion.
 */

interface ShortcutCard {
  keys: string[]
  title: string
  description: string
  icon: 'console' | 'ledger' | 'download'
  action?: () => void
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName.toLowerCase()
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target.isContentEditable
  )
}

function KeyCap({ label }: { label: string }) {
  return (
    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-[0.3rem] border border-[rgba(196,196,255,0.25)] bg-gradient-to-b from-[#2a251e] to-[#1a1611] px-2 font-mono text-[0.62rem] font-bold tracking-wider text-[#e9e3d4] shadow-[0_2px_0_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]">
      {label}
    </span>
  )
}

function Card({
  card,
  index,
}: {
  card: ShortcutCard
  index: number
}) {
  const icons = {
    console: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
        <rect x="1" y="1" width="16" height="16" rx="3" stroke="rgba(196,196,255,0.4)" strokeWidth="1.2" />
        <path d="M5 6h8M5 9h8M5 12h5" stroke="rgba(196,196,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    ledger: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
        <circle cx="9" cy="9" r="7.5" stroke="rgba(196,196,255,0.4)" strokeWidth="1.2" />
        <path d="M9 5.5v7M5.5 9h7" stroke="rgba(196,196,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    download: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
        <path
          d="M9 2.5v8m0 0l-3-3m3 3l3-3M3.5 12.5v2a1 1 0 001 1h9a1 1 0 001-1v-2"
          stroke="rgba(196,196,255,0.4)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  }

  return (
    <div
      className="shortcut-card group flex min-w-0 flex-col gap-3 overflow-hidden rounded-xl border border-[rgba(196,196,255,0.12)] bg-[rgba(26,22,17,0.6)] p-4 transition-colors duration-300 hover:border-[rgba(196,196,255,0.25)] hover:bg-[rgba(35,30,24,0.7)]"
      data-index={index}
    >
      <div className="flex items-center gap-2.5">
        {icons[card.icon]}
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#8f8774]">
          {card.title}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
        {card.keys.map((k, i) => (
          <span key={k} className="flex items-center gap-1.5">
            {i > 0 && <span className="font-mono text-[0.55rem] text-[#6f6756]">+</span>}
            <KeyCap label={k} />
          </span>
        ))}
      </div>
      <p className="text-[0.82rem] leading-relaxed text-[#c9c1ae]">{card.description}</p>
      {card.action && (
        <button
          onClick={card.action}
          className="mt-auto self-start rounded-[0.25rem] border border-[rgba(196,196,255,0.2)] px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#c9c1ae] transition-all duration-200 hover:border-[rgba(196,196,255,0.5)] hover:text-[#e9e3d4] active:scale-[0.97]"
        >
          Download
        </button>
      )}
    </div>
  )
}

export function ShortcutModal() {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  /* Show on mount — every site load */
  useEffect(() => {
    const t = requestAnimationFrame(() => setShow(true))
    return () => cancelAnimationFrame(t)
  }, [])

  /* Animate in */
  useEffect(() => {
    if (!show) return
    setOpen(true)

    if (reduced || !panelRef.current || !backdropRef.current) {
      closeRef.current?.focus()
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' },
      )
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.94, y: 16, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' },
      )
      gsap.fromTo(
        '.shortcut-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out', delay: 0.15 },
      )
    })

    lastFocusRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    return () => ctx.revert()
  }, [show, reduced])

  /* Centralized keyboard handler — mutually exclusive, skips editable elements */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return

      const mod = e.ctrlKey || e.metaKey

      // Ctrl+Shift+K — toggle Conservation Console
      if (mod && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        window.dispatchEvent(new Event('ar:toggle-console'))
        return
      }

      // Ctrl+Shift+G — toggle Keeper's Ledger
      if (mod && e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault()
        window.dispatchEvent(new Event('ar:toggle-github'))
        return
      }

      // Alt+Shift+D — download resume
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        downloadResume()
        return
      }

      // Alt+Shift+R — reopen the modal
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        setShow(true)
        return
      }

      // Escape — close the modal
      if (e.key === 'Escape') {
        e.preventDefault()
        setShow(false)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const downloadResume = useCallback(() => {
    const a = document.createElement('a')
    a.href = '/Akram-Rihani-CV.pdf'
    a.download = 'Akram-Rihani-Resume.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [])

  const close = useCallback(() => {
    if (reduced || !panelRef.current || !backdropRef.current) {
      setShow(false)
      setOpen(false)
      lastFocusRef.current?.focus()
      return
    }

    gsap.to(panelRef.current, {
      opacity: 0,
      scale: 0.96,
      y: 8,
      duration: 0.3,
      ease: 'power2.in',
    })
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setShow(false)
        setOpen(false)
        lastFocusRef.current?.focus()
      },
    })
  }, [reduced])

  /* Restore focus on unmount */
  useEffect(() => {
    if (!show && lastFocusRef.current) {
      lastFocusRef.current.focus()
    }
  }, [show])

  if (!show) return null

  const cards: ShortcutCard[] = [
    {
      keys: ['Ctrl', 'Shift', 'K'],
      title: 'Conservation Console',
      description:
        'Live FPS, draw calls, GPU state, and the current room — read from the real installation.',
      icon: 'console',
    },
    {
      keys: ['Ctrl', 'Shift', 'G'],
      title: "Owner's GitHub",
      description:
        "Opens the portfolio owner's GitHub profile, recent repositories, and commit activity through the cached proxy.",
      icon: 'ledger',
    },
    {
      keys: ['Alt', 'Shift', 'D'],
      title: 'Download Resume',
      description: `Download ${site.name}'s resume as a PDF — or press the button below.`,
      icon: 'download',
      action: downloadResume,
    },
  ]

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={close}
        data-testid="shortcut-backdrop"
        className="absolute inset-0 bg-[#0a0806]/60 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        className="relative w-[min(900px,calc(100vw-3rem))] rounded-2xl border border-[rgba(196,196,255,0.18)] bg-[#1a1611]/95 p-7 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
      >
        {/* Close */}
        <button
          ref={closeRef}
          onClick={close}
          aria-label="Close shortcuts modal"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-[0.3rem] border border-[rgba(196,196,255,0.2)] font-mono text-[0.65rem] text-[#8f8774] transition-all duration-200 hover:border-[rgba(196,196,255,0.5)] hover:text-[#e9e3d4] active:scale-95"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-1 flex items-center gap-3">
          <Monogram className="h-8 w-8 text-[#c5a75a]" />
          <h2 className="room-title text-[1.1rem] text-[#e9e3d4]">The Shortcuts</h2>
        </div>
        <p className="mb-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#8f8774]">
          Three doors into the museum&apos;s hidden rooms
        </p>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((card, i) => (
            <Card key={card.title} card={card} index={i} />
          ))}
        </div>

        {/* Footer hint */}
        <p className="mt-5 border-t border-[rgba(196,196,255,0.08)] pt-3 text-center font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#6f6756]">
          Press Esc or click outside to close · Alt+Shift+R reopens
        </p>
      </div>
    </div>
  )
}
