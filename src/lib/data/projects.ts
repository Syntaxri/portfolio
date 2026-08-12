import type { Project } from '@/types'

/**
 * THE COLLECTION — six accessions, curated. Real builds only.
 * WISLA hangs in the place of honour; the web builds fill the arcade.
 */
export const projects: Project[] = [
  {
    title: 'WISLA Platform',
    slug: 'wisla-platform',
    accession: 'INV. I',
    description:
      'A complete enterprise web application for university–company partnership: a Spring Boot backend with role-based access control, state machines for every workflow, and three different organisations under one roof.',
    longDescription:
      'WISLA is a full software system, architected and shipped end to end. The backend is Spring Boot with Spring Security at the gate: companies, faculties and students each hold a role, and every screen asks who is looking before it renders. Academic email verification opens the door; explicit state machines drive internships, applications and partnership agreements from draft to done; JPA over MySQL keeps the whole archive consistent. A CV snapshot freezes each application in time, so what the faculty reviewed is exactly what the company receives. Verified with a grade of 19/20.',
    tags: ['Java', 'Spring Boot', 'Spring Security', 'RBAC', 'JPA', 'MySQL', 'Architecture'],
    glaze: 'cobalt',
    year: '2024',
    cover: '/work/wisla-platform/WislaLightMode.jpg',
    category: 'Enterprise Application',
    role: 'Backend Engineering',
    featured: true,
    challenges: [
      {
        title: 'One system, three identities',
        description:
          'Companies, faculties and students share one platform, but nothing about their day looks the same.',
        solution:
          'Role-based access control with per-role views — authorization is resolved against the authenticated principal on every request.',
      },
      {
        title: 'Workflows with real states',
        description:
          'Internships, applications and partnership agreements pass through approval chains; a record must never be in two places.',
        solution:
          'Explicit state machines for every flow — status is a resolved fact, not a guess, and transitions are the only way to move.',
      },
      {
        title: 'The door has to check IDs',
        description:
          'Only real academic addresses should pass through the gate of the university system.',
        solution:
          'Academic email verification before the first login, enforced server-side at registration.',
      },
    ],
    metrics: [
      { label: 'Grade', value: '19/20' },
      { label: 'Organisations', value: '3 roles' },
      { label: 'Backend', value: 'Spring Boot' },
      { label: 'Store', value: 'MySQL · JPA' },
    ],
  },
  {
    title: 'Palais Amghass',
    slug: 'palais-amghass',
    accession: 'INV. II',
    description:
      'A palace hotel in the Atlas, digitised: an ambient WebGL room the visitor can orbit, a gallery that walks like a corridor, and an image budget held tight enough for valley bandwidth.',
    longDescription:
      'Palais Amghass is a hotel experience built for a domain of luxury. A WebGL room can be orbited like a sculpture; the gallery scrolls like the corridors of the palace; motion answers the layout rather than decorating it. The image budget is disciplined so the Atlas loads even on the slowest connection — beauty that respects the visitor’s bandwidth.',
    tags: ['Next.js', 'Three.js', 'GSAP', 'Tailwind CSS', 'Vercel'],
    glaze: 'brass',
    year: '2025',
    cover: '/work/palais-amghass/PalaisAmghassHomePage.jpg',
    liveUrl: 'https://palais-amghass.vercel.app',
    category: 'Hotel Experience',
    role: 'Frontend · Motion',
    featured: true,
    gallery: [
      {
        src: '/work/palais-amghass/PalaisAmghassHomePage.jpg',
        alt: 'Palais Amghass — the entrance hall of the site',
        caption: 'The entrance hall, on the internet.',
        width: 1600,
        height: 940,
      },
      {
        src: '/work/palais-amghass/PalaisAmghassChambres.jpg',
        alt: 'Palais Amghass — the rooms section',
        caption: 'The rooms, presented like the palace itself.',
        width: 1600,
        height: 940,
      },
    ],
  },
  {
    title: 'NextHobby',
    slug: 'nexthobby',
    accession: 'INV. III',
    description:
      'An equipment rental platform that started as a hobby and became a live product — renting, payments and accounts, shipped for real and open to the public.',
    longDescription:
      'NextHobby is the proof that a hobby kept long enough becomes a product. What began as a side experiment grew into a working rental platform: equipment discovery, item detail, rental flow, payment methods and account state — live at nexthobby.vercel.app and used for real. The whole product is TypeScript and Next.js, and every part of it was learned the only way that sticks: by shipping.',
    tags: ['Next.js', 'React', 'TypeScript', 'Payments', 'Vercel'],
    glaze: 'teal',
    year: '2025',
    cover: '/work/nexthobby/NextHobbyHomePage.jpg',
    liveUrl: 'https://nexthobby.vercel.app',
    category: 'Web Platform',
    role: 'Design + Build',
    featured: true,
    gallery: [
      {
        src: '/work/nexthobby/NextHobbyHomePage.jpg',
        alt: 'NextHobby — the home page',
        caption: 'The front door of the product.',
        width: 1600,
        height: 940,
      },
      {
        src: '/work/nexthobby/NextHobbyExploreEquuipment.jpg',
        alt: 'NextHobby — equipment exploration view',
        caption: 'The catalogue, where the browse begins.',
        width: 1600,
        height: 940,
      },
      {
        src: '/work/nexthobby/NextHobbyItemRent.jpg',
        alt: 'NextHobby — the rental flow',
        caption: 'The rental desk.',
        width: 1600,
        height: 940,
      },
    ],
  },
  {
    title: 'Auto-École Michlifen',
    slug: 'auto-ecole-michlifen',
    accession: 'INV. IV',
    description:
      'A driving school near Michlifen, online and findable — a live client site that turns inquiries into lessons.',
    longDescription:
      'Auto-École Michlifen is a commissioning for a driving school in the region: a clear, honest web presence that explains the offer, answers the common questions and collects leads. Designed and built to be found, read and acted on from a phone — because that is where the next pupil is looking.',
    tags: ['Next.js', 'React', 'SEO', 'Vercel'],
    glaze: 'terra',
    year: '2026',
    liveUrl: 'https://auto-ecole-michlifen.vercel.app',
    category: 'Local Business',
    role: 'Design + Build',
  },
  {
    title: 'Azrou Design',
    slug: 'azrou-design',
    accession: 'INV. V',
    description:
      'A design practice in the region, digitised — a live client build that gives a studio the web presence its work deserves.',
    longDescription:
      'Azrou Design is a live client build for a creative studio in the region: a portfolio of the studio’s own work, framed to make the craft the hero. Built with the same care the studio applies to its own commissions.',
    tags: ['Next.js', 'React', 'Vercel'],
    glaze: 'cobalt',
    year: '2026',
    liveUrl: 'https://azrou-design.vercel.app',
    category: 'Business Web',
    role: 'Design + Build',
  },
  {
    title: 'Le Sapin',
    slug: 'le-sapin',
    accession: 'INV. VI',
    description:
      'A local establishment gone digital — a live site that brings regulars online and welcomes new ones through the door.',
    longDescription:
      'Le Sapin is a live client build for a local establishment: the essentials — what it is, where it is, what to expect — presented so that a stranger becomes a regular. Every build is a commission of trust; this one keeps the promise short.',
    tags: ['Next.js', 'React', 'Vercel'],
    glaze: 'ivory',
    year: '2026',
    liveUrl: 'https://le-sapin.vercel.app',
    category: 'Local Business',
    role: 'Design + Build',
  },
]

export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function isFlagship(slug: string): boolean {
  return slug === 'wisla-platform'
}