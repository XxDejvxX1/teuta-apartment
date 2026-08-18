/**
 * Every photograph the code names is on disk, and every photograph on disk is
 * named by something.
 *
 * This is the check that would have caught the state this repository was in
 * before the guides were committed: lib/photo-widths.generated.ts was tracked
 * and modified, listing four covers whose files were all still untracked. A
 * `git commit -a` would have published a manifest pointing at files that were
 * not in the repository, and every guide cover would have 404'd on a fresh
 * clone with nothing failing loudly enough to notice.
 */
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

export const name = "assets";

/** Mirrors lib/image-loader.ts: the widest width keeps the plain filename. */
function fileFor(key, widths, index) {
  return index === widths.length - 1 ? `${key}.webp` : `${key}-${widths[index]}.webp`;
}

export async function run({ root }) {
  const problems = [];
  const photoDir = path.join(root, "public", "photos");
  const sourceDir = path.join(root, "assets", "photos-src");

  const widthsSrc = await readFile(path.join(root, "lib", "photo-widths.generated.ts"), "utf8");
  const metaSrc = await readFile(path.join(root, "lib", "photo-meta.generated.ts"), "utf8");

  const manifest = new Map();
  for (const m of widthsSrc.matchAll(/"([a-z0-9-]+)":\s*\[([\d,\s]+)\]/g)) {
    manifest.set(
      m[1],
      m[2]
        .split(",")
        .map((n) => parseInt(n.trim(), 10))
        .filter(Number.isFinite),
    );
  }
  if (manifest.size === 0) problems.push("photo-widths.generated.ts parsed to zero entries");

  // Every file the manifest resolves to must exist.
  const expected = new Set();
  for (const [key, widths] of manifest) {
    widths.forEach((_, i) => {
      const file = fileFor(key, widths, i);
      expected.add(file);
      if (!existsSync(path.join(photoDir, file))) {
        problems.push(`public/photos/${file} is named by the widths manifest but is not on disk`);
      }
    });
    if (!metaSrc.includes(`"${key}"`)) {
      problems.push(`"${key}" is in the widths manifest but not in photo-meta.generated.ts`);
    }
  }

  // And nothing may sit in public/photos/ that no manifest entry accounts for.
  const onDisk = await readdir(photoDir);
  for (const file of onDisk) {
    if (!file.endsWith(".webp")) {
      problems.push(
        `public/photos/${file} is not a .webp — originals belong in assets/photos-src/, ` +
          `which is not published`,
      );
      continue;
    }
    if (!expected.has(file)) {
      problems.push(`public/photos/${file} is published but no manifest entry produces it`);
    }
  }

  // Every original should still be here; the WebP are derived, not authored.
  if (existsSync(sourceDir)) {
    const sources = (await readdir(sourceDir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
    for (const key of manifest.keys()) {
      if (!sources.some((f) => path.basename(f, path.extname(f)) === key)) {
        problems.push(`assets/photos-src/ has no original for "${key}" to regenerate from`);
      }
    }
  } else {
    problems.push("assets/photos-src/ is missing — nothing can be regenerated");
  }

  return problems;
}
