/**
 * index.js — Dynamic homepage
 * Reads mode from context and renders the appropriate hero + sections.
 */
"use client";
import Head from 'next/head';
import Link from 'next/link';
import { useMode } from '../context/ModeContext';
import ParticleNetwork from '../components/ParticleNetwork';
import ProjectCard from '../components/ProjectCard';

// ── Developer hero ─────────────────────────────────────────────────────────
function DevHero({ content }) {
  const { hero, theme, projects } = content;
  return (
    <>
      <section id="hero" style={{ minHeight:'100vh', position:'relative', display:'flex', flexDirection:'column', justifyContent:'center', overflow:'hidden' }}>
        <ParticleNetwork config={{ nodeCount:80, nodeColor:theme.particleColor, lineColor:theme.particleColor, cursorNodeColor:'#ffffff', maxLineDistance:140, cursorRadius:200, cursorStrength:0.014, lineBaseOpacity:0.15, speed:0.3 }} />
        <div aria-hidden="true" style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, var(--bg) 100%)' }} />

        <div style={{ position:'relative', zIndex:2, padding:'0 2rem', maxWidth:'900px', margin:'0 auto', width:'100%' }}>
          <div className="animate-fade-up">
            <span style={{ fontFamily:'DM Mono, monospace', fontSize:'0.75rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--accent)', display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'1.5rem' }}>
              <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--accent)', animation:'heroPulse 2s ease-in-out infinite', flexShrink:0 }} />
              {hero.badge}
            </span>
          </div>

          <h1 className="animate-fade-up animate-delay-1" style={{ display:'flex', alignItems:'center', gap:'0.1em', marginBottom:'1.5rem', lineHeight:1 }}>
            <span style={{ fontSize:'clamp(8rem,22vw,16rem)', color:'var(--accent)', fontFamily:'Syne, sans-serif', fontWeight:800, lineHeight:0.85, letterSpacing:'-0.06em', flexShrink:0 }}>I</span>
            <span style={{ display:'flex', flexDirection:'column', gap:'0.08em' }}>
              <span style={{ fontSize:'clamp(2rem,6.5vw,5.2rem)', color:'var(--white)', fontFamily:'Syne, sans-serif', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1, marginLeft:'20px' }}>{hero.line1}</span>
              <span style={{ fontSize:'clamp(1.4rem,4.5vw,3.6rem)', color:'var(--muted)', fontFamily:'Syne, sans-serif', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.5, marginLeft:'20px' }}>{hero.line2}</span>
            </span>
          </h1>

          <p className="animate-fade-up animate-delay-2" style={{ maxWidth:'520px', color:'var(--muted)', fontSize:'1rem', lineHeight:1.8, marginBottom:'3rem' }}>{hero.sub}</p>

          <div className="animate-fade-up animate-delay-3" style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            <Link href={hero.cta1.href} className="btn-primary">{hero.cta1.label}</Link>
            <Link href={hero.cta2.href} className="btn-ghost">{hero.cta2.label}</Link>
          </div>

          <div className="animate-fade-up animate-delay-4" style={{ marginTop:'6rem', display:'flex', alignItems:'center', gap:'12px', color:'var(--muted)', fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>
            <div style={{ width:'40px', height:'1px', background:'var(--border)' }} />Scroll to explore
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section id="projects" style={{ padding:'8rem 2rem', maxWidth:'960px', margin:'0 auto' }}>
        <div className="reveal" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'4rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <span style={{ fontFamily:'DM Mono, monospace', fontSize:'0.7rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--accent)', display:'block', marginBottom:'0.75rem' }}>Selected work</span>
            <h2 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', color:'var(--white)', lineHeight:1.05 }}>Things I've<br />shipped</h2>
          </div>
          <Link href="/projects" style={{ fontFamily:'DM Mono, monospace', fontSize:'0.75rem', letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--accent)', textDecoration:'none' }}>All projects →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px,1fr))', gap:'1.5rem' }}>
          {projects.slice(0,2).map((p,i) => (
            <div key={p.title} className="reveal" data-delay={String(i+1)}><ProjectCard project={p} /></div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding:'0 2rem 8rem' }}>
        <div className="reveal-scale" style={{ maxWidth:'860px', margin:'0 auto', padding:'5rem 4rem', border:'1px solid var(--border)', borderRadius:'4px', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div aria-hidden="true" style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,var(--accent),transparent)' }} />
          <div aria-hidden="true" style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(255,107,53,0.06) 0%, transparent 70%)' }} />
          <h2 style={{ fontSize:'clamp(1.8rem,4.5vw,3.2rem)', color:'var(--white)', marginBottom:'1.2rem', lineHeight:1.1, position:'relative' }}>Let's build something<br />remarkable together.</h2>
          <p style={{ color:'var(--muted)', marginBottom:'3rem', fontSize:'0.9rem', lineHeight:1.8, position:'relative' }}>Open to full-time roles and select freelance projects.</p>
          <a href="mailto:hello@akramrihani.dev" className="btn-primary" style={{ position:'relative' }}>Get in touch</a>
        </div>
      </section>
    </>
  );
}

