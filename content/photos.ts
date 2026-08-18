import type { StaticImageData } from "next/image";

import heroWindow from "@/public/photos/hero-window.webp";
import bedroom from "@/public/photos/bedroom.webp";
import balcony from "@/public/photos/balcony.webp";
import livingRoom from "@/public/photos/living-room.webp";
import kitchen from "@/public/photos/kitchen.webp";
import beach from "@/public/photos/beach.webp";

/**
 * Static imports rather than string paths: Next reads the real dimensions at
 * build time and generates the blur placeholder, so there is no layout shift
 * and no hand-maintained width/height.
 *
 * The `.webp` files are generated from the `.jpg` originals beside them by
 * `npm run photos`, which cuts the set from 2.6 MB to 760 KB. Add a photo as a
 * JPEG, run the script, commit both.
 *
 * The JPEGs are not dead weight: `opengraph-image.tsx` composites the social
 * card from `hero-window.jpg` on disk at build time, and the JSON-LD `image`
 * array points at JPEG URLs because that is the format every crawler and link
 * scraper handles without question. Only the browser-facing photography is
 * WebP, which is where the bytes actually matter.
 *
 * Keys must match `gallery.photos.*` in the dictionaries.
 */
export type PhotoKey = "window" | "bedroom" | "balcony" | "living" | "kitchen" | "beach";

export type Photo = {
  key: PhotoKey;
  image: StaticImageData;
};

export const galleryPhotos: Photo[] = [
  { key: "window", image: heroWindow },
  { key: "bedroom", image: bedroom },
  { key: "balcony", image: balcony },
  { key: "living", image: livingRoom },
  { key: "kitchen", image: kitchen },
  { key: "beach", image: beach },
];

export const heroPhoto = heroWindow;

/** Used beside the copy in "The apartment" — deliberately not the hero again. */
export const apartmentPhoto = balcony;

/** Closes the page. Must not be the hero: the last impression should be new. */
export const closingPhoto = beach;
