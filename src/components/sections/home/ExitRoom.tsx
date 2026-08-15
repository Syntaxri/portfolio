'use client'

import { Reveal, RevealItem } from '@/components/museum/Reveal'
import { Room } from '@/components/museum/Room'
import { ZelligeBand } from '@/components/museum/ZelligeBand'
import { Monogram } from '@/components/museum/Monogram'
import { ContactForm } from '@/components/forms/ContactForm'
import { site, socials } from '@/lib/data/site'

/**
 * ROOM 05 — THE EXIT.
 * The last room of the museum: the lights stay gentle, the space opens,
 * and the visitors' book waits by the door. One question remains.
 */
export function ExitRoom() {
  return (
    <Room id="exit" number="05" name="THE EXIT" dark={false} className="bg-bg-2">
      <div className="mashrabiya" aria-hidden="true" />
      <div className="section-pad mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-[760px]">
          <div data-rv>
            <p className="label-accent label">Room 05 — the exit</p>
            <h2 className="display-title mt-6 text-[clamp(2.6rem,7vw,6rem)] text-text">
              Have an idea worth building?
            </h2>
            <p className="lede mt-6 max-w-[30ch] text-text-2">
              Let&apos;s turn it into something <span className="serif-italic">real</span>.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div data-rv className="rounded-md border border-[rgba(30,64,130,0.22)] bg-surface p-6 sm:p-9">
              <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                <p className="label-accent label">The visitors&apos; book</p>
                <span className="plaque">{site.availability} — {site.location}</span>
              </div>
              <ContactForm />
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            <Reveal>
              <div data-rv>
                <p className="label-muted label mb-5">Or find the keeper directly</p>
                <ul className="space-y-3">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target={s.href.startsWith('http') ? '_blank' : undefined}
                        rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                        className="group flex items-baseline justify-between gap-4 border-b border-[rgba(28,26,22,0.12)] pb-3 transition-colors hover:border-accent"
                      >
                        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-2">
                          {s.label}
                        </span>
                        <span className="font-mono text-[0.7rem] tracking-[0.08em] text-text-3 transition-colors group-hover:text-accent">
                          {s.handle} ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <a
                  href={`mailto:${site.email}`}
                  className="mt-8 block font-sans text-lg font-bold tracking-tight text-text underline decoration-accent/50 decoration-2 underline-offset-4 transition-colors hover:text-accent"
                >
                  {site.email}
                </a>

                <p className="serif-italic mt-6 max-w-[36ch] text-lg leading-relaxed text-text-3">
                  From one idea to one shipped thing — concept, architecture, code, experience,
                  deployment. The whole building, under one roof.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* the final moment — the exhibition ends on the monogram */}
      <div className="relative border-t border-[rgba(28,26,22,0.12)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6">
          <Monogram className="h-16 w-16 text-accent-2" />
          <p className="lede mt-6 max-w-[24ch] text-text-2">
            The exhibition has ended — the door stays open.
          </p>
          <p className="label-muted label mt-3">
            {site.name} — built in Azrou · {new Date().getFullYear()}
          </p>
          <div className="mt-8">
            <a href={`mailto:${site.email}`} className="btn">
              Write to the keeper ↗
            </a>
          </div>
          <Reveal className="mt-10 w-full">
            <RevealItem className="w-full">
              <ZelligeBand aria-hidden="true" tile={12} count={72} muted />
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </Room>
  )
}