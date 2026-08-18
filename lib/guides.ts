import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { marked } from "marked";

/**
 * The travel guides — "What to do in Durrës".
 *
 * One Markdown file per article, in `content/guides/`, named `<slug>.md`.
 * Markdown rather than a TypeScript module like the rest of `content/` on
 * purpose: these are the only files here meant to be edited by whoever writes
 * the prose, and asking for escaped strings in a `.ts` file would make a
 * paragraph break a build.
 *
 * Files were `<slug>.<lang>.md` while the site was trilingual, and this module
 * carried the rule that an article appears only in the languages it was written
 * in. Albanian and Italian were dropped in August 2026, so both the suffix and
 * the rule are gone.
 */

const GUIDE_DIR = path.join(process.cwd(), "content", "guides");

/**
 * The filter chips on the index, in the order they appear.
 *
 * Adding one here is half the job: the other half is a label under
 * `guides.categories` in `content/copy.json`, or the chip renders its own key.
 * Kept as a closed list so a typo in frontmatter fails the build rather than
 * quietly creating a fifth category with one article in it.
 */
export const GUIDE_CATEGORIES = ["history", "sea", "food", "trips"] as const;

export type GuideCategory = (typeof GUIDE_CATEGORIES)[number];

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  category: GuideCategory;
  /** ISO `yyyy-mm-dd`. Sorted on, and printed through Intl. */
  date: string;
  /**
   * A photo key in `public/photos/` — the same namespace the apartment
   * photographs use, so a cover goes through `npm run photos` and the existing
   * image loader with no extra pipeline. Omitted while no real photograph
   * exists, which is what makes the drawn cover appear instead.
   */
  cover?: string;
  /** Rendered HTML. */
  body: string;
  /** Reading time in minutes, computed — never authored, so it cannot drift. */
  minutes: number;
};

function isCategory(value: unknown): value is GuideCategory {
  return (GUIDE_CATEGORIES as readonly unknown[]).includes(value);
}

/**
 * ~200 words a minute, floored at 1.
 *
 * Counting the Markdown source rather than the rendered HTML overcounts by the
 * handful of syntax characters in a link, which is well inside the rounding.
 */
function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

let cache: Guide[] | undefined;

/**
 * Every article, newest first.
 *
 * Read once per process. The whole site is prerendered, so this runs at build
 * time and never on a request — there is no filesystem on the serving path.
 */
export function guides(): Guide[] {
  if (cache) return cache;

  if (!fs.existsSync(GUIDE_DIR)) {
    cache = [];
    return cache;
  }

  const found: Guide[] = [];

  for (const file of fs.readdirSync(GUIDE_DIR)) {
    if (!file.endsWith(".md")) continue;

    const slug = file.slice(0, -".md".length);
    const raw = fs.readFileSync(path.join(GUIDE_DIR, file), "utf8");
    const { data, content } = matter(raw);

    // Frontmatter is validated rather than trusted. These files are hand-edited
    // and a missing title would otherwise render an empty heading on a live page.
    const { title, summary, category, date, cover } = data as Record<string, unknown>;

    if (typeof title !== "string" || !title.trim()) {
      throw new Error(`content/guides/${file}: frontmatter needs a "title".`);
    }
    if (typeof summary !== "string" || !summary.trim()) {
      throw new Error(`content/guides/${file}: frontmatter needs a "summary".`);
    }
    if (!isCategory(category)) {
      throw new Error(
        `content/guides/${file}: "category" must be one of ${GUIDE_CATEGORIES.join(", ")}.`,
      );
    }
    // gray-matter parses an unquoted YAML date into a Date; both spellings are
    // accepted and normalised here so sorting and Intl always see `yyyy-mm-dd`.
    const iso =
      date instanceof Date
        ? date.toISOString().slice(0, 10)
        : typeof date === "string"
          ? date.trim()
          : "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      throw new Error(`content/guides/${file}: "date" must be yyyy-mm-dd.`);
    }

    found.push({
      slug,
      title: title.trim(),
      summary: summary.trim(),
      category,
      date: iso,
      cover: typeof cover === "string" && cover.trim() ? cover.trim() : undefined,
      // Author-controlled content from this repository, at the same trust level
      // as content/copy.json — no user input reaches it, so the HTML passes
      // through as written.
      body: marked.parse(content, { async: false, gfm: true }),
      minutes: readingMinutes(content),
    });
  }

  // Newest first; slug breaks ties so the order is stable across machines,
  // where readdir order is not.
  found.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

  cache = found;
  return cache;
}

export function guide(slug: string): Guide | undefined {
  return guides().find((entry) => entry.slug === slug);
}

/** Every slug, for `generateStaticParams`. */
export function guideParams(): { slug: string }[] {
  return guides().map(({ slug }) => ({ slug }));
}

/** Categories that actually have articles, in `GUIDE_CATEGORIES` order, with counts. */
export function guideCategories(list: Guide[]): { key: GuideCategory; count: number }[] {
  return GUIDE_CATEGORIES.map((key) => ({
    key,
    count: list.filter((entry) => entry.category === key).length,
  })).filter((entry) => entry.count > 0);
}
