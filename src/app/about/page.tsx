import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal, RevealItem } from '@/components/museum/Reveal'
import { ZelligeBand } from '@/components/museum/ZelligeBand'
import { Monogram } from '@/components/museum/Monogram'
import { crafts } from '@/lib/data/capabilities'
import { projects } from '@/lib/data/projects'
import { site, socials } from '@/lib/data/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meet Akram Rihani — full-stack software developer in Azrou, Morocco: Java & Spring Boot backends, Next.js & React interfaces, WebGL motion. The craft behind the museum of software craftsmanship.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: `About ${site.name} — ${site.jobTitle}`,
    description:
      'Meet Akram Rihani — full-stack software developer in Azrou, Morocco: Java & Spring Boot backends, Next.js & React interfaces, WebGL motion. The craft behind the museum of software craftsmanship.',
    url: `https://${site.domain}/about`,
  },
}

const STEPS = [
  {
    year: '2020',
    title: 'The kiln is lit',
    body: 'Software becomes the trade: Java, web systems, and the patience to make them correct. The museum opens its door in Azrou.',
  },
  {
    year: '2024',
    title: 'WISLA Platform',
    body: 'A complete enterprise application for university–company partnership — Spring Boot, role-based access, state machines for every workflow — verified with a grade of 19/20.',
    href: '/work/wisla-platform',
  },
  {
    year: '2025',
    title: 'Commissions begin',
    body: 'Craft becomes commissions with commercial weight: a palace hotel lifted into the browser, a hobby platform shipped as a live product.',
    href: '/work/palais-amghass',
  },
  {
    year: '2026',
    title: 'Live client builds',
    body: 'Auto-École Michlifen, Azrou Design, Le Sapin — local businesses online, each one still running on the wall of the Living Room.',
    href: '/#living',
  },
]

/**
 * THE KEEPER'S FILE — the room where the museum speaks about itself.
 * Who built it, what he does, the craft behind the walls, and the doors
 * that lead out to the work itself.
 */
