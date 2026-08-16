import { EntranceScene } from '@/components/sections/home/EntranceScene'
import { Fountain } from '@/components/sections/home/Fountain'
import { Workshop } from '@/components/sections/home/Workshop'
import { LoomRoom } from '@/components/sections/home/LoomRoom'
import { Collection } from '@/components/sections/home/Collection'
import { Archive } from '@/components/sections/home/Archive'
import { LivingRoom } from '@/components/sections/home/LivingRoom'
import { ExitRoom } from '@/components/sections/home/ExitRoom'

/**
 * THE MUSEUM — one continuous walk:
 * Atrium → Living Room → Fountain → Workshop → The Loom → Collection → Archive →
 * Exit.
 */
export default function Home() {
  return (
    <>
      <EntranceScene />
      <LivingRoom />
      <Fountain />
      <Workshop />
      <LoomRoom />
      <Collection />
      <Archive />
      <ExitRoom />
    </>
  )
}