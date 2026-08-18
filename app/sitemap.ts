import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";
import { guides } from "@/lib/guides";

/** `output: "export"` requires every route to declare itself static. */
export const dynamic = "force-static";

/**
 * One language, so no `alternates` and no `hreflang` — those existed only to
 * tell Google that /en, /sq and /it were the same page in three languages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...guides().map((article) => ({
      url: `${base}/guide/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
