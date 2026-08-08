import type { Project } from '@/types'

/**
 * Cover visual for a project — renders the real screenshot when one exists,
 * otherwise falls back to procedural SVG art so no slot is ever empty.
 */
export function ProjectVisual({ project, className = '' }: { project: Project; className?: string }) {
  if (project.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static local covers, aspect handled by the frame
      <img src={project.cover} alt={`${project.title} — cover`} loading="lazy" decoding="async" fetchPriority="low" className={`h-full w-full object-cover ${className}`} draggable={false} />
    )
  }
  const c = project.color
  const v = project.coverVariant ?? 'aurora'

  return (
    <svg viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <radialGradient id={`pv-bg-${v}-${project.slug}`} cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor={c} stopOpacity="0.5" />
          <stop offset="55%" stopColor={c} stopOpacity="0.12" />
          <stop offset="100%" stopColor="#05060a" stopOpacity="0" />
        </radialGradient>

        {v === 'aurora' && (
          <>
            <filter id={`pv-blur-${project.slug}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="26" />
            </filter>
            <linearGradient id={`pv-aur-${project.slug}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={c} />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </>
        )}

        {v === 'grid' && (
          <pattern id={`pv-grid-${project.slug}`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={c} strokeOpacity="0.22" strokeWidth="1" />
          </pattern>
        )}

        {v === 'signal' && (
          <>
            <filter id={`pv-soft-${project.slug}`}>
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
            <linearGradient id={`pv-sig-${project.slug}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor={c} stopOpacity="0" />
              <stop offset="50%" stopColor={c} stopOpacity="0.85" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </linearGradient>
          </>
        )}

        {v === 'orb' && (
          <>
            <radialGradient id={`pv-orb-${project.slug}`} cx="35%" cy="32%" r="32%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="42%" stopColor={c} stopOpacity="0.55" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`pv-halo-${project.slug}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c} stopOpacity="0.35" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </radialGradient>
          </>
        )}

        <filter id={`pv-grain-${project.slug}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.08" />
          </feComponentTransfer>
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
      </defs>

      <rect width="640" height="480" fill="#070810" />

      <rect width="640" height="480" fill={`url(#pv-bg-${v}-${project.slug})`} />

      {v === 'aurora' && (
        <>
          <ellipse cx="150" cy="120" rx="300" ry="170" fill={`url(#pv-aur-${project.slug})`} opacity="0.5" filter={`url(#pv-blur-${project.slug})`} transform="rotate(-18 320 240)" />
          <ellipse cx="470" cy="320" rx="260" ry="140" fill="#8b85d8" opacity="0.4" filter={`url(#pv-blur-${project.slug})`} transform="rotate(14 320 240)" />
          <circle cx="495" cy="150" r="96" fill="none" stroke={c} strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="495" cy="150" r="138" fill="none" stroke={c} strokeOpacity="0.22" strokeWidth="1" />
        </>
      )}

      {v === 'grid' && (
        <>
          <rect width="640" height="480" fill={`url(#pv-grid-${project.slug})`} />
          <g transform="translate(320 240)">
            <ellipse cx="0" cy="0" rx="170" ry="170" fill="none" stroke={c} strokeOpacity="0.55" strokeWidth="1.2" />
            <ellipse cx="0" cy="0" rx="120" ry="120" fill="none" stroke={c} strokeOpacity="0.3" strokeWidth="1" />
            <circle cx="0" cy="0" r="58" fill={c} fillOpacity="0.22" />
          </g>
        </>
      )}

      {v === 'signal' && (
        <>
          <path d="M 0 240 Q 170 120 320 216 T 640 200" fill="none" stroke={`url(#pv-sig-${project.slug})`} strokeWidth="2.5" filter={`url(#pv-soft-${project.slug})`} />
          <path d="M 0 320 Q 170 210 340 300 T 640 292" fill="none" stroke={c} strokeOpacity="0.5" strokeWidth="1.4" />
          <g fill={c}>
            <circle cx="320" cy="216" r="4" />
            <circle cx="520" cy="268" r="3" fillOpacity="0.6" />
          </g>
        </>
      )}

      {v === 'orb' && (
        <>
          <circle cx="320" cy="240" r="200" fill={`url(#pv-halo-${project.slug})`} />
          <circle cx="300" cy="218" r="74" fill={`url(#pv-orb-${project.slug})`} />
          <circle cx="300" cy="218" r="74" fill="none" stroke={c} strokeOpacity="0.4" strokeWidth="0.8" />
          <circle cx="340" cy="286" r="132" fill="none" stroke={c} strokeOpacity="0.16" strokeWidth="1" />
        </>
      )}

      <text x="36" y="386" fontFamily="DM Mono, monospace" fontSize="13" letterSpacing="0.22em" fill="#ffffff" fillOpacity="0.34">
        {project.category?.toUpperCase() ?? 'PROJECT'} — {project.year}
      </text>
      <text x="640" y="386" textAnchor="end" fontFamily="DM Mono, monospace" fontSize="13" letterSpacing="0.22em" fill={c} fillOpacity="0.7">
        AR
      </text>

      <rect width="640" height="480" filter={`url(#pv-grain-${project.slug})`} />
    </svg>
  )
}