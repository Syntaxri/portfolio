/**
 * MusicPlayer.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Persistent background music player for Next.js App Router portfolio.
 *
 * Architecture:
 *  • Single HTMLAudioElement created once and stored in a module-level ref
 *    (outside React) — survives route changes, never creates duplicates.
 *  • Web Audio API GainNode for smooth fade-in/out on play/pause.
 *  • Autoplay policy: music waits for first user interaction anywhere on page,
 *    then starts if the user hasn't explicitly paused.
 *  • localStorage persistence: muted state + volume survive refreshes.
 *  • Fully accessible: keyboard nav, ARIA labels, focus-visible rings.
 *  • Minimal DOM: fixed bottom-left pill, ~56px tall — never obstructs content.
 *  • Animated waveform bars when playing; flat lines when paused.
 *
 * To swap music: replace the src values in AUDIO_SOURCES below.
 * Add your MP3/OGG files to /public/audio/ folder.
 *
 * MAINTENANCE:
 *  • Add new tracks by extending the TRACKS array and cycling with nextTrack().
 *  • Adjust FADE_DURATION_MS to taste for fade speed.
 *  • Adjust DEFAULT_VOLUME (0–1) for loudness.
 */
"use client";
import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Config ────────────────────────────────────────────────────────────────
const FADE_DURATION_MS = 800;   // ms for fade-in / fade-out
const DEFAULT_VOLUME   = 0.35;  // 0–1, intentionally quiet for background
const STORAGE_KEY_MUTE = 'akram_music_muted';
const STORAGE_KEY_VOL  = 'akram_music_volume';

/**
 * Audio sources — browser picks first format it supports.
 * Place files in /public/audio/
 * Free ambient/lo-fi tracks: https://pixabay.com/music/ or https://freemusicarchive.org
 *
 * Example:
 *   { ogg: '/audio/ambient.ogg', mp3: '/audio/ambient.mp3', label: 'Ambient Loop' }
 */
const TRACKS = [
  {
    // Placeholder — replace with your actual files
    mp3: '/audio/background.mp3',
    label: 'Quran Recitation',
  },
];

// ─── Module-level audio singleton ─────────────────────────────────────────
// Lives OUTSIDE React so it survives route changes and HMR.
let audioSingleton   = null;  // HTMLAudioElement
let audioCtx         = null;  // AudioContext
let gainNode         = null;  // GainNode for fade
let sourceConnected  = false; // AudioContext connection flag
let fadeRaf          = null;  // requestAnimationFrame handle for fade

/**
 * Creates (or returns existing) audio singleton.
 * Called lazily on first interaction to respect autoplay policies.
 */
function getAudio() {
  if (audioSingleton) return audioSingleton;

  const audio          = new Audio();
  audio.loop           = true;
  audio.preload        = 'auto'; // lazy — don't load until needed
  audio.crossOrigin    = 'anonymous';

  // Multi-format source for browser compatibility
  const track = TRACKS[0];
  // Try OGG first (better compression), fallback to MP3
  audio.src = track.mp3;

  audioSingleton = audio;
  return audio;
}

/**
 * Initialise Web Audio API chain: AudioContext → GainNode → destination.
 * Must be called inside a user gesture handler (click, keydown, etc).
 */
function initAudioContext() {
  if (audioCtx) return;

  try {
    audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
    gainNode  = audioCtx.createGain();
    gainNode.gain.value = 0; // start silent — fade in
    gainNode.connect(audioCtx.destination);
  } catch (e) {
    // Web Audio API unavailable (very old browsers) — degrade gracefully
    console.warn('[MusicPlayer] Web Audio API unavailable, using direct volume');
  }
}

/**
 * Connect HTMLAudioElement to AudioContext chain (once).
 */
function connectSource(audio) {
  if (sourceConnected || !audioCtx) return;
  try {
    const src = audioCtx.createMediaElementSource(audio);
    src.connect(gainNode);
    sourceConnected = true;
  } catch (e) {
    console.warn('[MusicPlayer] Could not connect to AudioContext:', e);
  }
}

/**
 * Smooth fade: animates GainNode from current value to target over FADE_DURATION_MS.
 * Falls back to direct audio.volume if Web Audio is unavailable.
 */
function fade(audio, toVolume, onComplete) {
  if (fadeRaf) cancelAnimationFrame(fadeRaf);

  const startTime   = performance.now();
  const startVolume = gainNode ? gainNode.gain.value : audio.volume;
  const delta       = toVolume - startVolume;

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / FADE_DURATION_MS, 1);
    // Ease in-out cubic
    const eased    = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const current = startVolume + delta * eased;

    if (gainNode) {
      gainNode.gain.value = current;
    } else {
      audio.volume = Math.max(0, Math.min(1, current));
    }

    if (progress < 1) {
      fadeRaf = requestAnimationFrame(step);
    } else {
      fadeRaf = null;
      if (onComplete) onComplete();
    }
  }

  fadeRaf = requestAnimationFrame(step);
}

