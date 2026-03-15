/**
 * PhotoSection.js — Photography homepage sections
 * Dynamically imported — only loaded when mode === 'photography'
 */
"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { featuredPhotos, photographyCollections } from '../../lib/data/photographyGallery';

const ParticleNetwork = dynamic(() => import('../ParticleNetwork'), { ssr: false });

function CollectionCard({ col, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href="/photography"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="reveal" data-delay={String(delay)}
      style={{ display:'block', textDecoration:'none', position:'relative', borderRadius:'4px', overflow:'hidden', aspectRatio:'4/3',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform .4s cubic-bezier(.16,1,.3,1)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,.5)' : '0 4px 16px rgba(0,0,0,.3)',
      }}
    >
      <img src={col.cover} alt={col.title} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', filter: hovered ? 'brightness(.55)' : 'brightness(.75)', transition:'filter .4s ease' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 50%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'1.2rem', left:'1.2rem' }}>
        <p style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'1.1rem', color:'#fff', letterSpacing:'-0.02em', marginBottom:'4px' }}>{col.title}</p>
        <p style={{ fontFamily:'DM Mono, monospace', fontSize:'0.65rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--accent)' }}>{col.count} shots · {col.tag}</p>
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
        transition: 'transform .4s cubic-bezier(.16,1,.3,1)',
        cursor: 'crosshair',
      }}
    >
      <img src={photo.imageUrl} alt={photo.title} loading="lazy"
        style={{ width:'100%', height:'100%', objectFit:'cover',
          filter: hovered ? 'brightness(.7)' : 'brightness(.9)',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'filter .4s ease, transform .6s ease',
        }}
      />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'0.8rem',
        background:'linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 100%)',
        opacity: hovered ? 1 : 0, transition:'opacity .3s ease',
      }}>
        <p style={{ fontFamily:'DM Mono, monospace', fontSize:'0.62rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--accent)' }}>{photo.category}</p>
      </div>
    </div>
  );
}

export default function PhotoSection({ content }) {
  const { hero, theme } = content;
  return (
    <>
      {/* ── Hero ── */}
      <section id="hero" style={{ minHeight:'100vh', position:'relative', display:'flex', flexDirection:'column', justifyContent:'center', overflow:'hidden' }}>
        <ParticleNetwork config={{ nodeCount:50, nodeColor:theme.particleColor, lineColor:theme.particleColor, cursorNodeColor:'#fff', maxLineDistance:120, cursorRadius:180, cursorStrength:0.01, lineBaseOpacity:0.1, speed:0.2 }} />
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

      {/* ── Collections ── */}
      <section style={{ padding:'8rem 2rem', maxWidth:'960px', margin:'0 auto' }}>
        <div className="reveal" style={{ marginBottom:'3.5rem' }}>
          <span style={{ fontFamily:'DM Mono, monospace', fontSize:'0.7rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--accent)', display:'block', marginBottom:'0.75rem' }}>Collections</span>
          <h2 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', color:'var(--white)', lineHeight:1.05 }}>Curated<br />series</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px,1fr))', gap:'1.5rem' }}>
          {photographyCollections.map((col, i) => <CollectionCard key={col.slug} col={col} delay={i+1} />)}
        </div>
      </section>

      {/* ── Featured gallery strip ── */}
      <section style={{ padding:'0 2rem 8rem', maxWidth:'960px', margin:'0 auto' }}>
        <div className="reveal" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', color:'var(--white)', lineHeight:1.05 }}>Recent<br />frames</h2>
          <Link href="/photography" style={{ fontFamily:'DM Mono, monospace', fontSize:'0.75rem', letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--accent)', textDecoration:'none' }}>Full gallery →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          {featuredPhotos.slice(0,3).map((photo, i) => <GalleryThumb key={photo.id} photo={photo} delay={i} />)}
        </div>
      </section>
    </>
  );
}