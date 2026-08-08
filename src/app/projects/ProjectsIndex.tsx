'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealText } from '@/components/animations/RevealText'
import { ProjectVisual } from '@/components/projects/ProjectVisual'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Project } from '@/types'

gsap.registerPlugin(ScrollTrigger)

export function ProjectsIndex({ projects }: { projects: Project[] }) {
  const listRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = listRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.proj-row'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        }
      )
      gsap.fromTo(
        el.querySelectorAll('.proj-cover-inner'),
        { yPercent: 12, scale: 1.08 },
        {
          yPercent: 0,
          scale: 1,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <div className="mx-auto max-w-shell px-5 sm:px-8">
      <header className="mb-16 max-w-3xl">
        <p className="label label-accent mb-6">Index — {projects.length} projects</p>
        <h1 className="fluid-title font-extrabold tracking-tight">
          <RevealText>Work that ships,</RevealText>
          <RevealText className="text-outline">experiences that stay.</RevealText>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-secondary">
          A selection from backend platforms to immersive 3D web experiences — each one chosen for what it
          demanded technically.
        </p>
      </header>

      <div ref={listRef} className="flex flex-col gap-14 md:gap-16">
        {projects.map((project, i) => {
          const flip = i % 2 === 1
          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              data-cursor-text="Open"
              className={`proj-row group block ${flip ? 'md:ml-auto' : ''} md:w-[calc(100%-4rem)]`}
            >
              <div className="relative overflow-hidden border border-white/[0.08] bg-white/[0.02]">
                <div className="proj-cover-inner aspect-[1905/990] will-change-transform">
                  <ProjectVisual project={project} className="aspect-[1905/990] w-full" />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
                <div className="absolute bottom-4 left-5 flex items-center gap-3">
                  <span className="label text-white/70">{String(i + 1).padStart(2, '0')}</span>
                  <span className="h-px w-8 bg-white/25" />
                  <span className="label label-accent">{project.category}</span>
                  <span className="label text-white/50">{project.year}</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 items-end gap-4 md:grid-cols-12">
                <div className={`md:col-span-6 ${flip ? 'md:order-2' : ''}`}>
                  <h2 className="text-[clamp(2.25rem,5vw,4.25rem)] font-extrabold leading-[0.95] tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
                    {project.title}
                  </h2>
                </div>
                <div
                  className={`md:col-span-5 md:col-start-8 ${flip ? 'md:order-1 md:col-start-7 md:justify-self-end md:text-right' : 'md:justify-self-end'}`}
                >
                  <p className="label text-accent-secondary">{project.role}</p>
                  <p
                    className="mt-3 max-w-md text-sm leading-relaxed text-ink-secondary"
                    style={{ opacity: 0.75 }}
                  >
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 md:justify-end">
                    {project.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-tertiary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
