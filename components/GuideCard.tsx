import Link from "next/link";

import type { Guide } from "@/lib/guides";
import { keepTogether } from "@/lib/typography";
import GuideCover from "@/components/GuideCover";

/**
 * One article, as a mounted print with its caption.
 *
 * The title used to be printed over the cover under a scrim. Under the cover
 * it reads as a plate and its caption — the same grammar as the photographs —
 * needs no scrim at all, and a postcard-style cover keeps its own lettering
 * clear. The category and reading time follow the title rather than sitting
 * above it as a label.
 */
export default function GuideCard({
  guide,
  categoryLabel,
  minutesLabel,
  priority,
}: {
  guide: Guide;
  categoryLabel: string;
  minutesLabel: string;
  priority?: boolean;
}) {
  return (
    // Read by the no-JS category filter in globals.css.
    <li data-guide-category={guide.category}>
      <Link href={`/guide/${guide.slug}`} className="guide-card group block">
        <span className="mount block">
          <span className="relative block aspect-[3/2] overflow-hidden bg-night">
            <span className="guide-cover absolute inset-0 block">
              <GuideCover
                slug={guide.slug}
                cover={guide.cover}
                alt=""
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                priority={priority}
              />
            </span>
          </span>
        </span>

        <h3 className="guide-card-title t-display mt-7 text-title leading-[1.12] text-ink">
          {keepTogether(guide.title)}
        </h3>
        <p className="label mt-3 text-caption text-ink-soft">
          {categoryLabel}
          <span aria-hidden className="px-2 text-madder">
            ·
          </span>
          {minutesLabel}
        </p>
      </Link>
    </li>
  );
}
