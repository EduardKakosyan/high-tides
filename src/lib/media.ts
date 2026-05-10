/**
 * Typed registry of Cloudinary `public_id`s used across the site.
 *
 * To wire up real media:
 * 1. Upload to your Cloudinary account under folders matching the keys below
 *    (e.g. `high-tides/hero/`, `high-tides/gallery/`).
 * 2. Replace the `publicId` strings here with the actual `public_id`s.
 * 3. Add `width` and `height` so the layout reserves space and avoids CLS.
 * 4. Edit `alt` text to be descriptive (it shows up in lightbox + screen readers).
 */

export interface Photo {
  publicId: string;
  alt: string;
  width: number;
  height: number;
}

export interface VideoAsset {
  publicId: string;
  posterPublicId: string;
  alt: string;
}

export const hero: VideoAsset = {
  publicId: "high-tides/hero/main",
  posterPublicId: "high-tides/hero/poster",
  alt: "High Tides cottage seen from the water at sunset",
};

export const about: Photo = {
  publicId: "high-tides/about/exterior",
  alt: "The cottage exterior with the deck overlooking the cove",
  width: 1600,
  height: 1200,
};

export const location: Photo = {
  publicId: "high-tides/location/map",
  alt: "Map showing High Tides' location along the coast",
  width: 1600,
  height: 1000,
};

export const gallery: Photo[] = [
  {
    publicId: "high-tides/gallery/01",
    alt: "Morning light over the dock",
    width: 1600,
    height: 1067,
  },
  {
    publicId: "high-tides/gallery/02",
    alt: "Living room with wood stove and ocean view",
    width: 1600,
    height: 2000,
  },
  {
    publicId: "high-tides/gallery/03",
    alt: "Kitchen island and open shelving",
    width: 1600,
    height: 1067,
  },
  {
    publicId: "high-tides/gallery/04",
    alt: "Main bedroom looking onto the water",
    width: 1600,
    height: 1067,
  },
  {
    publicId: "high-tides/gallery/05",
    alt: "Wood-fired hot tub under the stars",
    width: 1600,
    height: 1067,
  },
  {
    publicId: "high-tides/gallery/06",
    alt: "Paddleboards laid out on the deck",
    width: 1600,
    height: 2000,
  },
  {
    publicId: "high-tides/gallery/07",
    alt: "Fire pit at dusk",
    width: 1600,
    height: 1067,
  },
  {
    publicId: "high-tides/gallery/08",
    alt: "View from the rowboat at low tide",
    width: 1600,
    height: 1067,
  },
];
