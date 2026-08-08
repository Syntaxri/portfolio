'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getFeaturedProjects } from '@/lib/data/projects'
import { ProjectVisual } from '@/components/projects/ProjectVisual'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Editorial case index — each row is a composition, not a card.
 * Covers scroll-in with a mask lift, alternate alignment, and respond
 * to hover with a contained parallax + lift. No hover-only content:
 * every piece of metadata is visible statically.
 */
export function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const projects = getFeaturedProjects()

  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.fw-row'),
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'power4.out', stagger: 0.14, scrollTrigger: { trigger: el, start: 'top 74%', once: true } }
      )

      /* cover masks rise through their frame */
      gsap.fromTo(
        el.querySelectorAll('.fw-cover-inner'),
        { yPercent: 14, scale: 1.12 },
        { yPercent: 0, scale: 1, duration: 1.4, ease: 'expo.out', stagger: 0.16, scrollTrigger: { trigger: el, start: 'top 78%', once: true } }
      )
    }, el)

    /* hover: pointer-driven drift on the cover only — single delegated
       listener per section, removed with the context on unmount */
    const rel = new Map<HTMLElement, { xTo: (v: number) => void; yTo: (v: number) => void }>()
    el.querySelectorAll<HTMLElement>('.fw-row').forEach((row) => {
      const cover = row.querySelector<HTMLElement>('.fw-cover-inner')
      if (!cover) return
      rel.set(row, {
        xTo: gsap.quickTo(cover, 'x', { duration: 0.8, ease: 'power3.out' }),
        yTo: gsap.quickTo(cover, 'y', { duration: 0.8, ease: 'power3.out' }),
      })
    })
    const onMove = (e: PointerEvent) => {
      const row = (e.target as HTMLElement).closest('.fw-row') as HTMLElement | null
      const entry = row ? rel.get(row) : undefined
      if (!row || !entry) return
      const rect = row.getBoundingClientRect()
      const cx = (e.clientX - rect.left) / rect.width - 0.5
      const cy = (e.clientY - rect.top) / rect.height - 0.5
      entry.xTo(cx * -16)
      entry.yTo(cy * -10)
    }
    const onLeave = () => {
      rel.forEach((entry) => {
        entry.xTo(0)
        entry.yTo(0)
      })
    }
    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    ctx.add(() => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    })

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} id="work" aria-label="Selected work" className="section-pad ambient-top relative">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label label-accent mb-6">03 — Selected Work</p>
            <h2 className="fluid-h2 max-w-xl font-extrabold tracking-tight">
              Case studies, <span className="text-outline">not cards</span>
            </h2>
          </div>
          <Link href="/projects" data-cursor-text="Archive" className="link-underline label hidden text-ink-secondary md:block">
            Full archive — {projects.length} featured
          </Link>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {projects.map((project, i) => {
            const flip = i % 2 === 1
            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                data-cursor-text="View"
                className={`fw-row group relative block ${flip ? 'md:ml-auto' : ''} md:w-[calc(100%-4rem)]`}
              >
                {/* cover — always visible, the entry point of the case */}
                <div className="relative overflow-hidden border border-white/[0.08] bg-white/[0.02]">
                  <div className="fw-cover-inner will-change-transform" style={{ transform: 'translateY(14%) scale(1.12)' }}>
                    <ProjectVisual project={project} className="aspect-[1905/990] w-full" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="label text-white/70">{String(i + 1).padStart(2, '0')}</span>
                      <span className="h-px w-8 bg-white/25" />
                      <span className="label label-accent">{project.category}</span>
                    </div>
                    <span className="label text-white/55">{project.year}</span>
                  </div>
                </div>

                {/* editorial metadata */}
                <div className={`mt-6 grid grid-cols-1 items-end gap-4 md:grid-cols-12 ${flip ? '' : ''}`}>
                  <div className="md:col-span-7">
                        <h3 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-tight text-ink transition-transform duration-500 ease-out-expo ${flip ? 'group-hover:-translate-x-3' : 'group-hover:translate-x-3'}">
                          {project.title}
                        </h3>
                      </div>
                      <div className="md:col-span-4 md:col-start-9 md:justify-self-end">
                        <p className="label mb-3 text-accent-secondary">{project.role}</p>
                        <p className="max-w-sm text-sm leading-relaxed text-ink-secondary" style={{ opacity: 0.78 }}>
                          {project.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 md:justify-end">
                          {project.tags.slice(0, 4).map((t) => (
                            <span key={t} className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-tertiary">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}