"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import RightNav from './RightNav';
import MusicPlayer from './MusicPlayer';

/**
 * useScrollReveal
 * ─────────────────────────────────────────────────────────────────────────────
 * The bug: when navigating away and back, React renders NEW DOM nodes for the
 * page. The old IntersectionObserver already disconnected. The new elements
 * have the .reveal class (opacity:0) but nothing ever observes them — so they
 * stay invisible until hard refresh.
 *
 * The fix:
 *  1. Depend on `pathname` so the effect re-runs on every route change.
 *  2. Wait 100ms after navigation for React to finish painting the new DOM.
 *  3. Strip .revealed from all elements so returning to a page re-animates.
 *  4. Create a fresh IntersectionObserver for the new page's elements.
 *  5. Disconnect on cleanup (next route change).
 */
function useScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

    // Wait for React to finish painting the new page DOM
    const timer = setTimeout(() => {
      // Reset: remove .revealed so elements re-animate on revisit
      document.querySelectorAll('.revealed').forEach(el => {
        el.classList.remove('revealed');
      });

      const els = document.querySelectorAll(SELECTOR);
      if (!els.length) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
      );

      els.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      // Disconnect any lingering observer on route change
      document.querySelectorAll(SELECTOR).forEach(el => {
        el.classList.remove('revealed');
      });
    };
  }, [pathname]); // re-run on every route change
}

export default function Layout({ children }) {
  useScrollReveal();

  return (
    <>
      <style>{`
        /* ── Scroll-reveal base states (hidden) ── */
        .reveal,
        .reveal-left,
        .reveal-right,
        .reveal-scale {
          opacity: 0;
          transition:
            opacity   0.7s cubic-bezier(0.16,1,0.3,1),
            transform 0.7s cubic-bezier(0.16,1,0.3,1);
          will-change: opacity, transform;
        }

        .reveal       { transform: translateY(32px);  }
        .reveal-left  { transform: translateX(-32px); }
        .reveal-right { transform: translateX(32px);  }
        .reveal-scale { transform: scale(0.94);       }

        /* Stagger delays */
        .reveal[data-delay="1"], .reveal-left[data-delay="1"],
        .reveal-right[data-delay="1"], .reveal-scale[data-delay="1"] { transition-delay: 0.1s; }

        .reveal[data-delay="2"], .reveal-left[data-delay="2"],
        .reveal-right[data-delay="2"], .reveal-scale[data-delay="2"] { transition-delay: 0.2s; }

        .reveal[data-delay="3"], .reveal-left[data-delay="3"],
        .reveal-right[data-delay="3"], .reveal-scale[data-delay="3"] { transition-delay: 0.3s; }

        .reveal[data-delay="4"], .reveal-left[data-delay="4"],
        .reveal-right[data-delay="4"], .reveal-scale[data-delay="4"] { transition-delay: 0.45s; }

        /* Visible state — toggled by IntersectionObserver */
        .revealed {
          opacity: 1 !important;
          transform: none !important;
        }
      `}</style>

      <Navbar />
      <RightNav />

      <div style={{ paddingRight: '0' }}>
        {children}
      </div>

      <Footer />
      <MusicPlayer />
    </>
  );
}