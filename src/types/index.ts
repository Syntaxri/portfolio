export type CoverVariant = 'aurora' | 'orb' | 'grid' | 'mesh' | 'signal'

export interface Project {
  title: string
  slug: string
  description: string
  longDescription: string
  tags: string[]
  icon: string
  color: string
  /** kept deliberately minimal — cover art is an abstract placeholder, never a fabricated screenshot */
  year: string
  coverVariant?: CoverVariant
  /** path to the real cover screenshot inside /public/work/<slug>/ */
  cover?: string
  /** live deployment of the project, if one exists */
  liveUrl?: string
  category?: string
  role?: string
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
    size?: number
    commits?: { message: string }[]
    ref_type?: string
    action?: string
  }
  repo: {
    name: string
  }
  created_at: string
}