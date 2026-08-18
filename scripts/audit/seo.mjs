/**
 * Reads the built HTML rather than the source that produced it.
 *
 * Every defect this catches was invisible in the components. `/guide` and all
 * four articles shipped with no og:image and no twitter:image, because
 * declaring an `openGraph` object in a route replaces the parent one whole —
 * including the image Next infers from app/opengraph-image.tsx. The source
 * looked correct. Only the output showed it.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export const name = "seo";
export const needsBuild = true;

/** 404s are not indexable and are checked separately. */
const NOT_INDEXABLE = new Set(["404.html", "_not-found.html"]);

async function htmlFiles(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full, base)));
    else if (entry.name.endsWith(".html")) out.push(path.relative(base, full));
  }
  return out.sort();
}

/** out/guide/day-trips.html -> /guide/day-trips ; out/index.html -> / */
const toRoute = (rel) => {
  const p = rel
    .split(path.sep)
    .join("/")
    .replace(/\.html$/, "");
  return p === "index" ? "/" : `/${p}`;
};

const count = (html, re) => (html.match(re) || []).length;
const meta = (html, key) =>
  (html.match(new RegExp(`<meta (?:property|name)="${key}" content="([^"]*)"`, "i")) || [])[1];

export async function run({ root }) {
  const problems = [];
  const outDir = path.join(root, "out");
  const files = await htmlFiles(outDir);

  const sitemap = await readFile(path.join(outDir, "sitemap.xml"), "utf8").catch(() => "");
  if (!sitemap) problems.push("out/sitemap.xml is missing");
  const sitemapRoutes = new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname || "/"),
  );

  for (const rel of files) {
    const html = await readFile(path.join(outDir, rel), "utf8");
    const route = toRoute(rel);
    const at = (msg) => problems.push(`${rel}: ${msg}`);

    const titles = count(html, /<title>/g);
    if (titles !== 1) at(`has ${titles} <title> tags, expected exactly 1`);

    if (NOT_INDEXABLE.has(rel)) {
      if (!/<meta name="robots" content="[^"]*noindex/i.test(html))
        at("is a 404 but is not noindex");
      continue;
    }

    if (!/<html[^>]+lang="[a-z]{2}/i.test(html)) at("has no lang attribute on <html>");

    const h1s = count(html, /<h1[\s>]/g);
    if (h1s !== 1) at(`has ${h1s} <h1> elements, expected exactly 1`);

    if (!meta(html, "description")) at("has no meta description");
    if (!/<link rel="canonical" href="[^"]+"/.test(html)) at("has no canonical link");

    for (const key of ["og:title", "og:description", "og:image", "og:url"]) {
      if (!meta(html, key)) at(`has no ${key}`);
    }
    for (const key of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
      if (!meta(html, key)) at(`has no ${key}`);
    }

    // A guide page inheriting the homepage's card is the exact bug this catches.
    const ogTitle = meta(html, "og:title");
    const twTitle = meta(html, "twitter:title");
    if (route !== "/" && ogTitle && twTitle && ogTitle !== twTitle) {
      at(`og:title and twitter:title disagree — twitter is probably inherited`);
    }

    if (/<meta name="robots" content="[^"]*noindex/i.test(html)) {
      at("is noindex but is a normal page");
    }

    for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
      try {
        JSON.parse(m[1].replace(/\u003c/g, "<"));
      } catch (e) {
        at(`has JSON-LD that does not parse: ${e.message}`);
      }
    }

    /*
      Google asks that FAQ markup describe something the visitor can see on that
      page. This lived in the root layout and so appeared on all six URLs,
      including articles that show none of the Good to know rows.
    */
    if (route !== "/" && html.includes('"FAQPage"')) {
      at("carries FAQPage markup but does not render the FAQ");
    }

    // A placeholder address is worse than no address; PRODUCT.md forbids it.
    if (/"streetAddress":\s*""/.test(html)) at("publishes an empty streetAddress");

    if (!sitemapRoutes.has(route)) at(`is not listed in sitemap.xml (route ${route})`);
    sitemapRoutes.delete(route);
  }

  for (const orphan of sitemapRoutes) {
    problems.push(`sitemap.xml lists ${orphan}, which the build does not emit`);
  }

  return problems;
}
