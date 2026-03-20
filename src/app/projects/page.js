"use client";
import { useState } from 'react';
import Head from 'next/head';
import ProjectCard from '../components/ProjectCard';
import ParticleNetwork from '../components/ParticleNetwork';
import { FadeUp, FadeIn, Stagger, ScaleIn } from '../components/Motion';

const allProjects = [
  { title:'Synthwave Studio',  description:'Browser-based audio synthesizer with real-time waveform visualization using Web Audio API and Canvas.', tags:['React','Web Audio','Canvas'],        link:'#', github:'#', year:'2024', category:'frontend'  },
  { title:'Orbit Dashboard',   description:'Analytics platform processing 10M+ daily events with live charts, configurable alert pipelines, and multi-tenant auth.', tags:['Next.js','PostgreSQL','Redis'],    link:'#', github:'#', year:'2024', category:'fullstack' },
  { title:'Verdant API',       description:'High-throughput REST + GraphQL API for a plant-care app, serving 50k+ users with push notifications and cron jobs.', tags:['Node.js','GraphQL','MongoDB'],   github:'#',             year:'2023', category:'backend'   },
  { title:'Palette AI',        description:'Color palette generator powered by a fine-tuned model. Extract palettes from images or text prompts.',    tags:['Python','FastAPI','React'],       link:'#', github:'#', year:'2023', category:'fullstack' },
  { title:'Nomad CLI',         description:'Command-line tool for managing remote dev environments — SSH tunnels, port forwarding, and config sync.',  tags:['Go','CLI','SSH'],                 github:'#',             year:'2022', category:'backend'   },
  { title:'Chronicle Blog',    description:'Minimalist blogging platform with MDX support, full-text search, and reading-time estimation.',             tags:['Next.js','MDX','SQLite'],         link:'#', github:'#', year:'2022', category:'frontend'  },
];

const CATEGORIES = ['all', 'frontend', 'fullstack', 'backend'];

export default function Projects() {
  const [active, setActive] = useState('all');
  const filtered = active === 'all' ? allProjects : allProjects.filter(p => p.category === active);

  return (
    <>
      <Head>
        <title>Projects — Akram Rihani</title>
        <meta name="description" content="Full-stack projects by Akram Rihani" />
      </Head>

      <main>
        {/* ── Hero with particles ── */}
        <section style={{
          position: 'relative', overflow: 'hidden',
          paddingTop: '130px', paddingBottom: '4rem',
          minHeight: '45vh',
        }}>
          <ParticleNetwork config={{
            nodeCount: 60, nodeColor: '#ff8c42', lineColor: '#ff8c42',
            cursorNodeColor: '#fff', maxLineDistance: 130,
            cursorRadius: 180, cursorStrength: 0.012,
            lineBaseOpacity: 0.11, speed: 0.5,
          }} />
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, var(--bg) 100%)',
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '960px', margin: '0 auto', padding: '0 2rem' }}>
            <FadeIn>
              <span style={{ fontFamily:'DM Mono, monospace', fontSize:'0.72rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--accent)', display:'block', marginBottom:'0.8rem' }}>
                Work
              </span>
            </FadeIn>
            <FadeUp delay={0.1}>
              <h1 style={{ fontSize:'clamp(2.5rem,7vw,5rem)', color:'var(--white)', lineHeight:0.95, marginBottom:'0.5rem' }}>
                Projects
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p style={{ fontFamily:'DM Mono, monospace', fontSize:'0.85rem', color:'var(--muted)', marginTop:'1rem' }}>
                {allProjects.length} projects across frontend, backend, and full-stack
              </p>
            </FadeUp>
          </div>
        </section>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 2rem 6rem' }}>

          {/* ── Animated filter tabs ── */}
          <FadeUp delay={0.1} style={{ marginBottom: '3rem' }}>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  style={{
                    fontFamily: 'DM Mono, monospace', fontSize: '0.73rem',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '8px 20px',
                    border: `1px solid ${active === cat ? 'var(--accent)' : 'var(--border)'}`,
                    background: active === cat ? 'var(--accent)' : 'transparent',
                    color: active === cat ? 'var(--bg)' : 'var(--muted)',
                    borderRadius: '6px', cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    transform: active === cat ? 'translateY(-2px)' : 'none',
                    boxShadow: active === cat ? '0 4px 16px rgba(var(--accent-rgb),0.3)' : 'none',
                  }}
                  onMouseEnter={e => { if (active !== cat) { e.currentTarget.style.borderColor='rgba(var(--accent-rgb),0.4)'; e.currentTarget.style.color='var(--text)'; }}}
                  onMouseLeave={e => { if (active !== cat) { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--muted)'; }}}
                >
                  {cat}
                  <span style={{ marginLeft:'6px', opacity:0.5, fontSize:'0.65rem' }}>
                    {cat === 'all' ? allProjects.length : allProjects.filter(p=>p.category===cat).length}
                  </span>
                </button>
              ))}
            </div>
          </FadeUp>

          {/* ── Project grid with stagger ── */}
          <Stagger
            baseDelay={0.05}
            staggerMs={70}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filtered.map(p => <ProjectCard key={p.title} project={p} />)}
          </Stagger>
        </div>
      </main>
    </>
  );
}