import { rates, hasPublishedRates, type SeasonKey } from "@/content/rates";
import { keepTogether } from "@/lib/typography";

type SeasonCopy = { label: string; months: string };

/**
 * Renders nothing until at least one real price exists in content/rates.ts, so
 * an unfinished rate card can never reach a guest.
 */
export default function Rates({
  copy,
}: {
  copy: {
    title: string;
    perNight: string;
    ask: string;
    // Keyed by the season union: a season renamed in one file and not the
    // other is a build error rather than a raw key rendered at a guest.
    seasons: Record<SeasonKey, SeasonCopy>;
  };
}) {
  if (!hasPublishedRates()) return null;

  return (
    <div className="mt-20 md:mt-24">
      <h3 className="t-display mb-8 text-title text-ink md:text-title-lg">
        {keepTogether(copy.title)}
      </h3>

      {/*
        One plate ruled into a column per season rather than four cards: the
        bands are one table read left to right, and the count follows the data —
        two across on a phone, four from 1024px.

        The price leads each cell and the season is its caption, which is the
        order people read a rate card in. That order is CSS `order`; the DOM
        keeps <dt> before <dd>, so a screen reader pairs each price with its
        season instead of announcing an answer to nothing.
      */}
      <dl className="ruled grid-cols-2 lg:grid-cols-4">
        {rates.seasons.map((season) => {
          const label = copy.seasons[season.key];
          const priced = typeof season.perNight === "number";

          return (
            <div key={season.key} className="flex flex-col px-5 py-6 md:px-7 md:py-8">
              <dt className="order-2 mt-5 text-body-md font-medium text-ink">{label.label}</dt>
              <dd className="order-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {priced ? (
                  <>
                    <span className="stitch-x text-stitch-lg text-ink">
                      {rates.currencySymbol}
                      {season.perNight}
                    </span>
                    <span className="label text-caption text-ink-mute">{copy.perNight}</span>
                  </>
                ) : (
                  // No price for this band yet. "Ask" is honest; leaving the
                  // band out would look like the card forgot a month.
                  <span className="t-display text-title text-ink-mute">{copy.ask}</span>
                )}
              </dd>
              <dd className="order-3 mt-1 text-note text-ink-mute">{label.months}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
