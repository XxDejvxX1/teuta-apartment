/**
 * Re-encodes the originals in assets/photos-src/ into public/photos/ as WebP.
 *
 *   npm run photos
 *
 * Why this exists
 * ---------------
 * The JPEGs are saved at near-maximum quality: 0.21-0.35 bytes per pixel where
 * a well-encoded photograph sits near 0.10. That is roughly two megabytes of
 * avoidable download on a first visit, paid for by guests on Albanian and
 * Italian mobile data.
 *
 * Next would normally handle this itself, but the site is heading for
 * Cloudflare Workers, which cannot run sharp — so whatever is committed is what
 * ships. Hence: convert once, commit the result, review the saving in the diff.
 *
 * Why it is NOT part of `npm run build`
 * -------------------------------------
 * Nothing extra should run on the deploy host. Keeping this manual means the
 * Cloudflare build is byte-for-byte the build you ran locally, build minutes are
 * untouched, and the images that ship are the ones reviewed in a commit rather
 * than something regenerated on a machine nobody watched.
 *
 * Safety
 * ------
 * sharp is an explicit devDependency (it also arrives as an optional dependency
 * of Next, but relying on that made the whole pipeline work by accident). The script
 * takes no input from anywhere: it reads one fixed directory, accepts no path
 * arguments, opens no network connection and runs no subprocess. The only files
 * it will ever read are ones you put in assets/photos-src/ yourself.
 */

import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Originals in, WebP out — two directories, not one.
 *
 * They used to be the same folder, which meant the .jpg sources were copied
 * into the export and served from the CDN alongside the .webp files actually
 * shown. That was 2.9 MB of photographs published for nothing: eight of the
 * eleven were referenced by no page, no stylesheet and no piece of markup.
 *
 * assets/ is outside public/, so nothing here is published. The originals stay
 * in the repository because they are what every width is regenerated from.
 */
const SOURCE_DIR = path.join(here, "..", "assets", "photos-src");
const PHOTO_DIR = path.join(here, "..", "public", "photos");

/** Sources we will re-encode. Anything else in the folder is left alone. */
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

/**
 * 75 is the knee of the curve for photographic content: visually
 * indistinguishable from the original at these dimensions, roughly a quarter of
 * the bytes. Raising it buys nothing you can see; lowering it starts to smear
 * the sea.
 */
const QUALITY = 75;

/**
 * Widths to emit, so `next/image` has a real srcset to choose from.
 *
 * Without these a 375px phone downloaded the same 1536px file a desktop did —
 * 642 KB of imagery for pictures displayed at 323-375px. Anything wider than a
 * given source is skipped rather than upscaled, and the source's own width is
 * always included as the top of the set.
 *
 * 256 exists for the host portrait, which renders at 144px.
 */
const WIDTHS = [256, 480, 768, 1200, 1536];

/** Written for the loader so it only ever points at files that exist. */
const MANIFEST = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "lib",
  "photo-widths.generated.ts",
);

const META = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "lib",
  "photo-meta.generated.ts",
);

/**
 * Width of the blur placeholder. Next's own static-import placeholders are this
 * size; larger is bytes inlined into every page that shows the photograph, and
 * smaller stops reading as the same picture.
 */
const BLUR_WIDTH = 8;

const force = process.argv.includes("--force");

const kb = (bytes) => Math.round(bytes / 1024);

async function main() {
  const entries = await readdir(SOURCE_DIR, { withFileTypes: true });

  const sources = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => SOURCE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort();

  if (sources.length === 0) {
    console.error(`No source images in ${SOURCE_DIR}`);
    process.exitCode = 1;
    return;
  }

  let totalIn = 0;
  let totalOut = 0;
  let written = 0;

  /** basename -> the widths that actually exist on disk, ascending. */
  const manifest = {};
  const meta = {};

  for (const name of sources) {
    const base = path.basename(name, path.extname(name));
    const from = path.join(SOURCE_DIR, name);
    const source = await stat(from);
    const { width: sourceWidth, height: sourceHeight } = await sharp(from).metadata();

    /*
      Never upscale. Widths wider than the source would be bytes spent
      reproducing detail that is not in the original, so the set is clamped and
      the source's own width caps it.
    */
    const widths = [...new Set([...WIDTHS.filter((w) => w < sourceWidth), sourceWidth])].sort(
      (a, b) => a - b,
    );

    manifest[base] = widths;

    /*
      Intrinsic size and a blur placeholder, so content/photos.ts can describe a
      photograph without importing the file.

      Importing it is what Next wants, and it is what this project did — but the
      import also makes webpack copy every photograph into _next/static/media,
      and the custom loader rewrites each src to /photos/ before the browser ever
      asks for one. That was 769 KB of files in the deploy that nothing could
      fetch. This carries the three facts the import was actually for.
    */
    const blur = await sharp(from).resize({ width: BLUR_WIDTH }).webp({ quality: 40 }).toBuffer();
    meta[base] = {
      width: sourceWidth,
      height: sourceHeight,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };

    totalIn += source.size;

    for (const width of widths) {
      // The widest carries the plain name, so a static import still resolves.
      const isFull = width === sourceWidth;
      const to = path.join(PHOTO_DIR, isFull ? `${base}.webp` : `${base}-${width}.webp`);

      // Skip work already done. Re-encoding is deterministic, so the only reason
      // to redo it is a newer source or changed settings (--force).
      if (!force) {
        const existing = await stat(to).catch(() => null);
        if (existing && existing.mtimeMs >= source.mtimeMs) {
          totalOut += existing.size;
          continue;
        }
      }

      const output = await sharp(from)
        .resize({ width, withoutEnlargement: true })
        // Strips EXIF by default, which also drops any GPS tag a phone attached.
        .webp({ quality: QUALITY })
        .toFile(to);

      totalOut += output.size;
      written += 1;
    }

    console.log(
      `  ${base.padEnd(14)} ${String(kb(source.size)).padStart(4)} KB source → ` +
        `${widths.length} widths [${widths.join(", ")}]`,
    );
  }

  await writeFile(
    MANIFEST,
    `// Generated by \`npm run photos\`. Do not edit.\n` +
      `//\n` +
      `// Maps each photograph to the widths that exist in public/photos/, so the\n` +
      `// image loader can only ever point at a file that is really there.\n` +
      `export const PHOTO_WIDTHS: Record<string, number[]> = ${JSON.stringify(
        manifest,
        null,
        2,
      )};\n`,
    "utf-8",
  );

  await writeFile(
    META,
    `// Generated by \`npm run photos\`. Do not edit.
` +
      `//
` +
      `// Intrinsic dimensions and a blur placeholder for each photograph, so a
` +
      `// component can render one without importing the file and making webpack
` +
      `// emit a second copy of it that nothing ever fetches.
` +
      `export type PhotoMeta = { width: number; height: number; blurDataURL: string };
` +
      `export const PHOTO_META: Record<string, PhotoMeta> = ${JSON.stringify(meta, null, 2)};
`,
    "utf-8",
  );

  const saved = totalIn > 0 ? Math.round((1 - totalOut / totalIn) * 100) : 0;
  console.log(
    `\n${written} files written across ${sources.length} photographs.\n` +
      `Sources ${kb(totalIn)} KB → all widths ${kb(totalOut)} KB (-${saved}%)\n` +
      `Manifest: ${path.relative(process.cwd(), MANIFEST)}` +
      `
Meta:     ${path.relative(process.cwd(), META)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
