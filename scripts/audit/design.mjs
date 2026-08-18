/**
 * The rules DESIGN.md and NEXT.md have stated in prose for months.
 *
 * Two of them were already true and had simply never been guarded: there is not
 * one hard-coded hex in components/, and nothing animates a property that
 * forces layout. Checks that start green are the cheap ones — they cost nothing
 * today and refuse the regression later.
 *
 * Note what the animation rule actually is. NEXT.md says "transform and opacity
 * only", but globals.css legitimately transitions color, border-color and
 * background-color in about eight places, and the reduced-motion block
 * deliberately swaps *to* colour transitions so feedback survives when movement
 * does not. The real invariant is "nothing that triggers layout", so this is a
 * deny-list. An allow-list would fail on correct code, and a check that cries
 * wolf gets switched off.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export const name = "design";

/** Animating any of these forces the browser to re-run layout. */
const LAYOUT_PROPS =
  /\b(width|height|top|left|right|bottom|margin|padding|inset|font-size|border-width)\b/;

/** Strips // and /* *​/ comments so a hex written in prose is not a finding. */
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

export async function run({ root }) {
  const problems = [];

  // --- No hard-coded colour in components/ ------------------------------
  const componentFiles = (await walk(path.join(root, "components"))).filter((f) =>
    /\.tsx?$/.test(f),
  );
  for (const file of componentFiles) {
    const rel = path.relative(root, file);
    const lines = stripComments(await readFile(file, "utf8")).split("\n");
    lines.forEach((line, i) => {
      const hex = line.match(/#[0-9a-fA-F]{3,8}\b/);
      if (hex) {
        problems.push(`${rel}:${i + 1} hard-codes ${hex[0]} — colours come from tokens`);
      }
    });
  }

  // --- Nothing animates a layout-triggering property --------------------
  const cssPath = path.join(root, "app", "globals.css");
  const css = await readFile(cssPath, "utf8");
  css.split("\n").forEach((line, i) => {
    const decl = line.match(/(?:transition|animation)(?:-property)?\s*:\s*([^;]+)/);
    if (!decl) return;
    const value = decl[1];
    if (LAYOUT_PROPS.test(value) || /\ball\b/.test(value)) {
      problems.push(
        `app/globals.css:${i + 1} animates a layout-triggering property: ${value.trim()}`,
      );
    }
  });

  // --- Type comes from the scale, not from a bracket ------------------
  /*
    73 arbitrary sizes were spread across 20 files. Most happened to match a
    documented step because everyone had read the same document; seven did not,
    and DESIGN.md carried those in a "known drift" section rather than in
    anything that could stop them.

    Substring tests rather than patterns: "text-[" and "fontSize" are
    distinctive enough on their own, and a check nobody can read is a check
    nobody maintains.
  */
  const typeFiles = [
    ...(await walk(path.join(root, "components"))),
    ...(await walk(path.join(root, "app"))),
  ].filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"));

  for (const file of typeFiles) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    // Satori rasterises to an image and has no stylesheet to take tokens from.
    if (rel === "app/opengraph-image.tsx") continue;

    const lines = (await readFile(file, "utf8")).split(/\r?\n/);
    lines.forEach((line, i) => {
      if (line.includes("text-[")) {
        problems.push(`${rel}:${i + 1} sets a font size by hand — use a step from the scale`);
      }
      if (line.includes("fontSize")) {
        problems.push(`${rel}:${i + 1} sets fontSize inline — no audit can see a style attribute`);
      }
    });
  }

  return problems;
}
