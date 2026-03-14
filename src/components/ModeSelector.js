/**
 * ModeSelector.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-screen entry experience. Shown only on the very first visit.
 * Two large cards — Developer and Photography — with cinematic entrance.
 *
 * Design choices:
 *  • Split-screen layout on desktop, stacked on mobile
 *  • Each half has a unique texture / atmosphere
 *  • Hovering a side floods it with its accent color
 *  • Clicking stores the choice and dismisses with a zoom-out exit
 */
"use client";
import { useState, useEffect } from 'react';
import { useMode } from '../context/ModeContext';

// ── Single selectable side ─────────────────────────────────────────────────
function ModeSide({ id, icon, title, subtitle, accent, bg, onSelect, entering }) {
  const [hovered, setHovered] = useState(false);
  const delay = id === 'developer' ? '0.1s' : '0.25s';

  return (
    <button
      onClick={() => onSelect(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Enter ${title} portfolio`}
      style={{
        flex: 1,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        background: hovered ? bg : 'transparent',
        transition: 'background 0.5s ease',
        opacity: entering ? 1 : 0,
        transform: entering
          ? 'translateY(0)'
          : id === 'developer' ? 'translateY(-30px)' : 'translateY(30px)',
        transitionProperty: 'opacity, transform, background',
        transitionDuration: `0.7s, 0.7s, 0.5s`,
        transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
        transitionDelay: delay,
        outline: 'none',
        minHeight: '300px',
      }}
    >
      {/* Noise texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.6,
        pointerEvents: 'none',
      }} />

      {/* Accent glow blob */}
      <div style={{
        position: 'absolute',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: accent,
        filter: 'blur(120px)',
        opacity: hovered ? 0.12 : 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div style={{
        fontSize: '2.8rem',
        marginBottom: '1.5rem',
        transform: hovered ? 'scale(1.15) translateY(-4px)' : 'scale(1) translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        filter: hovered ? `drop-shadow(0 0 16px ${accent})` : 'none',
      }}>
        {icon}
      </div>

      {/* Label */}
      <h2 style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
        letterSpacing: '-0.04em',
        color: hovered ? '#fff' : 'rgba(255,255,255,0.85)',
        marginBottom: '0.8rem',
        transition: 'color 0.3s ease',
        lineHeight: 1,
      }}>
        {title}
      </h2>

      {/* Sub */}
      <p style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.78rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: hovered ? accent : 'rgba(255,255,255,0.35)',
        maxWidth: '260px',
        textAlign: 'center',
        lineHeight: 1.6,
        transition: 'color 0.3s ease',
      }}>
        {subtitle}
      </p>

      {/* Enter arrow */}
      <div style={{
        marginTop: '2rem',
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: accent,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}>
        Enter
        <span style={{
          display: 'inline-block',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 0.25s ease',
        }}>→</span>
      </div>
    </button>
  );
}

// ── Main selector ──────────────────────────────────────────────────────────
export default function ModeSelector() {
  const { setMode }    = useMode();
  const [entering, setEntering] = useState(false);
  const [exiting,  setExiting]  = useState(false);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setEntering(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (m) => {
    setExiting(true);
    setTimeout(() => setMode(m), 600);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#0a0a08',
      display: 'flex',
      flexDirection: 'column',
      opacity: exiting ? 0 : 1,
      transform: exiting ? 'scale(1.04)' : 'scale(1)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    }}>

      {/* Header */}
      <div style={{
        padding: '2.5rem 2rem 0',
        textAlign: 'center',
        opacity: entering ? 1 : 0,
        transform: entering ? 'translateY(0)' : 'translateY(-16px)',
        transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <p style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '1.1rem',
          letterSpacing: '-0.03em',
          color: 'rgba(255,255,255,0.9)',
        }}>
          <span style={{ color: '#ff6b35' }}>{'{'}</span>
          {' '}Akram Rihani{' '}
          <span style={{ color: '#ff6b35' }}>{'}'}</span>
        </p>
        <p style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          marginTop: '0.5rem',
        }}>
          Choose your experience
        </p>
      </div>

      {/* Divider line */}
      <div style={{
        height: '1px',
        background: 'rgba(255,255,255,0.06)',
        margin: '2rem 0 0',
        opacity: entering ? 1 : 0,
        transition: 'opacity 0.5s ease 0.15s',
      }} />

      {/* Two halves */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
      }}
      className="mode-selector-halves"
      >
        {/* Vertical divider */}
        <div style={{
          position: 'absolute',
          left: '50%', top: '10%', bottom: '10%',
          width: '1px',
          background: 'rgba(255,255,255,0.08)',
          opacity: entering ? 1 : 0,
          transition: 'opacity 0.5s ease 0.2s',
        }} />

        <ModeSide
          id="developer"
          icon="⌨"
          title="Developer"
          subtitle="Systems, applications, and digital architecture"
          accent="#ff6b35"
          bg="rgba(255,107,53,0.04)"
          onSelect={handleSelect}
          entering={entering}
        />
        <ModeSide
          id="photography"
          icon="⬡"
          title="Photography"
          subtitle="Moments, light, and visual stories"
          accent="#d4a853"
          bg="rgba(212,168,83,0.04)"
          onSelect={handleSelect}
          entering={entering}
        />
      </div>

      {/* Footer hint */}
      <div style={{
        padding: '1.2rem',
        textAlign: 'center',
        opacity: entering ? 1 : 0,
        transition: 'opacity 0.5s ease 0.4s',
      }}>
        <p style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '0.62rem',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.18)',
          textTransform: 'uppercase',
        }}>
          Your choice is saved — switch anytime from the nav
        </p>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .mode-selector-halves {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}