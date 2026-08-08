import type { Metadata, Viewport } from 'next'
import { Inter, DM_Mono, Syne } from 'next/font/google'
import { Providers } from './providers'
import { Navbar } from '../components/navigation/Navbar'
import { Preloader } from '../components/animations/Preloader'
import { PageTransition } from '../components/animations/PageTransition'
import { CustomCursor } from '../components/animations/CustomCursor'
import { SectionRail } from '../components/animations/SectionRail'
import { site } from '@/lib/data/site'
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
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} — Creative Developer`,
    template: `%s — ${site.name}`,
  },
  description: site.strapline,
  alternates: {
    canonical: '/',
  },
  keywords: [
    'creative developer',
    '3d web developer',
    'webgl',
    'three.js',
    'react',
    'next.js',
    'gsap',
    'full-stack',
    'java',
    'spring boot',
    'typescript',
    'portfolio',
    'morocco',
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `https://${site.domain}`,
    siteName: site.name,
    title: `${site.name} — Creative Developer`,
    description: site.strapline,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${site.name} — portfolio` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Creative Developer`,
    description: site.strapline,
    images: ['/og.png'],
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

export const viewport: Viewport = {
  themeColor: '#05060a',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${dmMono.variable} ${syne.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: site.name,
              url: `https://${site.domain}`,
              email: `mailto:${site.email}`,
              knowsAbout: [
                'Creative Development',
                'WebGL',
                'Three.js',
                'React',
                'Next.js',
                'GSAP',
                'Java',
                'Spring Boot',
              ],
              sameAs: [site.github, site.linkedin],
            }),
          }}
        />
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:bg-accent focus:px-4 focus:py-2 focus:text-base"
          >
            Skip to content
          </a>
          <SectionRail />
          <Navbar />
          <main id="main" className="relative z-10">
            {children}
          </main>
          <div aria-hidden className="grain" />
          <Preloader />
          <PageTransition />
          <CustomCursor />
        </Providers>
      </body>
    </html>
  )
}
