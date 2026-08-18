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

/**
 * Which months belong to which band, 0-indexed.
 *
 * This existed only as a comment beside each season until the calendar needed
 * to total a stay. It is price data, so it lives here with the prices — if a
 * band ever moves, the label in the dictionaries has to move with it, and this
 * is the copy the arithmetic reads.
 *
 * Every month the apartment is open (April–October, see `site.season.openMonths`)
 * must appear exactly once. The closed months appear nowhere, so a night in
 * one is unpriced rather than free.
 */
export const seasonMonths: Record<SeasonKey, readonly number[]> = {
  spring: [3, 4, 9], // April, May, October
  shoulder: [5, 8], // June, September
  peak: [6, 7], // July, August
};

function seasonForMonth(month: number): SeasonKey | null {
  for (const key of Object.keys(seasonMonths) as SeasonKey[]) {
    if (seasonMonths[key].includes(month)) return key;
  }
  return null;
}

/** What one night costs, or null if that night has no published price. */
export function perNightOn(date: Date): number | null {
  // getUTCMonth, not getMonth: every date on this site is anchored at 12:00 UTC,
  // and reading it locally would land on the previous month for the 1st of a
  // month anywhere east of UTC — Albania included.
  const key = seasonForMonth(date.getUTCMonth());
  if (!key) return null;

  const season = rates.seasons.find((entry) => entry.key === key);
  return typeof season?.perNight === "number" ? season.perNight : null;
}

/**
 * What a whole stay costs, summed night by night.
 *
 * Night by night rather than nights × one rate, because a stay can cross a
 * band: 28 June to 3 July is four nights at the June price and one at July's.
 * Multiplying by either would be wrong, and wrong in the guest's favour half
 * the time and ours the other half.
 *
 * `departure` is exclusive — the guest leaves that morning and is not charged
 * for it, the same rule the availability calendar uses.
 *
 * Returns **null** rather than a partial figure if any night is unpriced, so a
 * band left at `null` shows the guest nothing instead of a total that quietly
 * omits three nights.
 */
export function stayCost(arrival: Date, departure: Date): number | null {
  let total = 0;
  let nights = 0;

  const cursor = new Date(arrival.getTime());
  while (cursor < departure) {
    const perNight = perNightOn(cursor);
    if (perNight === null) return null;

    total += perNight;
    nights += 1;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return nights > 0 ? total : null;
}
