"use client";
import { useState, useEffect, useRef } from 'react';
import { useMode } from '../context/ModeContext';

const PHOTO_PASSWORD = 'photography will never die';

function FloatingDots({ color }) {
  return (
    <div aria-hidden="true" style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${3 + (i % 3) * 2}px`,
          height: `${3 + (i % 3) * 2}px`,
          borderRadius: '50%',
          background: color,
          opacity: 0.08 + (i % 4) * 0.03,
          left: `${(i * 37 + 11) % 90 + 5}%`,
          top:  `${(i * 53 + 17) % 80 + 10}%`,
          animation: `floatDot ${3 + (i % 4)}s ease-in-out ${(i * 0.4) % 2}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

// ── Mode card — fully responsive with hover (desktop) + press (mobile) ────
function ModeCard({ id, icon, title, subtitle, description, accent, onSelect, visible, delay }) {
  const [active, setActive] = useState(false); // covers both hover and press

  return (
    <button
      onClick={() => onSelect(id)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(true)}   // keep active on desktop after click
      onTouchStart={() => setActive(true)}
      onTouchEnd={() => setTimeout(() => setActive(false), 300)}
      aria-label={`Select ${title} mode`}
      style={{
        flex: '1 1 0',
        minWidth: 0,
        minHeight: 'clamp(160px, 28vw, 280px)',
        border: `1px solid ${active ? accent : 'rgba(96,165,250,0.14)'}`,
        borderRadius: '14px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(1.2rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)',
        background: active
          ? `linear-gradient(135deg, ${accent}14 0%, rgba(5,10,20,0.98) 100%)`
          : 'rgba(11,20,38,0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0) scale(1)'
          : 'translateY(30px) scale(0.96)',
        transitionDelay: visible ? delay : '0s',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: active
          ? `0 20px 60px ${accent}25, 0 0 0 1px ${accent}35`
          : '0 2px 16px rgba(0,0,0,0.25)',
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: 'absolute', width: '260px', height: '260px', borderRadius: '50%',
        background: accent, filter: 'blur(80px)',
        opacity: active ? 0.16 : 0.05,
        transition: 'opacity 0.5s ease', pointerEvents: 'none',
      }} />

      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px',
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: active ? 1 : 0.3,
        transition: 'opacity 0.3s ease',
      }} />

      {/* Icon */}
      <div style={{
        fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
        marginBottom: 'clamp(0.6rem, 2vw, 1.2rem)',
        transform: active ? 'scale(1.2) translateY(-6px)' : 'scale(1) translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease',
        filter: active ? `drop-shadow(0 0 18px ${accent})` : 'none',
        position: 'relative', zIndex: 1,
        lineHeight: 1,
      }}>{icon}</div>

      {/* Title */}
      <h2 style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 800,
        fontSize: 'clamp(1.2rem, 3.5vw, 2rem)',
        letterSpacing: '-0.03em', lineHeight: 1,
        color: active ? '#fff' : 'rgba(255,255,255,0.8)',
        marginBottom: 'clamp(0.4rem, 1.5vw, 0.7rem)',
        transition: 'color 0.25s ease',
        position: 'relative', zIndex: 1,
      }}>{title}</h2>

      {/* Subtitle */}
      <p style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: 'clamp(0.6rem, 1.5vw, 0.72rem)',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        color: active ? accent : 'rgba(255,255,255,0.35)',
        maxWidth: '200px', textAlign: 'center', lineHeight: 1.6,
        transition: 'color 0.25s ease',
        position: 'relative', zIndex: 1,
        marginBottom: '0.3rem',
      }}>{subtitle}</p>

      {/* Description */}
      <p className="ms-card-desc" style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: 'clamp(0.55rem, 1.2vw, 0.63rem)',
        color: 'rgba(255,255,255,0.2)', textAlign: 'center',
        maxWidth: '180px', lineHeight: 1.5,
        position: 'relative', zIndex: 1,
        marginTop: '0.2rem',
      }}>{description}</p>

      {/* Enter cue — slides up on hover/press */}
      <div style={{
        marginTop: 'clamp(0.8rem, 2vw, 1.4rem)',
        display: 'flex', alignItems: 'center', gap: '6px',
        fontFamily: 'DM Mono, monospace',
        fontSize: 'clamp(0.58rem, 1.3vw, 0.66rem)',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: accent, position: 'relative', zIndex: 1,
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {id === 'photography' ? '🔒 Password required' : 'Enter →'}
      </div>
    </button>
  );
}

