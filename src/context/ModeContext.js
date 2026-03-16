/**
 * ModeContext.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Security rules:
 *  • Developer → Photography: requires password (blocks direct setMode call)
 *  • Photography → Developer: free switch
 *  • Photography mode is never auto-loaded without a verified session
 *  • Session verification stored separately from mode choice
 */
"use client";
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { MODES } from '../lib/modeContent';

const STORAGE_KEY          = 'portfolioMode';
const SESSION_VERIFIED_KEY = 'photoSessionVerified'; // tab-session flag
const VALID_MODES          = Object.keys(MODES);

const ModeContext = createContext(null);

function readPersistedMode() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const val = raw.trim().replace(/"/g, '');
    if (!VALID_MODES.includes(val)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    // Photography mode persisted but session not verified → treat as null
    // (forces password re-entry on new browser session)
    if (val === 'photography') {
      const sessionOk = sessionStorage.getItem(SESSION_VERIFIED_KEY);
      if (!sessionOk) return null;
    }
    return val;
  } catch {
    return null;
  }
}

function persistMode(mode) {
  try { localStorage.setItem(STORAGE_KEY, mode); } catch { }
}

function applyTheme(mode) {
  if (!mode || !MODES[mode]) return;
  const { accent, bg, surface } = MODES[mode].theme;
  const root = document.documentElement.style;
  root.setProperty('--accent',  accent);
  root.setProperty('--bg',      bg);
  root.setProperty('--surface', surface);
  const hex = accent.replace('#', '');
  root.setProperty('--accent-rgb',
    `${parseInt(hex.slice(0,2),16)},${parseInt(hex.slice(2,4),16)},${parseInt(hex.slice(4,6),16)}`
  );
}

export function ModeProvider({ children }) {
  const [mode,              setModeState]    = useState(null);
  const [isReady,           setIsReady]      = useState(false);
  // Controls whether the password modal appears when switching to photography
  const [pendingPhotoSwitch, setPendingPhotoSwitch] = useState(false);

  useEffect(() => {
    const saved = readPersistedMode();
    if (saved) { setModeState(saved); applyTheme(saved); }
    setIsReady(true);
  }, []);

  useEffect(() => { if (mode) applyTheme(mode); }, [mode]);

  /**
   * setMode — public API
   * Direct call with 'photography' only allowed from ModeSelector/password gate.
   * ModeSwitcher should use requestPhotoSwitch() instead.
   */
  const setMode = useCallback((m, { verified = false } = {}) => {
    if (!VALID_MODES.includes(m)) return;
    if (m === 'photography' && !verified) {
      // Trigger password gate instead of switching directly
      setPendingPhotoSwitch(true);
      return;
    }
    if (m === 'photography' && verified) {
      try { sessionStorage.setItem(SESSION_VERIFIED_KEY, '1'); } catch { }
    }
    setModeState(m);
    persistMode(m);
    setPendingPhotoSwitch(false);
  }, []);

  const clearMode = useCallback(() => {
    setModeState(null);
    try { localStorage.removeItem(STORAGE_KEY); sessionStorage.removeItem(SESSION_VERIFIED_KEY); } catch { }
  }, []);

  const cancelPendingSwitch = useCallback(() => setPendingPhotoSwitch(false), []);

  const content = useMemo(() => (mode ? MODES[mode] : null), [mode]);

  return (
    <ModeContext.Provider value={{
      mode, content, setMode, clearMode, isReady,
      pendingPhotoSwitch, cancelPendingSwitch, validModes: VALID_MODES,
    }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('[useMode] Must be inside <ModeProvider>');
  return ctx;
}