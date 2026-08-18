import type { StaticImageData } from "next/image";

import { PHOTO_META } from "@/lib/photo-meta.generated";

/**
 * The photographs, described rather than imported.
 *
 * This used to be six `import balcony from "@/public/photos/balcony.webp"`
 * lines. Static imports are the idiomatic way to give `next/image` real
 * dimensions and a blur placeholder without hand-maintaining either — but they
 * also make webpack copy each photograph into `_next/static/media` under a
 * hashed name, and `lib/image-loader.ts` rewrites every src to `/photos/...`
 * before the browser asks for anything. The hashed copies were 769 KB of files
 * in the deploy that no page could reach: three of them appeared in no HTML at
 * all.
 *
 * `npm run photos` now records the same three facts — width, height and an 8px
 * blur — in lib/photo-meta.generated.ts. `next/image` accepts any object of
 * this shape, so components pass these to `src` exactly as they passed the
 * imports, and `placeholder="blur"` still works.
 *
 * The `.webp` files themselves are generated from the `.jpg` originals by that
 * same script. Add a photo as a JPEG, run the script, commit both.
 *
 * Keys must match `gallery.photos.*` in content/copy.json.
 */
function photo(name: string): StaticImageData {
  const meta = PHOTO_META[name];
  if (!meta) {
    // A missing key here would otherwise render a broken image with no
    // dimensions, which collapses the layout around it.
    throw new Error(
      `content/photos.ts: "${name}" is not in lib/photo-meta.generated.ts. ` +
        `Add assets/photos-src/${name}.jpg and run \`npm run photos\`.`,
    );
  }
  return { src: `/photos/${name}.webp`, ...meta };
}

export type PhotoKey = "window" | "bedroom" | "balcony" | "living" | "kitchen" | "beach";

export type Photo = {
  key: PhotoKey;
  image: StaticImageData;
};

const heroWindow = photo("hero-window");
const balcony = photo("balcony");
const beach = photo("beach");

export const galleryPhotos: Photo[] = [
  { key: "window", image: heroWindow },
  { key: "bedroom", image: photo("bedroom") },
  { key: "balcony", image: balcony },
  { key: "living", image: photo("living-room") },
  { key: "kitchen", image: photo("kitchen") },
  { key: "beach", image: beach },
];

export const heroPhoto = heroWindow;

/** Used beside the copy in "The apartment" — deliberately not the hero again. */
export const apartmentPhoto = balcony;

/** Closes the page. Must not be the hero: the last impression should be new. */
export const closingPhoto = beach;
