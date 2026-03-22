/**
 * BuilderGuy.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Animated SVG character that sits on the letter and interacts with it.
 *
 * Developer mode: guy hammers + types on laptop, sparks fly
 * Photography mode: guy holds camera, flash pops, lens rotates
 *
 * Pure CSS keyframe animations — no dependencies, 60fps
 * Designed to sit absolutely positioned over the hero heading
 */
"use client";

// ── Developer Guy — hammers and types ─────────────────────────────────────
export function DevGuy() {
  return (
    <svg
      viewBox="0 0 120 160"
      width="120"
      height="160"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <style>{`
        /* Body bob */
        @keyframes bodyBob {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        /* Hammer swing */
        @keyframes hammerSwing {
          0%   { transform: rotate(-30deg); }
          35%  { transform: rotate(55deg); }
          50%  { transform: rotate(50deg); }
          100% { transform: rotate(-30deg); }
        }
        /* Laptop arm typing */
        @keyframes typeArm {
          0%,100% { transform: rotate(10deg); }
          50%     { transform: rotate(-15deg); }
        }
        /* Leg dangle */
        @keyframes legSwing {
          0%,100% { transform: rotate(-8deg); }
          50%     { transform: rotate(8deg); }
        }
        /* Hard hat bob */
        @keyframes hatBob {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-2px); }
        }
        /* Spark burst */
        @keyframes spark1 {
          0%   { opacity:1; transform: translate(0,0) scale(1); }
          100% { opacity:0; transform: translate(12px,-14px) scale(0.2); }
        }
        @keyframes spark2 {
          0%   { opacity:1; transform: translate(0,0) scale(1); }
          100% { opacity:0; transform: translate(-8px,-16px) scale(0.2); }
        }
        @keyframes spark3 {
          0%   { opacity:1; transform: translate(0,0) scale(1); }
          100% { opacity:0; transform: translate(16px,-8px) scale(0.2); }
        }
        /* Screen flicker */
        @keyframes screenFlicker {
          0%,90%,100% { opacity:0.9; }
          92%,96%     { opacity:0.4; }
        }
        /* Eye blink */
        @keyframes blink {
          0%,90%,100% { transform: scaleY(1); }
          95%         { transform: scaleY(0.1); }
        }
        /* Thinking bubble */
        @keyframes bubble {
          0%,100% { opacity:0; transform:scale(0.6) translateY(4px); }
          40%,70% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes bubbleDot {
          0%,30%,100% { opacity:0; }
          50%,80%     { opacity:1; }
        }
      `}</style>

      {/* ── Ground shadow ── */}
      <ellipse cx="52" cy="152" rx="28" ry="4" fill="rgba(0,0,0,0.25)" />

      {/* ── Whole body group — bobs up/down ── */}
      <g style={{ animation: 'bodyBob 0.6s ease-in-out infinite', transformOrigin: '52px 100px' }}>

        {/* ── Hard hat ── */}
        <g style={{ animation: 'hatBob 0.6s ease-in-out infinite', transformOrigin: '52px 40px' }}>
          <ellipse cx="52" cy="44" rx="14" ry="5" fill="#ff8c42" />
          <rect x="42" y="36" width="20" height="10" rx="3" fill="#ff8c42" />
          <rect x="40" y="44" width="24" height="3" rx="1.5" fill="#e07030" />
          {/* Hard hat brim shine */}
          <ellipse cx="49" cy="38" rx="5" ry="2" fill="rgba(255,255,255,0.2)" transform="rotate(-15,49,38)" />
        </g>

        {/* ── Head ── */}
        <circle cx="52" cy="58" r="11" fill="#f5c9a0" />
        {/* Ear */}
        <ellipse cx="41.5" cy="58" rx="2.5" ry="3" fill="#f0b888" />
        <ellipse cx="62.5" cy="58" rx="2.5" ry="3" fill="#f0b888" />
        {/* Eyes */}
        <g style={{ animation: 'blink 3.5s ease-in-out infinite', transformOrigin: '52px 57px' }}>
          <circle cx="47" cy="57" r="2" fill="#2a1a0a" />
          <circle cx="57" cy="57" r="2" fill="#2a1a0a" />
          {/* Eye shine */}
          <circle cx="47.8" cy="56.2" r="0.6" fill="white" />
          <circle cx="57.8" cy="56.2" r="0.6" fill="white" />
        </g>
        {/* Focused mouth (working hard) */}
        <path d="M 48 63 Q 52 61 56 63" stroke="#c0845a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {/* Sweat drop */}
        <ellipse cx="63" cy="54" rx="2" ry="3" fill="rgba(100,180,255,0.7)" />
        <ellipse cx="63" cy="51.5" rx="1" ry="1.5" fill="rgba(100,180,255,0.5)" />

        {/* ── Body / torso ── */}
        <rect x="42" y="68" width="20" height="24" rx="4" fill="#1a3a5c" />
        {/* Overalls straps */}
        <rect x="44" y="68" width="5" height="24" rx="2" fill="#0f2540" opacity="0.5" />
        <rect x="55" y="68" width="5" height="24" rx="2" fill="#0f2540" opacity="0.5" />
        {/* Pocket */}
        <rect x="49" y="74" width="6" height="5" rx="1" fill="#0f2540" opacity="0.4" />

        {/* ── HAMMER ARM (right) — swings down to hit ── */}
        <g style={{ animation: 'hammerSwing 0.5s cubic-bezier(0.4,0,0.2,1) infinite', transformOrigin: '62px 72px' }}>
          {/* Upper arm */}
          <rect x="60" y="68" width="5" height="14" rx="2.5" fill="#f5c9a0" transform="rotate(15,62,72)" />
          {/* Forearm */}
          <rect x="62" y="78" width="4" height="12" rx="2" fill="#f5c9a0" transform="rotate(10,64,84)" />
          {/* Hammer handle */}
          <rect x="63" y="88" width="3" height="16" rx="1.5" fill="#8B5E3C" transform="rotate(-5,64,96)" />
          {/* Hammer head */}
          <rect x="58" y="100" width="14" height="7" rx="2" fill="#888" transform="rotate(-5,65,103)" />
          <rect x="58" y="100" width="14" height="3" rx="1" fill="#aaa" transform="rotate(-5,65,103)" />
        </g>

        {/* ── LAPTOP ARM (left) ── */}
        <g style={{ animation: 'typeArm 0.3s ease-in-out infinite', transformOrigin: '42px 72px' }}>
          <rect x="36" y="68" width="5" height="14" rx="2.5" fill="#f5c9a0" />
          <rect x="34" y="80" width="4" height="10" rx="2" fill="#f5c9a0" />
        </g>

        {/* ── Laptop (resting on lap) ── */}
        <g transform="translate(28, 90)">
          {/* Base */}
          <rect x="0" y="6" width="22" height="14" rx="2" fill="#2a2a3a" />
          {/* Screen */}
          <rect x="2" y="0" width="18" height="12" rx="2" fill="#1a1a2e" />
          <rect x="3" y="1" width="16" height="10" rx="1" fill="#0a192f"
            style={{ animation: 'screenFlicker 2s ease-in-out infinite' }} />
          {/* Code lines on screen */}
          <rect x="4" y="3" width="8" height="1.5" rx="0.75" fill="#ff8c42" opacity="0.8" />
          <rect x="4" y="6" width="12" height="1.5" rx="0.75" fill="#60a5fa" opacity="0.8" />
          <rect x="4" y="9" width="6" height="1.5" rx="0.75" fill="#34d399" opacity="0.8" />
          {/* Keyboard */}
          {[0,3,6,9,12,15,18].map((x,i) => (
            <rect key={i} x={x+1} y="8" width="2.5" height="2" rx="0.5" fill="#444" />
          ))}
          {/* Trackpad */}
          <rect x="8" y="16" width="6" height="3" rx="1" fill="#333" />
        </g>

        {/* ── Legs (sitting, dangling) ── */}
        <g style={{ animation: 'legSwing 1.2s ease-in-out infinite', transformOrigin: '46px 92px' }}>
          <rect x="42" y="90" width="7" height="20" rx="3.5" fill="#2c4a6e" />
          <rect x="42" y="108" width="9" height="7" rx="3" fill="#333" />
          {/* Shoe lace */}
          <rect x="43" y="111" width="7" height="1" rx="0.5" fill="#ff8c42" opacity="0.6" />
        </g>
        <g style={{ animation: 'legSwing 1.2s ease-in-out 0.2s infinite reverse', transformOrigin: '56px 92px' }}>
          <rect x="55" y="90" width="7" height="20" rx="3.5" fill="#2c4a6e" />
          <rect x="55" y="108" width="9" height="7" rx="3" fill="#333" />
          <rect x="56" y="111" width="7" height="1" rx="0.5" fill="#ff8c42" opacity="0.6" />
        </g>

        {/* ── Sparks from hammering ── */}
        <g transform="translate(65,102)">
          <circle r="2" fill="#ff8c42" style={{ animation: 'spark1 0.5s ease-out infinite' }} />
          <circle r="1.5" fill="#ffcc00" style={{ animation: 'spark2 0.5s ease-out 0.08s infinite' }} />
          <circle r="1" fill="#ffffff" style={{ animation: 'spark3 0.5s ease-out 0.16s infinite' }} />
        </g>

        {/* ── Thinking bubble ── */}
        <g transform="translate(64,28)" style={{ animation: 'bubble 3s ease-in-out infinite' }}>
          <ellipse cx="14" cy="10" rx="13" ry="9" fill="rgba(255,255,255,0.08)" stroke="rgba(255,140,66,0.4)" strokeWidth="1" />
          {/* { } code in bubble */}
          <text x="5" y="14" fontSize="9" fill="#ff8c42" fontFamily="monospace" fontWeight="bold">{'</>'}</text>
          <circle cx="6" cy="22" r="2" fill="rgba(255,255,255,0.06)" stroke="rgba(255,140,66,0.3)" strokeWidth="0.8" />
          <circle cx="3" cy="27" r="1.2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,140,66,0.3)" strokeWidth="0.6" />
        </g>

      </g>
    </svg>
  );
}

