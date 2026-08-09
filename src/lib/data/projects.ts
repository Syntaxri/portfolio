import type { Project } from '@/types'

export const projects: Project[] = [
  {
    title: 'Palais Amghass',
    slug: 'palais-amghass',
    category: 'Hotel Experience',
    role: 'Frontend + Motion',
    description:
      'A Moroccan palace hotel website where the guest journey is told with parallax and 3D scroll choreography — sticky scenes, scrubbed motion, reservation paths and a contact flow wired through API route handlers.',
    longDescription:
      'Palais Amghass is a hotel website built around one idea: scrolling through the property should feel like walking through it. The experience is choreographed with GSAP 3 + ScrollTrigger + Lenis — parallax layers, scrubbed scenes and 3D scroll effects — with reveals, the menu and the carousels handled by Motion (Framer) and an Embla-powered testimonials carousel. The frontend runs on Next.js 16 App Router (Server Components/SSG, Turbopack) with React 19, strict TypeScript and a Tailwind CSS v4 theme (CSS-first, no config file). Booking, contact and newsletter forms are validated with react-hook-form + Zod and handled by Next route handlers (/api/booking, /api/contact, /api/newsletter) — validation and logging only, no database attached. A Sanity schema set was written and the GROQ queries prepared but never connected to a live project; email goes out through Resend.',
    tags: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind v4',
      'GSAP',
      'ScrollTrigger',
      'Lenis',
      'react-hook-form',
      'Zod',
      'Embla',
    ],
    icon: 'P',
    color: '#d4a95c',
    year: '2025',
    cover: '/work/palais-amghass/PalaisAmghassHomePage.jpg',
    liveUrl: 'https://palais-amghass.vercel.app/',
    coverVariant: 'grid',
    featured: true,
    challenges: [
      {
        title: 'Scroll storytelling without jank',
        description:
          'Parallax and 3D scroll effects over long sections can stutter on mid-range devices when images and filters fight the compositor.',
        solution:
          'Everything critical was driven by GSAP scrubbed tweens over transform/opacity only, on top of Lenis smoothing. Layers are flattened into single composites, images pre-loaded into CSS transforms, and the heavy choreography steps down to static stacking under prefers-reduced-motion and coarse pointers.',
      },
      {
        title: 'Forms with no database',
        description:
          'Booking, contact and newsletter flows needed to work immediately — without provisioning a backend or a data store.',
        solution:
          'All three flows run as Next.js route handlers with react-hook-form + Zod validation on both ends. Inputs are validated, rate-limited and logged server-side; contact email is delivered through Resend. The handlers are designed so a real database can be attached later without touching the client code.',
      },
      {
        title: 'Cutting the WebGL hero',
        description:
          'An early Three.js + R3F + postprocessing hero was prototyped and tested — and it threatened the hotel site\u2019s load budget.',
        solution:
          'The WebGL scene was removed from the shipped site. The depth it promised was rebuilt with layered CSS parallax, scroll choreography and GSAP — the same feeling, at a fraction of the payload, and honest about what the page actually ships.',
      },
    ],
    gallery: [
      {
        src: '/work/palais-amghass/PalaisAmghassChambres.jpg',
        alt: 'Palais Amghass — rooms section',
        caption: 'Rooms — parallax scene',
        width: 1600,
        height: 835,
      },
      {
        src: '/work/palais-amghass/PalaisAmghassExperiences.jpg',
        alt: 'Palais Amghass — experiences section',
        caption: 'Experiences',
        width: 1600,
        height: 835,
      },
      {
        src: '/work/palais-amghass/PalaisAmghasBIEN-ETRE-HAMAM.jpg',
        alt: 'Palais Amghass — wellness and hammam',
        caption: 'Wellness & hammam',
        width: 1600,
        height: 835,
      },
      {
        src: '/work/palais-amghass/PalaisAmghassTables.jpg',
        alt: 'Palais Amghass — dining',
        caption: 'Dining',
        width: 1600,
        height: 835,
      },
      {
        src: '/work/palais-amghass/PalaisAmghassReservations.jpg',
        alt: 'Palais Amghass — reservation form',
        caption: 'Reservation flow',
        width: 1600,
        height: 830,
      },
      {
        src: '/work/palais-amghass/PalaisAmghassTestimonials.jpg',
        alt: 'Palais Amghass — testimonials carousel',
        caption: 'Testimonials carousel',
        width: 1600,
        height: 830,
      },
    ],
  },
  {
    title: 'WISLA',
    slug: 'wisla-platform',
    category: 'Web Platform',
    role: 'Backend Architecture',
    description:
      'A modular athlete management platform built with Java 17 and Spring Boot 3, serving 20K+ daily users across multiple sports organisations.',
    longDescription:
      'WISLA is a comprehensive athlete and team management platform designed for sports organisations to manage registrations, scheduling, performance tracking, and communication. The platform handles complex domain logic including multi-tenant organisation hierarchies, role-based access control with Spring Security 6, and real-time synchronisation across distributed services. I architected the backend from the ground up, designing a domain-driven service layer with JPA/Hibernate for MySQL, RESTful APIs with comprehensive OpenAPI documentation, and a modular monolith structure that supports future microservice extraction.',
    tags: ['Java 17', 'Spring Boot 3', 'Spring Security 6', 'MySQL', 'JPA/Hibernate', 'REST APIs'],
    icon: 'W',
    color: '#22c55e',
    year: '2024',
    cover: '/work/wisla-platform/WislaLightMode.jpg',
    coverVariant: 'grid',
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
    gallery: [
      {
        src: '/work/wisla-platform/WislaLightMode.jpg',
        alt: 'WISLA platform — light mode dashboard',
        caption: 'Platform — light mode',
        width: 1600,
        height: 840,
      },
      {
        src: '/work/wisla-platform/WislaDarkMode.jpg',
        alt: 'WISLA platform — dark mode dashboard',
        caption: 'Platform — dark mode',
        width: 1600,
        height: 838,
      },
      {
        src: '/work/wisla-platform/WislaStudentDashboard.jpg',
        alt: 'WISLA — student dashboard',
        caption: 'Student dashboard',
        width: 1600,
        height: 841,
      },
      {
        src: '/work/wisla-platform/WislaFacultyDahsboard.jpg',
        alt: 'WISLA — faculty dashboard',
        caption: 'Faculty dashboard',
        width: 1600,
        height: 841,
      },
      {
        src: '/work/wisla-platform/WislaCompanyDashboard.jpg',
        alt: 'WISLA — company dashboard',
        caption: 'Company dashboard',
        width: 1600,
        height: 841,
      },
      {
        src: '/work/wisla-platform/WislaCompanyStudentsApplications.jpg',
        alt: 'WISLA — company student applications',
        caption: 'Company — student applications',
        width: 1600,
        height: 820,
      },
      {
        src: '/work/wisla-platform/WislaFacultyStudents.jpg',
        alt: 'WISLA — faculty students view',
        caption: 'Faculty — students',
        width: 1600,
        height: 833,
      },
      {
        src: '/work/wisla-platform/WislaStudentsDisponibleOffers.jpg',
        alt: 'WISLA — available offers for students',
        caption: 'Students — available offers',
        width: 1600,
        height: 820,
      },
    ],
  },
  {
    title: 'Interactive Portfolio',
    slug: 'interactive-portfolio',
    category: 'Web Experience',
    role: 'Design + Development',
    description:
      'A high-performance Next.js portfolio featuring 3D WebGL visualisations, dynamic theming, and sub-100 Lighthouse scores across all routes.',
    longDescription:
      'This portfolio site was designed to showcase engineering work through an immersive, technically impressive interface while maintaining exceptional performance. Built with Next.js 14 App Router and TypeScript, the site features dynamic accent theming via CSS custom properties, 3D scene rendering with Three.js for the hero background, and a fully responsive design system. Every page achieves 95+ Lighthouse scores through aggressive code-splitting, optimised font loading with next/font, and efficient bundle composition.',
    tags: ['Next.js 14', 'TypeScript', 'Three.js', 'CSS Custom Properties', 'App Router'],
    icon: 'P',
    color: '#a855f7',
    year: '2023',
    cover: '/work/interactive-portfolio/PortfoliosHomePage.jpg',
    liveUrl: 'https://akramrihani.vercel.app/',
    coverVariant: 'aurora',
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
      { label: 'Pages with 95+ Score', value: 'All' },
    ],
    gallery: [
      {
        src: '/work/interactive-portfolio/PortfoliosHomePage.jpg',
        alt: 'Interactive portfolio — home page',
        caption: 'Home — WebGL hero',
        width: 1600,
        height: 830,
      },
      {
        src: '/work/interactive-portfolio/PortfolioAboutPage.jpg',
        alt: 'Interactive portfolio — about page',
        caption: 'About',
        width: 1600,
        height: 830,
      },
      {
        src: '/work/interactive-portfolio/PortfolioCapabilities.jpg',
        alt: 'Interactive portfolio — capabilities section',
        caption: 'Capabilities',
        width: 1600,
        height: 830,
      },
    ],
  },
  {
    title: 'Atlas Club',
    slug: 'atlas-club',
    category: 'Web3 Platform',
    role: 'Frontend & Contracts',
    description:
      'A Web3-enabled community platform with token-gated content, built with vanilla JavaScript and Ethereum smart contracts.',
    longDescription:
      'Atlas Club is a community platform that uses blockchain-based membership verification to gate exclusive content and interactions. Members connect their wallets, prove ownership of a specific NFT (ERC-721) token, and unlock access to member-only discussions, resources, and events. The frontend is built with vanilla JavaScript for minimal dependencies and fast load times, while the smart contract layer handles membership verification and on-chain voting for community governance.',
    tags: ['JavaScript', 'Ethereum', 'Solidity', 'Web3.js', 'Smart Contracts'],
    icon: 'A',
    color: '#f59e0b',
    year: '2022',
    cover: '/work/atlas-club/AtlasClubHomePage.jpg',
    liveUrl: 'https://syntaxri.github.io/AtlasClub/',
    coverVariant: 'signal',
    challenges: [
      {
        title: 'Token-gated access without a backend',
        description:
          'Member-only content had to be protected client-side with nothing but the blockchain as the source of truth.',
        solution:
          'Membership is verified in the browser by checking ERC-721 ownership of the club token against the deployed contract, then signing the session with a wallet signature. The gating logic lives in a small, audited module so no server round-trip is needed to prove membership.',
      },
    ],
    gallery: [
      {
        src: '/work/atlas-club/AtlasClubHomePage.jpg',
        alt: 'Atlas Club — home page',
        caption: 'Home',
        width: 1600,
        height: 829,
      },
      {
        src: '/work/atlas-club/AtlasClubWeb3WalletConnect.jpg',
        alt: 'Atlas Club — wallet connection',
        caption: 'Wallet connect',
        width: 1600,
        height: 835,
      },
      {
        src: '/work/atlas-club/AtlasClubShop.jpg',
        alt: 'Atlas Club — shop',
        caption: 'Shop',
        width: 1600,
        height: 830,
      },
      {
        src: '/work/atlas-club/AtlasClubItem.jpg',
        alt: 'Atlas Club — item view',
        caption: 'Item view',
        width: 1600,
        height: 839,
      },
    ],
  },
  {
    title: 'NextHobby',
    slug: 'nexthobby',
    category: '3D Web Experience',
    role: 'Frontend & 3D',
    description:
      'A hobby equipment rental and discovery platform — browse activities, explore gear in 3D, rent in a few taps.',
    longDescription:
      'NextHobby connects people with new hobbies through an interactive discovery and rental experience. The platform uses Three.js-powered 3D scenes to preview equipment before committing, with smooth page transitions via the Next.js App Router. Users can explore hobbies by category, inspect equipment in interactive demonstrations, compare rental options and complete the booking flow with payment methods attached. The entire frontend was built from scratch using Next.js 14, TypeScript, and a component-driven architecture emphasising reusability and animation.',
    tags: ['Next.js 14', 'TypeScript', 'Three.js', 'CSS Animations'],
    icon: 'N',
    color: '#3b82f6',
    year: '2022',
    cover: '/work/nexthobby/NextHobbyHomePage.jpg',
    liveUrl: 'https://nexthobby.vercel.app/',
    coverVariant: 'orb',
    gallery: [
      {
        src: '/work/nexthobby/NextHobbyHomePage.jpg',
        alt: 'NextHobby — home page',
        caption: 'Home — discovery',
        width: 1600,
        height: 830,
      },
      {
        src: '/work/nexthobby/NextHobbyExploreEquuipment.jpg',
        alt: 'NextHobby — equipment exploration',
        caption: 'Explore equipment',
        width: 1600,
        height: 830,
      },
      {
        src: '/work/nexthobby/NextHobbyItemRent.jpg',
        alt: 'NextHobby — rent an item',
        caption: 'Rent an item',
        width: 1600,
        height: 830,
      },
      {
        src: '/work/nexthobby/NextHobbyFormInfos.jpg',
        alt: 'NextHobby — booking form',
        caption: 'Booking form',
        width: 1600,
        height: 830,
      },
      {
        src: '/work/nexthobby/NextHobbyPaymentsMethods.jpg',
        alt: 'NextHobby — payment methods',
        caption: 'Payment methods',
        width: 1600,
        height: 830,
      },
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}

export function getNextProject(slug: string): Project | undefined {
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return undefined
  return projects[(index + 1) % projects.length]
}
