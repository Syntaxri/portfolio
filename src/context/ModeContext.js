/**
 * ModeContext.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Global portfolio mode state — hardened per spec:
 *
 *  • Validates localStorage value before trusting it (handles corruption)
 *  • Falls back to selection screen if value is missing / invalid
 *  • setMode() updates state + localStorage atomically
 *  • CSS variables applied to :root whenever mode changes
 *  • isReady prevents flash of wrong state on first render
 *  • switchMode() resets without breaking component state (no hard reload)
 */
"use client";
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { MODES } from '../lib/modeContent';

const STORAGE_KEY   = 'portfolioMode';
const VALID_MODES   = Object.keys(MODES); // ['developer', 'photography']

const ModeContext = createContext(null);

/**
 * Safely read + validate localStorage.
 * Returns the stored mode string if valid, null otherwise.
 * Catches JSON errors, tampered values, and storage access failures.
 */
function readPersistedMode() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;                         // key absent
    const val = raw.trim().replace(/"/g, '');      // strip accidental JSON quotes
    if (!VALID_MODES.includes(val)) {
      // Value present but invalid — clear it to prevent infinite bad state
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return val;
  } catch {
    // localStorage blocked (private mode, security policy, etc.)
    return null;
  }
}

function persistMode(mode) {
  try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* silent */ }
}

function applyTheme(mode) {
  if (!mode || !MODES[mode]) return;
  const theme = MODES[mode].theme;
  const root  = document.documentElement.style;
  root.setProperty('--accent',  theme.accent);
  root.setProperty('--bg',      theme.bg);
  root.setProperty('--surface', theme.surface);
  // Also expose raw RGB for box-shadow calculations
  const hex = theme.accent.replace('#', '');
  const r   = parseInt(hex.slice(0,2), 16);
  const g   = parseInt(hex.slice(2,4), 16);
  const b   = parseInt(hex.slice(4,6), 16);
  root.setProperty('--accent-rgb', `${r},${g},${b}`);
}

export function ModeProvider({ children }) {
  // null = not yet chosen (show selector), string = active mode
  const [mode,    setModeState] = useState(null);
  const [isReady, setIsReady]   = useState(false);

  // ── Read + validate persisted choice on mount ────────────────────────────
  useEffect(() => {
    const saved = readPersistedMode();
    if (saved) {
      setModeState(saved);
      applyTheme(saved);
    }
    setIsReady(true); // always set ready so selector can render if no valid mode
  }, []);

  // ── Apply CSS variables whenever mode changes ────────────────────────────
  useEffect(() => {
    if (mode) applyTheme(mode);
  }, [mode]);

  /**
   * setMode — public API for ModeSelector and ModeSwitcher
   * Validates the value before accepting it.
   */
  const setMode = useCallback((m) => {
    if (!VALID_MODES.includes(m)) {
      console.warn(`[ModeContext] Invalid mode: "${m}". Expected one of: ${VALID_MODES.join(', ')}`);
      return;
    }
    setModeState(m);
    persistMode(m);
  }, []);

  /**
   * clearMode — resets to selector screen (for testing / edge cases)
   */
  const clearMode = useCallback(() => {
    setModeState(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* silent */ }
  }, []);

  const content = useMemo(() => (mode ? MODES[mode] : null), [mode]);

  return (
    <ModeContext.Provider value={{ mode, content, setMode, clearMode, isReady, validModes: VALID_MODES }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('[useMode] Must be called inside <ModeProvider>');
  return ctx;
}