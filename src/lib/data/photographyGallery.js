/**
 * photographyGallery.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Structured photo data for Photography mode.
 *
 * Schema per entry:
 * {
 *   id          : number   — unique integer (required)
 *   title       : string   — descriptive alt / display title (required)
 *   imageUrl    : string   — full URL or /public path (required)
 *   category    : 'landscape' | 'urban' | 'nature' | 'portrait' (required)
 *   collection  : string   — slug of parent collection, or null
 *   location    : string   — human-readable location (required)
 *   year        : string   — "YYYY" (required)
 *   aspectRatio : 'landscape' | 'portrait' | 'square' (default 'square')
 *   featured    : boolean  — show in homepage strip (default false)
 *   description : string   — optional longer caption (default '')
 * }
 *
 * Collections schema:
 * {
 *   slug  : string  — unique ID matching photo.collection
 *   title : string
 *   cover : string  — imageUrl of the cover shot
 *   count : number  — auto-computed, set manually for accuracy
 *   tag   : string  — category this collection belongs to
 * }
 */

export const PHOTO_DEFAULTS = {
  aspectRatio: 'square',
  featured:    false,
  collection:  null,
  description: '',
};

function photo(data) {
  return { ...PHOTO_DEFAULTS, ...data };
}

export const photographyGallery = [
  photo({
    id:          1,
    title:       'Mountain peaks at dusk',
    imageUrl:    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    category:    'landscape',
    collection:  'golden-horizons',
    location:    'Alps, Switzerland',
    year:        '2024',
    aspectRatio: 'landscape',
    featured:    true,
    description: 'Last light catching the granite ridgeline before dark.',
  }),
  photo({
    id:          2,
    title:       'City lights at night',
    imageUrl:    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
    category:    'urban',
    collection:  'urban-pulse',
    location:    'Tokyo, Japan',
    year:        '2024',
    aspectRatio: 'portrait',
    featured:    true,
    description: 'Neon blur from a slow shutter in Shinjuku.',
  }),
  photo({
    id:          3,
    title:       'Ocean at golden hour',
    imageUrl:    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
    category:    'landscape',
    collection:  'golden-horizons',
    location:    'Big Sur, CA',
    year:        '2023',
    aspectRatio: 'landscape',
    featured:    true,
    description: 'Pacific coast thirty minutes before the light disappeared.',
  }),
  photo({
    id:          4,
    title:       'Abstract architecture',
    imageUrl:    'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=800&q=80',
    category:    'urban',
    collection:  'urban-pulse',
    location:    'Dubai, UAE',
    year:        '2023',
    aspectRatio: 'square',
    featured:    false,
    description: 'Glass and steel — looking straight up.',
  }),
  photo({
    id:          5,
    title:       'Misty forest morning',
    imageUrl:    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80',
    category:    'nature',
    collection:  'silent-greens',
    location:    'Black Forest, Germany',
    year:        '2024',
    aspectRatio: 'portrait',
    featured:    false,
    description: 'Fog threading between pine trunks at 6am.',
  }),
  photo({
    id:          6,
    title:       'Desert sand dunes',
    imageUrl:    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
    category:    'landscape',
    collection:  'golden-horizons',
    location:    'Sahara, Morocco',
    year:        '2023',
    aspectRatio: 'landscape',
    featured:    false,
    description: 'Wind-sculpted ridges just after sunrise.',
  }),
  photo({
    id:          7,
    title:       'Downtown skyline',
    imageUrl:    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    category:    'urban',
    collection:  'urban-pulse',
    location:    'Chicago, IL',
    year:        '2022',
    aspectRatio: 'square',
    featured:    false,
    description: 'Looking south from the 360 Chicago observation deck.',
  }),
  photo({
    id:          8,
    title:       'Wildflower meadow',
    imageUrl:    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80',
    category:    'nature',
    collection:  'silent-greens',
    location:    'Tuscany, Italy',
    year:        '2024',
    aspectRatio: 'portrait',
    featured:    false,
    description: 'Poppies in a Tuscan field, late May.',
  }),
];

export const photographyCollections = [
  {
    slug:  'golden-horizons',
    title: 'Golden Horizons',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    count: 3,
    tag:   'landscape',
    description: 'Landscapes chasing the quality of light.',
  },
  {
    slug:  'urban-pulse',
    title: 'Urban Pulse',
    cover: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
    count: 3,
    tag:   'urban',
    description: 'Cities in motion — neon, concrete, and glass.',
  },
  {
    slug:  'silent-greens',
    title: 'Silent Greens',
    cover: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80',
    count: 2,
    tag:   'nature',
    description: 'Forests, meadows, and the quiet in between.',
  },
];

/** Convenience selectors */
export const featuredPhotos          = photographyGallery.filter(p => p.featured);
export const getPhotosByCategory     = cat => photographyGallery.filter(p => p.category === cat);
export const getPhotosByCollection   = slug => photographyGallery.filter(p => p.collection === slug);
export const getCollectionBySlug     = slug => photographyCollections.find(c => c.slug === slug) ?? null;