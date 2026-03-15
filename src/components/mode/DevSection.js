/**
 * DevSection.js — Developer homepage sections
 * Dynamically imported — only loaded when mode === 'developer'
 */
"use client";
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { featuredProjects } from '../../lib/data/developerProjects';

// ParticleNetwork is canvas-based — lazy load, no SSR
const ParticleNetwork = dynamic(() => import('../ParticleNetwork'), { ssr: false });

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  const { title, description, techStack = [], liveDemo, githubLink, year, status } = project;
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '4px', padding: '2rem',
        background: hovered ? 'rgba(255,107,53,0.03)' : 'var(--surface)',
        transition: 'all 0.25s cubic-bezier(.16,1,.3,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position:'absolute', top:0, right:0, width: hovered ? '80px':'0', height:'2px', background:'var(--accent)', transition:'width .3s ease' }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.8rem' }}>
        <h3 style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'1.15rem', letterSpacing:'-0.02em', color: hovered ? 'var(--accent)' : 'var(--white)', transition:'color .2s' }}>{title}</h3>
        <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
          {status === 'wip' && <span style={{ fontFamily:'DM Mono, monospace', fontSize:'0.6rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'2px 8px', border:'1px solid var(--accent)', color:'var(--accent)', borderRadius:'10px' }}>WIP</span>}
          {year && <span style={{ fontFamily:'DM Mono, monospace', fontSize:'0.7rem', color:'var(--muted)' }}>{year}</span>}
        </div>
      </div>
      <p style={{ color:'var(--muted)', fontSize:'0.88rem', lineHeight:1.7, marginBottom:'1.2rem' }}>{description}</p>
      {/* Tech stack badges */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'1.4rem' }}>
        {techStack.map(t => (
          <span key={t} style={{ fontFamily:'DM Mono, monospace', fontSize:'0.68rem', letterSpacing:'0.06em', textTransform:'uppercase', padding:'3px 10px', border:'1px solid var(--border)', borderRadius:'2px', color:'var(--muted)' }}>{t}</span>
        ))}
      </div>
      <div style={{ display:'flex', gap:'1rem' }}>
        {liveDemo   && <a href={liveDemo}   target="_blank" rel="noopener noreferrer" style={{ fontFamily:'DM Mono, monospace', fontSize:'0.72rem', letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--accent)', textDecoration:'none' }}>Live →</a>}
        {githubLink && <a href={githubLink} target="_blank" rel="noopener noreferrer" style={{ fontFamily:'DM Mono, monospace', fontSize:'0.72rem', letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--muted)',  textDecoration:'none' }}>GitHub ↗</a>}
      </div>
    </article>
  );
}

export default function DevSection({ content }) {
  const { hero, theme } = content;
  return (
    <>
      {/* ── Hero ── */}
      <section id="hero" style={{ minHeight:'100vh', position:'relative', display:'flex', flexDirection:'column', justifyContent:'center', overflow:'hidden' }}>
        <ParticleNetwork config={{ nodeCount:80, nodeColor:theme.particleColor, lineColor:theme.particleColor, cursorNodeColor:'#fff', maxLineDistance:140, cursorRadius:200, cursorStrength:0.014, lineBaseOpacity:0.15, speed:0.3 }} />
        <div aria-hidden="true" style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, var(--bg) 100%)' }} />
        <div style={{ position:'relative', zIndex:2, padding:'0 2rem', maxWidth:'900px', margin:'0 auto', width:'100%' }}>
          <div className="animate-fade-up">
            <span style={{ fontFamily:'DM Mono, monospace', fontSize:'0.75rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--accent)', display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'1.5rem' }}>
              <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--accent)', animation:'heroPulse 2s ease-in-out infinite' }} />
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

      {/* ── Featured Projects ── */}
      <section id="projects" style={{ padding:'8rem 2rem', maxWidth:'960px', margin:'0 auto' }}>
        <div className="reveal" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'4rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <span style={{ fontFamily:'DM Mono, monospace', fontSize:'0.7rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--accent)', display:'block', marginBottom:'0.75rem' }}>Selected work</span>
            <h2 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', color:'var(--white)', lineHeight:1.05 }}>Things I've<br />shipped</h2>
          </div>
          <Link href="/projects" style={{ fontFamily:'DM Mono, monospace', fontSize:'0.75rem', letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--accent)', textDecoration:'none' }}>All projects →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px,1fr))', gap:'1.5rem' }}>
          {featuredProjects.map((p, i) => (
            <div key={p.id} className="reveal" data-delay={String(i+1)}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
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