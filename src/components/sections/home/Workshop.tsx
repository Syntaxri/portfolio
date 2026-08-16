import { Reveal, RevealItem } from '@/components/museum/Reveal'
import { Room, RoomDoor } from '@/components/museum/Room'
import { ZelligeBand } from '@/components/museum/ZelligeBand'
import { starPath } from '@/lib/geometry'
import { crafts } from '@/lib/data/capabilities'

const GLAZE_HEX: Record<string, string> = {
  cobalt: '#1e4082',
  teal: '#15695c',
  terra: '#aa5226',
  brass: '#8c6634',
}

/**
 * ROOM 03 — WORKSHOP OF SYSTEMS.
 * Four disciplines, taught as crafts. Each panel is a cedar door into a
 * branch of the trade — the numeral on the lintel, the glazes in the inlay.
 */
export function Workshop() {
  return (
    <Room id="craft" number="03" name="WORKSHOP OF SYSTEMS" dark={false} className="bg-bg-2">
      <div className="zellige-wall" aria-hidden="true" />
      <div className="section-pad mx-auto max-w-7xl px-4 sm:px-6">
        <RoomDoor
          number="03"
          name="Workshop of Systems."
          catalog="Four disciplines, practised like crafts — because systems are only as strong as the hands that cut them."
        />

        <Reveal stagger={0.12} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {crafts.map((c) => {
            const hex = GLAZE_HEX[c.glaze]
            return (
              <RevealItem key={c.title}>
                <article
                  className="group relative flex h-full flex-col border border-[rgba(28,26,22,0.14)] bg-surface p-6 transition-all duration-300"
                  style={{ ['--glaze' as never]: hex }}
                >
                  <span
                    className="label-muted label mb-8 flex items-center justify-between"
                    aria-hidden="true"
                  >
                    {c.index}
                    <svg viewBox="0 0 10 10" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[22.5deg]" style={{ color: hex }}>
                      <path d={starPath(5, 5, 4.4, 1.8)} fill="currentColor" />
                    </svg>
                  </span>

                  <h3 className="exhibit-title text-text transition-colors duration-300 group-hover:text-accent">
                    {c.title}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-text-3">{c.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {c.skills.map((s) => (
                      <span key={s} className="tile-tag">
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="serif-italic mt-8 pt-5 text-sm text-text-3" style={{ borderTop: `1px solid ${hex}44` }}>
                    {c.plate}
                  </p>
                </article>
              </RevealItem>
            )
          })}
        </Reveal>
      </div>

      <ZelligeBand className="mt-4 w-full" aria-hidden="true" tile={12} count={72} muted />
    </Room>
  )
}