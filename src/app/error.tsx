'use client'

import Link from 'next/link'
import { Monogram } from '@/components/museum/Monogram'

/**
 * When the museum has a bad night: no stack trace, no blinking —
 * just a calm plaque and a working door.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-[70svh] flex-col items-center justify-center px-4 py-28 text-center">
      <Monogram className="mb-8 h-14 w-14 text-accent" />
      <span className="label-accent label mb-6">The cold gallery</span>
      <h1 className="room-title text-text">One of the tiles fell off.</h1>
      <p className="mt-4 max-w-[46ch] text-text-3">
        Something glazed wrong on this page. The rest of the museum is unharmed.
      </p>
      <p className="mt-2 font-mono text-[0.62rem] tracking-[0.14em] text-text-3">
        {error.digest ? `Digest ${error.digest}` : 'No digest recorded.'}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button type="button" onClick={reset} className="btn">
          Re-glaze the wall
        </button>
        <Link href="/" className="btn-ghost">
          Back to the entrance
        </Link>
      </div>
    </main>
  )
}