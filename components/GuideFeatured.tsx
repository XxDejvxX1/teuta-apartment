import Link from "next/link";

import type { Guide } from "@/lib/guides";
import { keepTogether } from "@/lib/typography";
import GuideCover from "@/components/GuideCover";
import { ArrowIcon } from "@/components/icons";

/**
 * The newest article, given the width of the page.
 *
 * Its heading is an h2, not an h1: the page is "What to do in Durrës" and that
 * is the phrase someone searches for. Making the featured title the document
 * heading would hand the page's ranking to whichever article was written last.
 *
 * The one card that keeps its title on the photograph, under the hero's
 * directional scrim — at this width it is the page's opening picture.
 */
export default function GuideFeatured({
  guide,
  meta,
  readLabel,
}: {
  guide: Guide;
  meta: string;
  readLabel: string;
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-11">
      <Link href={`/guide/${guide.slug}`} className="guide-card group block">
        <article
          data-on-dark=""
          className="mount corners relative flex min-h-[460px] items-end overflow-hidden bg-night md:min-h-[580px]"
        >
          <div className="guide-cover absolute inset-0">
            <GuideCover
              slug={guide.slug}
              cover={guide.cover}
              alt=""
              sizes="(max-width: 1400px) 100vw, 1400px"
              priority
            />
          </div>

          {/* Darken the side the words are on, leave the rest of the picture alone. */}
          <div aria-hidden className="guide-scrim-featured absolute inset-0" />

          <div className="relative w-full p-6 md:p-12">
            <h2 className="t-display mb-4 max-w-[16ch] text-headline leading-[1.04] text-white">
              {keepTogether(guide.title)}
            </h2>

            <p className="mb-8 max-w-[52ch] text-body-md leading-[1.6] text-white/85 md:text-body-lg">
              {guide.summary}
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {/* A span, not a nested link — the whole card is already the link. */}
              <span className="btn-linen inline-flex items-center gap-2.5 px-7 py-3.5 text-control">
                {readLabel}
                <span className="nudge nudge--right">
                  <ArrowIcon direction="right" size={16} />
                </span>
              </span>
              <p className="label text-caption text-white/80">{meta}</p>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}
