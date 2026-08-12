export interface Craft {
  title: string
  index: string
  description: string
  skills: string[]
  plate: string
  glaze: 'cobalt' | 'teal' | 'terra' | 'brass'
}

/**
 * THE WORKSHOP — four disciplines, taught as crafts.
 * Each one maps a tradition of the workshop onto a branch of engineering.
 */
export const crafts: Craft[] = [
  {
    title: 'Java Backend',
    index: 'Craft I',
    description:
      'The load-bearing walls. Spring Boot systems with real teeth — authentication, authorization, business rules and state machines that never guess.',
    skills: ['Java', 'Spring Boot', 'Spring Security', 'RBAC', 'JPA', 'MySQL', 'REST'],
    plate: 'The structure that holds the whole building up.',
    glaze: 'cobalt',
  },
  {
    title: 'TS · React · Next',
    index: 'Craft II',
    description:
      'The rooms visitors walk through. TypeScript-strict, server-first frontends — fast by default, accessible always, and only beautiful at the end.',
    skills: ['TypeScript', 'React', 'Next.js', 'RSC', 'Tailwind', 'Accessibility', 'Performance'],
    plate: 'The rooms the visitors walk through.',
    glaze: 'teal',
  },
  {
    title: 'DevOps & Security',
    index: 'Craft III',
    description:
      'The locks on every door. Linux, deployment, rate limits, headers, hardening — the invisible discipline that keeps what is built from falling.',
    skills: ['Linux', 'Git', 'CI/CD', 'Deployment', 'Auth', 'Security', 'Monitoring'],
    plate: 'The locks, the keys, the night guard.',
    glaze: 'terra',
  },
  {
    title: 'WebGL & Motion',
    index: 'Craft IV',
    description:
      'The glazed walls. Three.js scenes, GSAP choreography, scroll that reads like a tour — every frame earns its place or leaves the room.',
    skills: ['Three.js', 'React Three Fiber', 'GSAP', 'ScrollTrigger', 'Lenis', 'WebGL'],
    plate: 'The glaze that catches the light.',
    glaze: 'brass',
  },
]

export interface CraftPrinciple {
  craft: string
  engineering: string
  note: string
}

/**
 * THE GRAMMAR — the seven principles taken from the Moroccan workshop and
 * translated into how this museum (and every build in it) is made.
 */
export const grammar: CraftPrinciple[] = [
  {
    craft: 'Geometry',
    engineering: 'Architecture',
    note: 'Every tile is cut to a plan before it is glazed. Every feature is designed as a system before a line is written.',
  },
  {
    craft: 'Modularity',
    engineering: 'Components',
    note: 'One star, eight points, a thousand compositions. One primitive, reused with discipline, becomes a whole building.',
  },
  {
    craft: 'Repetition',
    engineering: 'Systems',
    note: 'The master repeats a pattern until it stops being decoration and becomes structure. Rendered once, reused everywhere.',
  },
  {
    craft: 'Symmetry',
    engineering: 'Consistency',
    note: 'A pattern that breaks on one side ruins the wall. State, roles and interfaces must answer the same way every time.',
  },
  {
    craft: 'Hierarchy',
    engineering: 'Information',
    note: 'The star governs the tile, the tile governs the wall. Typography and data follow the same rule: one voice leads.',
  },
  {
    craft: 'Precision',
    engineering: 'Correctness',
    note: 'A tile off by a millimetre breaks the whole motif. A nullable field, a wrong status, a race — the motif breaks too.',
  },
  {
    craft: 'Patience',
    engineering: 'Craft',
    note: 'Zellige cannot be rushed; neither can good software. The kiln fires at its own temperature. The types compile when they are right.',
  },
]