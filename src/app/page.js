"use client";
import Head from 'next/head';
import Link from 'next/link';
import ProjectCard from '../components/ProjectCard';
import ParticleNetwork from '../components/ParticleNetwork';

// ── Featured projects data (outside component — no re-creation) ────────────
const FEATURED_PROJECTS = [
  {
    title: 'Synthwave Studio',
    description: 'A browser-based audio synthesizer with real-time waveform visualization, built with Web Audio API.',
    tags: ['React', 'Web Audio', 'Canvas'],
    link: '#',
    github: '#',
    year: '2024',
  },
  {
    title: 'Orbit Dashboard',
    description: 'Analytics platform processing 10M+ daily events with live charts and configurable alert pipelines.',
    tags: ['Next.js', 'PostgreSQL', 'Redis'],
    link: '#',
    github: '#',
    year: '2024',
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Akram Rihani — Developer & Photographer</title>
        <meta name="description" content="Full-stack developer and photographer based remotely. Building performant, accessible digital products." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>

        {/* ════════════════════════════════════════════════════════════
            HERO SECTION
            id="hero" — tracked by RightNav IntersectionObserver
        ════════════════════════════════════════════════════════════ */}
        <section
          id="hero"
          aria-label="Introduction"
          style={{
            minHeight: '100vh',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* ── Particle network canvas (z-index 0, pointerEvents none) ── */}
          <ParticleNetwork
            config={{
              nodeCount: 80,
              nodeColor: '#ff6b35',
              lineColor: '#ff6b35',
              cursorNodeColor: '#ffffff',
              maxLineDistance: 140,
              cursorRadius: 200,
              cursorStrength: 0.014,
              lineBaseOpacity: 0.15,
              speed: 0.3,
            }}
          />

          {/* ── Radial vignette ── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, var(--bg) 100%)',
            }}
          />

          {/* ── Hero content ── */}
          <div style={{
            position: 'relative', zIndex: 2,
            padding: '0 2rem',
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%',
          }}>

            {/* Availability badge */}
            <div className="animate-fade-up">
              <span style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1.5rem',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: 'heroPulse 2s ease-in-out infinite',
                  flexShrink: 0,
                }} />
                Available for work
              </span>
            </div>

            {/* Drop-cap heading: giant "I" + stacked lines */}
            <h1
              className="animate-fade-up animate-delay-1"
              style={{ display: 'flex', alignItems: 'center', gap: '0.1em', marginBottom: '1.5rem', lineHeight: 1 }}
            >
              <span style={{
                fontSize: 'clamp(8rem, 22vw, 16rem)',
                color: 'var(--accent)',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                lineHeight: 0.85,
                letterSpacing: '-0.06em',
                flexShrink: 0,
              }}>
                I
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '0.08em' }}>
                <span style={{
                  fontSize: 'clamp(2rem, 6.5vw, 5.2rem)',
                  color: 'var(--white)',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginLeft: '20px',
                }}>
                  Build things
                </span>
                <span style={{
                  fontSize: 'clamp(1.4rem, 4.5vw, 3.6rem)',
                  color: 'var(--muted)',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.5,
                  marginLeft: '20px',
                }}>
                  call it V1.0
                </span>
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="animate-fade-up animate-delay-2" style={{
              maxWidth: '520px',
              color: 'var(--muted)',
              fontSize: '1rem',
              lineHeight: 1.8,
              marginBottom: '3rem',
            }}>
              I’m a full-stack developer and a photographer, which is why I spend my days chasing light and my nights coding logic.
            </p>

            {/* CTA buttons */}
            <div className="animate-fade-up animate-delay-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/projects" className="btn-primary">
                View Projects
              </Link>
              <Link href="/about" className="btn-ghost">
                About Me
              </Link>
            </div>

            {/* Scroll cue */}
            <div className="animate-fade-up animate-delay-4" style={{
              marginTop: '6rem',
              display: 'flex', alignItems: 'center', gap: '12px',
              color: 'var(--muted)', fontSize: '0.7rem', letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--border)' }} />
              Scroll to explore
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            FEATURED PROJECTS
            id="projects" — tracked by RightNav
        ════════════════════════════════════════════════════════════ */}
        <section
          id="projects"
          aria-labelledby="projects-heading"
          style={{ padding: '8rem 2rem', maxWidth: '960px', margin: '0 auto' }}
        >
          {/* Section header */}
          <div
            className="reveal"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}
          >
            <div>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--accent)', display: 'block', marginBottom: '0.75rem',
              }}>
                Selected work
              </span>
              <h2
                id="projects-heading"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--white)', lineHeight: 1.05 }}
              >
                Things I've<br />shipped
              </h2>
            </div>
            <Link href="/projects" style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.75rem',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--accent)',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'gap 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.gap = '12px'}
            onMouseLeave={e => e.currentTarget.style.gap = '6px'}
            >
              All projects →
            </Link>
          </div>

          {/* Project cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {FEATURED_PROJECTS.map((p, i) => (
              <div key={p.title} className="reveal" data-delay={String(i + 1)}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            DUAL IDENTITY — Developer & Photographer strip
        ════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Dual identity"
          style={{
            padding: '5rem 2rem',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', flexWrap: 'wrap' }}>

            {/* Developer side */}
            <div className="reveal-left" style={{ padding: '2rem 0' }}>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--accent)', display: 'block', marginBottom: '1rem',
              }}>
                01 / Developer
              </span>
              <h3 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
                color: 'var(--white)', letterSpacing: '-0.03em',
                lineHeight: 1.1, marginBottom: '1.2rem',
              }}>
                I write code that<br />doesn't break at 2am.
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '360px' }}>
                5+ years building full-stack products with React, Next.js, Node.js and whatever the job demands. I care about performance, accessibility, and clean architecture.
              </p>
            </div>

            {/* Photographer side */}
            <div className="reveal-right" data-delay="1" style={{
              padding: '2rem 0',
              borderLeft: '1px solid var(--border)',
              paddingLeft: '3rem',
            }}>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--accent)', display: 'block', marginBottom: '1rem',
              }}>
                02 / Photographer
              </span>
              <h3 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
                color: 'var(--white)', letterSpacing: '-0.03em',
                lineHeight: 1.1, marginBottom: '1.2rem',
              }}>
                I see the world<br />in frames and f-stops.
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '360px' }}>
                When I'm not shipping features I'm out with a camera. Landscapes, cityscapes, and anything with interesting light. Sony α7 Series.
              </p>
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════
            CONTACT CTA
            id="contact" — tracked by RightNav
        ════════════════════════════════════════════════════════════ */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          style={{ padding: '8rem 2rem' }}
        >
          <div
            className="reveal-scale"
            style={{
              maxWidth: '860px', margin: '0 auto',
              padding: '5rem 4rem',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top accent line */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            }} />
            {/* Subtle bg glow */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(255,107,53,0.05) 0%, transparent 70%)',
            }} />

            <span style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--accent)', display: 'block', marginBottom: '1.5rem',
              position: 'relative',
            }}>
              Open to opportunities
            </span>
            <h2
              id="contact-heading"
              style={{
                fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
                color: 'var(--white)', marginBottom: '1.2rem',
                lineHeight: 1.1, position: 'relative',
              }}
            >
              Let's build something<br />remarkable together.
            </h2>
            <p style={{
              color: 'var(--muted)', marginBottom: '3rem',
              fontSize: '0.9rem', lineHeight: 1.8, position: 'relative',
            }}>
              Open to full-time roles and select freelance projects.
            </p>
            <a
              href="mailto:hello@akramrihani.dev"
              className="btn-primary"
              style={{ position: 'relative' }}
            >
              Get in touch
            </a>
          </div>
        </section>

      </main>

      {/* ── Page-level styles ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes heroPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.5); }
        }

        /* Reusable button styles */
        .btn-primary {
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 14px 32px;
          background: var(--accent);
          color: var(--bg);
          border-radius: 2px;
          border: none;
          cursor: pointer;
          display: inline-block;
          text-decoration: none;
          transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover, .btn-primary:focus-visible {
          opacity: 0.88;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255,107,53,0.35);
          outline: none;
        }
        .btn-primary:active { transform: translateY(0); }

        .btn-ghost {
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 14px 28px;
          border: 1px solid var(--border);
          color: var(--muted);
          border-radius: 2px;
          display: inline-block;
          text-decoration: none;
          transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .btn-ghost:hover, .btn-ghost:focus-visible {
          border-color: var(--text);
          color: var(--text);
          transform: translateY(-2px);
          outline: none;
        }
        .btn-ghost:active { transform: translateY(0); }

        /* Responsive: stack dual-identity grid on mobile */
        @media (max-width: 640px) {
          #dual-identity-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}