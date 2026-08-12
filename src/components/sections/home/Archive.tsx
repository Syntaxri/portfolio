'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Reveal, RevealItem } from '@/components/museum/Reveal'
import { Room, RoomDoor } from '@/components/museum/Room'
import { ZelligeBand } from '@/components/museum/ZelligeBand'
import { starPath } from '@/lib/geometry'
import { getProject } from '@/lib/data/projects'

const ROLES = [
  {
    title: 'Company',
    line: 'Publishes internships and offers, reviews applications, manages partnerships.',
  },
  {
    title: 'Faculty',
    line: 'Validates students, supervises internships, approves the chain of agreements.',
  },
  {
    title: 'Student',
    line: 'Owns a dashboard, applies to offers, follows every application to its state.',
  },
] as const

const ARCHIVE_FRAMES = [
  {
    src: '/work/wisla-platform/WislaStudentDashboard.jpg',
    alt: 'WISLA — the student dashboard',
    caption: 'The student room, in light mode.',
  },
  {
    src: '/work/wisla-platform/WislaCompanyDashboard.jpg',
    alt: 'WISLA — the company dashboard',
    caption: 'The company desk, in light mode.',
  },
  {
    src: '/work/wisla-platform/WislaDarkMode.jpg',
    alt: 'WISLA — the platform in dark mode',
    caption: 'The same museum, after dark.',
  },
  {
    src: '/work/wisla-platform/WislaFacultyDahsboard.jpg',
    alt: 'WISLA — the faculty dashboard',
    caption: 'The faculty shelving.',
  },
] as const

/**
 * ROOM 04 — THE ARCHIVE.
 * The museum's technical reading room: the engineering of the flagship
 * exhibit, documented in the dark, where the details have the light.
 */
export function Archive() {
  const wisla = getProject('wisla-platform')!

  return (
    <Room id="archive" number="04" name="THE ARCHIVE" dark className="bg-walnut">
      <div className="zellige-wall" aria-hidden="true" />
      <div className="section-pad mx-auto max-w-7xl px-4 sm:px-6">
        <RoomDoor
          number="04"
          name="The Archive."
          catalog="The deep exhibit: WISLA — enterprise web application, backend engineering. The lights go down; the details come out."
        />

        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <div data-rv>
                <p className="label-accent label mb-4">The deep exhibit</p>
                <h3 className="room-title text-[clamp(2.2rem,4.4vw,3.6rem)] text-ivory">
                  WISLA Platform.
                </h3>
                <p className="lede mt-6 max-w-[54ch] text-[#cfc7b4]">{wisla.longDescription}</p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="/work/wisla-platform" className="btn">
                    Enter the exhibit →
                  </Link>
                  <span className="plaque border-[rgba(233,227,212,0.25)] bg-surface text-[#cfc7b4]">
                    {wisla.accession} · {wisla.category}
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-16">
              <p data-rv className="label-accent label mb-6">
                Field notes — three problems, three decisions
              </p>
              <div className="space-y-6">
                {wisla.challenges?.map((c, i) => (
                  <RevealItem key={c.title}>
                    <article className="border-t border-[rgba(233,227,212,0.12)] pt-6">
                      <div className="flex items-baseline gap-4">
                        <span className="label-muted label">0{i + 1}</span>
                        <h4 className="text-lg font-bold tracking-tight text-ivory">{c.title}</h4>
                      </div>
                      <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-[#b3ab96]">
                        {c.description}
                      </p>
                      <p className="mt-3 max-w-[56ch] border-l-2 border-[rgba(197,149,76,0.6)] pl-3 text-sm leading-relaxed text-[#cfc7b4]">
                        {c.solution}
                      </p>
                    </article>
                  </RevealItem>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            {/* the three identities — one roof */}
            <Reveal>
              <div data-rv className="rounded-md border border-[rgba(233,227,212,0.14)] bg-surface p-6">
                <p className="label-accent label mb-6">One platform, three keys to the door</p>
                <div className="relative">
                  <div
                    className="absolute left-1/2 hidden h-px w-4/5 -translate-x-1/2 bg-[rgba(233,227,212,0.16)] lg:block"
                    style={{ top: '3.1rem' }}
                    aria-hidden="true"
                  />
                  <div className="space-y-4">
                    {ROLES.map((r, i) => (
                      <div
                        key={r.title}
                        className="relative flex items-start gap-4 rounded-sm border border-[rgba(233,227,212,0.12)] bg-[rgba(233,227,212,0.03)] p-4"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className="mt-0.5 h-5 w-5 shrink-0"
                          style={{ color: i === 1 ? '#c5a75a' : '#c4c4ff' }}
                          aria-hidden="true"
                        >
                          <path d={starPath(10, 10, 8.6, 3.6)} fill="currentColor" />
                        </svg>
                        <div>
                          <h4 className="text-base font-bold tracking-tight text-ivory">
                            {r.title}
                          </h4>
                          <p className="mt-1 text-sm leading-relaxed text-[#b3ab96]">{r.line}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="serif-italic mt-6 text-sm leading-relaxed text-[#b3ab96]">
                  One Spring Boot spine. Three role-shaped dashboards. Every request answers to
                  Spring Security before it answers to the data.
                </p>
              </div>
            </Reveal>

            {/* ledger */}
            <Reveal className="mt-6">
              <div data-rv className="grid grid-cols-2 gap-3">
                {wisla.metrics?.map((m) => (
                  <div
                    key={m.label}
                    className="border border-[rgba(233,227,212,0.14)] bg-surface p-4"
                  >
                    <p className="label-muted label mb-2">{m.label}</p>
                    <p className="font-display text-2xl font-extrabold tracking-tight text-[#e9e3d4]">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* archive frames */}
        <Reveal className="mt-20">
          <p data-rv className="label-accent label mb-8">
            Frames from the field
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {ARCHIVE_FRAMES.map((f, i) => (
              <RevealItem key={f.src}>
                <figure className="arch-frame aspect-[16/9] w-full">
                  <Image
                    src={f.src}
                    alt={f.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    loading="lazy"
                    decoding="async"
                    className="object-contain"
                  />
                  <figcaption className="label-muted label relative border-t border-[rgba(233,227,212,0.12)] bg-surface/[0.92] px-4 py-2.5">
                    {f.caption} <span className="text-[rgba(233,227,212,0.35)]">· frame {i + 1}/4</span>
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </div>

      <ZelligeBand className="mt-4 w-full" aria-hidden="true" tile={12} count={72} muted />
    </Room>
  )
}