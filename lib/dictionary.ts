import copy from "@/content/copy.json";

/**
 * All the words on the site.
 *
 * This was three files behind a `getDictionary(locale)` lookup while the site
 * ran in English, Albanian and Italian. It is one file and a plain import now:
 * Albanian and Italian were dropped in August 2026 on the owner's call — almost
 * everyone arriving was reading the English pages anyway, and two translations
 * nobody used still had to be kept correct on every change.
 *
 * Everything guest-facing still lives here rather than in components, so a
 * wording change is one file and never a JSX edit.
 */
export const copyText = copy;

export type Copy = typeof copy;

/** Fills {name} placeholders. Leaves unknown keys untouched so a typo is visible, not silent. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
