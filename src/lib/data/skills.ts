export interface Skill {
  name: string
  level: number
  icon: string
  category: string
}

export const skillCategories = [
  { id: 'backend', label: 'Backend Engineering' },
  { id: 'security', label: 'Security & Identity' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'database', label: 'Database' },
  { id: 'tools', label: 'Tools & Infrastructure' },
] as const

export const skills: Skill[] = [
  { name: 'Java 17+', level: 92, icon: '☕', category: 'backend' },
  { name: 'Spring Boot 3', level: 90, icon: '🍃', category: 'backend' },
  { name: 'REST APIs', level: 88, icon: '🔗', category: 'backend' },
  { name: 'Spring Security 6', level: 85, icon: '🛡️', category: 'security' },
  { name: 'OAuth2 / JWT', level: 82, icon: '🔑', category: 'security' },
  { name: 'React', level: 80, icon: '⚛️', category: 'frontend' },
  { name: 'Next.js', level: 78, icon: '▲', category: 'frontend' },
  { name: 'TypeScript', level: 76, icon: '📘', category: 'frontend' },
  { name: 'MySQL', level: 85, icon: '🐬', category: 'database' },
  { name: 'JPA/Hibernate', level: 83, icon: '🗃️', category: 'database' },
  { name: 'Git', level: 85, icon: '🔀', category: 'tools' },
  { name: 'Linux', level: 80, icon: '🐧', category: 'tools' },
  { name: 'Maven', level: 78, icon: '📦', category: 'tools' },
]
