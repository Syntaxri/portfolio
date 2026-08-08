import type { Metadata } from 'next'
import { AboutClient } from './AboutClient'
import { experience } from '@/lib/data/experience'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Creative developer and full-stack engineer — Java/Spring Boot backend work meets React, TypeScript and WebGL frontends.',
}

export default function AboutPage() {
  return <AboutClient experience={experience} />
}