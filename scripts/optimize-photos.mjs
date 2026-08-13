/**
 * Re-encodes the photographs in public/photos/ to WebP.
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
 * sharp is already a Next.js dependency, so this adds no package. The script
 * takes no input from anywhere: it reads one fixed directory, accepts no path
 * arguments, opens no network connection and runs no subprocess. The only files
 * it will ever read are ones you put in public/photos/ yourself.
 */

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const PHOTO_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "photos",
);

/** Sources we will re-encode. Anything else in the folder is left alone. */
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

/**
 * 75 is the knee of the curve for photographic content: visually
 * indistinguishable from the original at these dimensions, roughly a quarter of
 * the bytes. Raising it buys nothing you can see; lowering it starts to smear
 * the sea.
 */
const QUALITY = 75;

const force = process.argv.includes("--force");

const kb = (bytes) => Math.round(bytes / 1024);

async function main() {
  const entries = await readdir(PHOTO_DIR, { withFileTypes: true });

  const sources = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => SOURCE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort();

  if (sources.length === 0) {
    console.error(`No source images in ${PHOTO_DIR}`);
    process.exitCode = 1;
    return;
  }

  let totalIn = 0;
  let totalOut = 0;
  let written = 0;

  for (const name of sources) {
    const from = path.join(PHOTO_DIR, name);
    const to = path.join(PHOTO_DIR, `${path.basename(name, path.extname(name))}.webp`);

    const source = await stat(from);

    // Skip work already done. Re-encoding is deterministic, so the only reason
    // to redo it is a newer source or a changed quality setting (--force).
    if (!force) {
      const existing = await stat(to).catch(() => null);
      if (existing && existing.mtimeMs >= source.mtimeMs) {
        totalIn += source.size;
        totalOut += existing.size;
        console.log(`  = ${name.padEnd(20)} up to date (${kb(existing.size)} KB)`);
        continue;
      }
    }

    const output = await sharp(from)
      // Strips EXIF by default, which also drops any GPS tag a phone attached.
      .webp({ quality: QUALITY })
      .toFile(to);

    totalIn += source.size;
    totalOut += output.size;
    written += 1;

    const saved = Math.round((1 - output.size / source.size) * 100);
    console.log(
      `  → ${name.padEnd(20)} ${String(kb(source.size)).padStart(4)} KB → ` +
        `${String(kb(output.size)).padStart(4)} KB  (-${saved}%)`,
    );
  }

  const saved = totalIn > 0 ? Math.round((1 - totalOut / totalIn) * 100) : 0;
  console.log(
    `\n${written} re-encoded, ${sources.length - written} already current.\n` +
      `Total: ${kb(totalIn)} KB → ${kb(totalOut)} KB (-${saved}%)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
