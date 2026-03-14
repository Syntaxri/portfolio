"use client";
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ParticleNetwork from '../../components/ParticleNetwork';

// ─── Photo data (swap src with your real images) ──────────────────────────
const PHOTOS = [
  { id: 1,  src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=70', title: 'Mountain Silence',    category: 'landscape', aspect: 'tall'   },
  { id: 2,  src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&q=70', title: 'Golden Hour',        category: 'landscape', aspect: 'wide'   },
  { id: 3,  src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=70', title: 'Portrait I',         category: 'portrait',  aspect: 'tall'   },
  { id: 4,  src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&q=70', title: 'City Grid',          category: 'urban',     aspect: 'wide'   },
  { id: 5,  src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=70', title: 'Fog Valley',         category: 'landscape', aspect: 'wide'   },
  { id: 6,  src: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500&q=70', title: 'Portrait II',        category: 'portrait',  aspect: 'tall'   },
  { id: 7,  src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=70', title: 'Urban Geometry',     category: 'urban',     aspect: 'tall'   },
  { id: 8,  src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&q=70', title: 'Road to Nowhere',    category: 'landscape', aspect: 'wide'   },
  { id: 9,  src: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&q=70', title: 'Night Lights',       category: 'urban',     aspect: 'wide'   },
  { id: 10, src: 'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?w=500&q=70', title: 'Portrait III',       category: 'portrait',  aspect: 'tall'   },
  { id: 11, src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&q=70', title: 'Alpine Dusk',        category: 'landscape', aspect: 'wide'   },
  { id: 12, src: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=500&q=70', title: 'Steel & Glass',      category: 'urban',     aspect: 'tall'   },
];

const CATEGORIES = ['all', 'landscape', 'portrait', 'urban'];

// ─── Lightbox ──────────────────────────────────────────────────────────────
function Lightbox({ photo, photos, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  if (!photo) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.96)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>

      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); onPrev(); }}
        style={{
          position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem',
          width: '44px', height: '44px', borderRadius: '2px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
      >←</button>

      {/* Image */}
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '85vw', maxHeight: '85vh' }}>
        <img
          src={photo.src}
          alt={photo.title}
          style={{
            maxWidth: '85vw', maxHeight: '80vh',
            objectFit: 'contain', display: 'block',
            borderRadius: '2px',
          }}
        />
        <div style={{
          marginTop: '1rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <p style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: '1rem', color: '#fff', letterSpacing: '-0.02em',
            }}>{photo.title}</p>
            <p style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)', marginTop: '2px',
            }}>{photo.category}</p>
          </div>
          <p style={{
            fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em',
          }}>
            {photos.indexOf(photo) + 1} / {photos.length}
          </p>
        </div>
      </div>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); onNext(); }}
        style={{
          position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem',
          width: '44px', height: '44px', borderRadius: '2px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
      >→</button>

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
          fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1,
          fontFamily: 'monospace',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
      >✕</button>
    </div>
  );
}

// ─── Photo card ────────────────────────────────────────────────────────────
function PhotoCard({ photo, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(photo)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: '2px',
        background: 'var(--surface)',
        gridRow: photo.aspect === 'tall' ? 'span 2' : 'span 1',
      }}
    >
      <img
        src={photo.thumb}
        alt={photo.title}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
          filter: hovered ? 'brightness(0.6)' : 'brightness(0.85)',
        }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)',
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.35s ease',
      }} />

      {/* Category pill */}
      <div style={{
        position: 'absolute', top: '14px', left: '14px',
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '4px 10px',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.7)',
        borderRadius: '2px',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'all 0.3s ease',
      }}>
        {photo.category}
      </div>

      {/* Title — slides up on hover */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '1.2rem 1rem 1rem',
        transform: hovered ? 'translateY(0)' : 'translateY(12px)',
        opacity: hovered ? 1 : 0,
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <p style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '1rem',
          letterSpacing: '-0.02em',
          color: '#fff',
          lineHeight: 1.2,
        }}>
          {photo.title}
        </p>
        <p style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.08em',
          marginTop: '4px',
        }}>
          Click to expand
        </p>
      </div>

      {/* Accent corner on hover */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: hovered ? '40px' : '0',
        height: '2px',
        background: 'var(--accent)',
        transition: 'width 0.4s ease 0.1s',
      }} />
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Photography() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const filtered = activeCategory === 'all'
    ? PHOTOS
    : PHOTOS.filter(p => p.category === activeCategory);

  const openLightbox = useCallback(photo => {
    setLightboxPhoto(photo);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxPhoto(null);
    document.body.style.overflow = '';
  }, []);

  const prevPhoto = useCallback(() => {
    if (!lightboxPhoto) return;
    const idx = filtered.indexOf(lightboxPhoto);
    setLightboxPhoto(filtered[(idx - 1 + filtered.length) % filtered.length]);
  }, [lightboxPhoto, filtered]);

  const nextPhoto = useCallback(() => {
    if (!lightboxPhoto) return;
    const idx = filtered.indexOf(lightboxPhoto);
    setLightboxPhoto(filtered[(idx + 1) % filtered.length]);
  }, [lightboxPhoto, filtered]);

  return (
    <>
      <Head>
        <title>Photography — Portfolio</title>
        <meta name="description" content="Photography portfolio — landscape, portrait, urban" />
      </Head>

      <Navbar />

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
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
          {/* ── Header ─────────────────────────────────────────────────── */}
          <div style={{ marginBottom: '4rem' }}>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              display: 'block',
              marginBottom: '1rem',
            }}>
              Through the lens
            </span>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
              <h1 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                color: 'var(--white)',
              }}>
                Akramo&shy;<br />
                <span style={{ color: 'var(--muted)' }}>graphy</span>
              </h1>

              <p style={{
                maxWidth: '340px',
                color: 'var(--muted)',
                fontSize: '0.88rem',
                lineHeight: 1.8,
                fontFamily: 'DM Mono, monospace',
              }}>
                I shoot between commits. Landscapes, street scenes, and the occasional portrait — always chasing the frame where light and geometry collide.
              </p>
            </div>

            {/* Divider */}
            <div style={{
              marginTop: '2.5rem',
              height: '1px',
              background: 'linear-gradient(90deg, var(--accent) 0%, var(--border) 40%, transparent 100%)',
            }} />
          </div>
          </section>
          {/* ── Filter tabs ────────────────────────────────────────────── */}
          <div style={{
            display: 'flex', gap: '0.4rem', marginBottom: '2.5rem', flexWrap: 'wrap',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.72rem',
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  padding: '8px 20px',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'var(--accent)' : 'var(--border)',
                  background: activeCategory === cat ? 'var(--accent)' : 'transparent',
                  color: activeCategory === cat ? 'var(--bg)' : 'var(--muted)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = 'var(--text)';
                    e.currentTarget.style.color = 'var(--text)';
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--muted)';
                  }
                }}
              >
                {cat}
                <span style={{
                  marginLeft: '8px',
                  opacity: 0.5,
                  fontSize: '0.65rem',
                }}>
                  {cat === 'all' ? PHOTOS.length : PHOTOS.filter(p => p.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {/* ── Masonry Grid ───────────────────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gridAutoRows: '220px',
            gap: '10px',
            marginBottom: '6rem',
          }}>
            {filtered.map(photo => (
              <PhotoCard key={photo.id} photo={photo} onClick={openLightbox} />
            ))}
          </div>

          {/* ── Bottom callout ─────────────────────────────────────────── */}
          <div style={{
            marginBottom: '6rem',
            padding: '3rem',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            }} />
            <div>
              <p style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: '1.4rem', color: 'var(--white)', letterSpacing: '-0.02em',
                marginBottom: '0.4rem',
              }}>
                Need a photographer?
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontFamily: 'DM Mono, monospace' }}>
                Available for projects, events & collaborations.
              </p>
            </div>
            <a
              href="mailto:hello@example.com"
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.78rem',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                padding: '12px 28px',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
                borderRadius: '2px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--bg)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)'; }}
            >
              Get in touch →
            </a>
          </div>

        </div>
      </main>

      {lightboxPhoto && (
        <Lightbox
          photo={lightboxPhoto}
          photos={filtered}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </>
  );
}