/**
 * ProjectCarousel.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Production-ready Embla Carousel for the portfolio homepage.
 *
 * Features:
 *  • Embla with align:center + loop:true + dragFree:false (snap)
 *  • Active card detection via scroll progress
 *  • Active card: scale(1) opacity(1) elevated shadow
 *  • Inactive cards: scale(0.88) opacity(0.45) dimmed
 *  • Edge gradient fade overlays
 *  • Autoplay (3.5s) pauses on hover/drag
 *  • Keyboard ← → navigation
 *  • Grab/grabbing cursor
 *  • Dot indicators + prev/next buttons
 *  • Fully accessible (ARIA roles, focus management)
 *  • Zero layout shift on hydration (SSR safe)
 *  • All projects shown — not just featured
 */
"use client";

import { useEffect, useCallback, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';

// ── Card dimensions ────────────────────────────────────────────────────────
const CARD_ASPECT = '10 / 6.5'; // 16:10-ish ratio

// ── Card gradient backgrounds (per project — feels designed not generic) ──
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #0d1f3c 0%, #1a3a5c 50%, #0d2a40 100%)',
  'linear-gradient(135deg, #1a0d2e 0%, #2d1854 50%, #1a0d3c 100%)',
  'linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 50%, #0d3020 100%)',
  'linear-gradient(135deg, #2a1a0d 0%, #4a2e1a 50%, #3a200d 100%)',
  'linear-gradient(135deg, #2a0d1a 0%, #4a1a2e 50%, #3a0d20 100%)',
  'linear-gradient(135deg, #0d2a2a 0%, #1a4a4a 50%, #0d3030 100%)',
];

// ── Tag color map ──────────────────────────────────────────────────────────
const TAG_COLORS = {
  'React':        '#61dafb',
  'Next.js':      '#ffffff',
  'Node.js':      '#3c873a',
  'Python':       '#3572A5',
  'TypeScript':   '#3178c6',
  'PostgreSQL':   '#336791',
  'MongoDB':      '#4db33d',
  'GraphQL':      '#e535ab',
  'Docker':       '#2496ed',
  'Go':           '#00add8',
  'FastAPI':      '#009688',
  'OpenAI':       '#74aa9c',
  'Redis':        '#dc382d',
};
const defaultTagColor = 'rgba(255,255,255,0.5)';

