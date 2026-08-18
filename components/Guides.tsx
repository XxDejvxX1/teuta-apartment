import Link from "next/link";

import type { Guide, GuideCategory } from "@/lib/guides";
import { interpolate } from "@/lib/dictionary";
import GuideCard from "@/components/GuideCard";
import { ArrowIcon } from "@/components/icons";

/**
 * "What to do in Durrës" on the homepage.
 *
 * Placed after Good to know and before the closing section, which is low on the
 * page on purpose: an article competes with booking, so it should catch someone
 * still browsing without pulling away anyone already reading dates. Three cards
 * at most — this is a doorway to the articles, not the index.
 *
 * Renders nothing at all when there are no articles, rather than an empty rail
 * or a link to a page that would only apologise.
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
    <section id="guides" className="bg-mist px-5 py-20 md:px-11 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div data-reveal="fade">
            <span data-reveal="mask" className="mb-5 block">
              <h2 className="t-h3 max-w-[16ch] text-ink">{copy.home.title}</h2>
            </span>
            <p className="max-w-[48ch] text-body-lg leading-[1.65] text-body-soft">
              {copy.home.body}
            </p>
          </div>

          <Link
            href="/guide"
            data-reveal="fade"
            style={{ ["--stagger-i" as string]: 1 }}
            className="guide-back inline-flex shrink-0 items-center gap-2.5 text-control text-accent"
          >
            {copy.home.link}
            <span className="guide-forward-arrow">
              <ArrowIcon direction="right" size={16} />
            </span>
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.slice(0, 3).map((guide, index) => (
            <GuideCard
              key={guide.slug}
              guide={guide}
              categoryLabel={copy.categories[guide.category]}
              minutesLabel={interpolate(copy.minutes, { count: guide.minutes })}
              index={index}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
