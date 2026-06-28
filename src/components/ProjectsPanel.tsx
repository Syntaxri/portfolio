import { getFeaturedProjects } from '../lib/data/projects'
import { ProjectCard } from './ProjectCard'

export function ProjectsPanel() {
  const featuredProjects = getFeaturedProjects()

  return (
    <div>
      <div className="flex items-center justify-between mb-5 px-1">
        <div>
          <h2 className="font-display font-bold text-lg text-white tracking-tight">
            Featured Work
          </h2>
          <p className="font-mono text-[0.6rem] tracking-wider text-white/30 mt-0.5">
            Selected projects that demonstrate my approach
          </p>
        </div>
        <a
          href="/projects"
          className="font-mono text-[0.6rem] tracking-widest uppercase text-white/30 hover:text-[var(--accent)] transition-colors no-underline"
        >
          View all →
        </a>
      </div>

      <div className="space-y-4">
        {featuredProjects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </div>
  )
}
