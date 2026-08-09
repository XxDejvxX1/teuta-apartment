"use client";

import { ArrowIcon } from "@/components/icons";

/**
 * Arrows and dots for a deck. Shared so the photo gallery and the reviews read
 * as the same component rather than two things that happen to look alike.
 */
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
        className="btn-outline flex h-12 w-12 items-center justify-center rounded-full border border-line bg-sand text-ink"
      >
        <ArrowIcon direction="left" />
      </button>

      {/* The visible mark stays 8px, but the target is 24x24 — bare dots fail
          WCAG 2.2 SC 2.5.8 on both size and spacing. */}
      <div className="deck-dots flex items-center">
        {Array.from({ length: count }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onShow(index)}
            aria-label={itemLabel(index)}
            aria-current={index === active ? "true" : undefined}
            className="flex h-6 w-6 items-center justify-center rounded-full"
          >
            <span
              aria-hidden
              className="deck-dot block h-2 rounded-full transition-[width,background-color] duration-[420ms]"
              style={{
                width: index === active ? 26 : 8,
                backgroundColor:
                  index === active ? "var(--color-ink)" : "var(--color-control-idle)",
                transitionTimingFunction: "var(--ease-soft)",
              }}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onShow(active + 1)}
        aria-label={labels.next}
        className="btn-outline flex h-12 w-12 items-center justify-center rounded-full border border-line bg-sand text-ink"
      >
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
}
