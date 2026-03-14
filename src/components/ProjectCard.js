"use client";
import { useState } from 'react';

export default function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  const { title, description, tags = [], link, github, year } = project;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '4px',
        padding: '2rem',
        background: hovered ? 'rgba(200,240,74,0.03)' : 'var(--surface)',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent corner */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: hovered ? '80px' : '0px',
        height: '2px',
        background: 'var(--accent)',
        transition: 'width 0.3s ease',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '1.2rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: hovered ? 'var(--accent)' : 'var(--white)',
          transition: 'color 0.2s',
        }}>
          {title}
        </h3>
        {year && (
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.7rem',
            color: 'var(--muted)',
            letterSpacing: '0.08em',
          }}>
            {year}
          </span>
        )}
      </div>

      <p style={{
        color: 'var(--muted)',
        fontSize: '0.88rem',
        lineHeight: 1.7,
        marginBottom: '1.5rem',
      }}>
        {description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {tags.map(tag => (
          <span key={tag} style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.06em',
            padding: '3px 10px',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            color: 'var(--muted)',
            textTransform: 'uppercase',
          }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'gap 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.gap = '10px'}
          onMouseLeave={e => e.currentTarget.style.gap = '6px'}
          >
            Live → 
          </a>
        )}
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--text)'}
          onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >
            GitHub ↗
          </a>
        )}
      </div>
    </article>
  );
}