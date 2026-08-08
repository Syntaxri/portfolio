import { Hero } from '@/components/sections/home/Hero'
import { Manifesto } from '@/components/sections/home/Manifesto'
import { Capabilities } from '@/components/sections/home/Capabilities'
import { FeaturedWork } from '@/components/sections/home/FeaturedWork'
import { Experience } from '@/components/sections/home/Experience'
import { Process } from '@/components/sections/home/Process'
import { StackSection } from '@/components/sections/home/StackSection'
import { Engineered } from '@/components/sections/home/Engineered'
import { ContactCta } from '@/components/sections/home/ContactCta'
import { Footer } from '@/components/sections/home/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Capabilities />
      <FeaturedWork />
      <Experience />
      <Process />
      <StackSection />
      <Engineered />
      <ContactCta />
      <Footer />
    </>
  )
}