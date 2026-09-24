"use client";

import { ArrowIcon } from "@/components/icons";

/** Arrows and dots under the gallery's deck. */
export default function DeckControls({
  count,
  active,
  onShow,
  labels,
  itemLabel,
}: {
  count: number;
  active: number;
  onShow: (index: number) => void;
  labels: { previous: string; next: string };
  itemLabel: (index: number) => string;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-4 md:mt-12">
      <button
        type="button"
        onClick={() => onShow(active - 1)}
        aria-label={labels.previous}
        className="deck-arrow flex h-12 w-12 items-center justify-center rounded-full"
      >
        <ArrowIcon direction="left" />
      </button>

      {/* The visible mark stays 8px, but the target is 24x24 — bare dots fail
          WCAG 2.2 SC 2.5.8 on both size and spacing. */}
      <div className="flex items-center">
        {Array.from({ length: count }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onShow(index)}
            aria-label={itemLabel(index)}
            aria-current={index === active ? "true" : undefined}
            className="flex h-6 w-6 items-center justify-center"
          >
            <span aria-hidden className="deck-dot" />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onShow(active + 1)}
        aria-label={labels.next}
        className="deck-arrow flex h-12 w-12 items-center justify-center rounded-full"
      >
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
}
