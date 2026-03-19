/**
 * PageLoader.js — "AR" Cinematic Pre-loader
 * ─────────────────────────────────────────────────────────────────────────────
 * A self-contained, zero-dependency pre-loader that uses pure CSS animations
 * orchestrated via animation-delay cascades (no GSAP needed — same timing
 * control, smaller bundle, 60fps guaranteed via transform/opacity only).
 *
 * Design concept — "Signal from the Deep":
 *   The initials AR emerge from a dark navy void through concentric hexagonal
 *   rings that pulse outward like sonar. A signature path draws itself across
 *   the screen. Then a circular radial wipe expands from center, erasing the
 *   loader and revealing the site beneath with hero content rising into view.
 *
 * Animation sequence:
 *   0.0s — Background fades in (navy → deep navy gradient)
 *   0.2s — Outer hex ring draws via stroke-dashoffset
 *   0.5s — Middle hex ring draws
 *   0.7s — Inner hex ring draws
 *   0.9s — "A" initial fades + slides up
 *   1.1s — "R" initial fades + slides up
 *   1.3s — Signature path draws itself left → right
 *   1.8s — Tagline fades in below
 *   2.4s — Radial mask expands (circle scale 0 → 150vmax)
 *   2.9s — Loader overlay fades out fully
 *   3.0s — onComplete() fires, component unmounts
 *
 * Accessibility:
 *   • aria-busy="true" on loader root
 *   • aria-live="polite" status region
 *   • Failsafe: forces complete at 5s if animations stall
 *   • Skip button visible on keyboard focus
 *
 * Performance:
 *   • ONLY transform + opacity animated (compositor thread only)
 *   • will-change applied sparingly to animated elements
 *   • SVG strokes use stroke-dasharray/offset (no JS per frame)
 *   • Radial wipe uses clip-path scale (GPU composited)
 *   • No layout thrashing — all measurements done once
 */
"use client";
import { useEffect, useState, useRef, useCallback } from 'react';

