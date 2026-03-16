/**
 * ModeSwitcher.js
 * Security rules:
 *  • Dev → Photo: calls setMode('photography') which triggers pendingPhotoSwitch
 *    → PasswordModal appears automatically from Layout
 *  • Photo → Dev: free switch, confirm pattern prevents accidents
 */
"use client";
import { useState, useRef, useEffect } from 'react';
import { useMode } from '../context/ModeContext';

const MODE_META = {
  developer:   { icon: '⌨', label: 'Dev Mode',   accent: '#ff6b35' },
  photography: { icon: '📷', label: 'Photo Mode', accent: '#d4a853' },
};

export default function ModeSwitcher() {
  const { mode, setMode }     = useMode();
  const [confirm, setConfirm] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timerRef              = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), [mode]);

  if (!mode) return null;

  const other     = mode === 'developer' ? 'photography' : 'developer';
  const otherMeta = MODE_META[other];
  const isGoingToPhoto = other === 'photography';

  const handleClick = () => {
    if (isGoingToPhoto) {
      // Dev → Photo: setMode will trigger pendingPhotoSwitch → PasswordModal
      // No confirm step needed — the password IS the confirmation
      setMode('photography'); // context blocks and sets pendingPhotoSwitch
      return;
    }
    // Photo → Dev: two-click confirm
    if (!confirm) {
      setConfirm(true);
      timerRef.current = setTimeout(() => setConfirm(false), 2500);
    } else {
      clearTimeout(timerRef.current);
      setConfirm(false);
      setMode('developer');
    }
  };

  const handleKey = e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
    if (e.key === 'Escape' && confirm) { clearTimeout(timerRef.current); setConfirm(false); }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKey}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={isGoingToPhoto ? 'Switch to Photography (password required)' : confirm ? 'Click again to confirm' : 'Switch to Developer mode'}
      aria-label={isGoingToPhoto ? 'Switch to photography portfolio (password required)' : 'Switch to developer portfolio'}
      style={{
        fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
        letterSpacing: '0.07em', textTransform: 'uppercase',
        padding: '7px 14px', borderRadius: '20px',
        border: `1px solid ${confirm ? otherMeta.accent : hovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)'}`,
        background: confirm ? `${otherMeta.accent}15` : hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        color: confirm ? otherMeta.accent : hovered ? 'var(--text)' : 'var(--muted)',
        cursor: 'pointer', whiteSpace: 'nowrap',
        display: 'flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-1px)' : 'none',
        outline: 'none', flexShrink: 0,
      }}
    >
      <span style={{ fontSize: '0.8rem' }}>{otherMeta.icon}</span>
      <span>
        {isGoingToPhoto
          ? '🔒 Photo'
          : confirm
          ? 'Confirm →'
          : otherMeta.label}
      </span>
    </button>
  );
}