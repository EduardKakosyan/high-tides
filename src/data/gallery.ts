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
    id: 'views',
    title: 'The view',
    images: [
      {
        src: img('view-1.jpg'),
        alt: 'View over Port Mouton bay from the cottage grounds, with an island offshore',
      },
      {
        src: img('view-2.jpg'),
        alt: 'The bay framed through a cottage window, with coastal trinkets on the sill',
      },
    ],
  },
  {
    id: 'living',
    title: 'Living & seating',
    images: [
      {
        src: img('seating-area-2.jpg'),
        alt: 'Bright living area with a mustard sofa and coastal daylight',
      },
      {
        src: img('seating-area-indoor-1.jpg'),
        alt: 'Comfortable indoor seating area arranged for relaxed evenings',
      },
      {
        src: img('seating-area-flowers.jpg'),
        alt: 'Living-room corner with fresh flowers on the table',
      },
      {
        src: img('tv-1.jpg'),
        alt: 'Seating area with a television',
      },
    ],
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    images: [
      {
        src: img('kitchen-1.jpg'),
        alt: 'Full kitchen at Hi Tides with bright natural light',
      },
      {
        src: img('kitchen-2.jpg'),
        alt: 'Kitchen counter and cabinetry with prep space',
      },
      {
        src: img('kitchen-3.jpg'),
        alt: 'Fully equipped kitchen viewed from the dining side',
      },
    ],
  },
  {
    id: 'bedrooms',
    title: 'Bedrooms',
    images: [
      {
        src: img('main-bedroom-1.jpg'),
        alt: 'Main bedroom with a queen bed in calm coastal tones',
      },
      {
        src: img('back-main-bedroom.jpg'),
        alt: 'Light main bedroom viewed from the back of the room',
      },
      {
        src: img('bed-1.jpg'),
        alt: 'Second bedroom with a queen bed and crisp linens',
      },
    ],
  },
  {
    id: 'bathrooms',
    title: 'Bathrooms',
    images: [
      {
        src: img('bathroom-main-1.jpg'),
        alt: 'Bright full bathroom with a clean finish',
      },
      {
        src: img('on-suit-bathroom-1.jpg'),
        alt: 'En-suite bathroom with vanity and mirror',
      },
      {
        src: img('on-suite-bathroom-2.jpg'),
        alt: 'Second view of the en-suite bathroom layout',
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
        alt: 'Back deck seating with a view over the bay',
      },
      {
        src: img('seating-deck-back.jpg'),
        alt: 'Outdoor seating on the back deck',
      },
      {
        src: img('side-deck.jpg'),
        alt: 'Side deck along the cedar-shingle siding',
      },
      {
        src: img('side-deck-house.jpg'),
        alt: 'Side deck looking back toward the grey-blue cedar-shingle cottage',
      },
      {
        src: img('front-house.jpg'),
        alt: 'Front exterior of Hi Tides with cedar shingles',
      },
      {
        src: img('back-of-house.jpg'),
        alt: 'Back of the cottage facing the deck and bay',
      },
      {
        src: img('back-house.jpg'),
        alt: 'Rear view of Hi Tides above the beach',
      },
      {
        src: img('back-full-shot.jpg'),
        alt: 'Back of the cottage and deck viewed from the yard',
      },
    ],
  },
  {
    id: 'outdoor-shower',
    title: 'Outdoor shower',
    images: [
      {
        src: img('outdoor-shower-side.jpg'),
        alt: 'Cedar outdoor shower tucked into the greenery, with a bamboo sunburst detail',
      },
      {
        src: img('outdoor-shower-entrance.jpg'),
        alt: 'Private outdoor shower beside the cottage, with the deck and bay just behind',
      },
    ],
  },
  {
    id: 'details',
    title: 'Details & utility',
    images: [
      {
        src: img('detail-pic.jpg'),
        alt: 'Small interior detail inside the cottage',
      },
      {
        src: img('hallway-pic.jpg'),
        alt: 'Hallway connecting the rooms inside Hi Tides',
      },
      {
        src: img('entrance-area-1.jpg'),
        alt: 'Entrance area leading in from the deck',
      },
      {
        src: img('dryer-washer.jpg'),
        alt: 'In-unit washer and dryer',
      },
    ],
  },
];

// A curated, tasteful subset for the homepage "The Home" section — one or two
// strong frames per space, kept to ~8 images so the section stays editorial.
export const featuredAltSet = new Set<string>([
  'Bright living area with a mustard sofa and coastal daylight',
  'Seating area with a television',
  'Full kitchen at Hi Tides with bright natural light',
  'Main bedroom with a queen bed in calm coastal tones',
  'Bright full bathroom with a clean finish',
  'Back deck seating with a view over the bay',
  'Front exterior of Hi Tides with cedar shingles',
  'Side deck along the cedar-shingle siding',
]);

export const featured: GalleryImage[] = groups
  .flatMap((g) => g.images)
  .filter((i) => featuredAltSet.has(i.alt));

/** The full, ordered list (used by the gallery + lightbox). */
export const allImages: GalleryImage[] = groups.flatMap((g) => g.images);
