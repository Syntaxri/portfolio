"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMode } from '../context/ModeContext';
import Navbar from './Navbar';
import Footer from './Footer';
import RightNav from './RightNav';
import MusicPlayer from './MusicPlayer';
import ModeSelector from './ModeSelector';

function useScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const timer = setTimeout(() => {
      document.querySelectorAll('.revealed').forEach(el => el.classList.remove('revealed'));
      const els = document.querySelectorAll(SELECTOR);
      if (!els.length) return;
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
      );
      els.forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => {
      clearTimeout(timer);
      document.querySelectorAll(SELECTOR).forEach(el => el.classList.remove('revealed'));
    };
  }, [pathname]);
}

export default function Layout({ children }) {
  useScrollReveal();
  const { mode, isReady } = useMode();

  // Don't flash anything until localStorage has been read
  if (!isReady) return null;

  // Show fullscreen selector if no mode chosen yet
  if (!mode) return <ModeSelector />;

  return (
    <>
      <style>{`
        .reveal, .reveal-left, .reveal-right, .reveal-scale {
          opacity: 0;
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
          will-change: opacity, transform;
        }
        .reveal       { transform: translateY(32px);  }
        .reveal-left  { transform: translateX(-32px); }
        .reveal-right { transform: translateX(32px);  }
        .reveal-scale { transform: scale(0.94);       }
        .reveal[data-delay="1"],.reveal-left[data-delay="1"],.reveal-right[data-delay="1"],.reveal-scale[data-delay="1"] { transition-delay:.1s; }
        .reveal[data-delay="2"],.reveal-left[data-delay="2"],.reveal-right[data-delay="2"],.reveal-scale[data-delay="2"] { transition-delay:.2s; }
        .reveal[data-delay="3"],.reveal-left[data-delay="3"],.reveal-right[data-delay="3"],.reveal-scale[data-delay="3"] { transition-delay:.3s; }
        .reveal[data-delay="4"],.reveal-left[data-delay="4"],.reveal-right[data-delay="4"],.reveal-scale[data-delay="4"] { transition-delay:.45s; }
        .revealed { opacity:1 !important; transform:none !important; }
      `}</style>

      <Navbar />
      <RightNav />
      <div>{children}</div>
      <Footer />
      <MusicPlayer />
    </>
  );
}