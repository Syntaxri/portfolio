/**
 * modeContent.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all mode-specific content.
 * Components read from here — swap data without touching UI code.
 */

// ── Developer mode ─────────────────────────────────────────────────────────
export const developerContent = {
  meta: {
    title: 'Akram Rihani — Developer',
    description: 'Full-stack developer building performant, accessible digital products.',
  },
  hero: {
    badge: '▸ Available for work',
    dropCap: 'I',
    line1: 'Build things',
    line2: 'call it V1.0',
    sub: 'Full-stack developer specializing in performant, accessible, and beautifully crafted digital products.',
    cta1: { label: 'View Projects', href: '/projects' },
    cta2: { label: 'About Me',      href: '/about'    },
  },
  nav: [
    { href: '/',         label: 'Home'        },
    { href: '/about',    label: 'About'       },
    { href: '/projects', label: 'Projects'    },
    { href: '/contact',  label: 'Contact'     },
  ],
  projects: [
    {
      title: 'Synthwave Studio',
      description: 'Browser-based audio synthesizer with real-time waveform visualization.',
      tags: ['React', 'Web Audio', 'Canvas'],
      link: '#', github: '#', year: '2024',
    },
    {
      title: 'Orbit Dashboard',
      description: 'Analytics platform processing 10M+ daily events with live charts.',
      tags: ['Next.js', 'PostgreSQL', 'Redis'],
      link: '#', github: '#', year: '2024',
    },
    {
      title: 'Verdant API',
      description: 'High-throughput REST + GraphQL API serving 50k+ users.',
      tags: ['Node.js', 'GraphQL', 'MongoDB'],
      github: '#', year: '2023',
    },
    {
      title: 'Palette AI',
      description: 'Color palette generator powered by a fine-tuned model.',
      tags: ['Python', 'FastAPI', 'React'],
      link: '#', github: '#', year: '2023',
    },
  ],
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
    bio1: "5+ years building full-stack products — from solo MVPs to systems serving hundreds of thousands of users. I care about performance, architecture, and the small details that make software feel alive.",
    bio2: "When I'm not shipping features I'm learning something new, contributing to open source, or out with a camera.",
    stats: [
      { n: '5+',  label: 'Years coding'    },
      { n: '30+', label: 'Projects shipped' },
      { n: '3',   label: 'Open source libs' },
    ],
  },
  theme: {
    accent: '#ff6b35',
    accentSecondary: '#c8f04a',
    bg: '#0a0a08',
    surface: '#111110',
    particleColor: '#ff6b35',
    cursorColor: '#ffffff',
  },
};

// ── Photography mode ────────────────────────────────────────────────────────
export const photographyContent = {
  meta: {
    title: 'Akram Rihani — Photography',
    description: 'Visual storyteller capturing landscapes, cities, and quiet moments.',
  },
  hero: {
    badge: '▸ Available for commissions',
    dropCap: 'I',
    line1: 'Capture moments',
    line2: 'call it light',
    sub: 'Visual storyteller working across landscape, urban, and portrait photography.',
    cta1: { label: 'View Gallery',     href: '/photography' },
    cta2: { label: 'About Me',         href: '/about'       },
  },
  nav: [
    { href: '/',            label: 'Home'        },
    { href: '/about',       label: 'About'       },
    { href: '/photography', label: 'Gallery'     },
    { href: '/contact',     label: 'Contact'     },
  ],
  gallery: [
    { id: 1,  src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', alt: 'Mountain peaks at dusk',        category: 'landscape', location: 'Alps, Switzerland',   year: '2024', aspectRatio: 'landscape' },
    { id: 2,  src: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',  alt: 'City lights at night',          category: 'urban',     location: 'Tokyo, Japan',        year: '2024', aspectRatio: 'portrait'  },
    { id: 3,  src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80', alt: 'Ocean at golden hour',          category: 'landscape', location: 'Big Sur, CA',         year: '2023', aspectRatio: 'landscape' },
    { id: 4,  src: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=800&q=80',     alt: 'Abstract architecture',        category: 'urban',     location: 'Dubai, UAE',          year: '2023', aspectRatio: 'square'    },
    { id: 5,  src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80',  alt: 'Misty forest morning',         category: 'nature',    location: 'Black Forest, Germany',year: '2024', aspectRatio: 'portrait' },
    { id: 6,  src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80', alt: 'Desert sand dunes',            category: 'landscape', location: 'Sahara, Morocco',     year: '2023', aspectRatio: 'landscape' },
  ],
  collections: [
    { title: 'Golden Horizons',  count: 12, tag: 'landscape', cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },
    { title: 'Urban Pulse',      count: 9,  tag: 'urban',     cover: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80'  },
    { title: 'Silent Greens',    count: 7,  tag: 'nature',    cover: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80'  },
  ],
  about: {
    tagline: 'I see the world in frames — landscapes, cities, and the quiet in between.',
    bio1: "Photography found me before code did. I shoot landscapes, urban environments, and portraits — always chasing the quality of light that makes an ordinary scene extraordinary.",
    bio2: "Based wherever the light is good. Currently exploring long-exposure night photography and documentary street work.",
    stats: [
      { n: '5+',   label: 'Years shooting' },
      { n: '8',    label: 'Countries shot' },
      { n: 'α7',   label: 'Sony Series'    },
    ],
  },
  theme: {
    accent: '#d4a853',        // warm gold
    accentSecondary: '#e8e8e0',
    bg: '#0d0c0a',
    surface: '#141310',
    particleColor: '#d4a853',
    cursorColor: '#ffffff',
  },
};

export const MODES = {
  developer:   developerContent,
  photography: photographyContent,
};