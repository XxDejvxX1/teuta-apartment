export const LOCALES = ["en", "sq", "it"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Shown in the language switcher — always in the language itself, never translated. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  sq: "Shqip",
  it: "Italiano",
};

/** Short form for the compact mobile switcher. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  sq: "SQ",
  it: "IT",
};

/** BCP 47 tags for <html lang>, hreflang and Intl formatting. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en",
  sq: "sq-AL",
  it: "it-IT",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Pick the best supported locale from an Accept-Language header.
 *
 * Hand-rolled rather than pulling in negotiator + @formatjs/intl-localematcher:
 * three locales and a q-value sort is not worth two dependencies.
 */
export function matchAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((entry) => entry.tag.length > 0 && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    // Match on the primary subtag so sq-AL, sq-XK and it-CH all resolve.
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}