// ── Single project card ────────────────────────────────────────────────────
function ProjectCard({ project, isActive, index }) {
  const [hovered, setHovered] = useState(false);
  const showHover = isActive && hovered;
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '0 0 min(480px, 82vw)',
        minWidth: 0,
        aspectRatio: CARD_ASPECT,
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        background: gradient,
        border: `1px solid ${isActive
          ? 'rgba(255,140,66,0.45)'
          : 'rgba(255,255,255,0.06)'}`,
        /* Active card rises, inactive cards recede */
        transform: isActive
          ? 'scale(1) translateY(0)'
          : 'scale(0.88) translateY(12px)',
        opacity: isActive ? 1 : 0.45,
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease, border-color 0.4s ease, box-shadow 0.4s ease',
        boxShadow: isActive
          ? '0 28px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,140,66,0.2), 0 0 60px rgba(255,140,66,0.08)'
          : '0 8px 24px rgba(0,0,0,0.3)',
        cursor: isActive ? 'pointer' : 'default',
        willChange: 'transform, opacity',
        userSelect: 'none',
      }}
    >
      {/* ── Background noise texture overlay ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.4,
      }} />

      {/* ── Top accent bar ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: isActive
          ? 'linear-gradient(90deg, var(--accent), var(--accent2), transparent)'
          : 'rgba(255,255,255,0.06)',
        transition: 'background 0.4s ease',
        zIndex: 2,
      }} />

      {/* ── Glow blob ── */}
      <div style={{
        position: 'absolute', top: '-30%', right: '-10%',
        width: '60%', height: '60%', borderRadius: '50%',
        background: CARD_GRADIENTS[index % CARD_GRADIENTS.length].includes('1a3a5c')
          ? 'rgba(96,165,250,0.12)' : 'rgba(255,140,66,0.08)',
        filter: 'blur(60px)',
        opacity: isActive ? 1 : 0.3,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* ── Card content ── */}
      <div style={{
        position: 'relative', zIndex: 3,
        padding: 'clamp(1.2rem,3vw,2rem)',
        height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
      }}>

        {/* Top row: number + status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: 'clamp(2rem,5vw,3.5rem)',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.06)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            userSelect: 'none',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {project.status === 'wip' && (
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.58rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '3px 10px', borderRadius: '12px',
                border: '1px solid rgba(255,140,66,0.5)',
                color: 'var(--accent)', background: 'rgba(255,140,66,0.08)',
              }}>WIP</span>
            )}
            <span style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
              letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)',
            }}>
              {project.year}
            </span>
          </div>
        </div>

        {/* Middle: title + description */}
        <div>
          <h3 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(1.3rem,3.5vw,2rem)',
            letterSpacing: '-0.03em', lineHeight: 1.1,
            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
            marginBottom: '0.6rem',
            transition: 'color 0.3s ease',
            transform: isActive && hovered ? 'translateX(4px)' : 'translateX(0)',
            transitionProperty: 'color, transform',
          }}>
            {project.title}
          </h3>
          <p style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: 'clamp(0.72rem,1.5vw,0.82rem)',
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.45)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {project.description}
          </p>
        </div>

        {/* Bottom: tags + links */}
        <div>
          {/* Tech tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
            {project.techStack.slice(0, 4).map((tag, i) => {
              const color = TAG_COLORS[tag] || defaultTagColor;
              return (
                <span key={tag} style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.62rem', letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '3px 10px', borderRadius: '4px',
                  border: `1px solid ${color}30`,
                  color: `${color}${isActive ? 'dd' : '77'}`,
                  background: `${color}10`,
                  transition: 'all 0.3s ease',
                  transitionDelay: `${i * 0.04}s`,
                }}>
                  {tag}
                </span>
              );
            })}
            {project.techStack.length > 4 && (
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.62rem',
                letterSpacing: '0.08em', padding: '3px 10px', borderRadius: '4px',
                color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)',
              }}>
                +{project.techStack.length - 4}
              </span>
            )}
          </div>

          {/* Action links */}
          <div style={{
            display: 'flex', gap: '1rem', alignItems: 'center',
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.35s ease 0.1s, transform 0.35s cubic-bezier(0.16,1,0.3,1) 0.1s',
          }}>
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--accent)', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'gap 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                onMouseEnter={e => e.currentTarget.style.gap = '12px'}
                onMouseLeave={e => e.currentTarget.style.gap = '6px'}
              >
                Live →
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dot indicator ──────────────────────────────────────────────────────────
function Dot({ active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={active ? 'Current slide' : 'Go to slide'}
      style={{
        width: active ? '24px' : '6px',
        height: '6px', borderRadius: '3px',
        background: active ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
        border: 'none', cursor: 'pointer', padding: 0,
        transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1), background 0.3s ease',
        outline: 'none',
      }}
    />
  );
}

// ── Nav button ─────────────────────────────────────────────────────────────
function NavBtn({ onClick, dir, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous project' : 'Next project'}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '44px', height: '44px', borderRadius: '50%',
        border: `1px solid ${hov ? 'rgba(255,140,66,0.6)' : 'rgba(255,255,255,0.12)'}`,
        background: hov ? 'rgba(255,140,66,0.1)' : 'rgba(11,20,38,0.8)',
        backdropFilter: 'blur(8px)',
        color: hov ? 'var(--accent)' : 'rgba(255,255,255,0.5)',
        cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', outline: 'none',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'scale(1.1)' : 'scale(1)',
        opacity: disabled ? 0.3 : 1,
      }}
    >
      {dir === 'prev' ? '←' : '→'}
    </button>
  );
}

