'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <span
        className="font-mono text-[0.6rem] tracking-widest uppercase block mb-6"
        style={{ color: 'var(--accent)' }}
      >
        Something went wrong
      </span>
      <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,3rem)] text-white tracking-tight leading-none mb-4">
        An unexpected error occurred
      </h1>
      <p className="text-sm text-white/40 max-w-[400px] mb-8">
        {error.message || 'Please try again.'}
      </p>
      <button
        onClick={reset}
        className="glass-button glass-button-primary no-underline"
      >
        Try again
      </button>
    </div>
  )
}
