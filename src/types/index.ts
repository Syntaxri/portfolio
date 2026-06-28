export interface Project {
  title: string
  slug: string
  description: string
  longDescription: string
  tags: string[]
  icon: string
  color: string
  featured?: boolean
  challenges?: Challenge[]
  metrics?: PerfMetric[]
  gallery?: GalleryImage[]
}

export interface Challenge {
  title: string
  description: string
  solution: string
}

export interface PerfMetric {
  label: string
  value: string
}

export interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

export interface GitHubEvent {
  id: string
  type: string
  payload: {
    commits?: { message: string }[]
    ref_type?: string
    action?: string
  }
  repo: {
    name: string
  }
  created_at: string
}
