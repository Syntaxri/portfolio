import { skills } from '../lib/data/skills'

export function TechStack() {
  const featured = skills.filter((s) => s.level >= 72)
  const sorted = [...featured].sort((a, b) => b.level - a.level)

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-bold text-base text-white tracking-tight">
            Technical Skills
          </h2>
          <p className="font-mono text-[0.6rem] tracking-wider text-white/30 mt-0.5">
            Core competencies and expertise levels
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {sorted.map((skill) => (
          <div
            key={skill.name}
            className="rounded-xl p-3.5 transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span
                className="text-sm"
                style={{ color: 'var(--accent)' }}
              >
                {skill.icon}
              </span>
              <span className="font-mono text-[0.6rem] tracking-wider uppercase text-white/70">
                {skill.name}
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${skill.level}%`,
                  background: skill.level > 85
                    ? 'var(--accent)'
                    : skill.level > 75
                      ? 'rgba(var(--accent-rgb), 0.6)'
                      : 'rgba(255,255,255,0.2)',
                }}
              />
            </div>
            <span className="font-mono text-[0.5rem] tracking-wide text-white/20 mt-1 block">
              {skill.level}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
