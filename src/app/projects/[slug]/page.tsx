import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, getNextProject, projects } from '@/lib/data/projects'
import { ProjectDetail } from './ProjectDetail'

interface Props {
  params: { slug: string }
}

export const dynamicParams = false

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

  const nextProject = getNextProject(project.slug)

  return <ProjectDetail project={project} nextProject={nextProject} key={project.slug} />
}
