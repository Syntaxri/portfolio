"use client";
import { useState, useRef } from 'react';

export default function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const { title, description, tags = [], link, github, year } = project;

  // 3D tilt effect on mouse move
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (cardRef.current) cardRef.current.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        border: `1px solid ${hovered ? 'rgba(var(--accent-rgb),0.5)' : 'var(--border)'}`,
        borderRadius: '10px',
        padding: '2rem',
        background: hovered
          ? 'linear-gradient(135deg, rgba(var(--accent-rgb),0.06) 0%, var(--surface) 100%)'
          : 'var(--surface)',
        transition: 'border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        // smooth return transition — JS overrides this on move, restores on leave
        willChange: 'transform',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hovered
          ? '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(var(--accent-rgb),0.15)'
          : '0 2px 12px rgba(0,0,0,0.2)',
      }}
    >
      {/* Accent top bar — grows on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: hovered ? '100%' : '0%',
        height: '2px',
        background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
        transition: 'width 0.45s cubic-bezier(0.16,1,0.3,1)',
      }} />

      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: 'var(--accent)',
        filter: 'blur(50px)',
        opacity: hovered ? 0.12 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{
          fontFamily: 'Syne, sans-serif', fontSize: '1.15rem', fontWeight: 800,
          letterSpacing: '-0.02em',
          color: hovered ? 'var(--accent)' : 'var(--white)',
          transition: 'color 0.25s ease',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          transitionProperty: 'color, transform',
          transitionDuration: '0.3s',
          transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
        }}>
          {title}
        </h3>
        {year && (
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
            color: 'var(--muted)', letterSpacing: '0.08em',
            flexShrink: 0, marginLeft: '1rem',
          }}>
            {year}
          </span>
        )}
      </div>

      <p style={{
        color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7,
        marginBottom: '1.5rem',
        transition: 'color 0.25s ease',
      }}>
        {description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
        {tags.map((tag, i) => (
          <span
            key={tag}
            style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              padding: '3px 10px',
              border: `1px solid ${hovered ? 'rgba(var(--accent-rgb),0.25)' : 'var(--border)'}`,
              borderRadius: '4px',
              color: hovered ? 'rgba(var(--accent-rgb),0.8)' : 'var(--muted)',
              background: hovered ? 'rgba(var(--accent-rgb),0.05)' : 'transparent',
              transition: `all 0.25s ease ${i * 0.04}s`, // stagger
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.73rem',
              letterSpacing: '0.06em', textTransform: 'uppercase',
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
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.73rem',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--muted)', textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
          >
            GitHub ↗
          </a>
        )}
      </div>
    </article>
  );
}