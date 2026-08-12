import type { Metadata, Viewport } from 'next'
import { Archivo, Fraunces, Space_Mono } from 'next/font/google'
import './globals.css'
import { Topbar } from '@/components/chrome/Topbar'
import { Footer } from '@/components/chrome/Footer'
import { StabilityFactory } from '@/components/chrome/StabilityFactory'
import { SmoothScrollProvider } from '@/components/animations/SmoothScroll'
import { RoomDirectory } from '@/components/museum/RoomDirectory'
import { CustomCursor } from '@/components/animations/CustomCursor'
import { Preloader } from '@/components/animations/Preloader'
import { PageTransition } from '@/components/animations/PageTransition'
import { CraftDashboard } from '@/components/chrome/CraftDashboard'
import { CuratorsKey } from '@/components/chrome/CuratorsKey'
import { site } from '@/lib/data/site'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#eae4d4',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} — The Museum of Software Craftsmanship`,
    template: `%s · ${site.name}`,
  },
  description: site.strapline,
  applicationName: site.name,
  authors: [{ name: site.name, url: `https://${site.domain}` }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    'Akram Rihani',
    'creative developer',
    'software engineer',
    'Morocco',
    'Azrou',
    'Spring Boot',
    'Java',
    'Next.js',
    'React',
    'TypeScript',
    'Three.js',
    'WebGL',
    'freelance developer',
  ],
  category: 'portfolio',
  icons: {
    icon: [{ url: '/akramlogo.png', sizes: 'any', type: 'image/png' }],
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `https://${site.domain}`,
    siteName: site.name,
    title: `${site.name} — The Museum of Software Craftsmanship`,
    description: site.strapline,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — The Museum of Software Craftsmanship`,
    description: site.strapline,
    creator: site.instagram,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  other: {
    'sameAs': `["${site.github}","${site.linkedin}","${site.instagram}"]`,
    'og:image:alt': 'The museum of software craftsmanship — Akram Rihani',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${fraunces.variable} ${spaceMono.variable} no-cursor`}
      >
        <SmoothScrollProvider>
          <StabilityFactory />
          <Topbar />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <RoomDirectory />
          <div className="grain" aria-hidden="true" />
          <CustomCursor />
          <Preloader />
          <PageTransition />
          <CraftDashboard />
          <CuratorsKey />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}