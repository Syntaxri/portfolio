'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Project } from '@/types'

const gradients = [
  'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(99,102,241,0.04) 50%, transparent 100%)',
  'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(139,92,246,0.04) 50%, transparent 100%)',
  'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.04) 50%, transparent 100%)',
  'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(168,85,247,0.04) 50%, transparent 100%)',
]

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project
  index?: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="no-underline block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article
        className="panel p-5"
        style={{
          background: hovered
            ? gradients[index % gradients.length]
            : undefined,
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
          {project.tags.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="text-[0.55rem] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{
                background: hovered
                  ? 'rgba(var(--accent-rgb), 0.06)'
                  : 'rgba(255,255,255,0.03)',
                border: hovered
                  ? '1px solid rgba(var(--accent-rgb), 0.15)'
                  : '1px solid rgba(255,255,255,0.06)',
                color: hovered
                  ? 'rgba(var(--accent-rgb), 0.7)'
                  : 'rgba(255,255,255,0.3)',
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
            className="font-mono text-[0.55rem] tracking-wider uppercase"
            style={{
              color: hovered
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(255,255,255,0.25)',
            }}
          >
            View details
          </span>
        </div>
      </article>
    </Link>
  )
}
