import type { Metadata } from 'next'
import { ContactClient } from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Akram Rihani — open to projects, collaborations, and conversations.',
}

export default function ContactPage() {
  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 pt-8">
      <ContactClient />
    </div>
  )
}
