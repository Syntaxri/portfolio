import type { Metadata } from 'next'
import { ContactClient } from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Akram Rihani — open to projects, collaborations, and conversations.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-shell px-5 pt-[calc(var(--nav-h)+2.5rem)] sm:px-8">
      <ContactClient />
    </div>
  )
}
