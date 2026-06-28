'use client'

import { useState, useRef, useEffect } from 'react'
import type { Skill } from '@/lib/data/skills'
import { skillCategories } from '@/lib/data/skills'

function CountUp({
  end,
  suffix = '',
  duration = 1000,
}: {
  end: number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.unobserve(el)
        const start = performance.now()

        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(eased * end))
          if (p < 1) requestAnimationFrame(step)
        }

        requestAnimationFrame(step)
      },
      { threshold: 0.5 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [end, duration])

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  )
}

export function AboutClient({
  skills,
  timeline,
}: {
  skills: Skill[]
  timeline: { year: string; role: string; company: string; desc: string }[]
}) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const groupedSkills = skillCategories.map((cat) => ({
    ...cat,
    skills: skills.filter((s) => s.category === cat.id),
  }))

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 pt-8">
      {/* Hero */}
      <div className="mb-16 px-1">
        <span
          className="font-mono text-[0.6rem] tracking-widest uppercase block mb-4"
          style={{ color: 'var(--accent)' }}
        >
          About me
        </span>

        <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,3.5rem)] text-white tracking-tight leading-[1.05] mb-6">
          Building digital products
          <br />
          <span
            className="text-transparent"
            style={{
              WebkitTextStroke: '1px rgba(255,255,255,0.2)',
            }}
          >
            with precision
          </span>
          <br />
          and purpose.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8">
          <div>
            <p className="text-sm leading-relaxed text-white/50 mb-4 max-w-[560px]">
              I architect and build digital products from concept to deployment.
              My work spans real-time audio engines in the browser, high-throughput
              API gateways, and accessible design systems — always with clean
              architecture and measurable performance.
            </p>
            <p className="text-sm leading-relaxed text-white/40 max-w-[560px]">
              I work across Java, Spring Boot, React, and TypeScript ecosystems.
              My focus is on clean domain models, secure APIs, and systems that
              scale predictably under load.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {[
              { n: 5, suffix: '+', label: 'Years coding' },
              { n: 30, suffix: '+', label: 'Projects shipped' },
              { n: 8, suffix: '+', label: 'Technologies used' },
            ].map(({ n, suffix, label }) => (
              <div
                key={label}
                className="px-4 py-3 rounded-xl text-center min-w-[100px]"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <p
                  className="font-display font-extrabold text-xl tracking-tight leading-none"
                  style={{ color: 'var(--accent)' }}
                >
                  <CountUp end={n} suffix={suffix} duration={1200} />
                </p>
                <p className="font-mono text-[0.55rem] tracking-wide uppercase text-white/30 mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-16">
        <div className="mb-8 px-1">
          <span
            className="font-mono text-[0.6rem] tracking-widest uppercase block mb-2"
            style={{ color: 'var(--accent)' }}
          >
            Toolkit
          </span>
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Skills &amp; Expertise
          </h2>
        </div>

        <div className="space-y-6">
          {groupedSkills.map(
            (group) =>
              group.skills.length > 0 && (
                <div key={group.id}>
                  <h3 className="font-mono text-[0.55rem] tracking-widest uppercase text-white/20 mb-3 px-1">
                    {group.label}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {group.skills.map((skill) => (
                      <div
                        key={skill.name}
                        onMouseEnter={() =>
                          setHoveredSkill(skill.name)
                        }
                        onMouseLeave={() => setHoveredSkill(null)}
                        className="rounded-xl p-3 transition-all duration-200"
                        style={{
                          background:
                            hoveredSkill === skill.name
                              ? 'rgba(var(--accent-rgb), 0.04)'
                              : 'rgba(255,255,255,0.02)',
                          border:
                            hoveredSkill === skill.name
                              ? '1px solid rgba(var(--accent-rgb), 0.15)'
                              : '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="text-xs"
                            style={{
                              color:
                                hoveredSkill === skill.name
                                  ? 'var(--accent)'
                                  : 'rgba(255,255,255,0.4)',
                            }}
                          >
                            {skill.icon}
                          </span>
                          <span className="font-mono text-[0.6rem] tracking-wider uppercase text-white/60">
                            {skill.name}
                          </span>
                        </div>
                        <div
                          className="h-1 rounded-full overflow-hidden"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                          }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${skill.level}%`,
                              background:
                                hoveredSkill === skill.name
                                  ? 'var(--accent)'
                                  : 'rgba(255,255,255,0.15)',
                              transition:
                                'background 0.3s ease, width 1s ease',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="pb-20">
        <div className="mb-8 px-1">
          <span
            className="font-mono text-[0.6rem] tracking-widest uppercase block mb-2"
            style={{ color: 'var(--accent)' }}
          >
            Career
          </span>
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Experience
          </h2>
        </div>

        <div className="space-y-0">
          {timeline.map((item, i) => (
            <div
              key={i}
              className="flex gap-6 pb-8 relative"
            >
              {i < timeline.length - 1 && (
                <div
                  className="absolute left-[15px] top-6 bottom-0 w-px"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
              )}
              <div className="flex flex-col items-center">
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[0.55rem] font-mono font-bold shrink-0"
                  style={{
                    background: 'rgba(var(--accent-rgb), 0.1)',
                    border: '1px solid rgba(var(--accent-rgb), 0.2)',
                    color: 'var(--accent)',
                  }}
                >
                  {item.year.slice(2)}
                </div>
              </div>
              <div className="pt-1">
                <h3 className="font-display font-bold text-base text-white mb-0.5">
                  {item.role}
                </h3>
                <p
                  className="font-mono text-[0.6rem] tracking-wider uppercase mb-2"
                  style={{ color: 'var(--accent)' }}
                >
                  {item.company}
                </p>
                <p className="text-sm leading-relaxed text-white/45 max-w-[500px]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
