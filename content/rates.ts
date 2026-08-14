/**
 * What the apartment costs.
 *
 * A visitor who cannot find a price goes back to Booking.com to look it up, and
 * most of them book there instead. This is the single most expensive blank on
 * the page.
 *
 * Prices are `null` until you fill them in, and the whole block renders nothing
 * while they are all null — so a half-finished rate card can never reach a
 * guest. Put in real numbers and the section appears by itself.
 *
 * Season labels are translated in content/dictionaries/*.json under `rates`.
 */

export type SeasonKey = "spring" | "shoulder" | "peak";

export type Season = {
  key: SeasonKey;
  /** Price per night in `currency`, or null while unknown. */
  perNight: number | null;
};

export const rates = {
  currency: "EUR",
  currencySymbol: "€",

  /**
   * Bands are the owner's own, not a generic low/mid/high split, and they
   * cover the whole open season — April to the end of September. There is no
   * winter band because the apartment is closed then; see `season.openMonths`
   * in site.ts, which also stops the calendar offering those dates.
   *
   * A band left at `null` would render "ask" rather than disappearing: a rate
   * card with a month silently missing reads as an error, not as discretion.
   */
  seasons: [
    { key: "spring", perNight: 60 }, // April, May and October
    { key: "shoulder", perNight: 70 }, // June and September
    { key: "peak", perNight: 85 }, // July and August
  ] as Season[],
};

/** True once at least one real price exists. Drives whether the block renders. */
export function hasPublishedRates(): boolean {
  return rates.seasons.some((season) => typeof season.perNight === "number");
}
