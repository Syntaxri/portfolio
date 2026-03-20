/**
 * Motion.js — Reusable animation wrapper components
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop-in replacements for <div> that add scroll-triggered entrance animations.
 *
 * Components:
 *   <FadeUp>       — fades + slides up when scrolled into view
 *   <FadeIn>       — fades in only
 *   <SlideLeft>    — slides from left
 *   <SlideRight>   — slides from right
 *   <ScaleIn>      — scales up from slightly smaller
 *   <Stagger>      — wraps a list; children animate in sequence
 *   <MagneticBtn>  — button that subtly follows the cursor (desktop only)
 *   <CursorTrail>  — global orange dot trail following cursor
 *   <CountUp>      — animated number counter
 *
 * All respect prefers-reduced-motion via CSS.
 * All accept standard div props (className, style, onClick, etc.)
 */
"use client";
import { useRef, useEffect, useState, useCallback } from 'react';
import { useInView } from '../lib/useInView';

// ── Shared transition builder ─────────────────────────────────────────────
function buildTransition(duration = 0.65, delay = 0) {
  return `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s`;
}

// ── FadeUp ────────────────────────────────────────────────────────────────
export function FadeUp({ children, delay = 0, duration = 0.65, distance = 36, style = {}, ...props }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity:   inView ? 1 : 0,
      transform: inView ? 'none' : `translateY(${distance}px)`,
      transition: buildTransition(duration, delay),
      willChange: 'opacity, transform',
      ...style,
    }} {...props}>
      {children}
    </div>
  );
}

// ── FadeIn ────────────────────────────────────────────────────────────────
export function FadeIn({ children, delay = 0, duration = 0.6, style = {}, ...props }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity:    inView ? 1 : 0,
      transform:  inView ? 'none' : 'translateY(10px)',
      transition: buildTransition(duration, delay),
      willChange: 'opacity, transform',
      ...style,
    }} {...props}>
      {children}
    </div>
  );
}

// ── SlideLeft ─────────────────────────────────────────────────────────────
export function SlideLeft({ children, delay = 0, duration = 0.65, distance = 40, style = {}, ...props }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity:   inView ? 1 : 0,
      transform: inView ? 'none' : `translateX(-${distance}px)`,
      transition: buildTransition(duration, delay),
      willChange: 'opacity, transform',
      ...style,
    }} {...props}>
      {children}
    </div>
  );
}

// ── SlideRight ────────────────────────────────────────────────────────────
export function SlideRight({ children, delay = 0, duration = 0.65, distance = 40, style = {}, ...props }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity:   inView ? 1 : 0,
      transform: inView ? 'none' : `translateX(${distance}px)`,
      transition: buildTransition(duration, delay),
      willChange: 'opacity, transform',
      ...style,
    }} {...props}>
      {children}
    </div>
  );
}

// ── ScaleIn ───────────────────────────────────────────────────────────────
export function ScaleIn({ children, delay = 0, duration = 0.7, style = {}, ...props }) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  return (
    <div ref={ref} style={{
      opacity:   inView ? 1 : 0,
      transform: inView ? 'none' : 'scale(0.90) translateY(20px)',
      transition: buildTransition(duration, delay),
      willChange: 'opacity, transform',
      ...style,
    }} {...props}>
      {children}
    </div>
  );
}

// ── Stagger ───────────────────────────────────────────────────────────────
// Children animate in one by one with a delay between each
export function Stagger({ children, baseDelay = 0, staggerMs = 80, style = {}, ...props }) {
  const [ref, inView] = useInView({ threshold: 0.08 });
  const items = Array.isArray(children) ? children : [children];
  return (
    <div ref={ref} style={style} {...props}>
      {items.map((child, i) => (
        <div key={i} style={{
          opacity:   inView ? 1 : 0,
          transform: inView ? 'none' : 'translateY(22px)',
          transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${baseDelay + i * staggerMs / 1000}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${baseDelay + i * staggerMs / 1000}s`,
          willChange: 'opacity, transform',
        }}>
          {child}
        </div>
      ))}
    </div>
  );
}

// ── MagneticBtn ───────────────────────────────────────────────────────────
// Subtly pulls toward cursor on hover — works on desktop only
export function MagneticBtn({ children, strength = 0.25, style = {}, ...props }) {
  const ref = useRef(null);

  const handleMove = useCallback((e) => {
    const el   = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * strength;
    const dy   = (e.clientY - cy) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }, [strength]);

  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ display: 'inline-block', transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)', ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

// ── CursorTrail ───────────────────────────────────────────────────────────
// Global orange dot trail — mount once in Layout
export function CursorTrail() {
  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    let lastX = 0, lastY = 0;
    const MIN_DIST = 18; // min px between dots

    const onMove = (e) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (Math.sqrt(dx*dx + dy*dy) < MIN_DIST) return;
      lastX = e.clientX;
      lastY = e.clientY;

      const dot = document.createElement('div');
      dot.className = 'cursor-trail';
      dot.style.left = `${e.clientX - 3}px`;
      dot.style.top  = `${e.clientY - 3}px`;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 500);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return null; // renders nothing
}

// ── CountUp ───────────────────────────────────────────────────────────────
// Animates a number when it enters the viewport
export function CountUp({ end, prefix = '', suffix = '', duration = 1200, style = {}, ...props }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parsed = parseFloat(String(end).replace(/[^0-9.]/g, '')) || 0;

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(el);
      const start = performance.now();
      const step  = (now) => {
        const p     = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        setVal(Math.round(eased * parsed));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });

    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} style={style} {...props}>
      {prefix}{val}{suffix}
    </span>
  );
}

// ── Parallax ──────────────────────────────────────────────────────────────
// Element moves at a slower/faster speed than scroll — subtle depth effect
export function Parallax({ children, speed = 0.15, style = {}, ...props }) {
  const ref    = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // Touch devices — skip
    if (window.matchMedia('(hover: none)').matches) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) { rafRef.current = null; return; }
        const rect   = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translateY(${center * speed}px)`;
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed]);

  return (
    <div ref={ref} style={{ willChange: 'transform', ...style }} {...props}>
      {children}
    </div>
  );
}