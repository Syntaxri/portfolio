import type { Metadata } from 'next'
import { Inter, DM_Mono, Syne } from 'next/font/google'
import { Providers } from './providers'
import { Navbar } from '../components/Navbar'
import { AuroraBackground } from '../components/AuroraBackground'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://viaruq.dev'),
  title: {
    default: 'Akram Rihani — Developer',
    template: '%s — Akram Rihani',
  },
  description:
    'Backend-focused full-stack engineer. Java, Spring Boot, React, TypeScript.',
  keywords: [
    'developer',
    'full-stack',
    'java',
    'spring boot',
    'react',
    'typescript',
    'portfolio',
    'backend',
  ],
  authors: [{ name: 'Akram Rihani' }],
  creator: 'Akram Rihani',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://viaruq.dev',
    siteName: 'Akram Rihani',
    title: 'Akram Rihani — Developer',
    description:
      'Backend-focused full-stack engineer. Java, Spring Boot, React, TypeScript.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akram Rihani',
    description:
      'Backend-focused full-stack engineer. Java, Spring Boot, React, TypeScript.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${dmMono.variable} ${syne.variable} antialiased`}>
        <Providers>
          <AuroraBackground />
          <Navbar />
          <main className="relative z-10 min-h-screen pt-24 pb-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
