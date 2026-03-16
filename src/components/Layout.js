"use client";
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useMode } from '../context/ModeContext';
import Navbar from './Navbar';
import Footer from './Footer';
import RightNav from './RightNav';
import MusicPlayer from './MusicPlayer';
import ModeSelector from './ModeSelector';
import PasswordModal from './PasswordModal';

const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

function useScrollReveal() {
  const pathname    = usePathname();
  const observerRef = useRef(null);
  const mutObsRef   = useRef(null);

  useEffect(() => {
    function revealIfVisible(el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    }

    function observe(el) {
      if (!observerRef.current || el.classList.contains('revealed')) return;
      revealIfVisible(el);
      if (!el.classList.contains('revealed')) {
        observerRef.current.observe(el);
      }
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px' }
    );

    document.querySelectorAll('.revealed').forEach(el => el.classList.remove('revealed'));
    document.querySelectorAll(SELECTOR).forEach(observe);

    mutObsRef.current = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.matches?.(SELECTOR)) observe(node);
          node.querySelectorAll?.(SELECTOR).forEach(observe);
        });
      });
    });
    mutObsRef.current.observe(document.body, { childList: true, subtree: true });

    const safetyTimer = setTimeout(() => {
      document.querySelectorAll(SELECTOR).forEach(el => {
        if (!el.classList.contains('revealed')) observe(el);
      });
    }, 600);

    return () => {
      observerRef.current?.disconnect();
      mutObsRef.current?.disconnect();
      clearTimeout(safetyTimer);
      document.querySelectorAll(SELECTOR).forEach(el => el.classList.remove('revealed'));
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
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
          will-change: opacity, transform;
        }
        .reveal       { transform: translateY(28px); }
        .reveal-left  { transform: translateX(-28px); }
        .reveal-right { transform: translateX(28px); }
        .reveal-scale { transform: scale(0.94); }
        .reveal[data-delay="1"],.reveal-left[data-delay="1"],.reveal-right[data-delay="1"],.reveal-scale[data-delay="1"] { transition-delay:.08s; }
        .reveal[data-delay="2"],.reveal-left[data-delay="2"],.reveal-right[data-delay="2"],.reveal-scale[data-delay="2"] { transition-delay:.16s; }
        .reveal[data-delay="3"],.reveal-left[data-delay="3"],.reveal-right[data-delay="3"],.reveal-scale[data-delay="3"] { transition-delay:.24s; }
        .reveal[data-delay="4"],.reveal-left[data-delay="4"],.reveal-right[data-delay="4"],.reveal-scale[data-delay="4"] { transition-delay:.36s; }
        .revealed { opacity:1 !important; transform:none !important; }
      `}</style>

      <Navbar />
      <RightNav />
      <div>{children}</div>
      <Footer />
      <MusicPlayer />

      {/* Password modal for Dev → Photo switching — rendered at root level */}
      <PasswordModal />
    </>
  );
}