import Link from 'next/link'
import { Reveal, RevealItem } from '@/components/museum/Reveal'
import { Room, RoomDoor } from '@/components/museum/Room'
import { ZelligeBand } from '@/components/museum/ZelligeBand'
import { ExhibitCover } from '@/components/projects/ExhibitCover'
import { projects } from '@/lib/data/projects'
import type { Project } from '@/types'

function ExhibitMeta({ project, children }: { project: Project; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="plaque plaque-accent">{project.accession}</span>
      <span className="plaque">{project.category}</span>
      <span className="plaque">{project.year}</span>
      {children}
    </div>
  )
}

/**
 * ROOM 03 — THE COLLECTION.
 * Six accessions hang along the arcade: the flagship in the place of
 * honour, then the web builds. Every piece is a door into its room.
 */
export function Collection() {
  const flagship = projects.find((p) => p.slug === 'wisla-platform')!
  const main = projects.filter((p) => p.featured && p.slug !== 'wisla-platform')
  const shelves = projects.filter((p) => !p.featured)

  return (
    <Room id="collection" number="03" name="THE COLLECTION" dark={false} className="bg-bg">
      <div className="zellige-wall" aria-hidden="true" />
      <div className="section-pad mx-auto max-w-7xl px-4 sm:px-6">
        <RoomDoor
          number="03"
          name="The Collection."
          catalog="Six accessions, curated — real builds only. The flagship hangs first, the web builds fill the arcade."
        />

        {/* flagship exhibit */}
        <Reveal>
          <article
            data-rv
            className="grid gap-8 lg:grid-cols-12 lg:items-center"
            aria-labelledby={`exhibit-${flagship.slug}`}
          >
            <div className="lg:col-span-7">
              <Link
                href={`/work/${flagship.slug}`}
                data-cursor="exhibit"
                className="block"
                aria-label={`${flagship.title} — case study`}
              >
                <ExhibitCover project={flagship} />
              </Link>
            </div>
            <div className="lg:col-span-5">
              <ExhibitMeta project={flagship}>
                <span className="plaque bg-accent text-[#f6f1e2] border-accent">Flagship accession</span>
              </ExhibitMeta>
              <h3 id={`exhibit-${flagship.slug}`} className="exhibit-title mt-5 text-text">
                <Link href={`/work/${flagship.slug}`}>{flagship.title}</Link>
              </h3>
              <p className="mt-4 max-w-[46ch] leading-relaxed text-text-3">
                {flagship.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {flagship.tags.slice(0, 6).map((t) => (
                  <span key={t} className="tile-tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={`/work/${flagship.slug}`} className="btn">
                  Enter the exhibit ↗
                </Link>
              </div>
            </div>
          </article>
        </Reveal>

        {/* featured arcade */}
        <div className="mt-24 space-y-20">
          {main.map((p) => (
            <Reveal key={p.slug}>
              <article
                data-rv
                className="grid gap-8 lg:grid-cols-12 lg:items-center"
                aria-labelledby={`exhibit-${p.slug}`}
              >
                <div className="lg:col-span-7">
                  <Link
                    href={`/work/${p.slug}`}
                    data-cursor="exhibit"
                    className="block"
                    aria-label={`${p.title} — case study`}
                  >
                    <ExhibitCover project={p} />
                  </Link>
                </div>
                <div className="lg:col-span-5">
                  <ExhibitMeta project={p} />
                  <h3 id={`exhibit-${p.slug}`} className="exhibit-title mt-5 text-text">
                    <Link href={`/work/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p className="mt-4 max-w-[46ch] leading-relaxed text-text-3">{p.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="tile-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link href={`/work/${p.slug}`} className="btn-ghost">
                      Read the case study →
                    </Link>
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="label transition-colors hover:text-accent"
                      >
                        Live ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* the shelves — live client builds */}
        <Reveal className="mt-24 border-t border-[rgba(28,26,22,0.1)] pt-12">
          <p data-rv className="label-muted label mb-8">
            The shelves — live client builds
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shelves.map((p) => (
              <RevealItem key={p.slug}>
                <Link href={`/work/${p.slug}`} data-cursor="exhibit" className="group block" aria-label={`${p.title} — case study`}>
                  <ExhibitCover project={p} />
                  <div className="mt-5 flex items-baseline justify-between gap-3">
                    <span className="exhibit-title text-[1.35rem] text-text-2 transition-colors group-hover:text-accent">
                      {p.title}
                    </span>
                    <span className="label-muted label shrink-0">{p.year}</span>
                  </div>
                  <ExhibitMeta project={p} />
                </Link>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </div>

      <ZelligeBand className="mt-4 w-full" aria-hidden="true" tile={12} count={72} muted />
    </Room>
  )
}