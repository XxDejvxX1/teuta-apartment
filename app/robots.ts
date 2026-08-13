import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";

/** `output: "export"` requires every route to declare itself static. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
