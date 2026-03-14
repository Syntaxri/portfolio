"use client";
import { useEffect, useRef, useState } from 'react';

// ─── Social links defined OUTSIDE render — no re-creation on updates ───────
const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/Syntaxri',
    color: '#e8e8e0',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/riihaniakram/',
    color: '#0a66c2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/akramography',
    color: '#e1306c',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
];

// ─── Animated gradient separator ─────────────────────────────────────────────
function GradientLine() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '1px',
        overflow: 'hidden',
        marginBottom: '2.5rem',
      }}
    >
      {/* Static base line */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--border)',
        }}
      />
      {/* Animated shimmer — infinite blink */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, transparent 0%, var(--accent) 40%, #fff 50%, var(--accent) 60%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s cubic-bezier(0.4,0,0.2,1) infinite',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { background-position: -200% center; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Social icon button ───────────────────────────────────────────────────────
function SocialIcon({ label, href, icon, color }) {
  const [hovered, setHovered] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} — opens in new tab`}
        onMouseEnter={() => { setHovered(true); setTooltip(true); }}
        onMouseLeave={() => { setHovered(false); setTooltip(false); }}
        onFocus={() => setTooltip(true)}
        onBlur={() => setTooltip(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          border: `1px solid ${hovered ? color + '55' : 'var(--border)'}`,
          background: hovered ? color + '12' : 'transparent',
          color: hovered ? color : 'var(--muted)',
          cursor: 'pointer',
          textDecoration: 'none',
          // CSS transforms for 3D lift effect
          transform: hovered
            ? 'translateY(-4px) scale(1.08)'
            : 'translateY(0) scale(1)',
          boxShadow: hovered
            ? `0 8px 24px ${color}30, 0 2px 8px rgba(0,0,0,0.3)`
            : '0 0 0 rgba(0,0,0,0)',
          transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          outline: 'none',
        }}
      >
        {icon}
      </a>

      {/* Tooltip */}
      <div
        role="tooltip"
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 10px)',
          left: '50%',
          transform: `translateX(-50%) translateY(${tooltip ? '0px' : '4px'})`,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '4px 10px',
          whiteSpace: 'nowrap',
          fontFamily: 'DM Mono, monospace',
          fontSize: '0.65rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text)',
          opacity: tooltip ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          zIndex: 10,
        }}
      >
        {label}
        {/* Arrow */}
        <div style={{
          position: 'absolute',
          top: '100%', left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid var(--border)',
        }} />
      </div>
    </div>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [lineAnimate, setLineAnimate] = useState(false);

  // Intersection observer for entry animation
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Delay line shimmer slightly after footer appears
          setTimeout(() => setLineAnimate(true), 400);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes footerFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% center; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { background-position: -200% center; opacity: 0; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.4); }
        }
        .footer-inner {
          opacity: 0;
        }
        .footer-inner.visible {
          animation: footerFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
        }
      `}</style>

      <footer
        ref={footerRef}
        role="contentinfo"
        style={{
          borderTop: '1px solid var(--border)',
          padding: '3.5rem 2rem 2.5rem',
          position: 'relative',
        }}
      >
        <div
          className={`footer-inner${visible ? ' visible' : ''}`}
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          {/* ── Shimmer separator line ── */}
          <GradientLine animate={lineAnimate} />

          {/* ── Main row ── */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}>

            {/* Identity block */}
            <div>
              <p style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '1.15rem',
                letterSpacing: '-0.04em',
                color: 'var(--white)',
                marginBottom: '6px',
                lineHeight: 1,
              }}>
                <span style={{ color: 'var(--accent)' }}>{'{'}</span>
                <span style={{ margin: '0 6px' }}>Akram Rihani</span>
                <span style={{ color: 'var(--accent)' }}>{'}'}</span>
              </p>
              <p style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                {/* Pulsing availability dot */}
                <span style={{
                  display: 'inline-block',
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: 'dotPulse 2.4s ease-in-out infinite',
                  flexShrink: 0,
                }} />
                Developer &amp; Photographer
              </p>
            </div>

            {/* Social icons */}
            <nav aria-label="Social media links" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {SOCIAL_LINKS.map(s => (
                <SocialIcon key={s.label} {...s} />
              ))}
            </nav>
          </div>

          {/* ── Bottom row ── */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)',
          }}>
            <p style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              color: 'var(--muted)',
            }}>
              © {year} Akram Rihani — All rights reserved
            </p>

            <p style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              color: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              Built with
              {/* Heart */}
              <span style={{ color: '#e25555', fontSize: '0.75rem' }}>♥</span>
              By Akram Rihani
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}