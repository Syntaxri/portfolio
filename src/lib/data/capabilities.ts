export type CapabilityPreview = 'signal' | 'lumen' | 'render' | 'aura'

export interface Capability {
  index: string
  title: string
  preview: CapabilityPreview
  description: string
  skills: string[]
}

export const capabilities: Capability[] = [
  {
    index: '01',
    title: 'Creative Development',
    preview: 'signal',
    description:
      'Interactive websites and web experiences. Creative frontend development and motion design implementation with a focus on emotion and restraint.',
    skills: ['Interactive websites', 'Creative frontend', 'Web experiences', 'Motion design'],
  },
  {
    index: '02',
    title: '3D / WebGL',
    preview: 'lumen',
    description:
      'Real-time rendering with Three.js and React Three Fiber. Custom GLSL shaders and interactive scenes that stay fast on modest hardware.',
    skills: ['Three.js', 'React Three Fiber', 'GLSL shaders', 'Real-time rendering'],
  },
  {
    index: '03',
    title: 'Motion & Interaction',
    preview: 'render',
    description:
      'Scroll choreography with GSAP and ScrollTrigger, micro-interactions and scrollytelling — motion that earns its place.',
    skills: ['GSAP', 'ScrollTrigger', 'Lenis', 'Micro-interactions'],
  },
  {
    index: '04',
    title: 'Engineering',
    preview: 'aura',
    description:
      'Production systems in React, Next.js and TypeScript. Clean APIs, performance budgets, accessibility, responsive architecture.',
    skills: ['React / Next.js', 'TypeScript', 'API integration', 'Performance'],
  },
]

export const stack = [
  { tech: 'TypeScript', note: 'Typed end-to-end — data, props, contracts.' },
  { tech: 'React', note: 'Component systems with predictable state.' },
  { tech: 'Next.js', note: 'App Router, RSC boundaries, route-level splits.' },
  { tech: 'Three.js', note: 'Custom scenes and shaders, kept lazy.' },
  { tech: 'React Three Fiber', note: 'Declarative WebGL inside React.' },
  { tech: 'GLSL', note: 'Hand-written fragment and vertex shaders.' },
  { tech: 'GSAP', note: 'Scroll choreography and micro-interactions.' },
  { tech: 'Lenis', note: 'Smooth scrolling with native fallbacks.' },
  { tech: 'Tailwind CSS', note: 'A disciplined design-token layer.' },
  { tech: 'Node.js', note: 'APIs, tooling and build pipelines.' },
  { tech: 'Java', note: 'Spring Boot backends behind the scenes.' },
  { tech: 'SQL', note: 'MySQL / PostgreSQL data modelling.' },
]

export const processSteps = [
  {
    index: '01',
    title: 'Discover',
    description: 'Goals, constraints, content and the one thing this experience must communicate.',
  },
  {
    index: '02',
    title: 'Design',
    description: 'Art direction, typography, a motion language, and clear visual hierarchy.',
  },
  {
    index: '03',
    title: 'Prototype',
    description: 'Interactive prototypes that prove the interaction model early.',
  },
  { index: '04', title: 'Develop', description: 'Component architecture, APIs, and the experience in code.' },
  {
    index: '05',
    title: 'Animate',
    description: 'Scroll choreography, transitions, micro-interactions — sequenced, not scattered.',
  },
  {
    index: '06',
    title: 'Optimize',
    description: 'Bundle budgets, 60fps, reduced motion, and honest performance.',
  },
  { index: '07', title: 'Deploy', description: 'Review, test across devices, ship, and iterate.' },
]