// ── Photography hero ───────────────────────────────────────────────────────
function PhotoHero({ content }) {
  const { hero, theme, gallery, collections } = content;
  return (
    <>
      <section id="hero" style={{ minHeight:'100vh', position:'relative', display:'flex', flexDirection:'column', justifyContent:'center', overflow:'hidden' }}>
        <ParticleNetwork config={{ nodeCount:50, nodeColor:theme.particleColor, lineColor:theme.particleColor, cursorNodeColor:'#ffffff', maxLineDistance:120, cursorRadius:180, cursorStrength:0.01, lineBaseOpacity:0.1, speed:0.2 }} />
        <div aria-hidden="true" style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, var(--bg) 100%)' }} />

        <div style={{ position:'relative', zIndex:2, padding:'0 2rem', maxWidth:'900px', margin:'0 auto', width:'100%' }}>
          <div className="animate-fade-up">
            <span style={{ fontFamily:'DM Mono, monospace', fontSize:'0.75rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--accent)', display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'1.5rem' }}>
              <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--accent)', animation:'heroPulse 2s ease-in-out infinite', flexShrink:0 }} />
              {hero.badge}
            </span>
          </div>

          <h1 className="animate-fade-up animate-delay-1" style={{ display:'flex', alignItems:'center', gap:'0.1em', marginBottom:'1.5rem', lineHeight:1 }}>
            <span style={{ fontSize:'clamp(8rem,22vw,16rem)', color:'var(--accent)', fontFamily:'Syne, sans-serif', fontWeight:800, lineHeight:0.85, letterSpacing:'-0.06em', flexShrink:0 }}>I</span>
            <span style={{ display:'flex', flexDirection:'column', gap:'0.08em' }}>
              <span style={{ fontSize:'clamp(2rem,6.5vw,5.2rem)', color:'var(--white)', fontFamily:'Syne, sans-serif', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1, marginLeft:'20px' }}>{hero.line1}</span>
              <span style={{ fontSize:'clamp(1.4rem,4.5vw,3.6rem)', color:'var(--accent)', fontFamily:'Syne, sans-serif', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.5, marginLeft:'20px' }}>{hero.line2}</span>
            </span>
          </h1>

          <p className="animate-fade-up animate-delay-2" style={{ maxWidth:'520px', color:'var(--muted)', fontSize:'1rem', lineHeight:1.8, marginBottom:'3rem' }}>{hero.sub}</p>

          <div className="animate-fade-up animate-delay-3" style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            <Link href={hero.cta1.href} className="btn-primary">{hero.cta1.label}</Link>
            <Link href={hero.cta2.href} className="btn-ghost">{hero.cta2.label}</Link>
          </div>
        </div>
      </section>

      {/* Collections preview */}
      <section style={{ padding:'8rem 2rem', maxWidth:'960px', margin:'0 auto' }}>
        <div className="reveal" style={{ marginBottom:'3.5rem' }}>
          <span style={{ fontFamily:'DM Mono, monospace', fontSize:'0.7rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--accent)', display:'block', marginBottom:'0.75rem' }}>Collections</span>
          <h2 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', color:'var(--white)', lineHeight:1.05 }}>Curated<br />series</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px,1fr))', gap:'1.5rem' }}>
          {collections.map((col, i) => (
            <CollectionCard key={col.title} col={col} delay={i+1} />
          ))}
        </div>
      </section>

      {/* Featured gallery strip */}
      <section style={{ padding:'0 2rem 8rem', maxWidth:'960px', margin:'0 auto' }}>
        <div className="reveal" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', color:'var(--white)', lineHeight:1.05 }}>Recent<br />frames</h2>
          <Link href="/photography" style={{ fontFamily:'DM Mono, monospace', fontSize:'0.75rem', letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--accent)', textDecoration:'none' }}>Full gallery →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          {gallery.slice(0,3).map((photo, i) => (
            <GalleryThumb key={photo.id} photo={photo} delay={i} />
          ))}
        </div>
      </section>
    </>
  );
}

