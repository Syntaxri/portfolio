import { zelligeBandSvg } from '@/lib/geometry'

interface ZelligeBandProps {
  className?: string
  tile?: number
  count?: number
  colors?: string[]
  /** washed-out paint for calm places */
  muted?: boolean
  'aria-hidden'?: boolean | 'true' | 'false'
}

/** A woven strip of glazed stars — the seam between museum rooms. */
export function ZelligeBand({
  className = '',
  tile = 14,
  count = 48,
  colors,
  muted = false,
}: ZelligeBandProps) {
  const uri =
    'data:image/svg+xml,' +
    encodeURIComponent(zelligeBandSvg(count, tile, colors))
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        width: '100%',
        height: tile,
        backgroundImage: `url("${uri}")`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: `${count * tile}px ${tile}px`,
        opacity: muted ? 0.45 : 0.85,
      }}
    />
  )
}