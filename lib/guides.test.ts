import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";

import { guides, guide, guideParams, GUIDE_CATEGORIES } from "@/lib/guides";
import { PHOTO_WIDTHS } from "@/lib/photo-widths.generated";

/**
 * Content integrity, not rendering.
 *
 * lib/guides.ts already throws on bad frontmatter, which means a broken article
 * fails the build — but only the build, which is the slowest possible place to
 * find out and the one nobody runs before committing. These are the same
 * guarantees in half a second.
 *
 * The cover check is the one that matters most: a cover names a photo key, and
 * nothing until now connected that key to the files on disk. An article
 * referring to a photograph that was never generated renders a broken image.
 */
describe("guides", () => {
  const all = guides();

  it("loads every article in content/guides/", () => {
    expect(all.length).toBeGreaterThan(0);
  });

  it("gives every article a title, a summary and a body", () => {
    for (const article of all) {
      expect(article.title.trim(), `${article.slug} title`).not.toBe("");
      expect(article.summary.trim(), `${article.slug} summary`).not.toBe("");
      expect(article.body.trim(), `${article.slug} body`).not.toBe("");
    }
  });

  it("uses only the four sanctioned categories", () => {
    for (const article of all) {
      expect(GUIDE_CATEGORIES, `${article.slug} category`).toContain(article.category);
    }
  });

  it("dates every article as yyyy-mm-dd, and a real date", () => {
    for (const article of all) {
      expect(article.date, `${article.slug} date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(article.date)), `${article.slug} date parses`).toBe(false);
    }
  });

  it("computes reading time rather than trusting the file", () => {
    for (const article of all) {
      expect(article.minutes, `${article.slug} minutes`).toBeGreaterThan(0);
    }
  });

  it("keeps slugs unique", () => {
    const slugs = all.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("sorts newest first", () => {
    const dates = all.map((a) => a.date);
    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
  });

  it("resolves every cover to files that are really on disk", () => {
    for (const article of all) {
      if (!article.cover) continue;

      const widths = PHOTO_WIDTHS[article.cover];
      expect(
        widths,
        `${article.slug}: cover "${article.cover}" is not in the widths manifest`,
      ).toBeDefined();

      // Mirrors lib/image-loader.ts: the widest keeps the plain filename.
      widths.forEach((width, i) => {
        const file =
          i === widths.length - 1 ? `${article.cover}.webp` : `${article.cover}-${width}.webp`;
        const full = path.join(process.cwd(), "public", "photos", file);
        expect(existsSync(full), `${article.slug}: public/photos/${file} is missing`).toBe(true);
      });
    }
  });

  it("finds every article by its own slug, and nothing by a made-up one", () => {
    for (const { slug } of guideParams()) {
      expect(guide(slug)?.slug, slug).toBe(slug);
    }
    expect(guide("no-such-article")).toBeUndefined();
  });
});
