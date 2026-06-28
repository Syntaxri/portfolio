import type { Metadata } from 'next'
import { projects } from '@/lib/data/projects'
import { ProjectsClient } from './ProjectsClient'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Projects by Akram Rihani — from athlete management platforms to interactive portfolios.',
}

export default function ProjectsPage() {
  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 pt-8">
      <div className="mb-10 px-1">
        <span className="font-mono text-[0.6rem] tracking-widest uppercase block mb-3"
          style={{ color: 'var(--accent)' }}
        >
          Work
        </span>
        <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,3.5rem)] text-white tracking-tight leading-none mb-3">
          Projects
        </h1>
        <p className="font-mono text-sm text-white/30">
          {projects.length} projects across backend, frontend, and full-stack
        </p>
      </div>

      <ProjectsClient projects={projects} />
    </div>
  )
}
