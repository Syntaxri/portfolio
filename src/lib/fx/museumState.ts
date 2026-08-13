/**
 * MUSEUM STATE — the shared, deliberately tiny wiring between the
 * installations and the chrome (conservation console, rooms).
 * Not React state: these values change every frame and must never
 * re-render anything.
 */

export interface GlSnapshot {
  calls: number
  triangles: number
  /** number of live WebGL canvases reporting */
  canvases: number
  /** lazily read on demand — the GPU string can trip a browser
   *  deprecation notice, so it is never fetched unless asked */
  gpu: string | null
}

interface GlSource {
  stats: () => { calls: number; triangles: number }
  gpu: () => string | null
}

const glSources = new Set<GlSource>()

export const glRegistry = {
  register(source: GlSource) {
    glSources.add(source)
  },
  unregister(source: GlSource) {
    glSources.delete(source)
  },
  snapshot(): GlSnapshot {
    let calls = 0
    let triangles = 0
    let gpu: string | null = null
    for (const s of glSources) {
      const st = s.stats()
      calls += st.calls
      triangles += st.triangles
      if (gpu === null) gpu = s.gpu()
    }
    return { calls, triangles, canvases: glSources.size, gpu }
  },
}

export const museumState = {
  /** the room the visitor is standing in (label for the console) */
  roomLabel: 'The Atrium',
  roomId: 'entrance',
  /** fires of the kiln: every zellige regeneration */
  regens: 0,
  zelligeSeed: 0,
  zelligePieces: 0,
  /** the loom's weave progress 0..1 */
  weave: 0,
  /** last haptic pulse, in ms (shared throttle across the loom) */
  lastPulseAt: 0,
}

/* ---------------------------------------------------------------------------
 * ROOM WATCH — one IntersectionObserver, any number of listeners.
 * The dashboard follows the visitor from room to room.
 * ------------------------------------------------------------------------- */

export const MUSEUM_ROOMS = [
  { id: 'entrance', label: 'Room 00 — The Atrium' },
  { id: 'courtyard', label: 'Room 01 — The Fountain' },
  { id: 'craft', label: 'Room 02 — The Workshop' },
  { id: 'loom', label: 'The Loom' },
  { id: 'collection', label: 'Room 03 — The Collection' },
  { id: 'archive', label: 'Room 04 — The Archive' },
  { id: 'exit', label: 'Room 05 — The Exit' },
] as const

export interface MuseumRoom {
  id: string
  label: string
  index: number
}

const roomListeners = new Set<(room: MuseumRoom) => void>()
let roomObserver: IntersectionObserver | null = null
let roomObserverCount = 0

function roomById(id: string): MuseumRoom {
  const idx = MUSEUM_ROOMS.findIndex((r) => r.id === id)
  if (idx === -1) return { id, label: 'The Gallery', index: MUSEUM_ROOMS.length }
  return { id: MUSEUM_ROOMS[idx].id, label: MUSEUM_ROOMS[idx].label, index: idx }
}

function startRoomObserver() {
  if (roomObserver) return
  const seen = new Map<string, number>()
  roomObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        seen.set(entry.target.id, entry.intersectionRatio)
      }
      let best: { id: string; ratio: number } = { id: '', ratio: 0 }
      for (const [id, ratio] of seen) {
        if (ratio > best.ratio) best = { id, ratio }
      }
      if (!best.id) return
      museumState.roomId = best.id
      const room = roomById(best.id)
      museumState.roomLabel = room.label
      for (const cb of roomListeners) cb(room)
    },
    { threshold: [0.15, 0.4, 0.65, 0.9] }
  )
  document.querySelectorAll('#main section[id]').forEach((el) => roomObserver?.observe(el))
}

export function onRoomChange(cb: (room: MuseumRoom) => void): () => void {
  roomListeners.add(cb)
  roomObserverCount++
  if (typeof document !== 'undefined') startRoomObserver()
  return () => {
    roomListeners.delete(cb)
    roomObserverCount--
    if (roomObserverCount <= 0 && roomObserver) {
      roomObserver.disconnect()
      roomObserver = null
    }
  }
}
