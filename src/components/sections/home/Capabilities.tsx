'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { capabilities, type CapabilityPreview } from '@/lib/data/capabilities'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Abstract demonstration per capability — CSS-only, GPU-friendly,
 * zero assets. Demonstrates the discipline, not fake client work.
 */
const MOTIVE_COLORS: Record<CapabilityPreview, string> = {
  signal: '#8b5cf6',
  lumen: '#a78bfa',
  render: '#818cf8',
  aura: '#60a5fa',
}

function CapabilityMotive({ variant, color }: { variant: CapabilityPreview; color: string }) {
  return (
    <div
      aria-hidden
      className="cap-motive relative h-40 w-full overflow-hidden border border-white/[0.07] bg-white/[0.015] transition-transform duration-500 ease-out-expo group-hover:scale-[1.02] md:h-44"
    >
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(80% 90% at 50% 0%, ${color}1f, transparent 65%)` }}
      />

      {variant === 'signal' && (
        <div className="absolute inset-x-0 bottom-8 flex items-end justify-center gap-[6px]">
          {[22, 34, 18, 42, 28, 50, 20, 36, 26, 44].map((h, i) => (
            <span
              key={i}
              className="motive-scan w-[3px]"
              style={{
                height: h,
                background: color,
                opacity: 0.35 + (i % 3) * 0.2,
                animationDelay: `${i * 90}ms`,
              }}
            />
          ))}
        </div>
      )}

      {variant === 'lumen' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="motive-drift block h-16 w-16 rounded-full blur-[10px]"
            style={{ background: `radial-gradient(circle, ${color}cc, transparent 70%)` }}
          />
          <span
            className="motive-drift absolute block h-9 w-9 rounded-full blur-[8px]"
            style={{ background: 'rgba(168,180,255,0.6)', animationDelay: '-2.2s', animationDuration: '6s' }}
          />
        </div>
      )}

      {variant === 'render' && (
        <div className="absolute inset-0">
          <div className="absolute inset-x-4 top-1/2 h-px bg-white/10" />
          <span
            className="motive-trace absolute left-4 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full"
            style={{ background: color, boxShadow: `0 0 14px ${color}` }}
          />
        </div>
      )}

      {variant === 'aura' && (
        <div className="absolute inset-x-4 top-6 space-y-[7px]">
          {['success — trees shake', 'pass — 624 checks', 'deploy · edge', 'gzip 98%'].map((line, i) => (
            <p
              key={line}
              className={`font-mono text-[0.55rem] uppercase tracking-[0.18em] ${i === 3 ? 'text-white/55' : 'text-white/50'}`}
            >
              <span className={i === 3 ? 'text-emerald-400' : 'text-white/50'}>▸ </span>
              {line}
            </p>
          ))}
          <span className="motive-scan absolute bottom-0 left-0 h-px w-24" style={{ background: color }} />
        </div>
      )}
    </div>
  )
}

export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.cap-row'),
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 76%', once: true },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      aria-label="Capabilities"
      className="section-pad ambient-aura relative"
    >
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label label-accent mb-6">02 — Capabilities</p>
            <h2 className="fluid-h2 max-w-xl font-extrabold tracking-tight">
              A practice with <span className="text-outline">range</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-secondary">
            From the creative surface to the systems underneath — each discipline is practised, not listed.
          </p>
        </div>

        <div className="border-t border-white/[0.08]">
          {capabilities.map((c) => (
            <article
              key={c.index}
              data-cursor-text="Hold"
              className="cap-row group grid grid-cols-1 gap-8 border-b border-white/[0.08] py-10 transition-colors duration-500 hover:bg-white/[0.015] md:grid-cols-[5rem_minmax(0,1fr)_22rem] md:items-center md:gap-10 md:px-4"
            >
              <span className="label text-accent-secondary md:self-start">{c.index}</span>

              <div>
                <h3 className="fluid-h2 font-extrabold tracking-tight text-ink transition-transform duration-500 ease-out-expo md:group-hover:translate-x-3">
                  {c.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-secondary">{c.description}</p>
                <p className="mt-5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink-tertiary">
                  {c.skills.map((s, i) => (
                    <span key={s}>
                      {i > 0 && <span className="mx-2 text-white/20">/</span>}
                      <span className="transition-colors duration-300 group-hover:text-ink-secondary">
                        {s}
                      </span>
                    </span>
                  ))}
                </p>
              </div>

              <div className="max-md:hidden">
                <CapabilityMotive variant={c.preview} color={MOTIVE_COLORS[c.preview]} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
