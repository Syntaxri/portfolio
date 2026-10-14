'use client'

/**
 * Root error boundary — shown when an unhandled error occurs.
 * Provides a recovery path while maintaining the museum aesthetic.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <span className="plaque plaque-accent">Exhibition Error</span>
        <h1 className="room-title">One of the tiles fell off</h1>
        <p className="lede text-text-2">
          Something went wrong while preparing the exhibition. The museum
          keeper has been notified.
        </p>
        {error.digest && (
          <span className="label label-muted">Error ID: {error.digest}</span>
        )}
        <button onClick={reset} className="btn">
          Try again
        </button>
      </div>
    </div>
  )
}
