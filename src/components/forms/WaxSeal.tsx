'use client'

import { Monogram } from '@/components/museum/Monogram'

/**
 * THE SEAL — the visitor's note is sealed with the keeper's mark.
 * One organic blob of wax, stamped by animation, never quite round —
 * wax is pressed, not poured.
 */
export function WaxSeal() {
  return (
    <span className="wax-seal flex h-12 w-12 shrink-0 items-center justify-center rounded-[58%_42%_55%_45%/50%_56%_44%_50%]">
      <Monogram className="h-7 w-7 text-[#f6efe0]" />
    </span>
  )
}
