/**
 * ModeSelector.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fullscreen mode selector with photography password gate.
 *
 * Flow:
 *  1. Show two cards: Developer | Photography
 *  2. Developer → setMode('developer') directly
 *  3. Photography → slide to password screen
 *  4. Correct password (case-insensitive) → setMode('photography')
 *  5. Wrong password → shake animation + error message + retry
 */
"use client";
import { useState, useEffect, useRef } from 'react';
import { useMode } from '../context/ModeContext';

const PHOTO_PASSWORD = 'photography will never die';

// ── Floating particle dots for atmosphere ─────────────────────────────────
function FloatingDots({ color }) {
  return (
    <div aria-hidden="true" style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${4 + (i % 4) * 3}px`,
          height: `${4 + (i % 4) * 3}px`,
          borderRadius: '50%',
          background: color,
          opacity: 0.12 + (i % 5) * 0.04,
          left: `${(i * 37 + 11) % 90 + 5}%`,
          top:  `${(i * 53 + 17) % 80 + 10}%`,
          animation: `floatDot ${3 + (i % 4)}s ease-in-out ${(i * 0.4) % 2}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

// ── Mode card ──────────────────────────────────────────────────────────────
function ModeCard({ id, icon, title, subtitle, accent, description, onSelect, visible, delay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onSelect(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Select ${title} mode`}
      style={{
        flex: 1, minHeight: '340px',
        border: `1px solid ${hovered ? accent : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '16px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2rem',
        background: hovered
          ? `linear-gradient(135deg, ${accent}12 0%, rgba(10,10,8,0.95) 100%)`
          : 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
        transitionDelay: delay,
        outline: 'none',
        boxShadow: hovered
          ? `0 20px 60px ${accent}20, 0 0 0 1px ${accent}30`
          : '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Glow blob */}
      <div style={{
        position:'absolute', width:'300px', height:'300px', borderRadius:'50%',
        background: accent, filter:'blur(80px)',
        opacity: hovered ? 0.15 : 0.05,
        transition:'opacity 0.5s ease', pointerEvents:'none',
      }} />

      {/* Top accent bar */}
      <div style={{
        position:'absolute', top:0, left:'20%', right:'20%', height:'2px',
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: hovered ? 1 : 0.3,
        transition:'opacity 0.3s ease',
        borderRadius:'0 0 2px 2px',
      }} />

      {/* Icon */}
      <div style={{
        fontSize: '3rem', marginBottom: '1.5rem',
        transform: hovered ? 'scale(1.2) translateY(-6px)' : 'scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        filter: hovered ? `drop-shadow(0 0 20px ${accent})` : 'none',
        position: 'relative', zIndex: 1,
      }}>{icon}</div>

      {/* Title */}
      <h2 style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 800,
        fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
        letterSpacing: '-0.04em', lineHeight: 1,
        color: hovered ? '#fff' : 'rgba(255,255,255,0.8)',
        marginBottom: '0.8rem',
        transition: 'color 0.3s ease', position: 'relative', zIndex: 1,
      }}>{title}</h2>

      {/* Description */}
      <p style={{
        fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        color: hovered ? accent : 'rgba(255,255,255,0.3)',
        maxWidth: '220px', textAlign: 'center', lineHeight: 1.7,
        transition: 'color 0.3s ease', position: 'relative', zIndex: 1,
        marginBottom: '0.5rem',
      }}>{subtitle}</p>

      <p style={{
        fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.2)', textAlign: 'center',
        maxWidth: '200px', lineHeight: 1.6, position: 'relative', zIndex: 1,
        marginTop: '0.3rem',
      }}>{description}</p>

      {/* Enter cue */}
      <div style={{
        marginTop: '1.8rem', display: 'flex', alignItems: 'center', gap: '8px',
        fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: accent, position: 'relative', zIndex: 1,
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.3s ease',
      }}>
        {id === 'photography' ? '🔒 Enter with password' : 'Enter →'}
      </div>
    </button>
  );
}

// ── Password gate screen ───────────────────────────────────────────────────
function PasswordGate({ onSuccess, onBack, visible }) {
  const [value,   setValue]   = useState('');
  const [error,   setError]   = useState('');
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hint,    setHint]    = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) setTimeout(() => inputRef.current?.focus(), 400);
  }, [visible]);

  const attempt = () => {
    if (!value.trim()) { triggerError('Enter the password to continue.'); return; }
    setLoading(true);
    // Small delay for UX feel
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
    setError(''); // clear error on typing
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(60px)',
      transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      {/* Artistic photography bg blur */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'60%', height:'60%', borderRadius:'50%', background:'radial-gradient(circle, rgba(212,168,83,0.12) 0%, transparent 70%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'50%', height:'50%', borderRadius:'50%', background:'radial-gradient(circle, rgba(212,100,83,0.08) 0%, transparent 70%)', filter:'blur(60px)' }} />
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position:'absolute', top:'2rem', left:'2rem',
          background:'none', border:'1px solid rgba(255,255,255,0.12)',
          color:'rgba(255,255,255,0.5)', cursor:'pointer',
          padding:'8px 16px', borderRadius:'6px',
          fontFamily:'DM Mono, monospace', fontSize:'0.68rem',
          letterSpacing:'0.08em', textTransform:'uppercase',
          transition:'all 0.2s ease', outline:'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; e.currentTarget.style.color='#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; }}
      >
        ← Back
      </button>

      {/* Lock icon */}
      <div style={{
        fontSize:'2.5rem', marginBottom:'1.5rem',
        animation: loading ? 'spin 1s linear infinite' : 'none',
        transition:'filter 0.3s ease',
        filter: error ? 'drop-shadow(0 0 12px #ff4444)' : 'drop-shadow(0 0 12px rgba(212,168,83,0.5))',
      }}>
        {loading ? '⟳' : error ? '🔒' : '🔓'}
      </div>

      {/* Heading */}
      <h2 style={{
        fontFamily:'Syne, sans-serif', fontWeight:800,
        fontSize:'clamp(1.6rem,4vw,2.4rem)', letterSpacing:'-0.04em',
        color:'#fff', marginBottom:'0.6rem', textAlign:'center',
      }}>
        Photography World
      </h2>
      <p style={{
        fontFamily:'DM Mono, monospace', fontSize:'0.72rem',
        letterSpacing:'0.08em', textTransform:'uppercase',
        color:'rgba(212,168,83,0.7)', marginBottom:'2.5rem',
        textAlign:'center',
      }}>
        This world is password protected
      </p>

      {/* Input */}
      <div style={{
        width:'100%', maxWidth:'400px',
        animation: shaking ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none',
      }}>
        <div style={{ position:'relative' }}>
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(''); }}
            onKeyDown={handleKey}
            placeholder="Enter the password…"
            aria-label="Photography mode password"
            aria-describedby={error ? 'pw-error' : undefined}
            style={{
              width:'100%', padding:'16px 50px 16px 20px',
              background:'rgba(255,255,255,0.05)',
              border:`1px solid ${error ? '#ff4444' : 'rgba(255,255,255,0.15)'}`,
              borderRadius:'10px', outline:'none',
              fontFamily:'DM Mono, monospace', fontSize:'0.9rem',
              color:'#fff', letterSpacing:'0.12em',
              transition:'border-color 0.2s ease',
              boxSizing:'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = error ? '#ff4444' : 'rgba(212,168,83,0.6)'; e.target.style.boxShadow = `0 0 0 3px ${error ? '#ff444418' : 'rgba(212,168,83,0.08)'}`; }}
            onBlur={e => { e.target.style.borderColor = error ? '#ff4444' : 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none'; }}
          />
          {/* Submit arrow */}
          <button
            onClick={attempt}
            aria-label="Submit password"
            style={{
              position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)',
              background:'none', border:'none', cursor:'pointer',
              color:'rgba(212,168,83,0.7)', fontSize:'1.1rem',
              padding:'4px', outline:'none', transition:'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color='#d4a853'}
            onMouseLeave={e => e.currentTarget.style.color='rgba(212,168,83,0.7)'}
          >→</button>
        </div>

        {/* Error */}
        {error && (
          <p id="pw-error" role="alert" style={{
            fontFamily:'DM Mono, monospace', fontSize:'0.68rem',
            letterSpacing:'0.06em', color:'#ff6b6b',
            marginTop:'10px', textAlign:'center',
          }}>
            ⚠ {error}
          </p>
        )}

        {/* Submit button */}
        <button
          onClick={attempt}
          disabled={loading}
          style={{
            width:'100%', marginTop:'14px',
            padding:'14px', borderRadius:'10px', border:'none',
            background: loading ? 'rgba(212,168,83,0.3)' : '#d4a853',
            color: loading ? 'rgba(255,255,255,0.5)' : '#0d0c0a',
            fontFamily:'DM Mono, monospace', fontSize:'0.78rem',
            letterSpacing:'0.1em', textTransform:'uppercase',
            cursor: loading ? 'wait' : 'pointer',
            fontWeight:600, transition:'all 0.2s ease',
            transform: loading ? 'none' : undefined,
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.background='#e0b560'; e.currentTarget.style.transform='translateY(-1px)'; } }}
          onMouseLeave={e => { e.currentTarget.style.background=loading?'rgba(212,168,83,0.3)':'#d4a853'; e.currentTarget.style.transform='none'; }}
        >
          {loading ? 'Verifying…' : 'Enter Photography World'}
        </button>

        {/* Hint toggle */}
        <div style={{ textAlign:'center', marginTop:'1.2rem' }}>
          <button
            onClick={() => setHint(h => !h)}
            style={{
              background:'none', border:'none', cursor:'pointer',
              fontFamily:'DM Mono, monospace', fontSize:'0.62rem',
              letterSpacing:'0.06em', textTransform:'uppercase',
              color:'rgba(255,255,255,0.25)', outline:'none',
              transition:'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.5)'}
            onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.25)'}
          >
            {hint ? '▲ Hide hint' : '▼ Need a hint?'}
          </button>
          {hint && (
            <p style={{
              fontFamily:'DM Mono, monospace', fontSize:'0.65rem',
              letterSpacing:'0.06em', color:'rgba(212,168,83,0.5)',
              marginTop:'8px', fontStyle:'italic',
              animation:'fadeIn 0.3s ease',
            }}>
              "A famous quote about photography…"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ModeSelector ──────────────────────────────────────────────────────
export default function ModeSelector() {
  const { setMode }         = useMode();
  const [visible,  setVisible]  = useState(false);   // entrance animation
  const [screen,   setScreen]   = useState('select'); // 'select' | 'password'
  const [exiting,  setExiting]  = useState(false);

  // Entrance
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
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(10,10,8,0.97)',
      backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column',
      opacity: exiting ? 0 : 1,
      transform: exiting ? 'scale(1.03)' : 'scale(1)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      overflow: 'hidden',
    }}>
      <FloatingDots color="#ff6b35" />

      <style>{`
        @keyframes floatDot {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-18px) scale(1.2); }
        }
        @keyframes shake {
          10%,90%  { transform: translateX(-2px); }
          20%,80%  { transform: translateX(4px); }
          30%,50%,70% { transform: translateX(-6px); }
          40%,60%  { transform: translateX(6px); }
          100%     { transform: translateX(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Select screen ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        opacity: screen === 'select' ? 1 : 0,
        pointerEvents: screen === 'select' ? 'auto' : 'none',
        transform: screen === 'select' ? 'translateX(0)' : 'translateX(-60px)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '2.5rem 2rem 2rem', textAlign: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-16px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <p style={{
            fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'1.1rem',
            letterSpacing:'-0.03em', color:'rgba(255,255,255,0.9)',
          }}>
            <span style={{color:'#ff6b35'}}>{'{'}</span>
            {' '}Akram Rihani{' '}
            <span style={{color:'#ff6b35'}}>{'}'}</span>
          </p>
          <p style={{
            fontFamily:'DM Mono, monospace', fontSize:'0.7rem',
            letterSpacing:'0.14em', textTransform:'uppercase',
            color:'rgba(255,255,255,0.3)', marginTop:'0.6rem',
          }}>
            Choose your experience
          </p>
        </div>

        {/* Cards */}
        <div style={{
          flex:1, display:'flex', alignItems:'center', justifyContent:'center',
          padding:'1rem 2rem 2rem', gap:'1.5rem',
        }}
        className="mode-cards"
        >
          <ModeCard
            id="developer"
            icon="⌨"
            title="Developer"
            subtitle="Systems & digital products"
            description="Full-stack engineering, open source, and architecture"
            accent="#ff6b35"
            onSelect={handleSelect}
            visible={visible}
            delay="0.15s"
          />
          <ModeCard
            id="photography"
            icon="📷"
            title="Photography"
            subtitle="Visual stories & light"
            description="Landscapes, cities, and moments — password protected"
            accent="#d4a853"
            onSelect={handleSelect}
            visible={visible}
            delay="0.28s"
          />
        </div>

        {/* Footer */}
        <p style={{
          fontFamily:'DM Mono, monospace', fontSize:'0.6rem',
          letterSpacing:'0.08em', textTransform:'uppercase',
          color:'rgba(255,255,255,0.15)', textAlign:'center',
          paddingBottom:'1.5rem',
          opacity: visible ? 1 : 0, transition:'opacity 0.5s ease 0.4s',
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

      <style>{`
        .mode-cards { flex-direction: row; }
        @media (max-width: 640px) {
          .mode-cards { flex-direction: column !important; padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
}