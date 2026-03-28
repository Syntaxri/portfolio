/**
 * ProfileCard.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Floating profile card — sits left of the hero title.
 * Matches navy + orange portfolio theme.
 *
 * Design decisions:
 *  • Glassmorphism card with subtle navy gradient
 *  • Photo with animated ring + availability dot
 *  • Info rows (email, location, role, github) with icon pills
 *  • Social links with brand hover colors
 *  • Subtle floating animation
 *  • Entrance animation staggers in from left
 *  • Collapses/hides on small screens (hero takes full width)
 */
"use client";
import { useState } from 'react';

// ── Info row component ────────────────────────────────────────────────────
function InfoRow({ icon, label, value, href }) {
  const [hov, setHov] = useState(false);
  const inner = (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 12px', borderRadius: '10px',
        background: hov ? 'rgba(255,140,66,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? 'rgba(255,140,66,0.2)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.25s ease',
        cursor: href ? 'pointer' : 'default',
        textDecoration: 'none',
      }}
    >
      {/* Icon pill */}
      <div style={{
        width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
        background: hov ? 'rgba(255,140,66,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hov ? 'rgba(255,140,66,0.3)' : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.85rem',
        transition: 'all 0.25s ease',
      }}>
        {icon}
      </div>
      <div style={{ overflow: 'hidden' }}>
        <p style={{
          fontFamily: 'DM Mono, monospace', fontSize: '0.58rem',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: '2px',
        }}>{label}</p>
        <p style={{
          fontFamily: 'DM Mono, monospace', fontSize: '0.75rem',
          color: hov && href ? 'var(--accent)' : 'var(--text)',
          letterSpacing: '0.01em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          transition: 'color 0.2s ease',
        }}>{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        style={{ textDecoration: 'none', display: 'block' }}>
        {inner}
      </a>
    );
  }
  return inner;
}

// ── Social button ─────────────────────────────────────────────────────────
function SocialBtn({ href, label, color, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '36px', height: '36px', borderRadius: '9px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${hov ? color + '55' : 'rgba(255,255,255,0.08)'}`,
        background: hov ? color + '18' : 'rgba(255,255,255,0.03)',
        color: hov ? color : 'var(--muted)',
        textDecoration: 'none', fontSize: '0.9rem',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hov ? 'translateY(-3px) scale(1.1)' : 'none',
        boxShadow: hov ? `0 6px 20px ${color}30` : 'none',
      }}
    >
      {children}
    </a>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────
export default function ProfileCard() {
  return (
    <>
      <style>{`
        @keyframes cardFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes ringPulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.04); }
        }
        @keyframes cardSlideIn {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes availPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
          50%      { box-shadow: 0 0 0 5px rgba(16,185,129,0.15); }
        }

        /* Hide on small screens — hero takes full width */
        .profile-card-wrap {
          display: flex;
          animation: cardSlideIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both;
        }
        @media (max-width: 900px) {
          .profile-card-wrap { display: none !important; }
        }
      `}</style>

      <div className="profile-card-wrap">
        <div style={{
          width: '240px',
          flexShrink: 0,
          background: 'rgba(11,20,38,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px',
          padding: '1.6rem 1.2rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '1.1rem',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
          position: 'relative',
          animation: 'cardFloat 5s ease-in-out 1s infinite',
          overflow: 'hidden',
        }}>

          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            opacity: 0.7, borderRadius: '0 0 2px 2px',
          }} />

          {/* Subtle bg glow */}
          <div style={{
            position: 'absolute', top: '-40px', left: '50%',
            transform: 'translateX(-50%)',
            width: '160px', height: '160px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,140,66,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* ── Photo ── */}
          <div style={{ position: 'relative', marginTop: '0.4rem' }}>
            {/* Animated ring */}
            <div style={{
              position: 'absolute', inset: '-5px', borderRadius: '20px',
              border: '1.5px solid rgba(255,140,66,0.5)',
              animation: 'ringPulse 2.5s ease-in-out infinite',
            }} />
            <div style={{
              position: 'absolute', inset: '-10px', borderRadius: '24px',
              border: '1px solid rgba(255,140,66,0.15)',
            }} />

            {/* Photo container */}
            <div style={{
              width: '88px', height: '88px', borderRadius: '16px',
              overflow: 'hidden', position: 'relative',
              background: 'rgba(255,140,66,0.1)',
              border: '2px solid rgba(255,140,66,0.25)',
            }}>
              {/* Replace src with your actual photo path */}
              <img
                src="/images/akram.png"
                alt="Akram Rihani"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => {
                  // Fallback initials if image missing
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Initials fallback */}
              <div style={{
                display: 'none', position: 'absolute', inset: 0,
                alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: '1.8rem', color: 'var(--accent)',
                background: 'rgba(255,140,66,0.08)',
              }}>AR</div>
            </div>

            {/* Availability dot */}
            <div style={{
              position: 'absolute', bottom: '-4px', right: '-4px',
              width: '16px', height: '16px', borderRadius: '50%',
              background: '#10b981',
              border: '2.5px solid #050a14',
              animation: 'availPulse 2s ease-in-out infinite',
            }} />
          </div>

          {/* ── Name & role ── */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            <h3 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: '1.05rem', letterSpacing: '-0.03em',
              color: 'var(--white)', marginBottom: '6px', lineHeight: 1.1,
            }}>
              Akram Rihani
            </h3>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '20px',
              background: 'rgba(255,140,66,0.1)',
              border: '1px solid rgba(255,140,66,0.25)',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.62rem',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--accent)',
              }}>
                Available for work
              </span>
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)' }} />

          {/* ── Info rows ── */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <InfoRow
              icon="✉"
              label="Email"
              value="akramrihanie@gmail.com"
              href="mailto:akramrihanie@gmail.com"
            />
            <InfoRow
              icon="📍"
              label="Location"
              value="Morocco 🇲🇦"
            />
            <InfoRow
              icon="⌨"
              label="Role"
              value="Full Stack Developer"
            />
            <InfoRow
              icon="◎"
              label="GitHub"
              value="github.com/Syntaxri"
              href="https://github.com/Syntaxri"
            />
          </div>

          {/* ── Divider ── */}
          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)' }} />

          {/* ── Social links ── */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <SocialBtn href="https://github.com/Syntaxri" label="GitHub" color="#e8e8e0">
              {/* GitHub icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </SocialBtn>
            <SocialBtn href="https://www.linkedin.com/in/riihaniakram/" label="LinkedIn" color="#0a66c2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </SocialBtn>
            <SocialBtn href="https://instagram.com/akramography" label="Instagram" color="#e1306c">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </SocialBtn>
          </div>

          {/* ── Bottom stat strip ── */}
          <div style={{
            width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '6px', marginTop: '-0.3rem',
          }}>
            {[
              { n: '5+', label: 'Yrs exp' },
              { n: '30+', label: 'Projects' },
            ].map(({ n, label }) => (
              <div key={label} style={{
                textAlign: 'center', padding: '8px 4px',
                borderRadius: '8px', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <p style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'1rem', color:'var(--accent)', lineHeight:1 }}>{n}</p>
                <p style={{ fontFamily:'DM Mono, monospace', fontSize:'0.55rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)', marginTop:'3px' }}>{label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}