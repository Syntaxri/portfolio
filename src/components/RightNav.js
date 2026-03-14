/**
 * RightNav.js — App Router compatible
 * ─────────────────────────────────────────────────────────────────────────────
 * FIX: Replaced `useRouter` from 'next/router' with:
 *   • usePathname()  from 'next/navigation' → read current path
 *   • useRouter()    from 'next/navigation' → programmatic navigation (push)
 */
"use client";
import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // ← App Router

const NAV_ITEMS = [
  { id: 'home',        label: 'Home',        href: '/',            sectionId: 'hero'        },
  { id: 'about',       label: 'About',       href: '/about',       sectionId: 'about'       },
  { id: 'projects',    label: 'Projects',    href: '/projects',    sectionId: 'projects'    },
  { id: 'photography', label: 'Photography', href: '/photography', sectionId: 'photography' },
];

export default function RightNav() {
  // ✅ App Router hooks
  const pathname = usePathname();
  const router   = useRouter();

  const itemRefs = useRef({});

  // ── Sync active item from current route ────────────────────────────────
  const syncRouteActive = useCallback(() => {
    NAV_ITEMS.forEach(item => {
      const el = itemRefs.current[item.id];
      if (!el) return;
      const isActive =
        (pathname === '/' && item.id === 'home') ||
        (pathname !== '/' && pathname.startsWith(item.href) && item.href !== '/');
      el.setAttribute('data-active', isActive ? 'true' : 'false');
    });
  }, [pathname]);

  useEffect(() => { syncRouteActive(); }, [syncRouteActive]);

  // ── IntersectionObserver for same-page section tracking ────────────────
  useEffect(() => {
    if (pathname !== '/') return;
    const observers = [];

    NAV_ITEMS.forEach(item => {
      if (!item.sectionId) return;
      const section = document.getElementById(item.sectionId);
      if (!section) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          Object.values(itemRefs.current).forEach(el => {
            if (el) el.setAttribute('data-active', 'false');
          });
          const activeEl = itemRefs.current[item.id];
          if (activeEl) activeEl.setAttribute('data-active', 'true');
        },
        { threshold: 0.3 }
      );
      obs.observe(section);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [pathname]);

  // ── Click: scroll same-page or navigate ───────────────────────────────
  const handleClick = useCallback((e, item) => {
    e.preventDefault();
    if (pathname === '/' || pathname === item.href) {
      const section = document.getElementById(item.sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    // ✅ App Router push
    router.push(item.href);
  }, [pathname, router]);

  return (
    <>
      <style>{`
        .rnav {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 200;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 0;
          animation: rnavIn 0.8s 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes rnavIn {
          from { opacity: 0; transform: translateY(-50%) translateX(20px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0);    }
        }
        .rnav-item {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          cursor: pointer;
          text-decoration: none;
          outline: none;
          padding: 6px 0 6px 12px;
          position: relative;
        }
        .rnav-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          white-space: nowrap;
          max-width: 0;
          overflow: hidden;
          opacity: 0;
          transform: translateX(6px);
          transition:
            max-width 0.35s cubic-bezier(0.16,1,0.3,1),
            opacity   0.25s ease,
            transform 0.3s cubic-bezier(0.16,1,0.3,1),
            color     0.2s ease;
          margin-right: 10px;
        }
        .rnav-dash {
          height: 2px;
          border-radius: 1px;
          background: var(--muted);
          width: 24px;
          flex-shrink: 0;
          margin-right: 16px;
          transition:
            width      0.3s cubic-bezier(0.16,1,0.3,1),
            background 0.2s ease,
            box-shadow 0.2s ease;
        }
        .rnav-dot {
          position: absolute;
          right: 10px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0;
          transform: scale(0);
          transition: opacity 0.2s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .rnav-item:hover .rnav-label,
        .rnav-item:focus-visible .rnav-label {
          max-width: 120px;
          opacity: 1;
          transform: translateX(0);
          color: var(--text);
        }
        .rnav-item:hover .rnav-dash,
        .rnav-item:focus-visible .rnav-dash {
          width: 36px;
          background: var(--text);
        }
        .rnav-item[data-active="true"] .rnav-label {
          max-width: 120px;
          opacity: 1;
          transform: translateX(0);
          color: var(--accent);
        }
        .rnav-item[data-active="true"] .rnav-dash {
          width: 40px;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
        }
        .rnav-item[data-active="true"] .rnav-dot {
          opacity: 1;
          transform: scale(1);
        }
        .rnav-item:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 4px;
          border-radius: 2px;
        }
        @media (max-width: 480px) {
          .rnav { display: none; }
        }
      `}</style>

      <nav className="rnav" aria-label="Page navigation" role="navigation">
        {NAV_ITEMS.map(item => (
          <a
            key={item.id}
            ref={el => { itemRefs.current[item.id] = el; }}
            href={item.href}
            className="rnav-item"
            data-active="false"
            aria-label={item.label}
            onClick={e => handleClick(e, item)}
            onKeyDown={e => { if (e.key === 'Enter') handleClick(e, item); }}
            tabIndex={0}
          >
            <span className="rnav-label">{item.label}</span>
            <span className="rnav-dash"  aria-hidden="true" />
            <span className="rnav-dot"   aria-hidden="true" />
          </a>
        ))}
      </nav>
    </>
  );
}