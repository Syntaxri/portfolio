"use client";
import { useRef, useEffect, useState } from 'react';

export default function SkillBadge({ skill, level }) {
  const pct     = level ?? 80;
  const barRef  = useRef(null);
  const [filled, setFilled] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Animate bar when it enters viewport
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay so the number and bar animate together
          setTimeout(() => setFilled(true), 100);
          obs.unobserve(el);
        }
      },
      { threshold: 0.8 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const barColor = pct > 85
    ? 'var(--accent)'
    : pct > 60
    ? 'var(--text)'
    : 'var(--muted)';

  return (
    <div
      ref={barRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: '8px',
        padding: '12px 14px',
        borderRadius: '8px',
        border: `1px solid ${hovered ? 'rgba(var(--accent-rgb),0.25)' : 'transparent'}`,
        background: hovered ? 'rgba(var(--accent-rgb),0.04)' : 'transparent',
        transition: 'border-color 0.3s ease, background 0.3s ease',
        cursor: 'default',
      }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: '0.78rem',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: hovered ? 'var(--text)' : 'var(--muted)',
          transition: 'color 0.25s ease',
        }}>
          {skill}
        </span>

        {/* Animated percentage number */}
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
          color: filled ? barColor : 'transparent',
          transition: 'color 0.4s ease 0.3s',
          fontVariantNumeric: 'tabular-nums',
          minWidth: '32px', textAlign: 'right',
        }}>
          {pct}%
        </span>
      </div>

      {/* Progress track */}
      <div style={{
        height: '3px',
        background: 'var(--border)',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Fill bar */}
        <div style={{
          height: '100%',
          width: filled ? `${pct}%` : '0%',
          background: barColor,
          borderRadius: '2px',
          transition: 'width 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Shimmer sweep on fill */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
            transform: filled ? 'translateX(100%)' : 'translateX(-100%)',
            transition: 'transform 0.8s ease 0.9s',
          }} />
        </div>
      </div>
    </div>
  );
}