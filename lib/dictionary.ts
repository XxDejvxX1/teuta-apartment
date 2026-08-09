import type { Locale } from "@/lib/i18n";
import en from "@/content/dictionaries/en.json";
import sq from "@/content/dictionaries/sq.json";
import it from "@/content/dictionaries/it.json";

/** English is the source of truth for the key shape; the others must match it. */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  sq: sq as Dictionary,
  it: it as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Fills {name} placeholders. Leaves unknown keys untouched so a typo is visible, not silent. */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
