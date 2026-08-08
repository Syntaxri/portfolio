'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { getFeaturedProjects } from '@/lib/data/projects'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Editorial project index. Rows are large typography links;
 * on desktop a floating preview follows the pointer.
 */
export function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const preRef = useRef<HTMLDivElement>(null)
  const preTitleRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()
  const projects = getFeaturedProjects()

useEffect(() => {
    if (reduced) return
    const pre = preRef.current
    if (!pre) return
    const onMove = (e: MouseEvent) => {
      gsap.to(pre, { x: e.clientX + 22, y: e.clientY - pre.offsetHeight - 60, duration: 0.35, ease: 'power3.out' })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  const showPreview = (title: string, color: string) => {
    if (reduced) return
    gsap.to(preRef.current, { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out' })
    if (preTitleRef.current) {
      preTitleRef.current.textContent = title
      preTitleRef.current.style.color = '#fff'
      preTitleRef.current.style.textShadow = `0 0 40px ${color}55`
    }
  }

  const hidePreview = () => {
    if (reduced) return
    gsap.to(preRef.current, { opacity: 0, scale: 0.92, duration: 0.2, ease: 'power3.out' })
  }

  return (
    <section ref={sectionRef} id="work" aria-label="Selected work" className="section-pad relative">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label label-accent mb-6">03 — Selected Work</p>
            <h2 className="fluid-h2 max-w-xl font-extrabold tracking-tight">
              Projects with intent
            </h2>
          </div>
          <Link href="/projects" className="link-underline label hidden text-ink-secondary md:block">
            All projects
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-shell px-5 sm:px-8">
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            data-cursor-text="View"
            onMouseEnter={(e) => showPreview(project.title, project.color)}
            onMouseLeave={hidePreview}
            className="group block border-t border-white/[0.08] py-8 transition-colors duration-500 last:border-b hover:bg-white/[0.015] sm:py-10"
          >
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-12">
              <span className="label md:col-span-1 md:self-start" style={{ opacity: 0.4 }}>
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="md:col-span-6">
                <h3 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-none tracking-tight text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-4 md:group-hover:translate-x-6">
                  {project.title}
                </h3>
              </div>

              <div className="md:col-span-4 md:justify-self-end">
                <div className="flex items-center gap-3 md:justify-end">
                  <span className="label text-accent-secondary">{project.category}</span>
                  <span className="h-px w-8 bg-white/15" />
                  <span className="label">{project.role}</span>
                </div>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-secondary md:text-right" style={{ opacity: 0.75 }}>
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 md:justify-end">
                  {project.tags.slice(0, 4).map((t) => (
                    <span key={t} className="tag border-white/10 font-mono text-[0.55rem] uppercase tracking-widest text-ink-tertiary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* floating preview */}
      <div
        ref={preRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden aspect-[4/3] w-72 items-center justify-center lg:flex"
        style={{
          opacity: 0,
          scale: 0.92,
          background: 'linear-gradient(145deg, rgba(139,92,246,0.25), rgba(20,16,40,0.9))',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h3 ref={preTitleRef} className="fluid-title px-8 text-center font-extrabold tracking-tight text-white" />
      </div>
    </section>
  )
}