// ─── Waveform bars (decorative, CSS animated) ──────────────────────────────
function WaveformBars({ playing }) {
  return (
    <div aria-hidden="true" style={{
      display: 'flex', alignItems: 'flex-end',
      gap: '2px', height: '16px',
    }}>
      {[0.4, 0.7, 1, 0.6, 0.85].map((h, i) => (
        <span
          key={i}
          style={{
            display: 'block',
            width: '3px',
            borderRadius: '2px',
            background: 'var(--accent)',
            height: playing ? `${h * 16}px` : '3px',
            transform: 'scaleY(1)',
            transformOrigin: 'bottom',
            transition: 'height 0.3s ease',
            animation: playing
              ? `waveBar ${0.6 + i * 0.15}s ease-in-out ${i * 0.08}s infinite alternate`
              : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ─── Volume slider ─────────────────────────────────────────────────────────
function VolumeSlider({ volume, onChange }) {
  return (
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={volume}
      onChange={e => onChange(parseFloat(e.target.value))}
      aria-label="Music volume"
      style={{
        width: '64px',
        height: '3px',
        cursor: 'pointer',
        accentColor: 'var(--accent)',
        background: `linear-gradient(to right, var(--accent) ${volume * 100}%, rgba(255,255,255,0.15) ${volume * 100}%)`,
        borderRadius: '2px',
        outline: 'none',
        appearance: 'auto',
      }}
    />
  );
}

// ─── Main MusicPlayer component ────────────────────────────────────────────
export default function MusicPlayer() {
  const [playing,    setPlaying]    = useState(false);
  const [muted,      setMuted]      = useState(false);
  const [volume,     setVolume]     = useState(DEFAULT_VOLUME);
  const [ready,      setReady]      = useState(false);    // audio loaded & can play
  const [expanded,   setExpanded]   = useState(false);    // show volume slider
  const [hasInteracted, setHasInteracted] = useState(false); // autoplay gate
  const [mounted,    setMounted]    = useState(false);    // SSR guard

  const playerRef = useRef(null);

  // ── SSR guard — don't render on server ────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  // ── Restore preferences from localStorage ─────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedMuted = localStorage.getItem(STORAGE_KEY_MUTE);
      const savedVol   = localStorage.getItem(STORAGE_KEY_VOL);
      if (savedMuted !== null) setMuted(savedMuted === 'true');
      if (savedVol   !== null) setVolume(parseFloat(savedVol));
    } catch (_) {}
  }, []);

  // ── First-interaction listener (autoplay gate) ─────────────────────────
  // Browsers block autoplay until user interacts with the page.
  // We listen for ANY click/keydown globally and auto-start music once.
  useEffect(() => {
    if (hasInteracted) return;

    const handler = () => {
      setHasInteracted(true);
    };

    window.addEventListener('click',   handler, { once: true, passive: true });
    window.addEventListener('keydown', handler, { once: true, passive: true });
    window.addEventListener('touchstart', handler, { once: true, passive: true });

    return () => {
      window.removeEventListener('click',   handler);
      window.removeEventListener('keydown', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, [hasInteracted]);

  // ── Auto-start after first interaction (if not muted by preference) ────
  useEffect(() => {
    if (!hasInteracted || muted) return;

    const audio = getAudio();
    initAudioContext();
    connectSource(audio);

    // Resume suspended AudioContext (Safari requires this)
    if (audioCtx?.state === 'suspended') {
      audioCtx.resume();
    }

    audio.volume = gainNode ? 1 : volume; // gain node controls actual volume

    audio.play().then(() => {
      setPlaying(true);
      fade(audio, muted ? 0 : volume);
    }).catch(err => {
      // Autoplay still blocked — user must click the player button
      console.info('[MusicPlayer] Autoplay blocked, waiting for explicit play:', err.message);
    });
  }, [hasInteracted]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle canplaythrough — mark as ready ─────────────────────────────
  useEffect(() => {
    const audio = getAudio();
    const onReady = () => setReady(true);
    audio.addEventListener('canplaythrough', onReady);
    // Also handle error gracefully
    audio.addEventListener('error', () => {
      console.warn('[MusicPlayer] Audio file failed to load. Check /public/audio/ files.');
      setReady(false);
    });
    return () => audio.removeEventListener('canplaythrough', onReady);
  }, []);

  // ── Play / Pause ───────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const audio = getAudio();
    initAudioContext();
    connectSource(audio);

    if (audioCtx?.state === 'suspended') audioCtx.resume();

    if (playing) {
      // Fade out then pause
      fade(audio, 0, () => {
        audio.pause();
        setPlaying(false);
      });
    } else {
      audio.volume = gainNode ? 1 : 0;
      audio.play().then(() => {
        setPlaying(true);
        fade(audio, muted ? 0 : volume);
      }).catch(console.warn);
    }
  }, [playing, muted, volume]);

  // ── Mute / Unmute ──────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    const audio  = getAudio();
    const newVal = !muted;
    setMuted(newVal);
    try { localStorage.setItem(STORAGE_KEY_MUTE, String(newVal)); } catch (_) {}

    if (playing) {
      fade(audio, newVal ? 0 : volume);
    }
  }, [muted, playing, volume]);

  // ── Volume change ──────────────────────────────────────────────────────
  const handleVolumeChange = useCallback((val) => {
    setVolume(val);
    try { localStorage.setItem(STORAGE_KEY_VOL, String(val)); } catch (_) {}

    if (playing && !muted) {
      const audio = getAudio();
      if (gainNode) {
        gainNode.gain.value = val;
      } else {
        audio.volume = val;
      }
    }

    // Auto-unmute if slider dragged up from 0
    if (val > 0 && muted) {
      setMuted(false);
      try { localStorage.setItem(STORAGE_KEY_MUTE, 'false'); } catch (_) {}
    }
  }, [playing, muted]);

  // ── Close expanded panel when clicking outside ─────────────────────────
  useEffect(() => {
    if (!expanded) return;
    const handler = e => {
      if (playerRef.current && !playerRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  // ── Keyboard: Escape closes expanded ──────────────────────────────────
  useEffect(() => {
    if (!expanded) return;
    const handler = e => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [expanded]);

  // Don't render on server
  if (!mounted) return null;

  const muteIcon = muted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊';

  return (
    <>
      <style>{`
        @keyframes waveBar {
          from { height: 4px; }
          to   { height: 16px; }
        }
        @keyframes playerFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Thumb styling for range input */
        .music-volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
        }
        .music-volume-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
          border: none;
        }

        .music-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
          outline: none;
          color: var(--text);
        }
        .music-btn:hover {
          background: rgba(255,255,255,0.08);
        }
        .music-btn:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
      `}</style>

      {/* ── Fixed player pill ── */}
      <div
        ref={playerRef}
        role="region"
        aria-label="Background music player"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 600,
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          animation: 'playerFadeIn 0.6s 1s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        {/* Volume panel — expands above the pill */}
        <div style={{
          background: 'rgba(10,10,8,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '10px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px',
          opacity: expanded ? 1 : 0,
          transform: expanded ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
          pointerEvents: expanded ? 'auto' : 'none',
          transition: 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.16,1,0.3,1)',
          transformOrigin: 'bottom left',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {/* Mute toggle */}
          <button
            className="music-btn"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute music' : 'Mute music'}
            aria-pressed={muted}
            title={muted ? 'Unmute' : 'Mute'}
          >
            <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{muteIcon}</span>
          </button>

          {/* Volume slider */}
          <input
            type="range"
            className="music-volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={e => handleVolumeChange(parseFloat(e.target.value))}
            aria-label="Music volume"
            style={{
              width: '80px',
              height: '3px',
              cursor: 'pointer',
              accentColor: 'var(--accent)',
              borderRadius: '2px',
              outline: 'none',
              appearance: 'auto',
            }}
          />

          {/* Volume % */}
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.06em',
            color: 'var(--muted)',
            minWidth: '28px',
          }}>
            {Math.round((muted ? 0 : volume) * 100)}%
          </span>
        </div>

        {/* Main pill */}
        <div style={{
          background: 'rgba(10,10,8,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${playing ? 'rgba(255,107,53,0.25)' : 'rgba(255,255,255,0.10)'}`,
          borderRadius: '50px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: playing
            ? '0 4px 24px rgba(255,107,53,0.15), 0 2px 8px rgba(0,0,0,0.4)'
            : '0 4px 16px rgba(0,0,0,0.35)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          cursor: 'default',
          userSelect: 'none',
        }}>

          {/* Play / Pause */}
          <button
            className="music-btn"
            onClick={togglePlay}
            aria-label={playing ? 'Pause background music' : 'Play background music'}
            aria-pressed={playing}
            title={playing ? 'Pause' : 'Play'}
            style={{ color: playing ? 'var(--accent)' : 'var(--muted)' }}
          >
            {playing ? (
              // Pause icon
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="2" y="1" width="4" height="12" rx="1"/>
                <rect x="8" y="1" width="4" height="12" rx="1"/>
              </svg>
            ) : (
              // Play icon
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path d="M3 1.5l9 5.5-9 5.5V1.5z"/>
              </svg>
            )}
          </button>

          {/* Waveform visualiser */}
          <WaveformBars playing={playing && !muted} />

          {/* Track label */}
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.62rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: playing ? 'var(--text)' : 'var(--muted)',
            transition: 'color 0.3s ease',
          }}>
            {TRACKS[0].label}
          </span>

          {/* Volume expand toggle */}
          <button
            className="music-btn"
            onClick={() => setExpanded(v => !v)}
            aria-label={expanded ? 'Hide volume controls' : 'Show volume controls'}
            aria-expanded={expanded}
            title="Volume"
            style={{
              color: expanded ? 'var(--accent)' : 'var(--muted)',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), color 0.2s ease',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 2l5 8H1z"/>
            </svg>
          </button>

        </div>
      </div>
    </>
  );
}