/**
 * THE KILN'S CLINK — the only sound left in the museum. A short, quiet
 * ceramic confirmation when the kiln fires: a high body note dropping
 * into a dull glaze partial, synthesized on the fly in Web Audio — no
 * files, no download, every node stops itself within 160ms.
 *
 * The ambience room-tones were removed: synthesized noise never sounded
 * like a room, and a museum that hisses is worse than a silent one.
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null

function ensureContext(): AudioContext | null {
  if (ctx) return ctx
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  master = ctx.createGain()
  master.gain.value = 1
  master.connect(ctx.destination)
  return ctx
}

/** The kiln's confirmation: one short, quiet ceramic clink — a high
 *  body note dropping into a dull glaze partial. Synthesized on the fly
 *  from a gesture, and every node stops itself within 160ms — nothing
 *  is retained between firings. */
export function playKilnClink(): void {
  const audio = ensureContext()
  const out = master
  if (!audio || out === null) return
  void audio.resume()

  const t0 = audio.currentTime
  const strike = (freq: number, drop: number, vol: number, dur: number, type: OscillatorType) => {
    const osc = audio.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t0)
    osc.frequency.exponentialRampToValueAtTime(freq * drop, t0 + dur * 0.55)
    const gain = audio.createGain()
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(gain).connect(out)
    osc.start(t0)
    osc.stop(t0 + dur + 0.02)
  }
  /* the ceramic body */
  strike(2150, 0.55, 0.05, 0.16, 'triangle')
  /* the glaze — a bright hairline partial, shorter and quieter */
  strike(3200, 0.8, 0.018, 0.09, 'sine')
}