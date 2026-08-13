import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/i18n";
import { siteUrl } from "@/content/site";

/** `output: "export"` requires every route to declare itself static. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, `${base}/${locale}`]),
  );

  return LOCALES.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === "en" ? 1 : 0.8,
    alternates: { languages },
  }));
}
