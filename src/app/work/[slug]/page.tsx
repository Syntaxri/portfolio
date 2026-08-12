import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getNextProject, getProject, projects } from '@/lib/data/projects'
import { ExhibitCover } from '@/components/projects/ExhibitCover'
import { Reveal, RevealItem } from '@/components/museum/Reveal'
import { ZelligeBand } from '@/components/museum/ZelligeBand'
import { starPath } from '@/lib/geometry'
import { site } from '@/lib/data/site'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return {
    title: `${project.title} — exhibit room`,
    description: project.description,
    openGraph: {
      title: `${project.title} · ${project.category} · ${project.year}`,
      description: project.description,
      url: `https://${site.domain}/work/${project.slug}`,
    },
  }
}

/**
 * AN EXHIBIT ROOM — the full document for one accession: the door, the
 * artwork, the fact sheet, the field notes, the frames. One room in the
 * museum, numbered and lit.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  const next = getNextProject(slug)
  const liveLink = project.liveUrl ?? null

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-10 flex items-center justify-between gap-4">
        <Link href="/#collection" className="label transition-colors hover:text-accent">
          ← The Collection
        </Link>
        <span className="label-muted label hidden sm:inline">
          Room {project.accession} — {project.category}
        </span>
      </nav>

      <Reveal>
        <header data-rv className="mb-12 max-w-[820px]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="plaque plaque-accent">{project.accession}</span>
            <span className="plaque">{project.category}</span>
            <span className="plaque">{project.role}</span>
            <span className="plaque">{project.year}</span>
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noreferrer"
                className="label transition-colors hover:text-accent"
              >
                Live ↗
              </a>
            )}
          </div>
          <h1 className="display-title mt-7 text-text">{project.title}</h1>
          <p className="lede mt-6 max-w-[44ch] text-text-2">{project.description}</p>
        </header>
      </Reveal>

      <Reveal>
        <div data-rv className="mb-16 max-w-[900px]">
          <ExhibitCover project={project} priority />
        </div>
      </Reveal>

      <Reveal className="mb-20">
        <div data-rv className="grid max-w-[900px] grid-cols-2 gap-3 sm:grid-cols-4">
          {project.metrics?.map((m) => (
            <div key={m.label} className="border border-[rgba(28,26,22,0.14)] bg-surface p-4">
              <p className="label-muted label mb-2">{m.label}</p>
              <p className="font-display text-2xl font-extrabold tracking-tight text-accent">
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <div data-rv>
              <p className="label-accent label mb-4">The fact sheet</p>
              <div className="max-w-[62ch] space-y-5 text-lg leading-relaxed text-text-2">
                {project.longDescription}
              </div>
            </div>
          </Reveal>

          {project.challenges && project.challenges.length > 0 && (
            <Reveal className="mt-16">
              <p data-rv className="label-accent label mb-6">
                Field notes — problems, decisions
              </p>
              <div className="space-y-5">
                {project.challenges.map((c, i) => (
                  <RevealItem key={c.title}>
                    <article className="border border-[rgba(28,26,22,0.14)] bg-surface p-6">
                      <div className="flex items-baseline gap-3">
                        <span className="label-muted label shrink-0">0{i + 1}</span>
                        <h2 className="text-lg font-bold tracking-tight text-text">{c.title}</h2>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-text-3">{c.description}</p>
                      <p className="mt-3 border-l-2 border-accent-2/60 pl-3 text-sm leading-relaxed text-text-2">
                        {c.solution}
                      </p>
                    </article>
                  </RevealItem>
                ))}
              </div>
            </Reveal>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <Reveal className="mt-16">
              <p data-rv className="label-accent label mb-6">
                Selected frames
              </p>
              <div className="space-y-8">
                {project.gallery.map((g) => (
                  <RevealItem key={g.src}>
                    <figure className="arch-frame aspect-[16/9] w-full">
                      <Image
                        src={g.src}
                        alt={g.alt}
                        fill
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        loading="lazy"
                        decoding="async"
                        className="object-contain"
                      />
                      <figcaption className="label-muted label relative border-t border-[rgba(28,26,22,0.12)] bg-surface/[0.92] px-4 py-2.5">
                        {g.caption}
                      </figcaption>
                    </figure>
                  </RevealItem>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="space-y-6 lg:sticky lg:top-28">
            <Reveal>
              <div data-rv className="border border-[rgba(28,26,22,0.14)] bg-surface p-6">
                <p className="label-accent label mb-5">The ledger</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span key={t} className="tile-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <svg viewBox="0 0 40 40" className="mt-6 h-10 w-10 text-accent" aria-hidden="true">
                  <path
                    d={starPath(20, 20, 16, 6.6)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d={starPath(20, 20, 16, 6.6)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    transform="rotate(22.5 20 20)"
                  />
                </svg>
              </div>
            </Reveal>
            <Reveal>
              <div data-rv className="border border-[rgba(28,26,22,0.14)] bg-bg-2 p-6">
                <p className="label-accent label mb-4">Commission this kind of work</p>
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent(`About ${project.title}`)}`}
                  className="serif text-2xl leading-snug text-text-2 transition-colors hover:text-accent"
                >
                  {site.email}
                </a>
                <p className="mt-3 text-sm leading-relaxed text-text-3">
                  One person, one build: concept to deployment, no handoffs lost in between.
                </p>
              </div>
            </Reveal>
          </div>
        </aside>
      </div>

      {/* the next accession */}
      <div className="mt-24 border-t border-[rgba(28,26,22,0.14)] pt-10">
        <Link
          href={`/work/${next.slug}`}
          className="group flex flex-wrap items-baseline justify-between gap-4"
          data-cursor="exhibit"
        >
          <span className="label-muted label">Next accession — {next.accession}</span>
          <span className="font-sans text-3xl font-extrabold tracking-tight text-text-2 transition-colors group-hover:text-accent sm:text-5xl">
            {next.title} →
          </span>
        </Link>
      </div>

      <ZelligeBand className="mt-12 w-full" aria-hidden="true" tile={12} count={72} muted />
    </div>
  )
}