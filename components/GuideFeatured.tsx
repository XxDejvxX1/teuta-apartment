import Link from "next/link";

import type { Guide } from "@/lib/guides";
import GuideCover from "@/components/GuideCover";
import { ArrowIcon } from "@/components/icons";

/**
 * The newest article, given the width of the page.
 *
 * Its heading is an h2, not an h1: the page is "What to do in Durrës" and that
 * is the phrase someone searches for. Making the featured article's title the
 * document heading would hand the page's ranking to whichever article happened
 * to be written last.
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
    <div data-reveal="rise" className="mx-auto max-w-[1400px] px-5 md:px-11">
      <Link href={`/guide/${guide.slug}`} className="guide-card guide-card--wide group block">
        <article
          data-on-dark=""
          className="relative flex min-h-[440px] items-end overflow-hidden rounded-[24px] bg-surface-warm md:min-h-[560px]"
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

          {/* The hero's directional scrim: darken the side the words are on,
              leave the rest of the picture alone. */}
          <div aria-hidden className="guide-scrim-featured absolute inset-0" />

          <div className="relative w-full p-6 md:p-12">
            <p className="eyebrow mb-4 text-white/80">{meta}</p>

            <h2 className="t-display mb-4 max-w-[16ch] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.06] text-white">
              {guide.title}
            </h2>

            <p className="mb-8 max-w-[52ch] text-[16px] leading-[1.6] text-white/85 md:text-[17px]">
              {guide.summary}
            </p>

            {/* A span, not a nested link — the whole card is already the link. */}
            <span className="btn-light inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-[15px] tracking-[0.01em] text-deep">
              {readLabel}
              <ArrowIcon direction="right" size={16} />
            </span>
          </div>
        </article>
      </Link>
    </div>
  );
}
