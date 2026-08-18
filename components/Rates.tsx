import { rates, hasPublishedRates, type SeasonKey } from "@/content/rates";

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
    // Record<string, …> accepted any key at all, so a season renamed in one
    // file and not the other fell through to rendering the raw key. This makes
    // that a build error.
    seasons: Record<SeasonKey, SeasonCopy>;
  };
}) {
  if (!hasPublishedRates()) return null;

  return (
    <div
      data-reveal="fade"
      style={{ ["--stagger-i" as string]: 2 }}
      className="mt-16 border-t border-line pt-12"
    >
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="t-display text-[26px] text-ink md:text-[30px]">{copy.title}</h3>
      </div>

      {/*
        One column per season — the grid used to declare four for three bands,
        leaving a phantom empty column at wide sizes. The price leads each cell
        now; the season name and its months are the caption underneath, which is
        the order someone actually reads them in.
      */}
      <dl className="grid gap-4 sm:grid-cols-3">
        {rates.seasons.map((season, index) => {
          const label = copy.seasons[season.key];
          const priced = typeof season.perNight === "number";

          return (
            /*
              The three price bands arrive one after another rather than as one
              block. "rise" rather than "fade" because these are the only real
              cards in this section, and the stagger is what makes the reader
              read them left to right instead of taking them in as a slab.
            */
            <div
              key={season.key}
              data-reveal="rise"
              style={{ ["--stagger-i" as string]: index }}
              className="flex flex-col rounded-2xl border border-line px-6 py-6"
            >
              {/*
                <dt> before <dd>, which is what the spec requires and what a
                screen reader needs in order to pair a price with the season it
                belongs to. This used to open with a <dd> and no preceding <dt>
                at all, so the price was announced as an answer to nothing.

                The reading order on screen is unchanged — big number first,
                caption under it — because that is CSS `order`, not DOM order.
              */}
              <dt className="order-2 mt-4 text-[15px] text-ink">{label.label}</dt>
              <dd
                className={`order-1 text-[34px] leading-none ${priced ? "text-ink" : "text-muted"}`}
              >
                {priced ? (
                  <>
                    {rates.currencySymbol}
                    {season.perNight}
                    <span className="ml-2 text-[13px] text-muted">{copy.perNight}</span>
                  </>
                ) : (
                  // No price given for this band yet. Saying "ask" is honest;
                  // omitting the band would look like the card forgot August.
                  <span className="text-[24px]">{copy.ask}</span>
                )}
              </dd>
              <dd className="order-3 mt-1 text-[13px] text-muted">{label.months}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
