import type { MetadataRoute } from 'next'
import { projects } from '@/lib/data/projects'
import { site } from '@/lib/data/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${site.domain}`
  const now = new Date()

  const staticPages = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 1 },
  ]

  const projectPages = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...projectPages]
}