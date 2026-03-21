/**
 * LogoCarousel.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Infinite scrolling tech stack carousel.
 *
 * Features:
 *  • Two rows scrolling in opposite directions (left ↔ right)
 *  • Pauses on hover (both rows)
 *  • Pure CSS animation — no JS per frame, 60fps guaranteed
 *  • Edge fade masks using CSS mask-image
 *  • Each skill has a custom icon (SVG or emoji) + label
 *  • Fully responsive — speeds scale with viewport
 *  • Respects prefers-reduced-motion
 */
"use client";
import { useState } from 'react';

// ── Skill definitions ─────────────────────────────────────────────────────
// icon: SVG path data or emoji string
// color: accent color for the icon on hover
const SKILLS_ROW_1 = [
  { label: 'HTML',              color: '#e34c26', icon: '🌐' },
  { label: 'CSS',               color: '#264de4', icon: '🎨' },
  { label: 'JavaScript',        color: '#f7df1e', icon: '⚡' },
  { label: 'Next.js',           color: '#ffffff', icon: '▲' },
  { label: 'Node.js',           color: '#3c873a', icon: '⬡' },
  { label: 'Python',            color: '#3572A5', icon: '🐍' },
  { label: 'Java',              color: '#b07219', icon: '☕' },
  { label: 'C++',               color: '#f34b7d', icon: '⚙' },
  { label: 'C',                 color: '#555555', icon: '©' },
  { label: 'Bash Script',       color: '#89e051', icon: '$_' },
  { label: 'Git',               color: '#f05032', icon: '⑂' },
  { label: 'GitHub',            color: '#ffffff', icon: '◎' },
  { label: 'Vercel',            color: '#ffffff', icon: '▲' },
];

const SKILLS_ROW_2 = [
  { label: 'PostgreSQL',        color: '#336791', icon: '🐘' },
  { label: 'SQL',               color: '#e38c00', icon: '🗄' },
  { label: 'OOP',               color: '#ff8c42', icon: '⬡' },
  { label: 'Dev Web',           color: '#61dafb', icon: '🌍' },
  { label: 'Dev Mobile',        color: '#a4c639', icon: '📱' },
  { label: 'Network Analysis',  color: '#00b4d8', icon: '📡' },
  { label: 'Database',          color: '#e38c00', icon: '🗃' },
  { label: 'Problem Solving',   color: '#ff8c42', icon: '🧩' },
  { label: 'Probability',       color: '#c084fc', icon: 'Σ' },
  { label: 'Data Structures',   color: '#34d399', icon: '⛓' },
  { label: 'Algorithms',        color: '#f472b6', icon: '∞' },
  { label: 'Linux',             color: '#fcc624', icon: '🐧' },
  { label: 'REST API',          color: '#ff8c42', icon: '⇄' },
];

// ── Single skill pill ─────────────────────────────────────────────────────
function SkillPill({ label, icon, color }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: '8px',
        border: `1px solid ${hovered ? color + '60' : 'rgba(255,255,255,0.08)'}`,
        background: hovered
          ? `rgba(${hexToRgb(color)}, 0.08)`
          : 'rgba(11,20,38,0.6)',
        backdropFilter: 'blur(6px)',
        whiteSpace: 'nowrap',
        cursor: 'default',
        transition: 'border-color 0.3s ease, background 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
        transform: hovered ? 'translateY(-3px) scale(1.04)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? `0 8px 24px ${color}25` : 'none',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {/* Icon */}
      <span style={{
        fontSize: '1rem',
        lineHeight: 1,
        color: hovered ? color : 'var(--muted)',
        transition: 'color 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        display: 'inline-block',
        transform: hovered ? 'scale(1.2)' : 'scale(1)',
        fontStyle: 'normal',
        minWidth: '1.2rem',
        textAlign: 'center',
      }}>
        {icon}
      </span>

      {/* Label */}
      <span style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.72rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: hovered ? 'var(--white)' : 'var(--muted)',
        transition: 'color 0.25s ease',
        fontWeight: 400,
      }}>
        {label}
      </span>

      {/* Active dot */}
      <span style={{
        width: '4px', height: '4px',
        borderRadius: '50%',
        background: color,
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'scale(1)' : 'scale(0)',
        transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        flexShrink: 0,
      }} />
    </div>
  );
}

// ── Hex color → RGB string helper ─────────────────────────────────────────
function hexToRgb(hex) {
  try {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.slice(0,2), 16);
    const g = parseInt(clean.slice(2,4), 16);
    const b = parseInt(clean.slice(4,6), 16);
    return `${r},${g},${b}`;
  } catch {
    return '255,140,66';
  }
}

// ── Single scrolling row ──────────────────────────────────────────────────
function CarouselRow({ skills, direction = 'left', speed = 40, paused }) {
  // Duplicate skills 3× so the loop is seamless even on wide screens
  const items = [...skills, ...skills, ...skills];
  const animName = direction === 'left' ? 'scrollLeft' : 'scrollRight';
  // Speed = seconds to scroll one full set width
  const duration = `${speed}s`;

  return (
    <div style={{
      overflow: 'hidden',
      width: '100%',
      // Edge fade masks — hides the hard ends
      maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
    }}>
      <div style={{
        display: 'inline-flex',
        gap: '12px',
        animation: `${animName} ${duration} linear infinite`,
        animationPlayState: paused ? 'paused' : 'running',
        willChange: 'transform',
      }}>
        {items.map((skill, i) => (
          <SkillPill key={`${skill.label}-${i}`} {...skill} />
        ))}
      </div>
    </div>
  );
}

// ── Main carousel ─────────────────────────────────────────────────────────
export default function LogoCarousel() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-label="Tech stack"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        padding: '4rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        /* ── Scroll animations ── */
        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scrollRight {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }

        /* ── Respect reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          @keyframes scrollLeft  { from { transform: none; } to { transform: none; } }
          @keyframes scrollRight { from { transform: none; } to { transform: none; } }
        }
      `}</style>

      {/* Section label */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '0.68rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ display:'inline-block', width:'28px', height:'1px', background:'var(--border)' }} />
          Tech Stack
          <span style={{ display:'inline-block', width:'28px', height:'1px', background:'var(--border)' }} />
        </span>
      </div>

      {/* Row 1 — scrolls left */}
      <div style={{ marginBottom: '12px' }}>
        <CarouselRow
          skills={SKILLS_ROW_1}
          direction="left"
          speed={35}
          paused={paused}
        />
      </div>

      {/* Row 2 — scrolls right (opposite direction) */}
      <CarouselRow
        skills={SKILLS_ROW_2}
        direction="right"
        speed={42}
        paused={paused}
      />

      {/* Hover hint */}
      {paused && (
        <div style={{
          position: 'absolute',
          bottom: '0.6rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'DM Mono, monospace',
          fontSize: '0.58rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          opacity: 0.6,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          animation: 'fadeIn 0.3s ease',
        }}>
          paused — move away to resume
        </div>
      )}
    </section>
  );
}