import Marquee from './StackMarquee'
import { stack } from '@/lib/data/capabilities'

export function StackSection() {
  return (
    <section aria-label="Technology" className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <p className="label label-accent mb-8">06 — Technology</p>
        <h2 className="fluid-h2 max-w-2xl font-extrabold tracking-tight">
          The tools I reach for daily
        </h2>
      </div>
      <Marquee items={stack} />
    </section>
  )
}