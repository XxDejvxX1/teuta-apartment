import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";
import { guides } from "@/lib/guides";
import { availabilityUpdated } from "@/content/availability";

/** `output: "export"` requires every route to declare itself static. */
export const dynamic = "force-static";

/**
 * One language, so no `alternates` and no `hreflang` — those existed only to
 * tell Google that /en, /sq and /it were the same page in three languages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  const articles = guides();

  /*
    Real dates, not `new Date()`. Building the sitemap with the current time
    told Google every page had changed every time the site deployed, which is
    the fastest way to make it stop believing lastmod at all.

    The homepage tracks the availability file, which is the thing on it that
    actually changes. The index tracks its newest article, because that is
    precisely when the index changes.
  */
  const newestArticle = articles[0]?.date;

  return [
    {
      url: base,
      lastModified: new Date(availabilityUpdated),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/guide`,
      ...(newestArticle ? { lastModified: new Date(newestArticle) } : {}),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...articles.map((article) => ({
      url: `${base}/guide/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
