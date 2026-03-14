/**
 * Navbar.js — Mode-aware floating glassmorphism navbar
 * Uses useMode() to get nav links + accent color for the active mode.
 * Falls back to developer links if mode not yet set.
 */
"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMode } from '../context/ModeContext';
import ModeSwitcher from './ModeSwitcher';
import { developerContent } from '../lib/modeContent';

const FALLBACK_NAV = developerContent.nav;

function NavLink({ href, label, isActive }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={isActive ? 'page' : undefined}
      style={{
        position: 'relative',
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.75rem',
        letterSpacing: hovered ? '0.12em' : '0.06em',
        textTransform: 'uppercase',
        color: isActive ? 'var(--accent)' : hovered ? 'var(--text)' : 'var(--muted)',
        textDecoration: 'none',
        padding: '6px 2px',
        transition: 'color 0.25s ease, letter-spacing 0.3s cubic-bezier(0.16,1,0.3,1)',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        outline: 'none',
      }}
    >
      {label}
      <span style={{
        position: 'absolute', bottom: '-1px', left: '50%',
        transform: 'translateX(-50%)',
        height: '1px',
        width: isActive || hovered ? '100%' : '0%',
        background: isActive ? 'var(--accent)' : 'var(--text)',
        borderRadius: '1px',
        transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
        display: 'block',
      }} />
    </Link>
  );
}

function HireButton() {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <a
      href="mailto:hello@akramrihani.dev"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      aria-label="Hire Akram"
      style={{
        fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        padding: '8px 20px', borderRadius: '3px',
        border: `1px solid ${hovered ? 'var(--accent)' : 'rgba(255,255,255,0.18)'}`,
        background: hovered ? 'var(--accent)' : 'transparent',
        color: hovered ? 'var(--bg)' : 'var(--muted)',
        cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
        transform: pressed ? 'scale(0.96)' : hovered ? 'scale(1.04) translateY(-1px)' : 'scale(1)',
        boxShadow: hovered ? '0 6px 20px rgba(var(--accent-rgb),0.3)' : 'none',
        transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        outline: 'none', whiteSpace: 'nowrap',
      }}
    >
      Hire me
    </a>
  );
}