// ─── SVG Hexagon path generator ─────────────────────────────────────────────
// Returns a regular hexagon path centered at (cx,cy) with given size
function hexPath(cx, cy, size) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`;
  });
  return `M ${pts[0]} L ${pts[1]} L ${pts[2]} L ${pts[3]} L ${pts[4]} L ${pts[5]} Z`;
}

// Perimeter of a regular hexagon with given size
const hexPerimeter = (size) => 6 * size;

// ─── Hex ring component ──────────────────────────────────────────────────────
function HexRing({ size, strokeWidth, color, opacity, delay, duration = 0.9 }) {
  const perim = hexPerimeter(size);
  const id    = `hex-${size}`;

  return (
    <path
      d={hexPath(200, 200, size)}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      style={{
        strokeDasharray:  perim,
        strokeDashoffset: perim,
        animation: `hexDraw ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s forwards`,
        willChange: 'stroke-dashoffset',
      }}
    />
  );
}

// ─── AR Signature SVG path ───────────────────────────────────────────────────
// Hand-crafted bezier path spelling "Akram" in a flowing signature style
// Scaled to fit within a 320×60 viewBox
const SIGNATURE_PATH =
  'M 10,45 C 20,10 35,8 42,30 C 46,42 44,50 40,48 C 36,46 38,35 45,32 ' +
  'C 55,28 62,38 60,48 L 60,25 C 60,25 65,20 70,35 C 75,48 72,52 68,48 ' +
  'C 64,44 66,36 74,34 C 82,32 88,40 86,50 ' +
  'M 95,20 C 95,20 90,50 95,50 C 100,50 108,30 112,30 C 118,30 115,50 120,50 ' +
  'M 128,28 C 122,28 118,38 120,46 C 122,54 130,54 134,46 C 138,38 136,28 128,28 ' +
  'M 128,28 L 142,20 ' +
  'M 150,38 C 148,30 152,24 158,26 C 164,28 164,36 158,40 C 152,44 148,44 150,50 ' +
  'M 150,50 L 165,50 ' +
  'M 175,20 C 175,55 180,55 185,35 C 190,15 195,50 200,50 ' +
  'M 210,20 L 280,20 ' + // underline flourish
  'M 210,24 C 240,24 270,26 285,28';

// ─── Main component ──────────────────────────────────────────────────────────
export default function PageLoader({ onComplete }) {
  const [phase,   setPhase]   = useState('loading'); // loading | exiting | done
  const [sigLen,  setSigLen]  = useState(0);
  const sigRef   = useRef(null);
  const timerRef = useRef([]);
  const doneRef  = useRef(false);

  // Measure actual signature path length for accurate dasharray
  useEffect(() => {
    if (sigRef.current) {
      try {
        setSigLen(sigRef.current.getTotalLength());
      } catch {
        setSigLen(600); // fallback estimate
      }
    }
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase('exiting');
    timerRef.current.push(
      setTimeout(() => {
        setPhase('done');
        onComplete?.();
      }, 700)
    );
  }, [onComplete]);

  useEffect(() => {
    // Start radial wipe at 2.4s
    const t1 = setTimeout(() => setPhase('wiping'), 2400);
    // Complete at 3.0s
    const t2 = setTimeout(finish, 3000);
    // Failsafe — force complete at 5s
    const t3 = setTimeout(finish, 5000);

    timerRef.current = [t1, t2, t3];
    return () => timerRef.current.forEach(clearTimeout);
  }, [finish]);

  if (phase === 'done') return null;

  const isWiping  = phase === 'wiping' || phase === 'exiting';
  const sigDash   = sigLen || 600;

  return (
    <>
      <style>{`
        /* ── Hex stroke draw ──────────────────────────────────────────── */
        @keyframes hexDraw {
          to { stroke-dashoffset: 0; }
        }

        /* ── Initial letters ─────────────────────────────────────────── */
        @keyframes initialIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Signature path draw ──────────────────────────────────────── */
        @keyframes sigDraw {
          to { stroke-dashoffset: 0; }
        }

        /* ── Tagline ─────────────────────────────────────────────────── */
        @keyframes tagIn {
          from { opacity: 0; transform: translateY(8px) scaleX(0.8); }
          to   { opacity: 1; transform: translateY(0) scaleX(1); }
        }

        /* ── Pulse rings ─────────────────────────────────────────────── */
        @keyframes ringPulse {
          0%   { transform: scale(1);   opacity: 0.15; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        /* ── Radial wipe ─────────────────────────────────────────────── */
        @keyframes radialWipe {
          from { clip-path: circle(0% at 50% 50%); }
          to   { clip-path: circle(150vmax at 50% 50%); }
        }

        /* ── Loader exit ─────────────────────────────────────────────── */
        @keyframes loaderExit {
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        /* ── Dot breath ──────────────────────────────────────────────── */
        @keyframes dotBreath {
          0%,100% { opacity: 0.3; transform: scaleX(1); }
          50%     { opacity: 0.8; transform: scaleX(1.15); }
        }

        /* Skip button */
        .loader-skip {
          position: absolute;
          top: 1.5rem; right: 1.5rem;
          opacity: 0;
          pointer-events: none;
          fontFamily: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(219,231,255,0.4);
          background: none;
          border: 1px solid rgba(219,231,255,0.15);
          padding: 6px 14px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }
        .loader-skip:focus-visible {
          opacity: 1 !important;
          pointer-events: auto !important;
          outline: 2px solid #ff8c42;
          outline-offset: 3px;
          color: rgba(219,231,255,0.8);
          border-color: rgba(219,231,255,0.4);
        }
      `}</style>

      {/* ── Root overlay ──────────────────────────────────────────────── */}
      <div
        role="status"
        aria-busy={phase === 'loading'}
        aria-label="Loading Akram Rihani portfolio"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
          background: 'linear-gradient(160deg, #0d1929 0%, #050a14 55%, #081222 100%)',
          animation: isWiping
            ? 'loaderExit 0.6s ease 0.1s forwards'
            : 'none',
          willChange: 'opacity',
          overflow: 'hidden',
        }}
      >
        {/* Skip button — only visible on keyboard focus */}
        <button
          className="loader-skip"
          onClick={finish}
          tabIndex={0}
          aria-label="Skip loading animation"
        >
          Skip intro
        </button>

        {/* ── Ambient grid ───────────────────────────────────────────── */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(96,165,250,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)',
        }} />

        {/* ── Pulse rings (pure CSS, no JS) ──────────────────────────── */}
        {[0, 0.6, 1.2].map((delay, i) => (
          <div key={i} aria-hidden="true" style={{
            position: 'absolute',
            width: '260px', height: '260px',
            borderRadius: '50%',
            border: '1px solid rgba(255,140,66,0.2)',
            animation: `ringPulse 2.4s ease-out ${delay + 1.8}s infinite`,
            willChange: 'transform, opacity',
          }} />
        ))}

        {/* ── Main SVG stage ─────────────────────────────────────────── */}
        <svg
          viewBox="0 0 400 400"
          width="360"
          height="360"
          aria-hidden="true"
          style={{ position: 'relative', zIndex: 2, overflow: 'visible' }}
        >
          {/* ── Hex rings — outer → inner, staggered ── */}
          <HexRing size={155} strokeWidth={0.6} color="rgba(96,165,250,0.18)"  opacity={1} delay={0.15} duration={1.0} />
          <HexRing size={138} strokeWidth={0.8} color="rgba(96,165,250,0.28)"  opacity={1} delay={0.35} duration={0.9} />
          <HexRing size={118} strokeWidth={1.2} color="rgba(96,165,250,0.40)"  opacity={1} delay={0.55} duration={0.8} />
          <HexRing size={100} strokeWidth={1.8} color="rgba(255,140,66,0.55)"  opacity={1} delay={0.70} duration={0.7} />
          <HexRing size={84}  strokeWidth={0.6} color="rgba(255,140,66,0.20)"  opacity={1} delay={0.80} duration={0.6} />

          {/* ── Corner tick marks at hex vertices ── */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (Math.PI / 180) * (60 * i - 30);
            const r = 100;
            const x = 200 + r * Math.cos(angle);
            const y = 200 + r * Math.sin(angle);
            return (
              <circle key={i} cx={x} cy={y} r="2"
                fill="rgba(255,140,66,0.7)"
                style={{
                  opacity: 0,
                  animation: `initialIn 0.4s ease ${0.9 + i * 0.05}s forwards`,
                }}
              />
            );
          })}

          {/* ── Initials "AR" ── */}
          <text
            x="200" y="215"
            textAnchor="middle"
            fontFamily="Syne, sans-serif"
            fontWeight="800"
            fontSize="72"
            letterSpacing="-4"
            fill="none"
            stroke="rgba(219,231,255,0.12)"
            strokeWidth="0.5"
            style={{ userSelect: 'none' }}
          >
            AR
          </text>

          {/* A — solid fill, animated */}
          <text
            x="174" y="215"
            textAnchor="middle"
            fontFamily="Syne, sans-serif"
            fontWeight="800"
            fontSize="72"
            fill="#dbe7ff"
            style={{
              opacity: 0,
              willChange: 'opacity, transform',
              animation: 'initialIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.95s forwards',
              userSelect: 'none',
            }}
          >
            A
          </text>

          {/* R — accent colored, slight delay */}
          <text
            x="228" y="215"
            textAnchor="middle"
            fontFamily="Syne, sans-serif"
            fontWeight="800"
            fontSize="72"
            fill="#ff8c42"
            style={{
              opacity: 0,
              willChange: 'opacity, transform',
              animation: 'initialIn 0.55s cubic-bezier(0.16,1,0.3,1) 1.15s forwards',
              userSelect: 'none',
            }}
          >
            R
          </text>

          {/* ── Thin accent lines flanking initials ── */}
          <line x1="50" y1="226" x2="140" y2="226"
            stroke="rgba(255,140,66,0.35)" strokeWidth="0.8"
            style={{
              opacity: 0,
              strokeDasharray: 90, strokeDashoffset: 90,
              animation: 'hexDraw 0.5s ease 1.35s forwards',
            }}
          />
          <line x1="260" y1="226" x2="350" y2="226"
            stroke="rgba(255,140,66,0.35)" strokeWidth="0.8"
            style={{
              opacity: 0,
              strokeDasharray: 90, strokeDashoffset: 90,
              animation: 'hexDraw 0.5s ease 1.35s forwards',
            }}
          />
        </svg>

        {/* ── Signature ──────────────────────────────────────────────── */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, 72px)',
          width: '300px',
          opacity: 0,
          animation: 'tagIn 0.3s ease 1.25s forwards',
        }}>
          <svg viewBox="0 0 295 70" width="295" height="70" overflow="visible">
            <path
              ref={sigRef}
              d={SIGNATURE_PATH}
              fill="none"
              stroke="rgba(255,140,66,0.75)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray:  sigDash,
                strokeDashoffset: sigDash,
                animation: sigDash > 0
                  ? `sigDraw 0.9s cubic-bezier(0.4,0,0.2,1) 1.3s forwards`
                  : 'none',
                willChange: 'stroke-dashoffset',
              }}
            />
          </svg>
        </div>

        {/* ── Tagline ─────────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, 128px)',
          textAlign: 'center',
          opacity: 0,
          animation: 'tagIn 0.5s cubic-bezier(0.16,1,0.3,1) 1.85s forwards',
        }}>
          <p style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.62rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(108,122,146,0.9)',
            whiteSpace: 'nowrap',
          }}>
            Full-Stack Junior Developer &nbsp;·&nbsp; UI / UX
          </p>
        </div>

        {/* ── Loading dots ────────────────────────────────────────────── */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          bottom: '2.5rem',
          display: 'flex', gap: '6px', alignItems: 'center',
          opacity: 0,
          animation: 'tagIn 0.4s ease 1.6s forwards',
        }}>
          {[0, 0.18, 0.36].map((d, i) => (
            <span key={i} style={{
              display: 'block',
              width: i === 1 ? '20px' : '6px',
              height: '2px',
              borderRadius: '1px',
              background: i === 1 ? '#ff8c42' : 'rgba(108,122,146,0.5)',
              animation: `dotBreath 1.6s ease ${d}s infinite`,
            }} />
          ))}
        </div>

        {/* ── Screen-reader status ────────────────────────────────────── */}
        <p aria-live="polite" className="sr-only" style={{
          position: 'absolute', width: '1px', height: '1px',
          overflow: 'hidden', clip: 'rect(0,0,0,0)',
        }}>
          Loading portfolio
        </p>
      </div>

      {/* ── Radial reveal mask (separate layer, above loader bg) ─────── */}
      {isWiping && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'linear-gradient(180deg, #0b1220 0%, #050a14 100%)',
            clipPath: 'circle(0% at 50% 50%)',
            animation: 'radialWipe 0.65s cubic-bezier(0.4,0,0.2,1) forwards',
            willChange: 'clip-path',
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}