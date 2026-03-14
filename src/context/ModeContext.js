/**
 * ModeContext.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Global portfolio mode state.
 *
 * Provides:
 *  • mode          — 'developer' | 'photography' | null (not yet chosen)
 *  • content       — the full content object for the active mode
 *  • setMode(m)    — updates mode + persists to localStorage
 *  • isReady       — true once localStorage has been read (prevents flicker)
 */
"use client";
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MODES } from '../lib/modeContent';

const STORAGE_KEY = 'portfolioMode';

const ModeContext = createContext(null);

export function ModeProvider({ children }) {
  const [mode,    setModeState] = useState(null);
  const [isReady, setIsReady]   = useState(false);

  // Read persisted choice on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && MODES[saved]) setModeState(saved);
    } catch (_) {}
    setIsReady(true);
  }, []);

  // Apply CSS theme variables whenever mode changes
  useEffect(() => {
    if (!mode) return;
    const theme = MODES[mode].theme;
    const root  = document.documentElement;
    root.style.setProperty('--accent',  theme.accent);
    root.style.setProperty('--bg',      theme.bg);
    root.style.setProperty('--surface', theme.surface);
  }, [mode]);

  const setMode = (m) => {
    setModeState(m);
    try { localStorage.setItem(STORAGE_KEY, m); } catch (_) {}
  };

  const content = useMemo(() => mode ? MODES[mode] : null, [mode]);

  return (
    <ModeContext.Provider value={{ mode, content, setMode, isReady }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used inside ModeProvider');
  return ctx;
}