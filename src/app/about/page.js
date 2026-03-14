"use client";
import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import SkillBadge from '../../components/SkillBadge';
import ParticleNetwork from '../../components/ParticleNetwork';

const skills = [
  { skill: 'JavaScript / TypeScript', level: 95 },
  { skill: 'React / Next.js',         level: 92 },
  { skill: 'Node.js',                 level: 88 },
  { skill: 'PostgreSQL',              level: 80 },
  { skill: 'Docker / DevOps',         level: 72 },
  { skill: 'Figma / Design Systems',  level: 68 },
  { skill: 'Photography',             level: 85 },
  { skill: 'Sony α7 / Lightroom',     level: 80 },
];

const timeline = [
  { year: '2024', role: 'Senior Frontend Engineer', company: 'Acme Corp',   desc: 'Led redesign of core product UI serving 500k+ users. Reduced LCP by 40%.' },
  { year: '2022', role: 'Full-Stack Developer',      company: 'Startup XYZ', desc: 'Built end-to-end features across Next.js and Node microservices.' },
  { year: '2020', role: 'Junior Developer',          company: 'Agency Co',   desc: 'Delivered 20+ client sites with a focus on performance and accessibility.' },
];

// ── Portrait with hover effects ───────────────────────────────────────────
function Portrait() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', width: '100%', maxWidth: '360px', margin: '0 auto', paddingBottom: '60px' }}
    >
      {/* Circular accent ring behind the image */}
      <div style={{
        position: 'absolute',
        top: '-10px', left: '-18px', right: '-15px', bottom: '25px',
        border: '1.5px solid var(--accent)',
        borderRadius: '50%',
        opacity: hovered ? 0.6 : 0.25,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }} />

      {/* Orange glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 60%, rgba(255,107,53,0.15) 0%, transparent 70%)',
        filter: 'blur(24px)',
        opacity: hovered ? 1 : 0.5,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
        borderRadius: '4px',
      }} />

      {/* Image — circular, overflow hidden stays here only for the image crop */}
      <div style={{
        position: 'relative', zIndex: 1,
        borderRadius: '50%', overflow: 'hidden',
        transform: hovered ? 'translate(-3px, -3px)' : 'translate(0,0)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered
          ? '0 0 0 3px var(--accent), 6px 6px 32px rgba(0,0,0,0.6)'
          : '0 0 0 1px rgba(255,107,53,0.25), 2px 2px 16px rgba(0,0,0,0.4)',
      }}>
        <Image
          src="/images/akram.png"
          alt="Akram Rihani — Developer & Photographer"
          width={360}
          height={360}
          priority
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* Name tag — OUTSIDE the circle so overflow:hidden never clips it */}
      <div style={{
        position: 'absolute',
        bottom: '-52px',
        left: '50%',
        transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(6px)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        zIndex: 3,
        background: 'rgba(10,10,8,0.88)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,107,53,0.35)',
        borderRadius: '30px',
        padding: '8px 20px',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.88rem', color: '#fff', marginBottom: '2px', letterSpacing: '-0.02em' }}>
          Akram Rihani
        </p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', margin: 0 }}>
          Dev & Photographer
        </p>
      </div>

      {/* Orbiting accent dot */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '-6px', right: '18%',
        width: '10px', height: '10px',
        borderRadius: '50%',
        background: 'var(--accent)',
        boxShadow: '0 0 10px var(--accent)',
        zIndex: 2,
        opacity: hovered ? 1 : 0.5,
        transform: hovered ? 'scale(1.3)' : 'scale(1)',
        transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </div>
  );
}

// ── Simple fade-in hook for elements already in viewport on load ───────────
function useFadeIn(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`;
    const t = setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 60); // short delay so browser paints first
    return () => clearTimeout(t);
  }, [delay]);
  return ref;
}

export default function About() {
  const ref0 = useFadeIn(0.1);
  const ref1 = useFadeIn(0.25);
  const ref2 = useFadeIn(0.4);
  const ref3 = useFadeIn(0.55);

  return (
    <>
      <Head>
        <title>About — Akram Rihani</title>
        <meta name="description" content="About Akram Rihani — full-stack developer and photographer." />
      </Head>

      <main>

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '130px',
          paddingBottom: '5rem',
          minHeight: '80vh',
        }}>
          {/* Particle background */}
          <ParticleNetwork config={{
            nodeCount: 55,
            nodeColor: '#ff6b35',
            lineColor: '#ff6b35',
            cursorNodeColor: '#ffffff',
            maxLineDistance: 130,
            cursorRadius: 180,
            cursorStrength: 0.012,
            lineBaseOpacity: 0.11,
            speed: 0.25,
          }} />

          {/* Vignette */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, var(--bg) 100%)',
          }} />

          {/* Two-column grid */}
          <div style={{
            position: 'relative', zIndex: 2,
            maxWidth: '960px', margin: '0 auto', padding: '0 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}>
            {/* Portrait */}
            <div ref={ref0}>
              <Portrait />
            </div>

            {/* Text */}
            <div ref={ref1}>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--accent)', display: 'block', marginBottom: '1rem',
              }}>
                About me
              </span>

              <h1 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                letterSpacing: '-0.04em', lineHeight: 1.05,
                color: 'var(--white)', marginBottom: '1.4rem',
              }}>
                Crafting digital<br />
                <span style={{ WebkitTextStroke: '1px #555', color: 'transparent' }}>
                  experiences
                </span><br />
                with precision.
              </h1>

              <p style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '0.9rem', marginBottom: '1rem' }}>
                I'm a full-stack developer with 5+ years of experience building products that are fast, accessible, and genuinely delightful to use.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '0.9rem', marginBottom: '2rem' }}>
                When I'm not shipping features, I'm out with my Sony α7 capturing landscapes, cityscapes, and anything with interesting light.
              </p>

              {/* Stat pills */}
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                {[
                  { n: '5+',  label: 'Years coding'     },
                  { n: '30+', label: 'Projects shipped'  },
                  { n: '8',   label: 'Countries shot'    },
                ].map(({ n, label }) => (
                  <div key={label} style={{
                    padding: '10px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: '4px', textAlign: 'center',
                  }}>
                    <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)', letterSpacing: '-0.03em', lineHeight: 1 }}>{n}</p>
                    <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '4px' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ SKILLS ════════════════════════════════════════════════════ */}
        <section style={{ padding: '4rem 2rem 5rem', maxWidth: '960px', margin: '0 auto' }}>
          <div ref={ref2} style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}>
              Toolkit
            </span>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--white)', letterSpacing: '-0.03em' }}>
              Technical Skills
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem' }}>
            {skills.map(s => <SkillBadge key={s.skill} {...s} />)}
          </div>
        </section>

        {/* ══ TIMELINE ══════════════════════════════════════════════════ */}
        <section style={{ padding: '0 2rem 7rem', maxWidth: '960px', margin: '0 auto' }}>
          <div ref={ref3} style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}>
              Career
            </span>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--white)', letterSpacing: '-0.03em' }}>
              Experience
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {timeline.map((item, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '2rem',
                paddingBottom: '2.5rem',
                position: 'relative',
              }}>
                {i < timeline.length - 1 && (
                  <div style={{
                    position: 'absolute', left: '39px', top: '24px', bottom: 0,
                    width: '1px', background: 'var(--border)',
                  }} />
                )}
                <div style={{ textAlign: 'right', paddingTop: '4px' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.06em' }}>
                    {item.year}
                  </span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', marginLeft: 'auto', marginTop: '8px', boxShadow: '0 0 6px var(--accent)' }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--white)', marginBottom: '4px' }}>{item.role}</h3>
                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>{item.company}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </>
  );
}