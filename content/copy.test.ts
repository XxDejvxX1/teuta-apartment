import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import copy from "@/content/copy.json";

/**
 * Every line of copy is reachable, and every top-level block is used.
 *
 * `meta.ogAlt` sat in this file describing the social card while the card built
 * its own alt string from a template and read nothing. Nobody noticed, because
 * unused copy is invisible: it does not break a build, fail a type check or
 * render wrong. It just quietly stops being true, and then someone edits it
 * believing they have changed the site.
 *
 * The leaf check is a heuristic — copy is passed down as props and read as
 * `copy.title` rather than `copyText.hero.title`, so it looks for the key name
 * anywhere in the source rather than the full path. That is loose enough to
 * miss a key used under a different name, and tight enough to catch a key used
 * nowhere at all, which is the failure that actually happens.
 */

const ROOT = process.cwd();
const SOURCE_DIRS = ["app", "components", "lib", "content", "scripts"];

function sourceFiles(dir: string): string[] {
  const full = path.join(ROOT, dir);
  const out: string[] = [];
  const walk = (d: string) => {
    for (const entry of readdirSync(d)) {
      const p = path.join(d, entry);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(ts|tsx|mjs)$/.test(entry) && !entry.endsWith(".test.ts")) out.push(p);
    }
  };
  walk(full);
  return out;
}

const source = SOURCE_DIRS.flatMap(sourceFiles)
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

/** Every distinct object key in the copy tree, at any depth. */
function leafKeys(value: unknown, found = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) leafKeys(item, found);
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      found.add(key);
      leafKeys(child, found);
    }
  }
  return found;
}

describe("copy.json", () => {
  it("uses every top-level block somewhere", () => {
    const unused = Object.keys(copy).filter((key) => !source.includes(`copyText.${key}`));
    expect(unused, `top-level copy blocks referenced by nothing`).toEqual([]);
  });

  it("has no key that no source file mentions", () => {
    const unused = [...leafKeys(copy)].filter((key) => {
      return !(
        // Read as a property: copy.title, article.summary
        source.includes(`.${key}`) ||
        // Indexed or quoted: copy["title"], PHOTO_WIDTHS['beach']
        source.includes(`"${key}"`) ||
        source.includes(`'${key}'`) ||
        source.includes(`[${key}]`) ||
        /*
          Declared as a bare object key or type member: `wifi: <WifiIcon />`.
          This is the loosest of the patterns and will match a coincidence
          elsewhere in the tree — which is the right way round to be wrong. A
          false pass costs an unused key surviving; a false failure would train
          everyone to delete the test.
        */
        source.includes(`${key}:`)
      );
    });
    expect(unused, "copy keys read by nothing").toEqual([]);
  });

  it("has no empty string anywhere it would render", () => {
    const empties: string[] = [];
    const walk = (value: unknown, trail: string) => {
      if (typeof value === "string") {
        // goodToKnow.payment is deliberately blank until the owners write one:
        // GoodToKnow drops the row rather than showing an empty term.
        if (value.trim() === "" && !trail.startsWith("goodToKnow.payment")) empties.push(trail);
      } else if (Array.isArray(value)) {
        value.forEach((item, i) => walk(item, `${trail}[${i}]`));
      } else if (value && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) walk(v, trail ? `${trail}.${k}` : k);
      }
    };
    walk(copy, "");
    expect(empties).toEqual([]);
  });
});