export default function AboutPage() {
  const web = projects.filter((p) => p.liveUrl)

  return (
    <>
      {/* the file's cover */}
      <section className="section-pad relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-24">
        <div className="zellige-wall" aria-hidden="true" />
        <div className="relative">
          <Reveal>
            <div data-rv className="mb-10 flex items-center justify-between gap-4">
              <Link href="/" className="label transition-colors hover:text-accent">
                ← The entrance
              </Link>
              <span className="label label-muted hidden sm:inline">Room A/V — the keeper&apos;s file</span>
            </div>
          </Reveal>
          <Reveal className="max-w-3xl">
            <header data-rv>
              <p className="label label-accent">The keeper&apos;s file</p>
              <h1 className="display-title mt-6 text-text">{site.name}</h1>
              <p className="mt-4 font-sans text-[clamp(0.9rem,1.5vw,1.1rem)] font-semibold uppercase tracking-[0.12em] text-text-2">
                {site.jobTitle} · {site.location}
              </p>
              <p className="serif mt-8 text-2xl leading-[1.5] text-text-2">{site.thesis}</p>
              <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-text-3">
                The museum of software craftsmanship is a one-person atelier: concept, architecture,
                development, experience, deployment — the whole building under one roof, so nothing gets lost
                in translation. On the backend, Spring Boot with Spring Security and JPA keeps real systems
                honest: role-based access, explicit state machines, one source of truth. On the frontend,
                TypeScript, React and Next.js make rooms people can walk through — and WebGL and motion are
                the glaze that catches the light.
              </p>
            </header>
          </Reveal>

          <Reveal className="mt-10">
            <div data-rv className="flex flex-wrap items-center gap-4">
              <Link href="/#collection" className="btn">
                Explore the work
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/#exit" className="btn-ghost">
                Start a project
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* the craft — four disciplines, as cut in the workshop */}
      <section aria-label="The craft" className="border-t border-[rgba(28,26,22,0.1)] bg-bg-2">
        <div className="section-pad mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p data-rv className="label-accent label mb-3">
              Room 02 — the workshop
            </p>
            <h2 data-rv className="room-title max-w-[20ch] text-text">
              Four disciplines, practised like crafts.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {crafts.map((c, i) => (
              <Reveal key={c.title} delay={0.05 * i}>
                <article
                  data-rv
                  className="flex h-full flex-col border border-[rgba(28,26,22,0.14)] bg-surface p-6"
                >
                  <span className="label-muted label mb-8">{c.index}</span>
                  <h3 className="exhibit-title text-text">{c.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-text-3">{c.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {c.skills.slice(0, 6).map((s) => (
                      <span key={s} className="tile-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* the road here */}
      <section aria-label="The road here" className="bg-bg">
        <div className="section-pad mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p data-rv className="label-accent label mb-3">
              The road here
            </p>
            <h2 data-rv className="room-title max-w-[24ch] text-text">
              From one idea to one shipped thing.
            </h2>
          </Reveal>

          <div className="mt-12 max-w-3xl">
            {STEPS.map((s, i) => (
              <Reveal
                key={s.year}
                className="border-t border-[rgba(28,26,22,0.1)] py-7 first:border-t-0 first:pt-0"
              >
                <RevealItem className="flex items-baseline gap-5">
                  <span className="label-accent label shrink-0">0{i + 1}</span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="exhibit-title text-text">{s.title}</h3>
                      <span className="label-muted label">{s.year}</span>
                    </div>
                    <p className="serif mt-2 max-w-[46ch] text-xl leading-relaxed text-text-2">{s.body}</p>
                    {s.href && (
                      <Link
                        href={s.href}
                        className="label mt-3 inline-block uppercase tracking-[0.14em] text-accent transition-opacity hover:opacity-75"
                      >
                        {s.href.startsWith('/#') ? 'Visit the room' : 'Read the case study'} →
                      </Link>
                    )}
                  </div>
                </RevealItem>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14">
            <div
              data-rv
              className="max-w-3xl rounded-md border border-[rgba(30,64,130,0.25)] bg-surface p-6 sm:p-8"
            >
              <p className="label-muted label mb-4">Commissions, still live on the wall</p>
              <div className="flex flex-wrap gap-2">
                {web.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/work/${p.slug}`}
                    className="tile-tag transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {p.title} ↗
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* elsewhere — the doors that never close */}
      <section
        aria-label="Find the keeper elsewhere"
        className="border-t border-[rgba(28,26,22,0.1)] bg-bg-2"
      >
        <div className="section-pad mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div data-rv className="flex flex-wrap items-start justify-between gap-10">
              <div className="max-w-xl">
                <p className="label-accent label mb-3">Room 06 — the visitor book</p>
                <h2 className="room-title max-w-[16ch] text-text">The door stays open.</h2>
                <p className="serif mt-4 text-xl leading-relaxed text-text-2">
                  One person, one build — from concept to deployment. If you have an idea worth building, the
                  visitor book is at the exit:
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-6 inline-block font-sans text-lg font-bold tracking-tight text-text underline decoration-accent/50 decoration-2 underline-offset-4 transition-colors hover:text-accent"
                >
                  {site.email}
                </a>
              </div>

              <div className="min-w-[16rem]">
                <p className="label-muted label mb-4">The keeper, elsewhere</p>
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
              </div>
            </div>
          </Reveal>

          <div className="mt-16 flex flex-col items-center text-center">
            <Monogram className="h-14 w-14 text-accent-2" />
            <p className="label-muted label mt-4">
              {site.name} — built in {site.location.split(',')[0]} · {new Date().getFullYear()}
            </p>
          </div>
        </div>

        <ZelligeBand className="mt-4 w-full" aria-hidden="true" tile={12} count={72} muted />
      </section>
    </>
  )
}
