/**
 * modeContent.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for mode-specific UI content and theme.
 * Heavy assets (projects, gallery) are imported from structured data files
 * so they can be tree-shaken / dynamically imported by consumers.
 *
 * Import pattern in pages:
 *   // Only loads developer data in developer mode
 *   const { featuredProjects } = await import('../lib/data/developerProjects');
 */
import { developerProjects, featuredProjects }           from './data/developerProjects';
import { photographyGallery, photographyCollections, featuredPhotos } from './data/photographyGallery';

export const developerContent = {
  meta: {
    title:       'Akram Rihani — Developer',
    description: 'Full-stack developer building performant, accessible digital products.',
  },
  hero: {
    badge: '▸ Available for work',
    dropCap: 'I',
    line1:   'Build things',
    line2:   'call it V1.0',
    sub:     'Full-stack developer specializing in performant, accessible, and beautifully crafted digital products.',
    cta1: { label: 'View Projects', href: '/projects' },
    cta2: { label: 'About Me',      href: '/about'    },
  },
  nav: [
    { href: '/',         label: 'Home'     },
    { href: '/about',    label: 'About'    },
    { href: '/projects', label: 'Projects' },
    { href: '/contact',  label: 'Contact'  },
  ],
  // Reference to structured data — consumers can import directly for lazy loading
  projects:         developerProjects,
  featuredProjects: featuredProjects,
  skills: [
    { skill: 'JavaScript / TypeScript', level: 95 },
    { skill: 'React / Next.js',         level: 92 },
    { skill: 'Node.js',                 level: 88 },
    { skill: 'PostgreSQL',              level: 80 },
    { skill: 'Docker / DevOps',         level: 72 },
    { skill: 'System Design',           level: 75 },
  ],
  about: {
    tagline: 'I engineer systems and craft interfaces that people actually enjoy using.',
    bio1:    '5+ years building full-stack products — from solo MVPs to systems serving hundreds of thousands of users.',
    bio2:    "When I'm not shipping features I'm learning something new, contributing to open source, or out with a camera.",
    stats:   [
      { n: '5+',  label: 'Years coding'     },
      { n: '30+', label: 'Projects shipped'  },
      { n: '3',   label: 'Open source libs'  },
    ],
  },
  theme: {
    accent:          '#ff6b35',
    accentSecondary: '#c8f04a',
    bg:              '#0a0a08',
    surface:         '#111110',
    particleColor:   '#ff6b35',
    cursorColor:     '#ffffff',
  },
};

export const photographyContent = {
  meta: {
    title:       'Akram Rihani — Photography',
    description: 'Visual storyteller capturing landscapes, cities, and quiet moments.',
  },
  hero: {
    badge:   '▸ Available for commissions',
    dropCap: 'I',
    line1:   'Capture moments',
    line2:   'call it light',
    sub:     'Visual storyteller working across landscape, urban, and portrait photography.',
    cta1: { label: 'View Gallery', href: '/photography' },
    cta2: { label: 'About Me',     href: '/about'       },
  },
  nav: [
    { href: '/',            label: 'Home'    },
    { href: '/about',       label: 'About'   },
    { href: '/photography', label: 'Gallery' },
    { href: '/contact',     label: 'Contact' },
  ],
  gallery:      photographyGallery,
  featuredPhotos: featuredPhotos,
  collections:  photographyCollections,
  about: {
    tagline: 'I see the world in frames — landscapes, cities, and the quiet in between.',
    bio1:    'Photography found me before code did. I shoot landscapes, urban environments, and portraits.',
    bio2:    'Based wherever the light is good. Currently exploring long-exposure night photography.',
    stats:   [
      { n: '5+', label: 'Years shooting' },
      { n: '8',  label: 'Countries shot' },
      { n: 'α7', label: 'Sony Series'    },
    ],
  },
  theme: {
    accent:          '#d4a853',
    accentSecondary: '#e8e8e0',
    bg:              '#0d0c0a',
    surface:         '#141310',
    particleColor:   '#d4a853',
    cursorColor:     '#ffffff',
  },
};

export const MODES = {
  developer:   developerContent,
  photography: photographyContent,
};