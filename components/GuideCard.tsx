import Link from "next/link";

import type { Guide } from "@/lib/guides";
import GuideCover from "@/components/GuideCover";

/**
 * One article in the index grid.
 *
 * The title sits on the cover rather than under it. That is a deliberate,
 * scoped exception to "don't print a photograph's name over the photograph" —
 * that rule exists because the gallery was labelling pictures with their own
 * filenames, which told the reader nothing. An article's title is not a label
 * for its cover; it is the thing being linked to, and the picture is there to
 * make it worth reading. See DESIGN.md.
 *
 * Legibility does not depend on which photograph ends up here. The scrim is the
 * page's existing directional-scrim system: measured over the brightest ground
 * on the site (warm sand, which is roughly what the drawn cover is), the title
 * holds 7.7:1 and the eyebrow 5.1:1. Any real photograph is darker than that,
 * so every later cover can only improve those numbers.
 */
export default function GuideCard({
  guide,
  categoryLabel,
  minutesLabel,
  index,
  priority,
}: {
  guide: Guide;
  categoryLabel: string;
  minutesLabel: string;
  index: number;
  priority?: boolean;
}) {
  return (
    <li
      // Read by the no-JS category filter in globals.css.
      data-guide-category={guide.category}
      data-reveal="rise"
      style={{ ["--stagger-i" as string]: index % 3 }}
    >
      <Link href={`/guide/${guide.slug}`} className="guide-card group block">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[20px] bg-surface-warm">
          <div className="guide-cover absolute inset-0">
            <GuideCover
              slug={guide.slug}
              cover={guide.cover}
              alt=""
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
              priority={priority}
            />
          </div>

          <div aria-hidden className="guide-scrim absolute inset-0" />

          <div className="absolute inset-x-0 bottom-0 p-[22px]">
            <p className="eyebrow mb-2 text-white/80">
              {categoryLabel}
              <span aria-hidden className="px-1.5 opacity-60">
                ·
              </span>
              {minutesLabel}
            </p>
            <h3 className="t-display text-[24px] leading-[1.12] text-white md:text-[26px]">
              {guide.title}
            </h3>
          </div>
        </div>
      </Link>
    </li>
  );
}
