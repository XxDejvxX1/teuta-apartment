/**
 * Build size, against numbers written down.
 *
 * This project tracked image weight carefully in comments and had no budget for
 * anything else, which is how 769 KB of unreachable photograph copies and a
 * 1.75 MB social card sat in the export without anyone noticing. Comments do
 * not fail a build.
 *
 * Ceilings live in budget.json beside this file, with the date and reasoning.
 * The report prints every figure and its headroom whether or not it passes, so
 * the trend is visible before the ceiling is hit rather than after.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

export const name = "budget";
export const needsBuild = true;

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

const kb = (bytes) => Math.round(bytes / 1024);

export async function run({ root }) {
  const outDir = path.join(root, "out");
  const { budgets } = JSON.parse(
    await readFile(path.join(root, "scripts", "audit", "budget.json"), "utf8"),
  );

  const files = await walk(outDir);
  const sizes = new Map();
  for (const file of files) sizes.set(file, (await stat(file)).size);

  const totalOf = (test) =>
    [...sizes].reduce((sum, [file, size]) => (test(file) ? sum + size : sum), 0);

  const photosDir = path.join(outDir, "photos") + path.sep;
  const measured = {
    total: totalOf(() => true),
    js: totalOf((f) => f.endsWith(".js")),
    css: totalOf((f) => f.endsWith(".css")),
    html: totalOf((f) => f.endsWith(".html")),
    photos: totalOf((f) => f.startsWith(photosDir)),
    fonts: totalOf((f) => f.endsWith(".woff2")),
    "index.html": sizes.get(path.join(outDir, "index.html")) ?? 0,
    "opengraph-image": sizes.get(path.join(outDir, "opengraph-image")) ?? 0,
  };

  const problems = [];
  const rows = [];
  for (const [key, limit] of Object.entries(budgets)) {
    const actual = kb(measured[key] ?? 0);
    const pct = Math.round((actual / limit) * 100);
    rows.push(
      `      ${key.padEnd(16)} ${String(actual).padStart(5)} / ${String(limit).padStart(5)} KB  ${String(pct).padStart(3)}%`,
    );
    if (actual > limit) {
      problems.push(`${key} is ${actual} KB, over its ${limit} KB budget by ${actual - limit} KB`);
    }
  }

  // Printed even when clean: the point is to see it creeping, not just breaking.
  console.log(rows.join("\n"));

  return problems;
}
