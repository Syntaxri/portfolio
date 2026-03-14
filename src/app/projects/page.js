"use client";
import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProjectCard from '../../components/ProjectCard';
import ParticleNetwork from '../../components/ParticleNetwork';

const allProjects = [
  {
    title: 'Synthwave Studio',
    description: 'A browser-based audio synthesizer with real-time waveform visualization using Web Audio API and Canvas.',
    tags: ['React', 'Web Audio', 'Canvas'],
    link: '#', github: '#', year: '2024', category: 'frontend',
  },
  {
    title: 'Orbit Dashboard',
    description: 'Analytics platform processing 10M+ daily events with live charts, configurable alert pipelines, and multi-tenant auth.',
    tags: ['Next.js', 'PostgreSQL', 'Redis'],
    link: '#', github: '#', year: '2024', category: 'fullstack',
  },
  {
    title: 'Verdant API',
    description: 'High-throughput REST + GraphQL API for a plant-care app, serving 50k+ users. Includes push notifications and cron jobs.',
    tags: ['Node.js', 'GraphQL', 'MongoDB'],
    github: '#', year: '2023', category: 'backend',
  },
  {
    title: 'Palette AI',
    description: 'Color palette generator powered by a fine-tuned model. Extract palettes from images or generate from text prompts.',
    tags: ['Python', 'FastAPI', 'React'],
    link: '#', github: '#', year: '2023', category: 'fullstack',
  },
  {
    title: 'Nomad CLI',
    description: 'Command-line tool for managing remote dev environments. Supports SSH tunnels, port forwarding, and config sync.',
    tags: ['Go', 'CLI', 'SSH'],
    github: '#', year: '2022', category: 'backend',
  },
  {
    title: 'Chronicle Blog',
    description: 'Minimalist blogging platform with MDX support, full-text search, and reading-time estimation.',
    tags: ['Next.js', 'MDX', 'SQLite'],
    link: '#', github: '#', year: '2022', category: 'frontend',
  },
];

const categories = ['all', 'frontend', 'fullstack', 'backend'];

export default function Projects() {
  const [active, setActive] = useState('all');
  const filtered = active === 'all' ? allProjects : allProjects.filter(p => p.category === active);

  return (
    <>
      <Head><title>Projects — Dev Portfolio</title></Head>
      <Navbar />
      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>

        <section style={{
          position: 'relative',   // ← required so canvas positions inside it
          overflow: 'hidden',     // ← prevents canvas bleeding out
          paddingTop: '100px',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>

          {/* Particle network — behind everything */}
          <ParticleNetwork
            config={{
              nodeCount: 60,
              nodeColor: '#ff6b35',
              lineColor: '#ff6b35',
              cursorNodeColor: '#ffffff',
              maxLineDistance: 130,
              cursorRadius: 180,
              cursorStrength: 0.012,
              lineBaseOpacity: 0.12,
              speed: 0.25,
            }}
          />

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>

          <div style={{ marginBottom: '3rem' }}>
            <span style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.75rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--accent)', display: 'block', marginBottom: '1rem',
            }}>
              Work
            </span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: 'var(--white)', marginBottom: '2rem' }}>
              Projects
            </h1>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '8px 18px',
                border: '1px solid',
                borderColor: active === cat ? 'var(--accent)' : 'var(--border)',
                background: active === cat ? 'var(--accent)' : 'transparent',
                color: active === cat ? 'var(--bg)' : 'var(--muted)',
                borderRadius: '2px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem',
            marginBottom: '6rem',
          }}>
            {filtered.map(p => <ProjectCard key={p.title} project={p} />)}
          </div>
        </div>
        </section>
      </main>
    </>
  );
}