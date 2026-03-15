/**
 * developerProjects.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Structured project data for Developer mode.
 *
 * Schema per entry (all fields listed; optional ones have fallback defaults):
 * {
 *   id          : string   — unique slug (required)
 *   title       : string   — display title (required)
 *   description : string   — short summary, max ~120 chars (required)
 *   techStack   : string[] — ordered list of technologies (required, min 1)
 *   skills      : string[] — broader skill categories this project demonstrates
 *   githubLink  : string   — full GitHub URL or null
 *   liveDemo    : string   — full live URL or null
 *   year        : string   — "YYYY" (required)
 *   featured    : boolean  — show on homepage (default false)
 *   status      : 'live' | 'wip' | 'archived'  (default 'live')
 * }
 */

/** Fallback values applied when optional fields are absent */
export const PROJECT_DEFAULTS = {
  githubLink: null,
  liveDemo:   null,
  featured:   false,
  status:     'live',
  skills:     [],
};

/** Merge defaults so consumers never see undefined fields */
function project(data) {
  return { ...PROJECT_DEFAULTS, ...data };
}

export const developerProjects = [
  project({
    id:          'synthwave-studio',
    title:       'Synthwave Studio',
    description: 'Browser-based audio synthesizer with real-time waveform visualization and MIDI support.',
    techStack:   ['React', 'Web Audio API', 'Canvas', 'TypeScript'],
    skills:      ['Frontend', 'Audio Engineering', 'Performance'],
    githubLink:  'https://github.com/Syntaxri/synthwave-studio',
    liveDemo:    'https://synthwave.akramrihani.dev',
    year:        '2024',
    featured:    true,
    status:      'live',
  }),
  project({
    id:          'orbit-dashboard',
    title:       'Orbit Dashboard',
    description: 'Analytics platform processing 10M+ daily events with live charts and configurable alert pipelines.',
    techStack:   ['Next.js', 'PostgreSQL', 'Redis', 'Recharts'],
    skills:      ['Full-Stack', 'Data Visualization', 'System Design'],
    githubLink:  'https://github.com/Syntaxri/orbit-dashboard',
    liveDemo:    null,
    year:        '2024',
    featured:    true,
    status:      'live',
  }),
  project({
    id:          'verdant-api',
    title:       'Verdant API',
    description: 'High-throughput REST + GraphQL API for a plant-care app, serving 50k+ users.',
    techStack:   ['Node.js', 'GraphQL', 'MongoDB', 'Docker'],
    skills:      ['Backend', 'API Design', 'DevOps'],
    githubLink:  'https://github.com/Syntaxri/verdant-api',
    liveDemo:    null,
    year:        '2023',
    featured:    false,
    status:      'live',
  }),
  project({
    id:          'palette-ai',
    title:       'Palette AI',
    description: 'Color palette generator powered by a fine-tuned model. Extract palettes from images or text prompts.',
    techStack:   ['Python', 'FastAPI', 'React', 'OpenAI'],
    skills:      ['AI/ML', 'Full-Stack', 'UX Design'],
    githubLink:  'https://github.com/Syntaxri/palette-ai',
    liveDemo:    'https://palette.akramrihani.dev',
    year:        '2023',
    featured:    false,
    status:      'live',
  }),
  project({
    id:          'nomad-cli',
    title:       'Nomad CLI',
    description: 'Command-line tool for managing remote dev environments — SSH tunnels, port forwarding, config sync.',
    techStack:   ['Go', 'CLI', 'SSH', 'YAML'],
    skills:      ['DevOps', 'Systems', 'Open Source'],
    githubLink:  'https://github.com/Syntaxri/nomad-cli',
    liveDemo:    null,
    year:        '2022',
    featured:    false,
    status:      'live',
  }),
];

/** Convenience selectors */
export const featuredProjects = developerProjects.filter(p => p.featured);
export const getProjectById   = id => developerProjects.find(p => p.id === id) ?? null;