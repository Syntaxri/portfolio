import { ImageResponse } from 'next/og'
import { MONOGRAM_PATHS, starPath } from '@/lib/geometry'

export const runtime = 'edge'
export const alt = 'Akram Rihani — the museum of software craftsmanship'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '84px 96px',
          background: '#eae4d4',
          color: '#1c1a16',
          position: 'relative',
        }}
      >
        <svg
          width="560"
          height="560"
          viewBox="0 0 560 560"
          style={{ position: 'absolute', right: -40, top: 20, opacity: 0.5 }}
        >
          <path d={starPath(280, 280, 250, 108)} fill="none" stroke="#1e4082" strokeWidth="1.4" />
          <path
            d={starPath(280, 280, 250, 108)}
            fill="none"
            stroke="#8c6634"
            strokeWidth="1"
            transform="rotate(22.5 280 280)"
          />
          <path d={starPath(280, 280, 250, 108)} fill="none" stroke="#15695c" strokeWidth="1" transform="rotate(45 280 280)" />
        </svg>
        <svg width="72" height="69" viewBox="0 0 100 96" style={{ marginBottom: 34 }}>
          <path d={MONOGRAM_PATHS.arch} fill="#1e4082" />
          <path d={MONOGRAM_PATHS.vLeft} stroke="#eae4d4" strokeWidth="7" strokeLinecap="round" />
          <path d={MONOGRAM_PATHS.vRight} stroke="#eae4d4" strokeWidth="7" strokeLinecap="round" />
          <path d={MONOGRAM_PATHS.keystone} fill="#eae4d4" />
          <path d={MONOGRAM_PATHS.floor} stroke="#8c6634" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
        <div style={{ fontSize: 28, display: 'flex', gap: 20, color: '#6f6656', letterSpacing: 6, marginBottom: 26 }}>
          <span>THE MUSEUM OF SOFTWARE CRAFTSMANSHIP</span>
        </div>
        <div
          style={{
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'sans-serif',
          }}
        >
          <span>AKRAM RIHANI</span>
          <span style={{ color: '#1e4082' }}>
            I BUILD IDEAS INTO <span style={{ WebkitTextStroke: '2.4px #1c1a16', color: 'transparent' }}>REAL</span> THINGS.
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}