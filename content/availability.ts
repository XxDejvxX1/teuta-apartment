/**
 * Booked dates, maintained by hand.
 *
 * Add a line whenever a booking comes in. `to` is the CHECKOUT date and is not
 * itself booked — the guest leaves that morning, so someone else can arrive the
 * same afternoon. This matches how the dates read on a Booking.com reservation,
 * so you can copy them across without doing any arithmetic.
 *
 *   { from: "2026-08-10", to: "2026-08-14" }
 *
 * blocks the nights of the 10th, 11th, 12th and 13th. The 14th stays open.
 *
 * Past dates are ignored automatically, so old entries are harmless — but it is
 * worth clearing them out once a season so this file stays readable.
 */

export type BookedRange = {
  /** First night, YYYY-MM-DD. */
  from: string;
  /** Checkout day, YYYY-MM-DD. Exclusive — not booked. */
  to: string;
  /** Optional, for your own reference. Never shown on the site. */
  note?: string;
};

/*
  The 2026 season as the owner gave it, August 2026.

  Remember `to` is the checkout day and is exclusive: a range ending 2026-09-01
  blocks the night of 31 August and leaves 1 September bookable.

  What a guest can actually book:
    - 1, 2, 3 September
    - 20, 21, 22, 23, 24 September
    - October except 1, 2 and 17-20
*/
/**
 * The day the ranges below were last changed, YYYY-MM-DD.
 *
 * This is the homepage's <lastmod> in the sitemap. That used to be `new Date()`,
 * which announced a change on every deploy whether or not anything had changed —
 * and a lastmod that is always "now" is one Google learns to distrust and then
 * ignore. Bump it when you edit the list.
 */
export const availabilityUpdated = "2026-08-18";

export const bookedRanges: BookedRange[] = [
  // August is closed out entirely.
  { from: "2026-08-01", to: "2026-09-01", note: "August full" },

  // September, either side of the two open windows.
  { from: "2026-09-04", to: "2026-09-20", note: "between the open windows" },
  { from: "2026-09-25", to: "2026-10-01", note: "end of September" },

  // October, newly opened this year.
  { from: "2026-10-01", to: "2026-10-03", note: "1-2 October" },
  { from: "2026-10-17", to: "2026-10-21", note: "17-20 October" },
];
