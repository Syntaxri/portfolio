import type { Metadata } from 'next'
import { skills } from '@/lib/data/skills'
import { AboutClient } from './AboutClient'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Backend-focused full-stack engineer with strong Java/Spring Boot expertise, REST API design, and secure systems architecture.',
}

const timeline = [
  {
    year: '2024',
    role: 'Backend Engineer',
    company: 'Independent',
    desc: 'Architected WISLA athlete management platform with Java 17, Spring Boot 3, Spring Security 6 RBAC, and MySQL. Designed multi-tenant data isolation with discriminator-based strategies and row-level locking for concurrent scheduling.',
  },
  {
    year: '2023',
    role: 'Full-Stack Developer',
    company: 'Independent',
    desc: 'Built the Interactive Portfolio with Next.js 14, Three.js 3D visualisations, and dynamic theming via CSS custom properties. Achieved 98 Lighthouse performance across all routes with aggressive code-splitting.',
  },
  {
    year: '2022',
    role: 'Full-Stack Developer',
    company: 'Contract',
    desc: 'Built a high-throughput REST API serving 50k+ users with role-based access control and push notifications. Deployed on Docker with CI/CD pipelines; managed PostgreSQL and Redis-backed services on Linux infrastructure.',
  },
  {
    year: '2021',
    role: 'Started Coding',
    company: 'Self-Taught',
    desc: 'Built first full-stack application with Java and Spring Boot after months of self-study. Contributed to open-source projects and participated in hackathons. Published technical articles on backend architecture and API design.',
  },
]

export default function AboutPage() {
  return <AboutClient skills={skills} timeline={timeline} />
}
