import { site } from '@/lib/data/site'

const ORIGIN = `https://${site.domain}` as const

/**
 * THE LEDGER OF THE BUILDING — the structured description of the whole
 * museum, rendered once in the head of every hall. One Person (the keeper)
 * and one WebSite (the museum), connected by @id so the entity stands as
 * one thing: Akram Rihani is the publisher of akramrihani.com.
 */
function ledger() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${ORIGIN}/#person`,
        name: site.name,
        url: `${ORIGIN}/`,
        jobTitle: site.jobTitle,
        sameAs: [site.github, site.linkedin, site.instagram],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Azrou',
          addressCountry: 'MA',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${ORIGIN}/#website`,
        url: `${ORIGIN}/`,
        name: `${site.name} — The Museum of Software Craftsmanship`,
        inLanguage: 'en',
        publisher: { '@id': `${ORIGIN}/#person` },
      },
    ],
  }
}

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(ledger()).replaceAll('<', '\\u003c'),
      }}
    />
  )
}
