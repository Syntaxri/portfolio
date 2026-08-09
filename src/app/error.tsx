'use client'

/**
 * Root error boundary. Visitors see a generic, safe message — internal
 * error details are logged only (never rendered).
 */
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="label mb-6 block" style={{ color: 'var(--accent)' }}>
        Something went wrong
      </span>
      <h1 className="mb-4 font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-none tracking-tight text-white">
        An unexpected error occurred
      </h1>
      <p className="mb-8 max-w-[400px] text-sm text-white/50">
        Please try again. If the problem persists, email me directly — the address is in the footer.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-3 border border-white/15 px-7 py-4 font-mono text-[0.65rem] uppercase tracking-widest text-ink-secondary transition-colors duration-300 hover:border-accent/50 hover:text-ink"
      >
        Try again
      </button>
    </div>
  )
}
