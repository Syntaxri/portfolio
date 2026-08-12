'use client'

import { Reveal, RevealItem } from '@/components/museum/Reveal'
import { Room, RoomDoor } from '@/components/museum/Room'
import { ZelligeBand } from '@/components/museum/ZelligeBand'
import { starPath } from '@/lib/geometry'
import { grammar } from '@/lib/data/capabilities'
import { site } from '@/lib/data/site'

/** The fountain: a slowly turning radial star, the heart of the room. */
function FountainArt() {
  const rays: { a: number; c: string }[] = []
  const palette = ['#1e4082', '#15695c', '#aa5226', '#e9e2cf', '#8c6634']
  for (let i = 0; i < 24; i++) {
    rays.push({ a: (i * Math.PI) / 12, c: palette[i % palette.length] })
  }
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className="spin-slow h-full w-full"
      style={{ animationDuration: '80s' }}
    >
      {rays.map((r, i) => (
        <path
          key={i}
          d={starPath(100 + Math.cos(r.a) * 52, 100 + Math.sin(r.a) * 52, 9, 3.4)}
          fill={r.c}
          opacity={0.75}
        />
      ))}
      <circle cx="100" cy="100" r="14" fill="#e9e2cf" stroke="#8c6634" strokeWidth="1.5" />
      <path d={starPath(100, 100, 9, 3.4)} fill="#1e4082" />
    </svg>
  )
}

/**
 * ROOM 01 — THE FOUNTAIN.
 * The story of the maker, told in four steps across the water, and the
 * seven rules taken from the Moroccan workshop that the whole museum is
 * built under.
 */
export function Fountain() {
  const steps = [
    {
      word: 'Curiosity',
      line: 'It started with a question: what can software actually do?',
    },
    {
      word: 'Engineering',
      line: 'The question became craft — Java, web systems, and the patience to make them correct.',
    },
    {
      word: 'Projects',
      line: 'Craft became commissions: live products, client sites, a university platform.',
    },
    {
      word: 'Products',
      line: 'And now the work is one thing — turning an idea into something real, end to end.',
    },
  ]

  return (
    <Room id="courtyard" number="01" name="THE FOUNTAIN" dark={false} className="bg-bg">
      <div className="zellige-wall" aria-hidden="true" />
      <div className="section-pad mx-auto max-w-7xl px-4 sm:px-6">
        <RoomDoor
          number="01"
          name="The Fountain."
          catalog="Every museum has a founding story. This one is four steps, and they all lead to the same place: an idea, made real."
        />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal stagger={0.14}>
              {steps.map((s, i) => (
                <RevealItem
                  key={s.word}
                  className="border-t border-[rgba(28,26,22,0.1)] py-7 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-baseline gap-5">
                    <span className="label-accent label shrink-0">0{i + 1}</span>
                    <div>
                      <h3 className="exhibit-title text-text">{s.word}</h3>
                      <p className="serif mt-2 max-w-[44ch] text-xl leading-relaxed text-text-2">
                        {s.line}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </Reveal>

            <Reveal>
              <div
                data-rv
                className="mt-12 rounded-md border border-[rgba(30,64,130,0.25)] bg-surface p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <span className="ping-dot" aria-hidden="true" />
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-text-2">
                    {site.availability}
                  </p>
                </div>
                <p className="serif mt-4 max-w-[52ch] text-2xl leading-snug text-text">
                  Concept → architecture → development → experience → deployment. One
                  person carrying the whole build — so nothing gets lost in translation.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative mx-auto aspect-square max-w-[340px] lg:max-w-none">
                <FountainArt />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <p className="label-muted label text-center leading-loose">
                    Founded in Azrou
                    <br />
                    Kiln · 2020 — present
                  </p>
                </div>
              </div>
              <p data-rv className="serif-italic mt-6 text-center text-lg text-text-3">
                “The water is quiet, but it is the reason the courtyard is alive.”
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24 border-t border-[rgba(28,26,22,0.1)] pt-14">
          <Reveal>
            <p data-rv className="label-accent label mb-3">
              The grammar of the workshop
            </p>
            <h3 data-rv className="room-title max-w-[20ch] text-text">
              Seven rules, taken from the Moroccan craft and applied to code.
            </h3>
          </Reveal>

          <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {grammar.map((g, i) => (
              <Reveal key={g.craft} delay={0.05 * i}>
                <div data-rv className="group h-full border border-[rgba(28,26,22,0.12)] bg-surface p-5 transition-colors duration-300 hover:border-[rgba(30,64,130,0.4)]">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="label-muted label">{String(i + 1).padStart(2, '0')}</span>
                    <svg viewBox="0 0 10 10" className="h-3 w-3 text-accent" aria-hidden="true">
                      <path d={starPath(5, 5, 4.4, 1.8)} fill="currentColor" />
                    </svg>
                  </div>
                  <h4 className="font-sans text-lg font-bold tracking-tight text-text">
                    {g.craft}
                  </h4>
                  <p className="label mt-1 text-accent">{g.engineering}</p>
                  <p className="mt-3 text-sm leading-relaxed text-text-3">{g.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <ZelligeBand className="mt-4 w-full" aria-hidden="true" tile={12} count={72} muted />
    </Room>
  )
}