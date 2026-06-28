import type { MetadataRoute } from 'next'
import { projects } from '@/lib/data/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://viaruq.dev'
  const now = new Date()

  const staticPages = [
    { url: base, lastModified: now, changeFrequency: 'monthly' as const, priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
  ]

  const projectPages = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...projectPages]
}
