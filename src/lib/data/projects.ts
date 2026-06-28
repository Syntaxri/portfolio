import type { Project } from '@/types'

export const projects: Project[] = [
  {
    title: 'WISLA',
    slug: 'wisla-platform',
    description:
      'A modular athlete management platform built with Java 17 and Spring Boot 3, serving 20K+ daily users across multiple sports organisations.',
    longDescription:
      'WISLA is a comprehensive athlete and team management platform designed for sports organisations to manage registrations, scheduling, performance tracking, and communication. The platform handles complex domain logic including multi-tenant organisation hierarchies, role-based access control with Spring Security 6, and real-time synchronisation across distributed services. I architected the backend from the ground up, designing a domain-driven service layer with JPA/Hibernate for MySQL, RESTful APIs with comprehensive OpenAPI documentation, and a modular monolith structure that supports future microservice extraction.',
    tags: ['Java 17', 'Spring Boot 3', 'Spring Security 6', 'MySQL', 'JPA/Hibernate', 'REST APIs'],
    icon: 'W',
    color: '#22c55e',
    featured: true,
    challenges: [
      {
        title: 'Multi-tenant data isolation',
        description:
          'Serving multiple independent organisations with strict data isolation requirements and varying custom field schemas.',
        solution:
          'Implemented a discriminator-based multi-tenant strategy with Spring Security filters injecting tenant context at the request level. Custom field schemas are stored as JSONB with Hibernate custom types, enabling flexible per-organisation attributes without sacrificing query performance.',
      },
      {
        title: 'Complex role hierarchies',
        description:
          'Organisations required granular permission models — from league administrators to team coaches to athletes — with overlapping and inheritable permissions.',
        solution:
          'Designed a role-based access control layer using Spring Security 6 method-level annotations, with a custom permission evaluator that resolves transitive role hierarchies. The permission matrix is cached in Redis with tenant-scoped invalidation.',
      },
      {
        title: 'High-throughput competition scheduling',
        description:
          'The scheduling engine needed to handle concurrent booking requests for venues, officials, and team slots without conflicts, across multiple timezones.',
        solution:
          'Built a pessimistic locking scheduler with MySQL row-level locks and a compensation transaction pattern for conflict resolution. The scheduler processes bookings in batch with configurable window sizes, achieving sub-100ms response times at peak load.',
      },
    ],
    metrics: [
      { label: 'Daily Active Users', value: '20K+' },
      { label: 'API Response Time (p95)', value: '<120ms' },
      { label: 'Tenants', value: '15+' },
      { label: 'Test Coverage', value: '92%' },
    ],
  },
  {
    title: 'Interactive Portfolio',
    slug: 'interactive-portfolio',
    description:
      'A high-performance Next.js portfolio featuring 3D WebGL visualisations, dynamic theming, and sub-100 Lighthouse scores across all routes.',
    longDescription:
      'This portfolio site was designed to showcase engineering work through an immersive, technically impressive interface while maintaining exceptional performance. Built with Next.js 14 App Router and TypeScript, the site features dynamic accent theming via CSS custom properties, 3D scene rendering with Three.js for the hero background, and a fully responsive design system. Every page achieves 95+ Lighthouse scores through aggressive code-splitting, optimised font loading with next/font, and efficient bundle composition.',
    tags: ['Next.js 14', 'TypeScript', 'Three.js', 'CSS Custom Properties', 'App Router'],
    icon: 'P',
    color: '#a855f7',
    featured: true,
    challenges: [
      {
        title: '3D performance on mid-range devices',
        description:
          'The Three.js hero scene needed to run at 60fps on a wide range of devices, including mobile and mid-range laptops.',
        solution:
          'Implemented adaptive quality scaling based on device capability detection. The renderer uses a low-poly fallback for mobile devices, throttles frame rate to 30fps on battery power, and dynamically reduces particle count when frame drops are detected via performance observers.',
      },
      {
        title: 'Dynamic accent colour system',
        description:
          'The site supports user-selectable accent colours that must propagate across 60+ components without a CSS-in-JS runtime cost.',
        solution:
          'Used CSS custom properties scoped to document.documentElement, updated via a React context that writes to a style tag in the document head. Colour transformations (brightness, opacity variants) are computed with CSS calc() and color-mix(), avoiding JavaScript colour math entirely.',
      },
      {
        title: 'Zero-layout-shift image loading',
        description:
          'Project gallery images with unknown aspect ratios needed to load without causing cumulative layout shift.',
        solution:
          'Built a custom image component that extracts dimensions from the blob on the server side, embeds aspect-ratio in the markup, and uses a CSS-only blur-up placeholder technique with WebP progressive rendering for smooth transitions.',
      },
    ],
    metrics: [
      { label: 'Lighthouse Performance', value: '98' },
      { label: 'Bundle JS (shared)', value: '86.9 kB' },
      { label: 'Static Routes', value: '17' },
      { label: 'Pages with 95+ Score', value: 'All' },
    ],
  },
  {
    title: 'Atlas Club',
    slug: 'atlas-club',
    description:
      'A Web3-enabled community platform with token-gated content, built with vanilla JavaScript and Ethereum smart contracts.',
    longDescription:
      'Atlas Club is a community platform that uses blockchain-based membership verification to gate exclusive content and interactions. Members connect their wallets, prove ownership of a specific NFT (ERC-721) token, and unlock access to member-only discussions, resources, and events. The frontend is built with vanilla JavaScript for minimal dependencies and fast load times, while the smart contract layer handles membership verification and on-chain voting for community governance.',
    tags: ['JavaScript', 'Ethereum', 'Solidity', 'Web3.js', 'Smart Contracts'],
    icon: 'A',
    color: '#f59e0b',
    gallery: [],
  },
  {
    title: 'HobbyVerse',
    slug: 'hobbyverse',
    description:
      'A hobby discovery platform with immersive 3D visualisations, built from scratch in Next.js with Three.js and animated transitions.',
    longDescription:
      'HobbyVerse connects people with new hobbies through an interactive discovery experience. The platform uses Three.js-powered 3D scenes to preview activities before committing, with smooth page transitions via Next.js App Router and Framer Motion. Users can browse hobbies by category, view interactive demonstrations, and connect with local groups. The entire frontend was built from scratch using Next.js 14, TypeScript, and a component-driven architecture emphasising reusability and animation.',
    tags: ['Next.js 14', 'TypeScript', 'Three.js', 'Framer Motion', 'CSS Animations'],
    icon: 'H',
    color: '#3b82f6',
    gallery: [],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}
