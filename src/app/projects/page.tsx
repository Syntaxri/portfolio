import type { Metadata } from 'next'
import { projects } from '@/lib/data/projects'
import { ProjectsIndex } from './ProjectsIndex'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Projects by Akram Rihani — from athlete management platforms and Web3 communities to immersive 3D web experiences.',
}

export default function ProjectsPage() {
  return (
    <div className="pt-[calc(var(--nav-h)+2.5rem)]">
      <ProjectsIndex projects={projects} />
    </div>
  )
}
