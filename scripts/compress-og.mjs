/**
 * Re-encodes the Open Graph card from PNG to JPEG after the export.
 *
 * `ImageResponse` can only emit PNG, and a PNG of a 1200x630 photograph is
 * lossless: the card was shipping at 1.75 MB. That matters because the card
 * exists for one reason — the preview WhatsApp draws when someone forwards the
 * link, which is how most of this site's traffic will actually spread — and
 * WhatsApp declines to fetch images that large. The card was failing at the
 * only job it has.
 *
 * Satori still does the layout, so the design is unchanged. This only swaps the
 * container. `public/_headers` sets the matching Content-Type, since the export
 * writes the file with no extension for Cloudflare to guess from.
 *
 * Runs as part of `npm run build`. Safe to run twice: a file that is already
 * JPEG is left alone.
 */
import { readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const file = path.join(process.cwd(), "out", "opengraph-image");
const QUALITY = 82;

const before = (await stat(file).catch(() => null))?.size;
if (before === undefined) {
  console.error(`No ${file} — run \`next build\` first.`);
  process.exit(1);
}

const input = await readFile(file);

// PNG magic number. Anything else has already been through this script.
const isPng = input
  .subarray(0, 8)
  .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
if (!isPng) {
  console.log("opengraph-image is not a PNG; leaving it alone.");
  process.exit(0);
}

const output = await sharp(input).jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
await writeFile(file, output);

const pct = Math.round((1 - output.length / before) * 100);
const kb = (n) => `${Math.round(n / 1024)} KB`;
console.log(`opengraph-image: ${kb(before)} PNG -> ${kb(output.length)} JPEG (-${pct}%)`);
