"use client";
import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMode } from '../context/ModeContext';
import { developerContent } from '../lib/modeContent';

export default function RightNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const { content } = useMode();
  const NAV_ITEMS = (content?.nav || developerContent.nav).map(item => ({
    ...item,
    id: item.href === '/' ? 'home' : item.href.replace('/', ''),
    sectionId: item.href === '/' ? 'hero' : item.href.replace('/', ''),
  }));

  const itemRefs = useRef({});

  const syncRouteActive = useCallback(() => {
    NAV_ITEMS.forEach(item => {
      const el = itemRefs.current[item.id];
      if (!el) return;
      const isActive = (pathname === '/' && item.id === 'home') ||
        (pathname !== '/' && pathname.startsWith(item.href) && item.href !== '/');
      el.setAttribute('data-active', isActive ? 'true' : 'false');
    });
  }, [pathname, NAV_ITEMS]);

  useEffect(() => { syncRouteActive(); }, [syncRouteActive]);

  useEffect(() => {
    if (pathname !== '/') return;
    const observers = [];
    NAV_ITEMS.forEach(item => {
      const section = document.getElementById(item.sectionId);
      if (!section) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        Object.values(itemRefs.current).forEach(el => { if (el) el.setAttribute('data-active', 'false'); });
        const activeEl = itemRefs.current[item.id];
        if (activeEl) activeEl.setAttribute('data-active', 'true');
      }, { threshold: 0.3 });
      obs.observe(section);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [pathname, NAV_ITEMS]);

  const handleClick = useCallback((e, item) => {
    e.preventDefault();
    if (pathname === '/' || pathname === item.href) {
      const section = document.getElementById(item.sectionId);
      if (section) { section.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    }
    router.push(item.href);
  }, [pathname, router]);

  return (
    <>
      <style>{`
        .rnav { position:fixed; right:0; top:50%; transform:translateY(-50%); z-index:200; display:flex; flex-direction:column; gap:6px; padding:16px 0; animation:rnavIn 0.8s 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes rnavIn { from { opacity:0; transform:translateY(-50%) translateX(20px); } to { opacity:1; transform:translateY(-50%) translateX(0); } }
        .rnav-item { display:flex; align-items:center; justify-content:flex-end; cursor:pointer; text-decoration:none; outline:none; padding:6px 0 6px 12px; position:relative; }
        .rnav-label { font-family:'DM Mono',monospace; font-size:.68rem; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); white-space:nowrap; max-width:0; overflow:hidden; opacity:0; transform:translateX(6px); transition:max-width .35s cubic-bezier(0.16,1,0.3,1),opacity .25s ease,transform .3s cubic-bezier(0.16,1,0.3,1),color .2s ease; margin-right:10px; }
        .rnav-dash { height:2px; border-radius:1px; background:var(--muted); width:24px; flex-shrink:0; margin-right:16px; transition:width .3s cubic-bezier(0.16,1,0.3,1),background .2s ease,box-shadow .2s ease; }
        .rnav-dot { position:absolute; right:10px; width:4px; height:4px; border-radius:50%; background:var(--accent); opacity:0; transform:scale(0); transition:opacity .2s ease,transform .3s cubic-bezier(0.34,1.56,0.64,1); }
        .rnav-item:hover .rnav-label,.rnav-item:focus-visible .rnav-label { max-width:120px; opacity:1; transform:translateX(0); color:var(--text); }
        .rnav-item:hover .rnav-dash,.rnav-item:focus-visible .rnav-dash { width:36px; background:var(--text); }
        .rnav-item[data-active="true"] .rnav-label { max-width:120px; opacity:1; transform:translateX(0); color:var(--accent); }
        .rnav-item[data-active="true"] .rnav-dash { width:40px; background:var(--accent); box-shadow:0 0 8px var(--accent); }
        .rnav-item[data-active="true"] .rnav-dot { opacity:1; transform:scale(1); }
        .rnav-item:focus-visible { outline:2px solid var(--accent); outline-offset:4px; border-radius:2px; }
        @media(max-width:480px) { .rnav { display:none; } }
      `}</style>
      <nav className="rnav" aria-label="Page navigation">
        {NAV_ITEMS.map(item => (
          <a key={item.id} ref={el => { itemRefs.current[item.id] = el; }}
            href={item.href} className="rnav-item" data-active="false"
            aria-label={item.label}
            onClick={e => handleClick(e, item)}
            onKeyDown={e => { if (e.key === 'Enter') handleClick(e, item); }}
            tabIndex={0}
          >
            <span className="rnav-label">{item.label}</span>
            <span className="rnav-dash" aria-hidden="true" />
            <span className="rnav-dot"  aria-hidden="true" />
          </a>
        ))}
      </nav>
    </>
  );
}