/**
 * AMBIENCE — the museum's environmental sound, synthesized entirely in
 * Web Audio: no files, no download, a few noise buffers and filters.
 *
 * Two acoustic rooms:
 *   — the museum: a quiet daytime hall — soft room tone, airy and calm.
 *   — the archive: an underground vault — low mechanical hum, a slow
 *     press that never quite starts, darker and heavier.
 *
 * Everything here is optional. It starts only after a user gesture,
 * follows the visitor's room, and can always be switched off.
 */

import { museumState } from '@/lib/fx/museumState'

type EngineState = 'idle' | 'playing' | 'off'

interface Engine {
  ctx: AudioContext | null
  master: GainNode | null
  museumBus: GainNode | null
  archiveBus: GainNode | null
  state: EngineState
}

const engine: Engine = { ctx: null, master: null, museumBus: null, archiveBus: null, state: 'idle' }

function makeNoise(ctx: AudioContext, brown: boolean, seconds = 2.5): AudioBuffer {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const data = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1
    if (brown) {
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    } else {
      data[i] = white
    }
  }
  return buf
}

function buildMuseum(ctx: AudioContext): GainNode {
  const bus = ctx.createGain()
  bus.gain.value = 0

  /* the hall: broad noise, air on the move, cut far above the floor */
  const src = ctx.createBufferSource()
  src.buffer = makeNoise(ctx, false)
  src.loop = true
  const air = ctx.createBiquadFilter()
  air.type = 'bandpass'
  air.frequency.value = 620
  air.Q.value = 0.45
  const floor = ctx.createBiquadFilter()
  floor.type = 'highpass'
  floor.frequency.value = 60
  src.connect(air).connect(floor).connect(bus)
  src.start()

  /* a slow tide on the hall — never a beat, just the room breathing */
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.06
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.0005
  lfo.connect(lfoGain).connect(bus.gain)
  lfo.start()

  return bus
}

function buildArchive(ctx: AudioContext): GainNode {
  const bus = ctx.createGain()
  bus.gain.value = 0

  /* the vault: low brown rumble through a narrow throat */
  const src = ctx.createBufferSource()
  src.buffer = makeNoise(ctx, true)
  src.loop = true
  const throat = ctx.createBiquadFilter()
  throat.type = 'lowpass'
  throat.frequency.value = 150
  const rumble = ctx.createGain()
  rumble.gain.value = 0.9
  src.connect(throat).connect(rumble).connect(bus)
  src.start()

  /* the press: the same hum breathing — a distant machine, not a beat */
  const press = ctx.createBiquadFilter()
  press.type = 'bandpass'
  press.frequency.value = 320
  press.Q.value = 1.4
  src.connect(press).connect(bus)

  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.14
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 110
  lfo.connect(lfoGain).connect(press.frequency)
  lfo.start()

  return bus
}

function build(ctx: AudioContext) {
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  const museumBus = buildMuseum(ctx)
  museumBus.connect(master)
  const archiveBus = buildArchive(ctx)
  archiveBus.connect(master)

  engine.ctx = ctx
  engine.master = master
  engine.museumBus = museumBus
  engine.archiveBus = archiveBus
}

/** called from a user gesture — the only legal moment to wake audio */
export function ensureAmbience(): void {
  if (engine.state !== 'idle') return
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) {
    engine.state = 'off'
    return
  }
  const ctx = new Ctor()
  build(ctx)
  engine.state = 'playing'
  museumState.ambience = 'playing'
  /* the visitor's room at the moment the sound wakes */
  engine.museumBus?.gain.setTargetAtTime(0.5, ctx.currentTime, 0.8)
  engine.archiveBus?.gain.setTargetAtTime(0, ctx.currentTime, 0.8)
  void ctx.resume()
}

export function setAmbience(on: boolean): void {
  if (!engine.ctx) {
    if (on) {
      ensureAmbience()
      return
    }
    engine.state = 'off'
    museumState.ambience = 'off'
    return
  }
  const ctx = engine.ctx
  if (on) {
    engine.state = 'playing'
    museumState.ambience = 'playing'
    engine.master?.gain.setTargetAtTime(1, ctx.currentTime, 0.7)
    void ctx.resume()
  } else {
    engine.state = 'off'
    museumState.ambience = 'off'
    engine.master?.gain.setTargetAtTime(0, ctx.currentTime, 0.4)
    window.setTimeout(() => {
      if (engine.state === 'off') void ctx.suspend()
    }, 1200)
  }
}

export function setAmbientRoom(roomId: string): void {
  const ctx = engine.ctx
  if (!ctx || !engine.museumBus || !engine.archiveBus) return
  const archive = roomId === 'archive'
  engine.museumBus.gain.setTargetAtTime(archive ? 0.28 : 0.5, ctx.currentTime, 1.2)
  engine.archiveBus.gain.setTargetAtTime(archive ? 1 : 0, ctx.currentTime, 1.2)
}

export function ambienceState(): EngineState {
  return engine.state
}

/* visibility: a museum that is not being visited makes no sound */
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && engine.state === 'playing' && engine.ctx) {
      void engine.ctx.suspend()
    } else if (!document.hidden && engine.state === 'playing' && engine.ctx) {
      void engine.ctx.resume()
    }
  })
}