// ── Photography Guy — holds camera, takes shots ────────────────────────────
export function PhotoGuy() {
  return (
    <svg
      viewBox="0 0 120 160"
      width="120"
      height="160"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <style>{`
        @keyframes photoBodyBob {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-2px) rotate(1deg); }
        }
        @keyframes cameraShake {
          0%,100% { transform: rotate(-3deg); }
          50%     { transform: rotate(3deg); }
        }
        @keyframes flashPop {
          0%,85%,100% { opacity:0; transform:scale(0.5); }
          90%         { opacity:1; transform:scale(1.4); }
          95%         { opacity:0.6; transform:scale(1); }
        }
        @keyframes lensRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes photoLegSwing {
          0%,100% { transform: rotate(-5deg); }
          50%     { transform: rotate(5deg); }
        }
        @keyframes beret {
          0%,100% { transform: rotate(-3deg) translateY(0); }
          50%     { transform: rotate(2deg) translateY(-1px); }
        }
        @keyframes eyeSquint {
          0%,80%,100% { transform: scaleY(1); }
          85%,90%     { transform: scaleY(0.2); }
        }
        @keyframes viewfinderPulse {
          0%,100% { opacity:0.6; }
          50%     { opacity:1; }
        }
        @keyframes photoBubble {
          0%,100% { opacity:0; transform:scale(0.6) translateY(4px); }
          40%,70% { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>

      <ellipse cx="52" cy="152" rx="28" ry="4" fill="rgba(0,0,0,0.25)" />

      <g style={{ animation: 'photoBodyBob 1.4s ease-in-out infinite', transformOrigin: '52px 100px' }}>

        {/* ── Beret ── */}
        <g style={{ animation: 'beret 2s ease-in-out infinite', transformOrigin: '52px 42px' }}>
          <ellipse cx="52" cy="46" rx="15" ry="5" fill="#d4a853" />
          <ellipse cx="52" cy="40" rx="12" ry="8" fill="#d4a853" />
          <circle cx="62" cy="38" r="3" fill="#c09040" />
          <ellipse cx="47" cy="40" rx="4" ry="3" fill="rgba(255,255,255,0.12)" transform="rotate(-20,47,40)" />
        </g>

        {/* ── Head ── */}
        <circle cx="52" cy="58" r="11" fill="#f5c9a0" />
        <ellipse cx="41.5" cy="58" rx="2.5" ry="3" fill="#f0b888" />
        <ellipse cx="62.5" cy="58" rx="2.5" ry="3" fill="#f0b888" />

        {/* Right eye squinted through viewfinder */}
        <g style={{ animation: 'eyeSquint 2.5s ease-in-out infinite', transformOrigin: '57px 57px' }}>
          <circle cx="57" cy="57" r="2" fill="#2a1a0a" />
          <circle cx="57.8" cy="56.2" r="0.6" fill="white" />
        </g>
        {/* Left eye normal */}
        <circle cx="47" cy="57" r="2" fill="#2a1a0a" />
        <circle cx="47.8" cy="56.2" r="0.6" fill="white" />

        {/* Smile */}
        <path d="M 47 63 Q 52 67 57 63" stroke="#c0845a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>

        {/* ── Body — casual dark jacket ── */}
        <rect x="42" y="68" width="20" height="24" rx="4" fill="#1a1a2e" />
        {/* Collar */}
        <path d="M 48 68 L 52 74 L 56 68" fill="#2a2a3e" />
        {/* Pocket */}
        <rect x="44" y="74" width="5" height="5" rx="1" fill="#14142a" opacity="0.5" />

        {/* ── CAMERA (held up, both arms) ── */}
        <g style={{ animation: 'cameraShake 1.4s ease-in-out infinite', transformOrigin: '52px 80px' }}>
          {/* Left arm up */}
          <rect x="34" y="65" width="5" height="18" rx="2.5" fill="#f5c9a0" transform="rotate(20,36,74)" />
          {/* Right arm up */}
          <rect x="64" y="65" width="5" height="18" rx="2.5" fill="#f5c9a0" transform="rotate(-20,67,74)" />

          {/* Camera body */}
          <rect x="34" y="72" width="36" height="24" rx="4" fill="#1c1c1c" />
          <rect x="34" y="72" width="36" height="4" rx="2" fill="#2a2a2a" />

          {/* Viewfinder */}
          <rect x="46" y="68" width="12" height="7" rx="2" fill="#1c1c1c" />
          <rect x="48" y="69" width="8" height="4" rx="1" fill="#0a0a1a"
            style={{ animation: 'viewfinderPulse 0.7s ease-in-out infinite' }} />

          {/* Lens */}
          <circle cx="52" cy="84" r="10" fill="#111" />
          <circle cx="52" cy="84" r="8" fill="#0a0a1a" />
          <circle cx="52" cy="84" r="6" fill="#050510" />
          {/* Lens inner rotation ring */}
          <circle cx="52" cy="84" r="7" fill="none" stroke="#333" strokeWidth="1"
            strokeDasharray="3 2"
            style={{ animation: 'lensRotate 3s linear infinite', transformOrigin: '52px 84px' }} />
          {/* Lens reflection */}
          <ellipse cx="49" cy="81" rx="2.5" ry="1.5" fill="rgba(100,160,255,0.35)" transform="rotate(-30,49,81)" />
          <ellipse cx="54" cy="87" rx="1.5" ry="1" fill="rgba(255,255,255,0.12)" transform="rotate(-30,54,87)" />
          <circle cx="52" cy="84" r="1.5" fill="rgba(255,255,255,0.08)" />

          {/* Shutter button */}
          <circle cx="65" cy="74" r="3" fill="#333" />
          <circle cx="65" cy="74" r="1.8" fill="#444" />

          {/* Camera strap */}
          <path d="M 34 76 Q 28 72 30 64 Q 32 58 38 60" fill="none" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" />
          <path d="M 70 76 Q 76 72 74 64 Q 72 58 66 60" fill="none" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* ── Flash pop ── */}
        <g transform="translate(72,70)" style={{ animation: 'flashPop 2.5s ease-out infinite' }}>
          <circle r="8" fill="rgba(255,255,220,0.9)" />
          {/* Flash rays */}
          {[0,45,90,135,180,225,270,315].map((angle, i) => (
            <line key={i}
              x1="0" y1="0"
              x2={Math.cos(angle*Math.PI/180)*14}
              y2={Math.sin(angle*Math.PI/180)*14}
              stroke="rgba(255,255,200,0.7)" strokeWidth="1.5" strokeLinecap="round"
            />
          ))}
        </g>

        {/* ── Legs (sitting) ── */}
        <g style={{ animation: 'photoLegSwing 1.8s ease-in-out infinite', transformOrigin: '46px 92px' }}>
          <rect x="42" y="90" width="7" height="20" rx="3.5" fill="#1a1a2e" />
          <rect x="42" y="108" width="9" height="7" rx="3" fill="#222" />
          <rect x="43" y="111" width="7" height="1" rx="0.5" fill="#d4a853" opacity="0.6" />
        </g>
        <g style={{ animation: 'photoLegSwing 1.8s ease-in-out 0.3s infinite reverse', transformOrigin: '56px 92px' }}>
          <rect x="55" y="90" width="7" height="20" rx="3.5" fill="#1a1a2e" />
          <rect x="55" y="108" width="9" height="7" rx="3" fill="#222" />
          <rect x="56" y="111" width="7" height="1" rx="0.5" fill="#d4a853" opacity="0.6" />
        </g>

        {/* ── Thought bubble — aperture symbol ── */}
        <g transform="translate(64,28)" style={{ animation: 'photoBubble 4s ease-in-out infinite' }}>
          <ellipse cx="14" cy="10" rx="13" ry="9" fill="rgba(255,255,255,0.06)" stroke="rgba(212,168,83,0.4)" strokeWidth="1" />
          <circle cx="14" cy="10" r="5" fill="none" stroke="rgba(212,168,83,0.7)" strokeWidth="1" />
          <circle cx="14" cy="10" r="2" fill="rgba(212,168,83,0.5)" />
          <circle cx="3" cy="22" r="2" fill="rgba(255,255,255,0.05)" stroke="rgba(212,168,83,0.3)" strokeWidth="0.8" />
          <circle cx="0" cy="27" r="1.2" fill="rgba(255,255,255,0.04)" stroke="rgba(212,168,83,0.3)" strokeWidth="0.6" />
        </g>

      </g>
    </svg>
  );
}