import { PHOTO_WIDTHS } from "./photo-widths.generated";

/**
 * Points `next/image` at the pre-generated widths in public/photos/.
 *
 * There is no image optimiser on the serving path — the site is a static export
 * on Cloudflare Workers, and Next's optimiser needs a native binary — so the
 * resizing happens once, at build time, in `npm run photos`. This just chooses
 * which of those files to ask for.
 *
 * Without it every screen received the widest file: 642 KB on a 375px phone for
 * photographs displayed at 323-375px.
 *
 * The `src` arriving here is whichever URL Next resolved. For a static import
 * that is a hashed path like `/_next/static/media/hero-window.2u_r2-abc.webp`;
 * for a plain string it is `/photos/host.webp`. Both reduce to the basename
 * before the first dot, which is the manifest key.
 *
 * Anything not in the manifest is returned untouched, so an image added without
 * running the script degrades to its original file rather than 404ing.
 */
export default function photoLoader({ src, width }: { src: string; width: number }): string {
  const file = src.split("/").pop();
  if (!file) return src;

  const name = file.split(".")[0];
  const available = PHOTO_WIDTHS[name];
  if (!available || available.length === 0) return src;

  // Smallest width that still covers the requested size; the widest if none does.
  const chosen =
    available.find((candidate) => candidate >= width) ?? available[available.length - 1];

  // The widest keeps the plain name so a static import resolves to a real file.
  const isWidest = chosen === available[available.length - 1];
  return isWidest ? `/photos/${name}.webp` : `/photos/${name}-${chosen}.webp`;
}
