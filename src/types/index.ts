export type Glaze = 'cobalt' | 'teal' | 'terra' | 'brass' | 'ivory'

export interface Project {
  title: string
  slug: string
  /** exhibition accession number, e.g. 'INV. I' */
  accession: string
  description: string
  longDescription: string
  tags: string[]
  glaze: Glaze
  /** exhibition year */
  year: string
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
  /** intrinsic dimensions — reserve space to prevent layout shift while loading */
  width: number
  height: number
}