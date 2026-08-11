import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <span
        className="font-mono text-[0.65rem] tracking-widest uppercase block mb-6"
        style={{ color: 'var(--accent)' }}
      >
        Error 404
      </span>
      <h1 className="font-display font-extrabold text-[clamp(2.5rem,6vw,4rem)] text-white tracking-tight leading-none mb-4">
        Page not found
      </h1>
      <p className="text-sm text-white/50 max-w-[400px] mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-3 border border-white/15 px-7 py-4 font-mono text-[0.65rem] uppercase tracking-widest text-ink-secondary transition-colors duration-300 hover:border-accent/50 hover:text-ink"
      >
        Back to home
      </Link>
    </div>
  )
}