function CollectionCard({ col, delay }) {
  const [hovered, setHovered] = useState(false);
  const { useState: _u } = require('react');
  return (
    <Link href="/photography" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="reveal" data-delay={String(delay)}
      style={{ display:'block', textDecoration:'none', position:'relative', borderRadius:'4px', overflow:'hidden', aspectRatio:'4/3', cursor:'pointer',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        transition:'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      <img src={col.cover} alt={col.title} style={{ width:'100%', height:'100%', objectFit:'cover', filter: hovered ? 'brightness(0.55)' : 'brightness(0.75)', transition:'filter 0.4s ease' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'1.2rem', left:'1.2rem' }}>
        <p style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'1.1rem', color:'#fff', letterSpacing:'-0.02em', marginBottom:'4px' }}>{col.title}</p>
        <p style={{ fontFamily:'DM Mono, monospace', fontSize:'0.65rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--accent)' }}>{col.count} shots</p>
      </div>
    </Link>
  );
}

function GalleryThumb({ photo, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="reveal" data-delay={String(delay+1)}
      style={{ position:'relative', overflow:'hidden', borderRadius:'3px', aspectRatio:'1',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        transition:'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <img src={photo.src} alt={photo.alt} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', filter: hovered ? 'brightness(0.7)' : 'brightness(0.9)', transition:'filter 0.4s ease, transform 0.6s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
import { useState } from 'react';

export default function Home() {
  const { mode, content } = useMode();
  if (!mode || !content) return null;

  return (
    <>
      <Head>
        <title>{content.meta.title}</title>
        <meta name="description" content={content.meta.description} />
      </Head>

      <main>
        {mode === 'developer'
          ? <DevHero content={content} />
          : <PhotoHero content={content} />
        }
      </main>

      <style>{`
        @keyframes heroPulse { 0%,100% { opacity:.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.5); } }
        .btn-primary {
          font-family:'DM Mono',monospace; font-size:.8rem; letter-spacing:.06em; text-transform:uppercase;
          padding:14px 32px; background:var(--accent); color:var(--bg); border-radius:2px;
          border:none; cursor:pointer; display:inline-block; text-decoration:none;
          transition:opacity .2s ease, transform .2s ease, box-shadow .2s ease;
        }
        .btn-primary:hover { opacity:.88; transform:translateY(-2px); box-shadow:0 8px 24px rgba(255,107,53,.3); }
        .btn-ghost {
          font-family:'DM Mono',monospace; font-size:.8rem; letter-spacing:.06em; text-transform:uppercase;
          padding:14px 28px; border:1px solid var(--border); color:var(--muted); border-radius:2px;
          display:inline-block; text-decoration:none; transition:border-color .2s ease, color .2s ease, transform .2s ease;
        }
        .btn-ghost:hover { border-color:var(--text); color:var(--text); transform:translateY(-2px); }
        /* Entrance animations */
        .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-delay-1 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .animate-delay-2 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .animate-delay-3 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .animate-delay-4 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </>
  );
}