// ── Main carousel ──────────────────────────────────────────────────────────
export default function ProjectCarousel({ projects }) {
  const [activeIndex,  setActiveIndex]  = useState(0);
  const [isDragging,   setIsDragging]   = useState(false);
  const autoplayRef = useRef(null);
  const isPausedRef = useRef(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align:       'center',
    loop:        true,
    dragFree:    false,
    containScroll: false,
    skipSnaps:   false,
  });

  // ── Detect active slide ────────────────────────────────────────────────
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // ── Autoplay ───────────────────────────────────────────────────────────
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!isPausedRef.current && emblaApi) emblaApi.scrollNext();
    }, 3500);
  }, [emblaApi]);

  const pauseAutoplay  = useCallback(() => { isPausedRef.current = true; }, []);
  const resumeAutoplay = useCallback(() => { isPausedRef.current = false; }, []);

  // ── Keyboard nav ──────────────────────────────────────────────────────
  const onKeyDown = useCallback((e) => {
    if (!emblaApi) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); emblaApi.scrollPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); emblaApi.scrollNext(); }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('pointerDown', () => { setIsDragging(true); pauseAutoplay(); });
    emblaApi.on('pointerUp',   () => { setIsDragging(false); resumeAutoplay(); });
    onSelect();
    startAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect, startAutoplay, pauseAutoplay, resumeAutoplay]);

  if (!projects?.length) return null;

  return (
    <section
      aria-label="Featured projects"
      aria-roledescription="carousel"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onKeyDown={onKeyDown}
      tabIndex={0}
      style={{ outline: 'none', position: 'relative' }}
    >
      <style>{`
        .embla { overflow: hidden; }
        .embla__container {
          display: flex;
          gap: clamp(12px, 2vw, 24px);
          align-items: center;
          padding: 2rem 0 3rem;
          cursor: grab;
        }
        .embla__container:active { cursor: grabbing; }
      `}</style>

      {/* ── Left fade overlay ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 'clamp(60px,8vw,120px)',
        background: 'linear-gradient(90deg, var(--bg) 0%, transparent 100%)',
        zIndex: 10, pointerEvents: 'none',
      }} />
      {/* ── Right fade overlay ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: 'clamp(60px,8vw,120px)',
        background: 'linear-gradient(270deg, var(--bg) 0%, transparent 100%)',
        zIndex: 10, pointerEvents: 'none',
      }} />

      {/* ── Embla viewport ── */}
      <div
        className="embla"
        ref={emblaRef}
        role="list"
        style={{ userSelect: 'none' }}
      >
        <div className="embla__container">
          {projects.map((project, i) => (
            <div
              key={project.id}
              role="listitem"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${projects.length}: ${project.title}`}
              aria-current={i === activeIndex ? 'true' : undefined}
            >
              <ProjectCard
                project={project}
                isActive={i === activeIndex}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Controls row ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '1.5rem',
        paddingBottom: '1rem',
      }}>
        <NavBtn dir="prev" onClick={() => emblaApi?.scrollPrev()} />

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {projects.map((_, i) => (
            <Dot
              key={i}
              active={i === activeIndex}
              onClick={() => emblaApi?.scrollTo(i)}
            />
          ))}
        </div>

        <NavBtn dir="next" onClick={() => emblaApi?.scrollNext()} />
      </div>

      {/* ── Active project counter ── */}
      <p style={{
        textAlign: 'center',
        fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--muted)', marginTop: '0.25rem',
      }}>
        <span style={{ color: 'var(--accent)' }}>{String(activeIndex + 1).padStart(2, '0')}</span>
        {' / '}
        {String(projects.length).padStart(2, '0')}
      </p>
    </section>
  );
}