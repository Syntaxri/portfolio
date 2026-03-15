/**
 * ModeSwitcher.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Seamless mode toggle in the navbar.
 *
 * UX flow:
 *  1. Shows the other mode's icon + label
 *  2. First click → shows confirmation state "Switch? ✓" for 2.5s
 *  3. Clicking again confirms → updates context + localStorage, site re-renders
 *     in the new mode without a hard page reload
 *  4. Timeout expires → reverts to idle state (no accidental switches)
 *
 * The site re-renders via React context propagation — component state is NOT
 * broken because we never call window.location.reload().
 */
"use client";
import { useState, useEffect, useRef } from 'react';
import { useMode } from '../context/ModeContext';

const MODE_META = {
  developer:   { icon: '⌨', label: 'Dev Mode',   accent: '#ff6b35' },
  photography: { icon: '⬡', label: 'Photo Mode', accent: '#d4a853' },
};

export default function ModeSwitcher() {
  const { mode, setMode }    = useMode();
  const [confirm, setConfirm] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timeoutRef            = useRef(null);

  const other      = mode === 'developer' ? 'photography' : 'developer';
  const otherMeta  = MODE_META[other];
  const currentMeta = MODE_META[mode] || MODE_META.developer;

  // Clear pending confirmation on unmount or mode change
  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [mode]);

  const handleClick = () => {
    if (!confirm) {
      // First click — enter confirmation state
      setConfirm(true);
      timeoutRef.current = setTimeout(() => setConfirm(false), 2500);
    } else {
      // Second click — confirm switch
      clearTimeout(timeoutRef.current);
      setConfirm(false);
      setMode(other); // updates context + localStorage, React re-renders
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
    if (e.key === 'Escape' && confirm) { clearTimeout(timeoutRef.current); setConfirm(false); }
  };

  if (!mode) return null;

  const displayColor = confirm ? otherMeta.accent : 'var(--muted)';

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={confirm ? `Confirm switch to ${other} mode` : `Switch to ${other} mode`}
      aria-label={confirm ? `Confirm switch to ${other} portfolio` : `Switch to ${other} portfolio`}
      aria-pressed={confirm}
      style={{
        fontFamily: 'DM Mono, monospace',
        fontSize:   '0.68rem',
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        padding:    '7px 14px',
        borderRadius: '20px',
        border: `1px solid ${confirm ? otherMeta.accent : hovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)'}`,
        background:  confirm ? `${otherMeta.accent}15` : hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        color:       displayColor,
        cursor:      'pointer',
        whiteSpace:  'nowrap',
        display:     'flex',
        alignItems:  'center',
        gap:         '6px',
        transition:  'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        transform:   hovered ? 'translateY(-1px)' : 'translateY(0)',
        outline:     'none',
        flexShrink:  0,
      }}
    >
      <span style={{
        fontSize: '0.75rem',
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        display: 'inline-block',
        transform: confirm ? 'rotate(180deg) scale(1.2)' : 'rotate(0) scale(1)',
      }}>
        {confirm ? otherMeta.icon : otherMeta.icon}
      </span>
      <span>
        {confirm ? 'Confirm →' : otherMeta.label}
      </span>
    </button>
  );
}