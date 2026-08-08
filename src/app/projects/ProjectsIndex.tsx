'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealText } from '@/components/animations/RevealText'
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
          A selection from backend platforms to immersive 3D web experiences —
          each one chosen for what it demanded technically.
        </p>
      </header>

      <div ref={listRef} className="border-t border-white/[0.08]">
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            data-cursor-text="Open"
            className="proj-row group block border-b border-white/[0.08] py-9 transition-colors duration-500 hover:bg-white/[0.015] sm:py-11"
          >
            <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
              <span className="label self-start pt-3 md:col-span-1" style={{ opacity: 0.45 }}>
                {String(i + 1).padStart(2, '0')}
              </span>

              <h2 className="text-[clamp(2.25rem,5vw,4.25rem)] font-extrabold leading-none tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-4 md:col-span-6">
                {project.title}
              </h2>

              <div className="md:col-span-5 md:justify-self-end">
                <div className="flex items-center gap-3 md:justify-end">
                  <span className="label text-accent-secondary">{project.category}</span>
                  <span className="h-px w-8 bg-white/15" />
                  <span className="label">{project.role}</span>
                </div>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-secondary" style={{ opacity: 0.72 }}>
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 md:justify-end">
                  {project.tags.slice(0, 4).map((t) => (
                    <span key={t} className="tag border border-white/10 px-3 py-1 font-mono text-[0.55rem] uppercase tracking-widest text-ink-tertiary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}