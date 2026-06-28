import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, projects } from '@/lib/data/projects'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject(params.slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
  }
}

export default function ProjectPage({ params }: Props) {
  const project = getProject(params.slug)
  if (!project) notFound()

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 pt-8 pb-24">
      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] tracking-widest uppercase no-underline mb-10 transition-colors"
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        ← Back to projects
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold mb-4"
          style={{
            background: `${project.color}15`,
            border: `1px solid ${project.color}30`,
            color: project.color,
          }}
        >
          {project.icon}
        </div>

        <h1 className="font-display font-extrabold text-[clamp(2rem,4.5vw,3.25rem)] text-white tracking-tight leading-[1.05] mb-4">
          {project.title}
        </h1>

        <p className="text-base leading-relaxed text-white/45 max-w-[600px] mb-6">
          {project.longDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tech) => (
            <span key={tech} className="tag">{tech}</span>
          ))}
        </div>
      </div>

      <div className="divider mb-12" />

      {/* Challenges */}
      {project.challenges && project.challenges.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display font-bold text-lg text-white tracking-tight mb-6">
            Key Challenges
          </h2>
          <div className="space-y-5">
            {project.challenges.map((c, i) => (
              <div key={i} className="panel p-5">
                <span
                  className="font-mono text-[0.55rem] font-bold tracking-wider block mb-2"
                  style={{ color: 'rgba(var(--accent-rgb), 0.5)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display font-semibold text-sm text-white mb-2">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/40 mb-2">
                  {c.description}
                </p>
                <p className="text-sm leading-relaxed text-white/50">
                  <span style={{ color: 'var(--accent)' }}>Solution:</span> {c.solution}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Metrics */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display font-bold text-lg text-white tracking-tight mb-6">
            Performance & Impact
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {project.metrics.map((m, i) => (
              <div key={i} className="panel p-5 text-center">
                <p
                  className="font-display font-extrabold text-2xl tracking-tight mb-1"
                  style={{ color: 'var(--accent)' }}
                >
                  {m.value}
                </p>
                <p className="font-mono text-[0.55rem] tracking-widest uppercase text-white/25">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display font-bold text-lg text-white tracking-tight mb-6">
            Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery.map((img, i) => (
              <div key={i} className="panel overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto block"
                  loading="lazy"
                />
                {img.caption && (
                  <p className="font-mono text-[0.55rem] tracking-wider text-white/30 px-4 py-2.5">
                    {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="divider mb-8" />
      <div className="flex justify-between items-center">
        <Link
          href="/projects"
          className="font-mono text-[0.6rem] tracking-widest uppercase no-underline transition-colors"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          ← All projects
        </Link>
        <a
          href={`https://github.com/Syntaxri/${project.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[0.6rem] tracking-widest uppercase no-underline transition-colors"
          style={{ color: 'var(--accent)' }}
        >
          View on GitHub →
        </a>
      </div>
    </div>
  )
}
