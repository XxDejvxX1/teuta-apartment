import Link from "next/link";

import type { Guide, GuideCategory } from "@/lib/guides";
import { interpolate } from "@/lib/dictionary";
import { keepTogether } from "@/lib/typography";
import GuideCard from "@/components/GuideCard";
import { ArrowIcon } from "@/components/icons";

/**
 * "What to do in Durrës" on the homepage.
 *
 * Low on the page on purpose: an article competes with booking, so it should
 * catch someone still browsing without pulling away anyone already reading
 * dates. Three cards at most — a doorway to the articles, not the index.
 *
 * Renders nothing when there are no articles, rather than an empty rail.
 */
export default function Guides({
  guides,
  copy,
}: {
  guides: Guide[];
  copy: {
    minutes: string;
    categories: Record<GuideCategory, string>;
    home: { title: string; body: string; link: string };
  };
}) {
  if (guides.length === 0) return null;

  return (
    <section id="guides" className="bg-flax px-5 py-24 md:px-11 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="rise mb-6">
              <h2 className="t-headline max-w-[14ch] text-ink">{keepTogether(copy.home.title)}</h2>
            </span>
            <p className="max-w-[48ch] text-body-lg leading-[1.65] text-ink-soft">
              {copy.home.body}
            </p>
          </div>

          <Link
            href="/guide"
            className="inline-flex shrink-0 items-center gap-2.5 self-start py-1 text-control text-ink md:self-auto"
          >
            <span className="link-stitch">{copy.home.link}</span>
            <span className="nudge nudge--right">
              <ArrowIcon direction="right" size={16} />
            </span>
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {guides.slice(0, 3).map((guide) => (
            <GuideCard
              key={guide.slug}
              guide={guide}
              categoryLabel={copy.categories[guide.category]}
              minutesLabel={interpolate(copy.minutes, { count: guide.minutes })}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
