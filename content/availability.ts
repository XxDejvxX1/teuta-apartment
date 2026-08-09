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

export const bookedRanges: BookedRange[] = [
  // Examples — delete these and put the real bookings in.
  { from: "2026-08-11", to: "2026-08-16", note: "example" },
  { from: "2026-08-20", to: "2026-08-25", note: "example" },
  { from: "2026-08-25", to: "2026-08-29", note: "example, back-to-back" },
  { from: "2026-09-17", to: "2026-09-24", note: "example" },
];
