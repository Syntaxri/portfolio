export const site = {
  name: 'Akram Rihani',
  nickname: 'Viaruq',
  monogram: 'A/V',
  role: 'Software Engineer',
  roles: ['Software Engineer', 'Digital Product Builder', 'WebGL & Motion'],
  email: 'hello@akramrihani.com',
  location: 'Azrou, Morocco',
  from: 'Morocco',
  availability: 'Open for freelance',
  thesis: 'I build ideas into real things.',
  domain: 'www.akramrihani.com',
  timezone: 'Africa/Casablanca',
  github: 'https://github.com/Syntaxri',
  githubUsername: 'Syntaxri',
  linkedin: 'https://www.linkedin.com/in/riihaniakram/',
  instagram: 'https://www.instagram.com/viaruq',
  strapline:
    'The Moroccan digital museum of software craftsmanship. Akram Rihani (Viaruq) — a software engineer in Azrou who turns ideas into real products: Java backends that hold, web experiences that move, systems that ship.',
} as const

export const socials = [
  { label: 'GitHub', handle: site.githubUsername, href: site.github },
  { label: 'LinkedIn', handle: 'riihaniakram', href: site.linkedin },
  { label: 'Instagram', handle: 'viaruq', href: site.instagram },
  { label: 'Email', handle: site.email, href: `mailto:${site.email}` },
] as const