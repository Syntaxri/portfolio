'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ensureAmbience, setAmbience, setAmbientRoom } from '@/lib/fx/ambience'
import { museumState, onRoomChange } from '@/lib/fx/museumState'

const PREF_KEY = 'ar-ambience'

function readPref(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(PREF_KEY) === 'on'
  } catch {
    return false
  }
}

function writePref(on: boolean) {
  try {
    if (on) localStorage.setItem(PREF_KEY, 'on')
    else localStorage.removeItem(PREF_KEY)
  } catch {
    /* storage unavailable — the visit just stays quiet */
  }
}

/**
 * The ambience switch: one brass button, ON or OFF, never louder than a
 * room tone. Sound starts only inside a real user gesture and follows
 * the visitor from room to room. Under reduced motion the museum starts
 * silent — the visitor may still turn the sound on themselves.
 */
export function AmbienceControl({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()
  const [on, setOn] = useState(false)
  const prefRef = useRef(false)

  useEffect(() => {
    prefRef.current = readPref()
    if (prefRef.current) setOn(true)
  }, [])

  /* follow the visitor's room once sound is alive */
  useEffect(() => {
    const off = onRoomChange((room) => {
      setAmbientRoom(room.id)
      if (on) museumState.ambience = 'playing'
    })
    return off
  }, [on])

  /* the one legal door for autoplay: the visitor's first interaction */
  useEffect(() => {
    if (!prefRef.current || reduced) return
    const wake = () => {
      ensureAmbience()
      setAmbientRoom(museumState.roomId)
    }
    window.addEventListener('pointerdown', wake, { once: true })
    window.addEventListener('keydown', wake, { once: true })
    return () => {
      window.removeEventListener('pointerdown', wake)
      window.removeEventListener('keydown', wake)
    }
  }, [reduced])

  const toggle = () => {
    const next = !on
    setOn(next)
    writePref(next)
    if (next) {
      ensureAmbience()
      setAmbientRoom(museumState.roomId)
    } else {
      setAmbience(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Mute the museum ambience' : 'Play the museum ambience'}
      className={`group inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-colors ${
        on ? 'text-accent' : 'text-text-3 hover:text-text-2'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="relative inline-block h-1.5 w-1.5 rounded-full border border-current"
        style={
          on
            ? { background: 'currentColor', boxShadow: '0 0 6px currentColor' }
            : { background: 'transparent' }
        }
      />
      Ambience {on ? 'on' : 'off'}
    </button>
  )
}
