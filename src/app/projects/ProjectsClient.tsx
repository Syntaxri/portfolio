'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Project } from '@/types'

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="no-underline block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article
        className="panel p-6"
        style={{
          borderColor: hovered
            ? 'rgba(var(--accent-rgb), 0.2)'
            : undefined,
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.6rem] font-bold"
              style={{
                background: `${project.color}15`,
                border: `1px solid ${project.color}30`,
                color: project.color,
              }}
            >
              {project.icon}
            </span>
            <h3
              className="font-display font-bold text-base text-white transition-colors"
              style={hovered ? { color: 'var(--accent)' } : undefined}
            >
              {project.title}
            </h3>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-white/45 mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tech) => (
            <span
              key={tech}
              className="tag"
              style={{
                background: hovered
                  ? 'rgba(var(--accent-rgb), 0.06)'
                  : undefined,
                borderColor: hovered
                  ? 'rgba(var(--accent-rgb), 0.15)'
                  : undefined,
                color: hovered
                  ? 'rgba(var(--accent-rgb), 0.7)'
                  : undefined,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {project.featured && (
            <span
              className="font-mono text-[0.6rem] tracking-widest uppercase flex items-center gap-1.5 transition-all duration-200"
              style={{ color: 'var(--accent)' }}
            >
              Case study →
            </span>
          )}
          <span
            className="font-mono text-[0.6rem] tracking-widest uppercase transition-colors duration-200"
            style={{
              color: hovered
                ? 'rgba(255,255,255,0.6)'
                : 'rgba(255,255,255,0.25)',
            }}
          >
            View details ↗
          </span>
        </div>
      </article>
    </Link>
  )
}

export function ProjectsClient({
  projects,
}: {
  projects: Project[]
}) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-sm text-white/30 text-center py-16">
          No projects yet.
        </p>
      )}
    </div>
  )
}
