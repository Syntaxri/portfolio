/**
 * ModeSwitcher.js
 * Small navbar toggle that lets users switch between modes at any time.
 * Renders as a compact pill with the OTHER mode's icon + label.
 */
"use client";
import { useState } from 'react';
import { useMode } from '../context/ModeContext';

export default function ModeSwitcher() {
  const { mode, setMode } = useMode();
  const [hovered, setHovered] = useState(false);
  const [confirm, setConfirm] = useState(false);

  if (!mode) return null;

  const other      = mode === 'developer' ? 'photography' : 'developer';
  const otherLabel = mode === 'developer' ? '⬡ Photo'    : '⌨ Dev';
  const otherColor = mode === 'developer' ? '#d4a853'    : '#ff6b35';

  const handleClick = () => {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 2500);
      return;
    }
    setConfirm(false);
    setMode(other);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`Switch to ${other} mode`}
      aria-label={`Switch to ${other} portfolio`}
      style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.68rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '6px 14px',
        borderRadius: '20px',
        border: `1px solid ${confirm ? otherColor : 'rgba(255,255,255,0.15)'}`,
        background: confirm ? `${otherColor}18` : 'transparent',
        color: confirm ? otherColor : 'var(--muted)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
        outline: 'none',
        flexShrink: 0,
      }}
    >
      {confirm ? `Confirm →` : otherLabel}
    </button>
  );
}