/**
 * PasswordModal.js
 * Appears when a Dev mode user tries to switch to Photography.
 * Floats over the current page (does NOT replace it).
 */
"use client";
import { useState, useEffect, useRef } from 'react';
import { useMode } from '../context/ModeContext';

const PHOTO_PASSWORD = 'photography will never die';

export default function PasswordModal() {
  const { pendingPhotoSwitch, cancelPendingSwitch, setMode } = useMode();
  const [value,   setValue]   = useState('');
  const [error,   setError]   = useState('');
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (pendingPhotoSwitch) {
      setValue(''); setError('');
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [pendingPhotoSwitch]);

  // Close on ESC
  useEffect(() => {
    if (!pendingPhotoSwitch) return;
    const fn = e => { if (e.key === 'Escape') cancelPendingSwitch(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [pendingPhotoSwitch, cancelPendingSwitch]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = pendingPhotoSwitch ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [pendingPhotoSwitch]);

  const attempt = () => {
    if (!value.trim()) { triggerError('Please enter the password.'); return; }
    setLoading(true);
    setTimeout(() => {
      if (value.trim().toLowerCase() === PHOTO_PASSWORD) {
        setMode('photography', { verified: true });
      } else {
        setLoading(false);
        setValue('');
        triggerError('Incorrect password. Try again.');
      }
    }, 500);
  };

  const triggerError = (msg) => {
    setError(msg);
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  if (!pendingPhotoSwitch) return null;

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:translateY(-50%) scale(0.94); }
          to   { opacity:1; transform:translateY(-50%) scale(1); }
        }
        @keyframes shake {
          10%,90%  { transform:translateX(-2px); }
          20%,80%  { transform:translateX(4px); }
          30%,50%,70% { transform:translateX(-6px); }
          40%,60%  { transform:translateX(6px); }
          100%     { transform:translateX(0); }
        }
        @keyframes backdropIn {
          from { opacity:0; } to { opacity:1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={cancelPendingSwitch}
        aria-hidden="true"
        style={{
          position:'fixed', inset:0, zIndex:800,
          background:'rgba(0,0,0,0.7)',
          backdropFilter:'blur(8px)',
          animation:'backdropIn 0.3s ease',
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Photography mode password"
        style={{
          position:'fixed', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          zIndex:801,
          width:'min(420px,90vw)',
          background:'rgba(13,12,10,0.98)',
          border:'1px solid rgba(212,168,83,0.25)',
          borderRadius:'16px',
          padding:'2.5rem 2rem',
          boxShadow:'0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,83,0.1)',
          animation:'modalIn 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Glow */}
        <div aria-hidden="true" style={{
          position:'absolute', top:'-40px', left:'50%', transform:'translateX(-50%)',
          width:'200px', height:'200px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(212,168,83,0.15) 0%, transparent 70%)',
          filter:'blur(20px)', pointerEvents:'none',
        }} />

        {/* Close */}
        <button
          onClick={cancelPendingSwitch}
          aria-label="Close"
          style={{
            position:'absolute', top:'1rem', right:'1rem',
            background:'none', border:'1px solid rgba(255,255,255,0.1)',
            color:'rgba(255,255,255,0.4)', cursor:'pointer',
            width:'30px', height:'30px', borderRadius:'6px',
            fontSize:'0.85rem', display:'flex', alignItems:'center',
            justifyContent:'center', transition:'all 0.2s', outline:'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; e.currentTarget.style.color='#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='rgba(255,255,255,0.4)'; }}
        >✕</button>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'2rem', marginBottom:'0.8rem' }}>📷</div>
          <h2 style={{
            fontFamily:'Syne, sans-serif', fontWeight:800,
            fontSize:'1.4rem', letterSpacing:'-0.03em',
            color:'#fff', marginBottom:'0.5rem',
          }}>
            Photography World
          </h2>
          <p style={{
            fontFamily:'DM Mono, monospace', fontSize:'0.68rem',
            letterSpacing:'0.08em', textTransform:'uppercase',
            color:'rgba(212,168,83,0.6)',
          }}>
            Password required to enter
          </p>
        </div>

        {/* Input area */}
        <div style={{ animation: shaking ? 'shake 0.5s both' : 'none' }}>
          <div style={{ position:'relative' }}>
            <input
              ref={inputRef}
              type="password"
              value={value}
              onChange={e => { setValue(e.target.value); setError(''); }}
              onKeyDown={e => {
                if (e.key === 'Enter') attempt();
                if (e.key === 'Escape') cancelPendingSwitch();
              }}
              placeholder="Enter password…"
              aria-label="Password"
              style={{
                width:'100%', padding:'14px 48px 14px 16px',
                background:'rgba(255,255,255,0.05)',
                border:`1px solid ${error ? '#ff6b6b' : 'rgba(255,255,255,0.12)'}`,
                borderRadius:'8px', outline:'none',
                fontFamily:'DM Mono, monospace', fontSize:'0.88rem',
                color:'#fff', letterSpacing:'0.1em',
                transition:'border-color 0.2s ease, box-shadow 0.2s ease',
                boxSizing:'border-box',
              }}
              onFocus={e => {
                e.target.style.borderColor = error ? '#ff6b6b' : 'rgba(212,168,83,0.5)';
                e.target.style.boxShadow   = `0 0 0 3px ${error ? '#ff6b6b18' : 'rgba(212,168,83,0.08)'}`;
              }}
              onBlur={e => {
                e.target.style.borderColor = error ? '#ff6b6b' : 'rgba(255,255,255,0.12)';
                e.target.style.boxShadow   = 'none';
              }}
            />
            <button onClick={attempt} aria-label="Submit" style={{
              position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)',
              background:'none', border:'none', cursor:'pointer',
              color:'rgba(212,168,83,0.6)', fontSize:'1rem',
              outline:'none', transition:'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color='#d4a853'}
            onMouseLeave={e => e.currentTarget.style.color='rgba(212,168,83,0.6)'}
            >→</button>
          </div>

          {error && (
            <p role="alert" style={{
              fontFamily:'DM Mono, monospace', fontSize:'0.65rem',
              letterSpacing:'0.06em', color:'#ff6b6b',
              marginTop:'8px', textAlign:'center',
            }}>⚠ {error}</p>
          )}

          <button
            onClick={attempt}
            disabled={loading}
            style={{
              width:'100%', marginTop:'12px', padding:'13px',
              borderRadius:'8px', border:'none',
              background: loading ? 'rgba(212,168,83,0.3)' : '#d4a853',
              color: loading ? 'rgba(255,255,255,0.5)' : '#0d0c0a',
              fontFamily:'DM Mono, monospace', fontSize:'0.75rem',
              letterSpacing:'0.1em', textTransform:'uppercase',
              cursor: loading ? 'wait' : 'pointer',
              fontWeight:600, transition:'all 0.2s ease',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background='#e0b560'; e.currentTarget.style.transform='translateY(-1px)'; } }}
            onMouseLeave={e => { e.currentTarget.style.background = loading ? 'rgba(212,168,83,0.3)':'#d4a853'; e.currentTarget.style.transform='none'; }}
          >
            {loading ? 'Verifying…' : 'Enter Photography World'}
          </button>
        </div>
      </div>
    </>
  );
}