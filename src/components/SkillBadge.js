export default function SkillBadge({ skill, level }) {
  const pct = level ?? 80;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '0.8rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text)',
        }}>
          {skill}
        </span>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '0.7rem',
          color: 'var(--muted)',
        }}>
          {pct}%
        </span>
      </div>
      <div style={{
        height: '2px',
        background: 'var(--border)',
        borderRadius: '1px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: pct > 85
            ? 'var(--accent)'
            : pct > 60
            ? 'var(--text)'
            : 'var(--muted)',
          borderRadius: '1px',
          transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  );
}