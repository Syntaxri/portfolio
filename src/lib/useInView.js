/**
 * useInView.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight IntersectionObserver hook.
 * Returns [ref, isInView] — attach ref to any element.
 *
 * Usage:
 *   const [ref, inView] = useInView({ threshold: 0.15, once: true });
 *   <div ref={ref} style={{ opacity: inView ? 1 : 0 }} />
 */
"use client";
import { useEffect, useRef, useState } from 'react';

export function useInView({
  threshold  = 0.12,
  rootMargin = '0px 0px -40px 0px',
  once       = true,   // stop observing after first trigger
} = {}) {
  const ref     = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}

/**
 * useCountUp
 * Animates a number from 0 → end when inView becomes true.
 * Returns the current display value as a string.
 *
 * Usage:
 *   const [ref, value] = useCountUp(95, { suffix: '%', duration: 1200 });
 */
export function useCountUp(end, { suffix = '', prefix = '', duration = 1000 } = {}) {
  const ref      = useRef(null);
  const [val, setVal] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const parsed    = parseFloat(String(end).replace(/[^0-9.]/g, ''));

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * parsed));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return [ref, `${prefix}${val}${suffix}`];
}