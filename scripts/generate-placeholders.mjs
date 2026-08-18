/**
 * Generates stand-in photos so the layout, motion and image pipeline can be
 * built and verified before the real photography exists.
 *
 *   node scripts/generate-placeholders.mjs
 *
 * Every file carries a small "PLACEHOLDER" label in the corner. That is
 * deliberate — it makes it impossible to ship these by accident. Replace the
 * files in assets/photos-src/ with real JPEGs at the same names and dimensions and
 * nothing in the code needs to change.
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Stand-ins are sources, not output: they go where the real originals live, and
// `npm run photos` turns them into the WebP the site actually serves.
const OUT_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "assets",
  "photos-src",
);

/** A soft sea-and-sky scene. Enough structure to judge crops and gradients. */
function seaScene({ w, h, sky, sea, sand, warm }) {
  const horizon = Math.round(h * 0.52);
  const shore = Math.round(h * 0.68);
  return `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${sky[0]}"/>
        <stop offset="100%" stop-color="${sky[1]}"/>
      </linearGradient>
      <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${sea[0]}"/>
        <stop offset="100%" stop-color="${sea[1]}"/>
      </linearGradient>
      <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${sand[0]}"/>
        <stop offset="100%" stop-color="${sand[1]}"/>
      </linearGradient>
      <radialGradient id="sun" cx="0.72" cy="0.22" r="0.42">
        <stop offset="0%" stop-color="${warm}" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="${warm}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${horizon}" fill="url(#sky)"/>
    <rect y="${horizon}" width="${w}" height="${shore - horizon}" fill="url(#sea)"/>
    <rect y="${shore}" width="${w}" height="${h - shore}" fill="url(#sand)"/>
    <rect width="${w}" height="${h}" fill="url(#sun)"/>
    ${Array.from({ length: 7 }, (_, i) => {
      const y = horizon + ((shore - horizon) / 8) * (i + 1);
      const o = 0.16 - i * 0.015;
      return `<rect y="${y.toFixed(0)}" width="${w}" height="2" fill="#ffffff" opacity="${o.toFixed(3)}"/>`;
    }).join("")}
  `;
}

/** A flat interior wash with a light source, for the room photos. */
function roomScene({ w, h, base, light, floor }) {
  const floorY = Math.round(h * 0.72);
  return `
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${base[0]}"/>
        <stop offset="100%" stop-color="${base[1]}"/>
      </linearGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${floor[0]}"/>
        <stop offset="100%" stop-color="${floor[1]}"/>
      </linearGradient>
      <radialGradient id="win" cx="0.78" cy="0.28" r="0.5">
        <stop offset="0%" stop-color="${light}" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="${light}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#wall)"/>
    <rect y="${floorY}" width="${w}" height="${h - floorY}" fill="url(#floor)"/>
    <rect width="${w}" height="${h}" fill="url(#win)"/>
    <rect x="${Math.round(w * 0.62)}" y="${Math.round(h * 0.12)}"
          width="${Math.round(w * 0.3)}" height="${Math.round(h * 0.34)}"
          fill="#ffffff" opacity="0.14" rx="4"/>
  `;
}

function label(text, w, h) {
  const fs = Math.round(Math.min(w, h) * 0.035);
  return `
    <rect x="${fs}" y="${h - fs * 3}" width="${fs * (text.length * 0.62 + 2)}" height="${fs * 2}"
          fill="#0d1b22" opacity="0.55" rx="${fs * 0.35}"/>
    <text x="${fs * 2}" y="${h - fs * 1.55}" font-family="DejaVu Sans, Verdana, Arial, sans-serif"
          font-size="${fs}" fill="#ffffff" opacity="0.92" letter-spacing="1">${text}</text>
  `;
}

const PHOTOS = [
  {
    name: "hero-window",
    w: 2400,
    h: 1600,
    body: (w, h) =>
      seaScene({
        w,
        h,
        sky: ["#8fb6c9", "#dfe9ea"],
        sea: ["#2f6b82", "#4d90a4"],
        sand: ["#dccdb4", "#c9b79b"],
        warm: "#ffd9a8",
      }),
  },
  {
    name: "balcony",
    w: 1200,
    h: 1450,
    body: (w, h) =>
      seaScene({
        w,
        h,
        sky: ["#9cc0d0", "#e6eeee"],
        sea: ["#356f86", "#5697aa"],
        sand: ["#d8c8ae", "#c4b193"],
        warm: "#ffe0b6",
      }),
  },
  {
    name: "beach",
    w: 1200,
    h: 1450,
    body: (w, h) =>
      seaScene({
        w,
        h,
        sky: ["#a8c8d6", "#eef3f2"],
        sea: ["#3b7d92", "#5b9cae"],
        sand: ["#e0d2ba", "#cdbb9f"],
        warm: "#ffe3bd",
      }),
  },
  {
    name: "bedroom",
    w: 1200,
    h: 1450,
    body: (w, h) =>
      roomScene({
        w,
        h,
        base: ["#e7e2d8", "#d4cec2"],
        light: "#fff3dc",
        floor: ["#b9a891", "#a2917a"],
      }),
  },
  {
    name: "living-room",
    w: 1200,
    h: 1450,
    body: (w, h) =>
      roomScene({
        w,
        h,
        base: ["#eae6dd", "#d9d3c7"],
        light: "#fff1d6",
        floor: ["#bfae97", "#a89680"],
      }),
  },
  {
    name: "kitchen",
    w: 1200,
    h: 1450,
    body: (w, h) =>
      roomScene({
        w,
        h,
        base: ["#e4e8e6", "#cfd6d3"],
        light: "#f4fbff",
        floor: ["#b2b6b2", "#9aa09c"],
      }),
  },
];

await mkdir(OUT_DIR, { recursive: true });

for (const photo of PHOTOS) {
  const { name, w, h } = photo;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${photo.body(w, h)}
    ${label(`PLACEHOLDER · ${name}`, w, h)}
  </svg>`;

  const file = path.join(OUT_DIR, `${name}.jpg`);
  await sharp(Buffer.from(svg)).jpeg({ quality: 80, mozjpeg: true }).toFile(file);
  console.log(`  ${name}.jpg  ${w}x${h}`);
}

console.log(`\nWrote ${PHOTOS.length} placeholders to assets/photos-src/`);
console.log("Replace them with real JPEGs at the same filenames, then run `npm run photos`.");
