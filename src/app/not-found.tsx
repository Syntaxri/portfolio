import Link from 'next/link'
import { Monogram } from '@/components/museum/Monogram'

/**
 * The corridor that leads nowhere: a hall with no number, and the
 * recommended reading beneath it.
 */
export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70svh] flex-col items-center justify-center px-4 py-28 text-center">
      <Monogram className="mb-8 h-14 w-14 text-accent" />
      <span className="label-accent label mb-6">Room — unnumbered</span>
      <h1 className="display-title text-outline">404</h1>
      <h2 className="serif mt-4 text-3xl text-text-2">This hall was never built.</h2>
      <p className="mt-4 max-w-[46ch] text-text-3">
        The museum has no record of this room. Two exhibits you are welcome to visit instead:
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn">
          The entrance
        </Link>
        <Link href="/#collection" className="btn-ghost">
          The Collection
        </Link>
      </div>
    </main>
  )
}