// ── Password gate — scrollable on small screens ────────────────────────────
function PasswordGate({ onSuccess, onBack, visible }) {
  const [value,   setValue]   = useState('');
  const [error,   setError]   = useState('');
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hint,    setHint]    = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) setTimeout(() => inputRef.current?.focus(), 450);
  }, [visible]);

  const attempt = () => {
    if (!value.trim()) { triggerError('Enter the password to continue.'); return; }
    setLoading(true);
    setTimeout(() => {
      if (value.trim().toLowerCase() === PHOTO_PASSWORD) {
        onSuccess();
      } else {
        setLoading(false);
        triggerError('Wrong password. Try again.');
        setValue('');
      }
    }, 600);
  };

  const triggerError = (msg) => {
    setError(msg);
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') attempt();
    if (e.key === 'Escape') onBack();
    if (error) setError('');
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      /* Scrollable container — critical for small phones with keyboards open */
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      padding: 'clamp(4rem, 12vw, 6rem) clamp(1rem, 5vw, 2rem) 2rem',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(50px)',
      transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      pointerEvents: visible ? 'auto' : 'none',
    }}>

      {/* Bg glows */}
      <div aria-hidden="true" style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'60%', height:'60%', borderRadius:'50%', background:'radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 70%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'50%', height:'50%', borderRadius:'50%', background:'radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)', filter:'blur(60px)' }} />
      </div>

      {/* Back button */}
      <button onClick={onBack} style={{
        position: 'fixed',
        top: 'clamp(0.8rem, 3vw, 1.5rem)',
        left: 'clamp(0.8rem, 3vw, 1.5rem)',
        zIndex: 10,
        background: 'rgba(5,10,20,0.8)', backdropFilter: 'blur(8px)',
        border: '1px solid var(--border)',
        color: 'var(--muted)', cursor: 'pointer',
        padding: '8px 14px', borderRadius: '6px',
        fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        transition: 'all 0.2s ease', outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}>← Back</button>

      {/* Content card */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '400px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Lock icon */}
        <div style={{
          fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
          marginBottom: 'clamp(0.8rem, 3vw, 1.5rem)',
          animation: loading ? 'spin 1s linear infinite' : 'none',
          filter: error
            ? 'drop-shadow(0 0 10px #ff4444)'
            : 'drop-shadow(0 0 10px rgba(212,168,83,0.5))',
        }}>
          {loading ? '⟳' : error ? '🔒' : '🔓'}
        </div>

        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
          letterSpacing: '-0.04em',
          color: 'var(--white)',
          marginBottom: '0.5rem', textAlign: 'center',
        }}>
          Photography World
        </h2>

        <p style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: 'clamp(0.62rem, 2vw, 0.72rem)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'rgba(212,168,83,0.7)',
          marginBottom: 'clamp(1.5rem, 5vw, 2.5rem)',
          textAlign: 'center',
        }}>
          Password protected
        </p>

        {/* Input group */}
        <div style={{
          width: '100%',
          animation: shaking ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none',
        }}>
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              type="password"
              value={value}
              onChange={e => { setValue(e.target.value); if (error) setError(''); }}
              onKeyDown={handleKey}
              placeholder="Enter the password…"
              aria-label="Photography mode password"
              aria-describedby={error ? 'pw-error' : undefined}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: 'clamp(12px, 3vw, 16px) 48px clamp(12px, 3vw, 16px) clamp(14px, 3vw, 20px)',
                background: 'rgba(11,20,38,0.85)',
                border: `1px solid ${error ? '#ff4444' : 'var(--border)'}`,
                borderRadius: '10px', outline: 'none',
                fontFamily: 'DM Mono, monospace',
                fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                color: 'var(--text)', letterSpacing: '0.1em',
                /* Prevent iOS zoom on focus (font-size must be >= 16px equivalent) */
                WebkitAppearance: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onFocus={e => {
                e.target.style.borderColor = error ? '#ff4444' : 'rgba(212,168,83,0.55)';
                e.target.style.boxShadow   = `0 0 0 3px ${error ? '#ff444415' : 'rgba(212,168,83,0.08)'}`;
              }}
              onBlur={e => {
                e.target.style.borderColor = error ? '#ff4444' : 'var(--border)';
                e.target.style.boxShadow   = 'none';
              }}
            />
            <button onClick={attempt} aria-label="Submit" style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(212,168,83,0.7)', fontSize: '1.1rem',
              padding: '4px', outline: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}>→</button>
          </div>

          {error && (
            <p id="pw-error" role="alert" style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.66rem',
              letterSpacing: '0.04em', color: '#ff6b6b',
              marginTop: '8px', textAlign: 'center',
              animation: 'fadeIn 0.25s ease',
            }}>⚠ {error}</p>
          )}

          <button
            onClick={attempt}
            disabled={loading}
            style={{
              width: '100%', marginTop: '12px',
              padding: 'clamp(12px, 3vw, 14px)',
              borderRadius: '10px', border: 'none',
              background: loading ? 'rgba(212,168,83,0.3)' : '#d4a853',
              color: loading ? 'rgba(255,255,255,0.5)' : '#050a14',
              fontFamily: 'DM Mono, monospace',
              fontSize: 'clamp(0.72rem, 2.5vw, 0.78rem)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: loading ? 'wait' : 'pointer',
              fontWeight: 600, transition: 'all 0.2s ease',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {loading ? 'Verifying…' : 'Enter Photography World'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem', paddingBottom: '1rem' }}>
            <button
              onClick={() => setHint(h => !h)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'DM Mono, monospace', fontSize: '0.62rem',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'var(--muted)', outline: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {hint ? '▲ Hide hint' : '▼ Need a hint?'}
            </button>
            {hint && (
              <p style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
                letterSpacing: '0.06em', color: 'rgba(212,168,83,0.5)',
                marginTop: '8px', fontStyle: 'italic',
                animation: 'fadeIn 0.3s ease',
              }}>
                "A famous quote I use about photography in my instagram posts…"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ModeSelector ──────────────────────────────────────────────────────
export default function ModeSelector() {
  const { setMode }              = useMode();
  const [visible,  setVisible]   = useState(false);
  const [screen,   setScreen]    = useState('select');
  const [exiting,  setExiting]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (id) => {
    if (id === 'developer') {
      exit(() => setMode('developer'));
    } else {
      setScreen('password');
    }
  };

  const handlePasswordSuccess = () => {
    exit(() => setMode('photography', { verified: true }));
  };

  const exit = (cb) => {
    setExiting(true);
    setTimeout(cb, 500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose portfolio experience"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'linear-gradient(180deg, #0b1220 0%, #050a14 100%)',
        display: 'flex', flexDirection: 'column',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.02)' : 'scale(1)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        overflow: 'hidden',
        /* Prevent pull-to-refresh on mobile */
        overscrollBehavior: 'none',
        touchAction: 'manipulation',
      }}
    >
      <FloatingDots color="#ff8c42" />

      <style>{`
        @keyframes floatDot {
          from { transform: translateY(0) scale(1); }
          to   { transform: translateY(-14px) scale(1.15); }
        }
        @keyframes shake {
          10%,90%  { transform: translateX(-2px); }
          20%,80%  { transform: translateX(4px); }
          30%,50%,70% { transform: translateX(-5px); }
          40%,60%  { transform: translateX(5px); }
          100%     { transform: translateX(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(-4px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── Responsive card layout ── */

        /* Desktop: side by side */
        .ms-cards-wrap {
          flex-direction: row;
          padding: clamp(0.5rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem) clamp(1rem, 3vw, 2rem);
          gap: clamp(0.75rem, 2vw, 1.5rem);
        }

        /* Tablet portrait & below: stack vertically */
        @media (max-width: 640px) {
          .ms-cards-wrap {
            flex-direction: column !important;
            padding: 0.5rem 1rem 1rem !important;
            gap: 0.75rem !important;
          }
        }

        /* Very small phones (< 380px): even tighter */
        @media (max-width: 380px) {
          .ms-cards-wrap {
            padding: 0.4rem 0.75rem 0.75rem !important;
            gap: 0.6rem !important;
          }
          /* Hide description text to save space */
          .ms-card-desc { display: none !important; }
        }

        /* Landscape phones: side by side but shorter */
        @media (max-height: 500px) and (orientation: landscape) {
          .ms-cards-wrap {
            flex-direction: row !important;
            padding: 0.4rem 1rem !important;
            gap: 0.75rem !important;
          }
        }

        /* Prevent iOS input zoom */
        @media (max-width: 768px) {
          input[type="password"] { font-size: 16px !important; }
        }
      `}</style>

      {/* ── Select screen ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        opacity: screen === 'select' ? 1 : 0,
        pointerEvents: screen === 'select' ? 'auto' : 'none',
        transform: screen === 'select' ? 'translateX(0)' : 'translateX(-50px)',
        transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* Header */}
        <div style={{
          padding: 'clamp(1.2rem, 4vw, 2.5rem) 1.5rem clamp(0.6rem, 2vw, 1rem)',
          textAlign: 'center', flexShrink: 0,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <p style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
            letterSpacing: '-0.03em', color: 'var(--white)',
          }}>
            <span style={{ color: 'var(--accent)' }}>{'{'}</span>
            {' '}Akram Rihani{' '}
            <span style={{ color: 'var(--accent)' }}>{'}'}</span>
          </p>
          <p style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: 'clamp(0.6rem, 2vw, 0.7rem)',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--muted)', marginTop: '0.4rem',
          }}>
            Choose your experience
          </p>
        </div>

        {/* Cards container */}
        <div
          className="ms-cards-wrap"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <ModeCard
            id="developer"
            icon="⌨"
            title="Developer"
            subtitle="Systems & digital products"
            description="Full-stack engineering, open source, architecture"
            accent="#ff8c42"
            onSelect={handleSelect}
            visible={visible}
            delay="0.12s"
          />
          <ModeCard
            id="photography"
            icon="📷"
            title="Photography"
            subtitle="Visual stories & light"
            description="Landscapes, cities, moments — password protected"
            accent="#d4a853"
            onSelect={handleSelect}
            visible={visible}
            delay="0.24s"
          />
        </div>

        {/* Footer hint */}
        <p style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: 'clamp(0.52rem, 1.5vw, 0.6rem)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.14)', textAlign: 'center',
          padding: 'clamp(0.6rem, 2vw, 1.2rem)',
          flexShrink: 0,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s ease 0.4s',
        }}>
          Your choice is saved — switch anytime from the nav
        </p>
      </div>

      {/* ── Password screen ── */}
      <PasswordGate
        visible={screen === 'password'}
        onSuccess={handlePasswordSuccess}
        onBack={() => setScreen('select')}
      />
    </div>
  );
}