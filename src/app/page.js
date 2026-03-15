/**
 * index.js — Dynamic homepage
 * ─────────────────────────────────────────────────────────────────────────────
 * Performance strategy:
 *  • DevSection and PhotoSection are dynamically imported with next/dynamic
 *    so their JS bundles are NOT loaded for the inactive mode.
 *  • ParticleNetwork is also dynamically imported (canvas = heavy, not SSR).
 *  • Each section component pulls its data directly from the structured
 *    data files, keeping the bundle split clean.
 *  • `ssr: false` on all interactive canvas/animation components prevents
 *    hydration mismatches.
 */
"use client";
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useMode } from '../context/ModeContext';

// ── Lazy-load mode-specific sections ──────────────────────────────────────
// next/dynamic ensures only the selected mode's code is loaded.
const DevSection = dynamic(
  () => import('../components/mode/DevSection'),
  {
    ssr: false,
    loading: () => <SectionSkeleton />,
  }
);

const PhotoSection = dynamic(
  () => import('../components/mode/PhotoSection'),
  {
    ssr: false,
    loading: () => <SectionSkeleton />,
  }
);

// ── Loading skeleton while dynamic chunk loads ────────────────────────────
function SectionSkeleton() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex', gap: '8px', alignItems: 'center',
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.72rem', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--muted)',
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: '4px', height: '4px', borderRadius: '50%',
            background: 'var(--accent)',
            animation: `dotBounce 0.8s ease-in-out ${i*0.15}s infinite alternate`,
          }} />
        ))}
        Loading
      </div>
      <style>{`
        @keyframes dotBounce {
          from { opacity: 0.2; transform: translateY(0); }
          to   { opacity: 1;   transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function Home() {
  const { mode, content } = useMode();

  // Mode not yet resolved — Layout handles the selector, so this won't render
  if (!mode || !content) return null;

  return (
    <>
      <Head>
        <title>{content.meta.title}</title>
        <meta name="description" content={content.meta.description} />
        <meta name="viewport"    content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        {mode === 'developer'
          ? <DevSection  content={content} />
          : <PhotoSection content={content} />
        }
      </main>

      <style>{`
        /* ── Shared button styles used by both sections ── */
        .btn-primary {
          font-family: 'DM Mono', monospace;
          font-size: .8rem; letter-spacing: .06em; text-transform: uppercase;
          padding: 14px 32px; background: var(--accent); color: var(--bg);
          border-radius: 2px; border: none; cursor: pointer;
          display: inline-block; text-decoration: none;
          transition: opacity .2s ease, transform .2s ease, box-shadow .2s ease;
        }
        .btn-primary:hover, .btn-primary:focus-visible {
          opacity: .88; transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(var(--accent-rgb),.3);
          outline: none;
        }
        .btn-ghost {
          font-family: 'DM Mono', monospace;
          font-size: .8rem; letter-spacing: .06em; text-transform: uppercase;
          padding: 14px 28px; border: 1px solid var(--border); color: var(--muted);
          border-radius: 2px; display: inline-block; text-decoration: none;
          transition: border-color .2s ease, color .2s ease, transform .2s ease;
        }
        .btn-ghost:hover, .btn-ghost:focus-visible {
          border-color: var(--text); color: var(--text);
          transform: translateY(-2px); outline: none;
        }
        /* Entrance animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroPulse {
          0%,100% { opacity:.5; transform:scale(1); }
          50%     { opacity:1;  transform:scale(1.5); }
        }
        .animate-fade-up            { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) forwards; }
        .animate-delay-1            { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) .1s  both; }
        .animate-delay-2            { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) .2s  both; }
        .animate-delay-3            { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) .3s  both; }
        .animate-delay-4            { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) .45s both; }
      `}</style>
    </>
  );
}