function HamburgerButton({ open, onClick }) {
  return (
    <button onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open} aria-controls="mobile-menu"
      style={{ background: 'none', border: 'none', cursor: 'pointer',
        padding: '8px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        gap: '5px', width: '40px', height: '40px', borderRadius: '4px', outline: 'none' }}
    >
      {[0,1,2].map(i => (
        <span key={i} aria-hidden="true" style={{
          display: 'block',
          width: i === 1 ? (open ? '0px' : '22px') : '22px',
          height: '1.5px', background: 'var(--text)', borderRadius: '2px',
          transformOrigin: 'center',
          transform: open && i === 0 ? 'translateY(6.5px) rotate(45deg)'
                   : open && i === 2 ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
          opacity: open && i === 1 ? 0 : 1,
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        }} />
      ))}
    </button>
  );
}

function MobileMenu({ open, onClose, navLinks }) {
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div onClick={onClose} aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 299,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
      }} />
      <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(320px, 85vw)', zIndex: 300,
        background: 'rgba(10,10,8,0.95)', backdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column', padding: '5rem 2.5rem 3rem',
      }}>
        <button onClick={onClose} aria-label="Close menu" style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          background: 'none', border: '1px solid rgba(255,255,255,0.12)',
          color: 'var(--muted)', cursor: 'pointer', width: '36px', height: '36px',
          borderRadius: '4px', fontSize: '1rem', display: 'flex',
          alignItems: 'center', justifyContent: 'center', outline: 'none',
        }}>✕</button>

        <nav aria-label="Mobile navigation">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  fontSize: '1.6rem', letterSpacing: '-0.03em',
                  color: isActive ? 'var(--accent)' : 'var(--text)',
                  textDecoration: 'none', paddingBottom: '1.2rem',
                  marginBottom: '0.4rem',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  transform: open ? 'translateX(0)' : 'translateX(30px)',
                  opacity: open ? 1 : 0,
                  transition: `transform 0.4s cubic-bezier(0.16,1,0.3,1) ${0.1+i*0.06}s, opacity 0.3s ease ${0.1+i*0.06}s`,
                }}
              >
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 400 }}>
                  0{i+1}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(12px)',
          transition: `opacity 0.4s ease 0.35s, transform 0.4s cubic-bezier(0.16,1,0.3,1) 0.35s`,
        }}>
          <ModeSwitcher />
        </div>
      </div>
    </>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { content } = useMode();
  const navLinks = content?.nav || FALLBACK_NAV;

  const [scrolled,    setScrolled]    = useState(false);
  const [scrollDir,   setScrollDir]   = useState('up');
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const lastScrollY = useRef(0);
  const ticking    = useRef(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 20);
        setScrollDir(y > lastScrollY.current ? 'down' : 'up');
        lastScrollY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const compressing = scrolled && scrollDir === 'down';
  const navPaddingV = compressing ? '8px' : '12px';
  const blurAmount  = scrolled ? (compressing ? '24px' : '18px') : '0px';
  const bgOpacity   = scrolled ? (compressing ? 0.9 : 0.8) : 0;
  const shadowStr   = scrolled ? (compressing ? '0 8px 40px rgba(0,0,0,0.6)' : '0 4px 24px rgba(0,0,0,0.4)') : 'none';
  const navWidth    = compressing ? 'calc(100% - 4rem)' : 'calc(100% - 3rem)';

  return (
    <>
      <style>{`
        @keyframes navbarSlideDown {
          from { opacity:0; transform: translateX(-50%) translateY(-24px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
        .nav-brand:hover .nav-brand-text { letter-spacing:0.04em; text-shadow: 0 0 20px rgba(255,107,53,0.4); }
        .nav-brand-text { transition: letter-spacing 0.4s cubic-bezier(0.16,1,0.3,1), text-shadow 0.3s ease; letter-spacing: -0.03em; }
        a:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset:4px; border-radius:3px; }
        .nav-desktop-links { display: flex; }
        .nav-mobile-toggle { display: none; }
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
          .nav-hire-desktop  { display: none !important; }
          .nav-switcher-desktop { display: none !important; }
        }
      `}</style>

      <header role="banner" style={{
        position: 'fixed', top: '18px', left: '50%',
        transform: 'translateX(-50%)',
        width: navWidth, maxWidth: '1100px', zIndex: 500,
        background: `rgba(10,10,8,${bgOpacity})`,
        backdropFilter: `blur(${blurAmount})`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        border: scrolled ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px', boxShadow: shadowStr,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${navPaddingV} 1.5rem`,
        animation: mounted ? 'navbarSlideDown 0.7s cubic-bezier(0.16,1,0.3,1) both' : 'none',
        transition: 'padding 0.35s cubic-bezier(0.16,1,0.3,1), width 0.35s, box-shadow 0.35s ease, background 0.35s ease',
      }}>
        {/* Brand */}
        <Link href="/" className="nav-brand" aria-label="Akram Rihani — Home" style={{ textDecoration:'none', flexShrink:0 }}>
          <span className="nav-brand-text" style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'1.05rem', color:'var(--white)', userSelect:'none', display:'inline-block' }}>
            <span style={{ color:'var(--accent)', display:'inline-block', transform:'scaleX(1.1)' }}>{'{'}</span>
            <span style={{ margin:'0 6px' }}>Akram Rihani</span>
            <span style={{ color:'var(--accent)', display:'inline-block', transform:'scaleX(1.1)' }}>{'}'}</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="nav-desktop-links" aria-label="Main navigation" style={{ gap:'2rem', alignItems:'center' }}>
          {navLinks.map(link => (
            <NavLink key={link.href} href={link.href} label={link.label} isActive={pathname === link.href} />
          ))}
        </nav>

        {/* Right side — switcher + hire */}
        <div style={{ display:'flex', gap:'10px', alignItems:'center', flexShrink:0 }}>
          <div className="nav-switcher-desktop"><ModeSwitcher /></div>
          <div className="nav-hire-desktop"><HireButton /></div>
          <div className="nav-mobile-toggle" style={{ alignItems:'center' }}>
            <HamburgerButton open={mobileOpen} onClick={() => setMobileOpen(v => !v)} />
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navLinks={navLinks} />
    </>
  );
}