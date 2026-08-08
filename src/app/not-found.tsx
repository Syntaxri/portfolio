import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <span
        className="font-mono text-[0.6rem] tracking-widest uppercase block mb-6"
        style={{ color: 'var(--accent)' }}
      >
        Error 404
      </span>
      <h1 className="font-display font-extrabold text-[clamp(2.5rem,6vw,4rem)] text-white tracking-tight leading-none mb-4">
        Page not found
      </h1>
      <p className="text-sm text-white/40 max-w-[400px] mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="glass-button glass-button-primary no-underline">
        Back to home
      </Link>
    </div>
  )
}
