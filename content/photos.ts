import type { StaticImageData } from "next/image";

import heroWindow from "@/public/photos/hero-window.jpg";
import bedroom from "@/public/photos/bedroom.jpg";
import balcony from "@/public/photos/balcony.jpg";
import livingRoom from "@/public/photos/living-room.jpg";
import kitchen from "@/public/photos/kitchen.jpg";
import beach from "@/public/photos/beach.jpg";

/**
 * Static imports rather than string paths: Next reads the real dimensions at
 * build time and generates the blur placeholder, so there is no layout shift
 * and no hand-maintained width/height.
 *
 * Keys must match `gallery.photos.*` in the dictionaries.
 */
export type PhotoKey =
  | "window"
  | "bedroom"
  | "balcony"
  | "living"
  | "kitchen"
  | "beach";

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
