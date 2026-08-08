/**
 * "Under the hood" — statements about this site itself, not client claims.
 * Every row is a true property of the shipped implementation.
 */
export const engineered = [
  {
    index: '01',
    title: 'Custom GLSL shaders',
    detail: 'A hand-written 4-octave FBM aurora fragment shader drives the hero atmosphere — procedural, no textures.',
  },
  {
    index: '02',
    title: 'Lazy WebGL engine',
    detail: 'The Three.js chunk is fetched on demand, rendered at adaptive DPR, and freed the moment the hero leaves view.',
  },
  {
    index: '03',
    title: 'Scroll-linked narrative',
    detail: 'A single master timeline choreographs the manifesto — sharpening, emphasis, and exit are one motion.',
  },
  {
    index: '04',
    title: 'Reduced motion, first',
    detail: 'Every effect ships behind prefers-reduced-motion; content order never depends on a transition.',
  },
  {
    index: '05',
    title: 'Performance discipline',
    detail: 'Motion runs on transforms and opacity only — 60fps on mid-range hardware, ~87 kB shared JS.',
  },
  {
    index: '06',
    title: 'Accessible by default',
    detail: 'Semantic landmarks, skip link, keyboard-visible focus, and no hover-only interaction.',
  },
]

/** Global chapter rail — anchors by section id, reused by the section indicator. */
export const chapters = [
  { id: 'hero', label: 'Intro' },
  { id: 'work', label: 'Work' },
  { id: 'capabilities', label: 'Practice' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
] as const