// Shared, grouped gallery image list (issue #11).
//
// Single source of truth for the cottage interiors/exterior, grouped by space.
// Both TheHome.astro (a curated subset) and gallery.astro (the full set) read
// from here so the two stay in sync. Source JPEGs live in src/assets/media/ and
// were produced by scripts/process-images.sh from the host's .CR3 originals.
//
// We import the source modules eagerly via import.meta.glob so Astro's <Image>
// pipeline can emit AVIF/WebP + responsive srcset for each (astro:assets needs a
// real ImageMetadata import, not a runtime string path).
import type { ImageMetadata } from 'astro';

// Eagerly resolve every JPEG in src/assets/media so we can look images up by
// filename. `eager: true` gives us the metadata object Astro's <Image> expects.
const sources = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/media/*.jpg',
  { eager: true },
);

/** Resolve a bare filename (e.g. "kitchen-1.jpg") to its ImageMetadata. */
function img(file: string): ImageMetadata {
  const mod = sources[`../assets/media/${file}`];
  if (!mod) {
    throw new Error(
      `gallery.ts: missing image source for "${file}" in src/assets/media/`,
    );
  }
  return mod.default;
}

export interface GalleryImage {
  src: ImageMetadata;
  alt: string;
}

export interface GalleryGroup {
  /** Stable id for headings / anchors. */
  id: string;
  title: string;
  images: GalleryImage[];
}

// Grouped by space. Alt text is meaningful and specific (accessibility req).
export const groups: GalleryGroup[] = [
  {
    id: 'living',
    title: 'Living & seating',
    images: [
      {
        src: img('seating-area-2.jpg'),
        alt: 'Bright living area with a mustard sofa and soft coastal daylight',
      },
      {
        src: img('seating-area-indoor-1.jpg'),
        alt: 'Indoor seating area arranged for slow, comfortable evenings',
      },
      {
        src: img('seating-area-flowers.jpg'),
        alt: 'Living-room corner with fresh flowers on the table',
      },
      {
        src: img('tv-1.jpg'),
        alt: 'Seating area with a television, set up for cosy nights in',
      },
    ],
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    images: [
      {
        src: img('kitchen-1.jpg'),
        alt: 'Full kitchen, bright and ready for slow coastal mornings',
      },
      {
        src: img('kitchen-2.jpg'),
        alt: 'Kitchen counter and cabinetry with ample prep space',
      },
      {
        src: img('kitchen-3.jpg'),
        alt: 'Kitchen viewed from the dining side, fully equipped to cook in',
      },
    ],
  },
  {
    id: 'bedrooms',
    title: 'Bedrooms',
    images: [
      {
        src: img('main-bedroom-1.jpg'),
        alt: 'Main bedroom with a queen bed dressed in calm, coastal tones',
      },
      {
        src: img('back-main-bedroom.jpg'),
        alt: 'Main bedroom seen from the back of the room, light and airy',
      },
      {
        src: img('bed-1.jpg'),
        alt: 'Queen bed made up with crisp linens in the second bedroom',
      },
    ],
  },
  {
    id: 'bathrooms',
    title: 'Bathrooms',
    images: [
      {
        src: img('bathroom-main-1.jpg'),
        alt: 'Main full bathroom with a clean, bright finish',
      },
      {
        src: img('on-suit-bathroom-1.jpg'),
        alt: 'En-suite bathroom with vanity and mirror',
      },
      {
        src: img('on-suite-bathroom-2.jpg'),
        alt: 'En-suite bathroom, second view showing the layout',
      },
      {
        src: img('shower-1.jpg'),
        alt: 'Walk-in shower with tiled surround',
      },
    ],
  },
  {
    id: 'deck-exterior',
    title: 'Deck & exterior',
    images: [
      {
        src: img('deck-seating-back.jpg'),
        alt: 'Back deck seating with a view out over the bay',
      },
      {
        src: img('seating-deck-back.jpg'),
        alt: 'Outdoor seating on the back deck, set for coffee in the morning sun',
      },
      {
        src: img('side-deck.jpg'),
        alt: 'Side deck of the cottage, wrapping along the cedar-shingle siding',
      },
      {
        src: img('side-deck-house.jpg'),
        alt: 'Side deck looking back toward the grey-blue cedar-shingle house',
      },
      {
        src: img('front-house.jpg'),
        alt: 'Front of the cottage with its weathered cedar shingles',
      },
      {
        src: img('back-of-house.jpg'),
        alt: 'Back of the cottage facing the deck and the bay beyond',
      },
      {
        src: img('back-house.jpg'),
        alt: 'Rear elevation of the cottage above the beach',
      },
      {
        src: img('back-full-shot.jpg'),
        alt: 'Full view of the back of the house and deck from the yard',
      },
    ],
  },
  {
    id: 'details',
    title: 'Details & utility',
    images: [
      {
        src: img('detail-pic.jpg'),
        alt: 'A small interior detail that gives the cottage its character',
      },
      {
        src: img('hallway-pic.jpg'),
        alt: 'Hallway connecting the rooms of the cottage',
      },
      {
        src: img('entrance-area-1.jpg'),
        alt: 'Entrance area welcoming you in from the deck',
      },
      {
        src: img('dryer-washer.jpg'),
        alt: 'In-unit washer and dryer for longer stays',
      },
    ],
  },
];

// A curated, tasteful subset for the homepage "The Home" section — one or two
// strong frames per space, kept to ~8 images so the section stays editorial.
export const featuredAltSet = new Set<string>([
  'Bright living area with a mustard sofa and soft coastal daylight',
  'Seating area with a television, set up for cosy nights in',
  'Full kitchen, bright and ready for slow coastal mornings',
  'Main bedroom with a queen bed dressed in calm, coastal tones',
  'Main full bathroom with a clean, bright finish',
  'Back deck seating with a view out over the bay',
  'Front of the cottage with its weathered cedar shingles',
  'Side deck of the cottage, wrapping along the cedar-shingle siding',
]);

export const featured: GalleryImage[] = groups
  .flatMap((g) => g.images)
  .filter((i) => featuredAltSet.has(i.alt));

/** The full, ordered list (used by the gallery + lightbox). */
export const allImages: GalleryImage[] = groups.flatMap((g) => g.images);
