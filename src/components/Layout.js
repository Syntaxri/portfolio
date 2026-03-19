"use client";
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMode } from '../context/ModeContext';
import Navbar from './Navbar';
import Footer from './Footer';
import RightNav from './RightNav';
import MusicPlayer from './MusicPlayer';
import ModeSelector from './ModeSelector';
import PasswordModal from './PasswordModal';
import dynamic from 'next/dynamic';

// Loader is canvas/animation heavy — load only client side
const PageLoader = dynamic(() => import('./PageLoader'), { ssr: false });

const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
const LOADER_KEY = 'ar_loader_seen'; // sessionStorage key — shows once per session

// ─── Scroll reveal (unchanged logic) ─────────────────────────────────────────
function useScrollReveal() {
  const pathname    = usePathname();
  const observerRef = useRef(null);
  const mutObsRef   = useRef(null);

  useEffect(() => {
    function revealIfVisible(el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('revealed');
    }
    function observe(el) {
      if (!observerRef.current || el.classList.contains('revealed')) return;
      revealIfVisible(el);
      if (!el.classList.contains('revealed')) observerRef.current.observe(el);
    }

    observerRef.current = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); observerRef.current?.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: '0px' }
    );

    document.querySelectorAll('.revealed').forEach(el => el.classList.remove('revealed'));
    document.querySelectorAll(SELECTOR).forEach(observe);

    mutObsRef.current = new MutationObserver(mutations => {
      mutations.forEach(m => m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.matches?.(SELECTOR)) observe(node);
        node.querySelectorAll?.(SELECTOR).forEach(observe);
      }));
    });
    mutObsRef.current.observe(document.body, { childList: true, subtree: true });

    const t = setTimeout(() => {
      document.querySelectorAll(SELECTOR).forEach(el => {
        if (!el.classList.contains('revealed')) observe(el);
      });
    }, 600);

    return () => {
      observerRef.current?.disconnect();
      mutObsRef.current?.disconnect();
      clearTimeout(t);
      document.querySelectorAll(SELECTOR).forEach(el => el.classList.remove('revealed'));
    };
  }, [pathname]);
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function Layout({ children }) {
  useScrollReveal();
  const { mode, isReady } = useMode();

  // Show loader once per session (not on every route change, not after mode select)
  const [showLoader, setShowLoader] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  useEffect(() => {
    try {
      const forceShow = new URLSearchParams(window.location.search).has('loader');
      const seen = sessionStorage.getItem(LOADER_KEY);
      if (!seen || forceShow) {
        setShowLoader(true);
      } else {
        setLoaderDone(true);
      }
    } catch {
      setLoaderDone(true);
    }
  }, []);

  const handleLoaderComplete = () => {
    try { sessionStorage.setItem(LOADER_KEY, '1'); } catch {}
    setShowLoader(false);
    setLoaderDone(true);
  };

  // Phase 1: Show loader (before mode is even known)
  if (showLoader && !loaderDone) {
    return (
      <>
        <PageLoader onComplete={handleLoaderComplete} />
        {/* Render page underneath so it's ready when loader exits */}
        <div style={{ visibility: 'hidden', pointerEvents: 'none', userSelect: 'none' }} aria-hidden="true">
          {isReady && mode && children}
        </div>
      </>
    );
  }

  // Phase 2: Loader done — show mode selector or app
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
      <PasswordModal />
    </>
  );
}