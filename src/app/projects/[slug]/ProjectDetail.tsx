'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealText } from '@/components/animations/RevealText'
import { Magnetic } from '@/components/animations/Magnetic'
import { ProjectVisual } from '@/components/projects/ProjectVisual'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Project } from '@/types'

gsap.registerPlugin(ScrollTrigger)

interface ProjectDetailProps {
  project: Project
  nextProject?: Project
}

export function ProjectDetail({ project, nextProject }: ProjectDetailProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = rootRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>('.detail-reveal').forEach((node) => {
        gsap.fromTo(
          node,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: { trigger: node, start: 'top 88%', once: true },
          }
        )
      })
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={rootRef}>
      {/* Cinematic hero */}
      <header className="relative border-b border-white/[0.06]">
        <div className="mx-auto max-w-shell px-5 pb-16 pt-[calc(var(--nav-h)+2rem)] sm:px-8">
          <Link
            href="/projects"
            className="label inline-flex items-center gap-3 transition-colors hover:text-ink"
          >
            <span aria-hidden>←</span> All projects
          </Link>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="flex items-center gap-4">
                <span className="label text-accent-secondary">{project.category}</span>
                <span className="h-px w-8 bg-white/15" />
                <span className="label">{project.role}</span>
              </div>

              <h1 className="mt-6 text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[0.95] tracking-tight">
                <RevealText>{project.title}</RevealText>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-relaxed text-ink-secondary md:text-lg">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap content-end gap-2 md:col-span-4 md:justify-end">
              {project.tags.map((t) => (
                <span key={t} className="tag border border-white/10 px-3 py-1 font-mono text-[0.55rem] uppercase tracking-widest text-ink-tertiary">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Visual band — the project cover, framed at the source ratio */}
        <div
          className="relative mx-auto mb-14 flex h-[38vh] max-w-shell items-center justify-center overflow-hidden px-5 sm:px-8 md:h-auto md:aspect-[1905/990]"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(90% 120% at 50% 100%, ${project.color}26 0%, ${project.color}0a 45%, transparent 70%)`,
            }}
          />
          <ProjectVisual
            project={project}
            className="absolute inset-x-0 top-1/2 h-full w-full scale-[1.04] -translate-y-1/2 object-cover opacity-80 blur-[1.5px] mix-blend-screen"
          />
          <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.06]" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-2 pb-4">
            <span className="label text-white/45">{project.title} — {project.category}</span>
            <span className="label text-white/45">{project.year}</span>
          </div>
        </div>
      </header>

      {/* Immersive overview */}
      <section className="mx-auto max-w-shell px-5 py-20 sm:px-8" aria-label="Overview">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <h2 className="fluid-h2 max-w-xl font-extrabold tracking-tight md:col-span-5">
            The brief, <span className="text-outline">unpacked</span>
          </h2>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-base leading-relaxed text-ink-secondary">{project.longDescription}</p>

            {project.metrics && project.metrics.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-px bg-white/[0.07]">
                {project.metrics.map((m) => (
                  <div key={m.label} className="detail-reveal bg-base p-6">
                    <dt className="label mb-2">{m.label}</dt>
                    <dd className="font-display text-3xl font-extrabold tracking-tight text-accent-secondary">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </section>

      {/* Challenges & solutions */}
      {project.challenges && project.challenges.length > 0 && (
        <section className="border-t border-white/[0.06]" aria-label="Challenges and solutions">
          <div className="mx-auto max-w-shell px-5 py-20 sm:px-8">
            <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end">
              <div>
                <p className="label label-accent mb-6">The work</p>
                <h2 className="fluid-h2 font-extrabold tracking-tight">Challenges, and how they fell</h2>
              </div>
            </div>

            <ol className="border-t border-white/[0.08]">
              {project.challenges.map((c, i) => (
                <li
                  key={i}
                  className="detail-reveal grid grid-cols-1 gap-6 border-b border-white/[0.08] py-12 md:grid-cols-12"
                >
                  <span className="label pt-2 text-accent-secondary md:col-span-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="md:col-span-4">
                    <h3 className="fluid-title font-extrabold tracking-tight">{c.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-ink-tertiary">{c.description}</p>
                  </div>
                  <div className="md:col-span-6 md:col-start-7">
                    <p className="label mb-3 text-accent-secondary">Solution</p>
                    <p className="text-base leading-relaxed text-ink-secondary">{c.solution}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="border-t border-white/[0.06]" aria-label="Gallery">
          <div className="mx-auto max-w-shell px-5 py-20 sm:px-8">
            <h2 className="label label-accent mb-8">Gallery</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {project.gallery.map((img, i) => (
                <figure key={i} className="detail-reveal">
                  {/* eslint-disable-next-line @next/next/no-img-element -- gallery images are remote/local, aspect unknown */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    style={{ width: '100%', height: 'auto' }}
                  />
                  {img.caption && <figcaption className="label mt-3">{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Next project */}
      {nextProject && (
        <section className="border-t border-white/[0.06]" aria-label="Next project">
          <Link href={`/projects/${nextProject.slug}`} className="group block" data-cursor-text="Next">
            <div className="mx-auto max-w-shell px-5 py-20 text-center sm:px-8">
              <p className="label mb-6 text-accent-secondary">Next project</p>
              <p className="text-[clamp(2.5rem,8vw,7rem)] font-extrabold leading-none tracking-tight text-outline transition-colors duration-500 group-hover:text-ink">
                {nextProject.title}
              </p>
              <p className="label mt-8 inline-flex items-center gap-2">
                Continue <span aria-hidden>→</span>
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* Bottom bar */}
      <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-6 px-5 py-10 sm:px-8">
        <Link href="/projects" className="link-underline label text-ink-tertiary transition-colors hover:text-ink">
          ← All projects
        </Link>
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline label text-accent-secondary"
          >
            Visit live site ↗
          </a>
        ) : (
          <span className="label text-ink-tertiary">Private project — no live link</span>
        )}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="link-underline label cursor-pointer text-ink-tertiary transition-colors hover:text-ink"
        >
          Back to top ↑
        </button>
      </div>
    </div>
  )
}