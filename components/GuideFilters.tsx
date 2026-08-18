import type { GuideCategory } from "@/lib/guides";

/**
 * The category chips above the grid.
 *
 * No JavaScript. A radio group drives the filter and globals.css hides the
 * cards that do not match the checked one, which keeps house rule 10 — the page
 * works with the bundle disabled — without a client component, a hydration
 * boundary or a re-render. On a browser without `:has()` every article stays
 * visible, which is the correct thing to degrade to.
 *
 * A category with no articles never reaches here, so the row
 * can never offer a filter that empties the grid.
 */
export default function GuideFilters({
  copy,
  categories,
  total,
}: {
  copy: {
    filterLegend: string;
    all: string;
    categories: Record<GuideCategory, string>;
  };
  categories: { key: GuideCategory; count: number }[];
  total: number;
}) {
  // One category is not a choice — it is a label that cannot be unticked.
  if (categories.length < 2) return null;

  const chips = [
    { key: "all", label: copy.all, count: total },
    ...categories.map((entry) => ({
      key: entry.key,
      label: copy.categories[entry.key],
      count: entry.count,
    })),
  ];

  return (
    <fieldset className="mb-9 flex flex-wrap items-center gap-x-7 gap-y-4 md:mb-11">
      <legend className="sr-only">{copy.filterLegend}</legend>

      {chips.map((chip) => (
        <span key={chip.key} className="relative inline-flex">
          <input
            type="radio"
            name="guide-category"
            id={`gcat-${chip.key}`}
            defaultChecked={chip.key === "all"}
            className="guide-filter-input"
          />
          <label htmlFor={`gcat-${chip.key}`} className="guide-filter-chip">
            {chip.label}
            <span className="guide-filter-count">{chip.count}</span>
          </label>
        </span>
      ))}
    </fieldset>
  );
}
