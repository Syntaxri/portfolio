"use client";
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useMode } from '../context/ModeContext';
import Navbar from './Navbar';
import Footer from './Footer';
import RightNav from './RightNav';
import MusicPlayer from './MusicPlayer';
import ModeSelector from './ModeSelector';

const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

/**
 * useScrollReveal — fixed for dynamic imports + first-load viewport elements
 *
 * Root cause of the blank homepage:
 *  1. next/dynamic loads DevSection/PhotoSection asynchronously AFTER the
 *     observer is set up — so querySelectorAll finds 0 elements and exits.
 *  2. rootMargin: '0px 0px -30px 0px' shrinks the detection zone, causing
 *     elements already in the viewport to never cross the threshold.
 *  3. Elements already visible when the observer finally attaches are NOT
 *     re-evaluated — IntersectionObserver only fires on state changes.
 *
 * Fix:
 *  - Use a MutationObserver to watch for new .reveal elements added to the
 *    DOM (i.e. when the dynamic chunk finishes loading) and immediately
 *    reveal ones already in the viewport.
 *  - Use rootMargin: '0px' so the full viewport counts.
 *  - After attaching the IntersectionObserver, manually call a "check now"
 *    pass using getBoundingClientRect() for elements already visible.
 */
function useScrollReveal() {
  const pathname    = usePathname();
  const observerRef = useRef(null);
  const mutObsRef   = useRef(null);

  useEffect(() => {
    // ── Immediately reveal any element already visible in the viewport ──
    function revealIfVisible(el) {
      const rect = el.getBoundingClientRect();
      const inViewport =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0;
      if (inViewport) el.classList.add('revealed');
    }

    // ── Observe an element for scroll-based reveal ──────────────────────
    function observe(el) {
      if (!observerRef.current) return;
      // Already revealed — skip
      if (el.classList.contains('revealed')) return;
      // Visible right now — reveal immediately without waiting for scroll
      revealIfVisible(el);
      if (!el.classList.contains('revealed')) {
        observerRef.current.observe(el);
      }
    }

    // ── Create the IntersectionObserver ─────────────────────────────────
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px', // no shrinkage — full viewport counts
      }
    );

    // ── Reset all elements on route change ──────────────────────────────
    document.querySelectorAll('.revealed').forEach(el => {
      el.classList.remove('revealed');
    });

    // ── Initial pass — observe whatever is in the DOM right now ─────────
    // This handles elements rendered synchronously (non-dynamic sections)
    document.querySelectorAll(SELECTOR).forEach(observe);

    // ── MutationObserver — watch for dynamic-import elements landing ─────
    // DevSection / PhotoSection load asynchronously via next/dynamic.
    // When their DOM nodes appear, immediately check + observe them.
    mutObsRef.current = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return; // elements only
          // Check the node itself
          if (node.matches?.(SELECTOR)) observe(node);
          // Check all descendants
          node.querySelectorAll?.(SELECTOR).forEach(observe);
        });
      });
    });

    mutObsRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // ── Safety net: re-check after dynamic chunks likely finish ──────────
    // next/dynamic chunks typically load within 300–800ms on localhost.
    // This catches any elements the MutationObserver might have missed.
    const safetyTimer = setTimeout(() => {
      document.querySelectorAll(SELECTOR).forEach(el => {
        if (!el.classList.contains('revealed')) observe(el);
      });
    }, 600);

    return () => {
      observerRef.current?.disconnect();
      mutObsRef.current?.disconnect();
      clearTimeout(safetyTimer);
      // Reset on route change so animations replay on revisit
      document.querySelectorAll(SELECTOR).forEach(el => {
        el.classList.remove('revealed');
      });
    };
  }, [pathname]);
}

export default function Layout({ children }) {
  useScrollReveal();
  const { mode, isReady } = useMode();

  if (!isReady) return null;
  if (!mode)    return <ModeSelector />;

  return (
    <>
      <style>{`
        .reveal, .reveal-left, .reveal-right, .reveal-scale {
          opacity: 0;
          transition:
            opacity   0.7s cubic-bezier(0.16,1,0.3,1),
            transform 0.7s cubic-bezier(0.16,1,0.3,1);
          will-change: opacity, transform;
        }
        .reveal       { transform: translateY(28px);  }
        .reveal-left  { transform: translateX(-28px); }
        .reveal-right { transform: translateX(28px);  }
        .reveal-scale { transform: scale(0.94);       }

        .reveal[data-delay="1"], .reveal-left[data-delay="1"],
        .reveal-right[data-delay="1"], .reveal-scale[data-delay="1"] { transition-delay: 0.08s; }
        .reveal[data-delay="2"], .reveal-left[data-delay="2"],
        .reveal-right[data-delay="2"], .reveal-scale[data-delay="2"] { transition-delay: 0.16s; }
        .reveal[data-delay="3"], .reveal-left[data-delay="3"],
        .reveal-right[data-delay="3"], .reveal-scale[data-delay="3"] { transition-delay: 0.24s; }
        .reveal[data-delay="4"], .reveal-left[data-delay="4"],
        .reveal-right[data-delay="4"], .reveal-scale[data-delay="4"] { transition-delay: 0.36s; }

        .revealed {
          opacity: 1 !important;
          transform: none !important;
        }
      `}</style>

      <Navbar />
      <RightNav />
      <div>{children}</div>
      <Footer />
      <MusicPlayer />
    </>
  );
}