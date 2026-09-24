import type { GuideCategory } from "@/lib/guides";

/**
 * The category chips above the grid.
 *
 * No JavaScript. A radio group drives the filter and globals.css hides the
 * cards that do not match the checked one, so the page keeps working with the
 * bundle disabled and ships no client component for it. On a browser without
 * `:has()` every article stays visible, which is the right thing to degrade to.
 *
 * A category with no articles never reaches here, so the row can never offer
 * a filter that empties the grid.
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
    <fieldset className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-4 md:mb-14">
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
          <label htmlFor={`gcat-${chip.key}`} className="guide-filter-chip label text-note">
            {chip.label}
            <span className="text-label opacity-75">{chip.count}</span>
          </label>
        </span>
      ))}
    </fieldset>
  );
}
