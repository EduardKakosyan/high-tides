// The photo set, in one flat list ordered as a walkthrough: up the drive, in
// the front door, through the living room and kitchen, the bedrooms and bath,
// out to the deck and the yard, the outdoor shower, and finally the beach.
//
// No groups and no captions. Each photo's alt text is its only description
// (read by screen readers and the lightbox) and also its identity for the
// view transition between the story page and /gallery (see morphName).
//
// Source JPEGs live in src/assets/media/ (from scripts/process-images.sh and
// the beach photos the host sent). Astro's <Image> turns them into AVIF/WebP
// with responsive srcsets at build time.
import type { ImageMetadata } from 'astro';

const sources = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/media/*.jpg',
  { eager: true },
);

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

const photo = (file: string, alt: string): GalleryImage => ({
  src: img(file),
  alt,
});

// Twenty photos: four blocks of five, which is what the gallery grid's
// large-tile rhythm (every fifth photo) is built around.
export const walkthrough: GalleryImage[] = [
  photo('front-house.jpg', 'The front of Hi Tides, grey cedar shingles above the lawn and boulders'),
  photo('hallway-pic.jpg', 'Entry hall with blue panelling and coat hooks'),
  photo('entrance-area-1.jpg', 'Living room with the yellow sofa, a writing desk, and the french doors'),
  photo('seating-area-2.jpg', 'Living room with the television and reading chairs'),
  photo('seating-area-indoor-1.jpg', 'Two yellow armchairs under the cedar wall, looking out to the trees'),
  photo('kitchen-1.jpg', 'Full kitchen with island seating and a wall oven'),
  photo('dryer-washer.jpg', 'Stacked washer and dryer'),
  photo('detail-pic.jpg', 'Stained glass hummingbird and flowers in a window'),
  photo('main-bedroom-1.jpg', 'Main bedroom with a queen bed'),
  photo('on-suit-bathroom-1.jpg', 'En suite bathroom with a walk-in shower'),
  photo('bed-1.jpg', 'Second bedroom with a queen bed and a quilt'),
  photo('side-deck-house.jpg', 'Back deck with two red Adirondack chairs'),
  photo('side-deck.jpg', 'The deck looking out over Port Mouton bay'),
  photo('back-full-shot.jpg', 'The cottage from the lawn, with the bay behind'),
  photo('deck-seating-back.jpg', 'Patio seating on the back terrace'),
  photo('shower-inside.jpg', 'Inside the outdoor shower, cedar walls and a rainfall head'),
  photo('seating-area-flowers.jpg', 'Flowers along the back terrace'),
  photo('outdoor-shower-side.jpg', 'The outdoor shower among the trees'),
  photo('beach-sand.jpg', 'White sand and dunes on a clear day near Port Mouton'),
  photo('beach-sunset.jpg', 'Sunset over the beach at low tide'),
];

/** The full, ordered list used by the gallery and the lightbox. */
export const allImages: GalleryImage[] = walkthrough;

function byFile(file: string): GalleryImage {
  const meta = img(file);
  const found = walkthrough.find((p) => p.src === meta);
  if (!found) throw new Error(`gallery.ts: "${file}" is not in the walkthrough`);
  return found;
}

/** The cottage section on the story page: four interiors, living room leads. */
export const homeFeatured: GalleryImage[] = [
  byFile('seating-area-2.jpg'),
  byFile('kitchen-1.jpg'),
  byFile('main-bedroom-1.jpg'),
  byFile('on-suit-bathroom-1.jpg'),
];

/** The outside section: the beach at sunset leads, then the deck and the outdoor shower. */
export const stayPhotos: GalleryImage[] = [
  byFile('beach-sunset.jpg'),
  byFile('side-deck-house.jpg'),
  byFile('shower-inside.jpg'),
  byFile('outdoor-shower-side.jpg'),
];

/** Photos used outside the gallery list (The View). */
export const beachWaves: GalleryImage = photo(
  'beach-waves.jpg',
  'Clear water breaking on white sand near Port Mouton',
);

/**
 * Stable view-transition name for a photo, shared by the story page and
 * /gallery so the same photo morphs between them on navigation.
 */
export function morphName(image: GalleryImage): string {
  return (
    'photo-' +
    image.alt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}
