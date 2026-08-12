import Image from 'next/image'
import { starPath, zelligeBandSvg } from '@/lib/geometry'
import type { Project } from '@/types'

const GLAZE_HEX: Record<string, string> = {
  cobalt: '#1e4082',
  teal: '#15695c',
  terra: '#aa5226',
  brass: '#8c6634',
  ivory: '#c9c0a8',
}

/** A procedural Zellige composition standing in for a photograph. */
function ProceduralCover({ project }: { project: Project }) {
  const hex = GLAZE_HEX[project.glaze]
  const stars: { x: number; y: number; s: number; rot: number }[] = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      stars.push({ x: 62.5 + col * 125, y: 62 + row * 125, s: 46, rot: 0 })
    }
  }
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      stars.push({ x: 125 + col * 125, y: 125 + row * 125, s: 34, rot: 22.5 })
    }
  }
  const band = encodeURIComponent(zelligeBandSvg(12, 12))
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(160deg, rgba(238,232,218,0.94), rgba(238,232,218,0.78))',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        style={{ color: hex }}
      >
        {stars.map((s, i) => (
          <path
            key={i}
            d={starPath(s.x, s.y, s.s, s.s * 0.38, 8)}
            fill="currentColor"
            opacity={0.14 + (i % 3) * 0.05}
            transform={`rotate(${s.rot} ${s.x} ${s.y})`}
          />
        ))}
        <path d={starPath(250, 250, 78, 34)} fill="currentColor" opacity={0.2} />
      </svg>
      <div
        className="absolute inset-x-0 bottom-0 h-4"
        style={{
          backgroundImage: `url("data:image/svg+xml,${band}")`,
          backgroundSize: `${12 * 12}px 12px`,
          backgroundRepeat: 'repeat-x',
          opacity: 0.5,
        }}
      />
    </div>
  )
}

function GlazeTint({ project }: { project: Project }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
      style={{
        background: `linear-gradient(to top, ${GLAZE_HEX[project.glaze]}33, transparent 55%)`,
      }}
    />
  )
}

/**
 * The face of an exhibit: the photograph inside its arch frame, or — for
 * pieces still awaiting their photographs — a composed Zellige wall in the
 * project's glazes. Honest either way: no fabricated screenshots.
 */
export function ExhibitCover({ project, priority = false, className = '' }: { project: Project; priority?: boolean; className?: string }) {
  return (
    <div className={`arch-frame group relative aspect-[4/3] w-full overflow-hidden ${className}`}>
      {project.cover ? (
        <Image
          src={project.cover}
          alt={`${project.title} — ${project.category ?? 'project'}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          decoding="async"
          className="object-contain"
        />
      ) : (
        <ProceduralCover project={project} />
      )}
      <GlazeTint project={project} />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 40%, rgba(233,226,207,0.55), rgba(233,226,207,0) 70%)',
        }}
      />
    </div>
  )
}