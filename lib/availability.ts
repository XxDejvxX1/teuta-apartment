import type { BookedRange } from "@/content/availability";

/**
 * Parses `YYYY-MM-DD` at 12:00 UTC.
 *
 * Noon, not midnight, is the whole trick. `new Date("2026-08-10")` is midnight
 * UTC, which in Albania (UTC+2) is still the 10th — but formatted back through
 * a local-time API it can land on the 9th. Noon leaves twelve hours of slack in
 * both directions, which no real-world offset can cross.
 */
export function parseDayKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key.trim());
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(+year, +month - 1, +day, 12));

  // Rejects things like 2026-02-31, which Date would silently roll over.
  return date.getUTCMonth() === +month - 1 && date.getUTCDate() === +day
    ? date
    : null;
}

/** `YYYY-MM-DD`, built from UTC parts so it never drifts with the host clock. */
export function dayKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Normalises any instant to 12:00 UTC on the same UTC calendar day. */
export function utcNoon(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12),
  );
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

/** Guards against a typo'd year producing an unbounded loop. */
const MAX_NIGHTS_PER_RANGE = 400;

/**
 * Collapse booked ranges into the set of nights that are taken.
 *
 * The rule that matters: **`to` is the checkout day and is exclusive.** A
 * booking of 10–14 August occupies the nights of the 10th, 11th, 12th and 13th.
 * The guest leaves on the morning of the 14th, so the 14th is available to
 * check into.
 *
 * Treating it as inclusive blocks one night too many on every single booking,
 * which quietly turns away guests on exactly the changeover days that are
 * easiest to fill.
 *
 * Malformed or reversed ranges are skipped rather than throwing — a typo in the
 * bookings file should never take the whole page down.
 */
export function blockedNights(ranges: BookedRange[]): Set<string> {
  const nights = new Set<string>();

  for (const range of ranges) {
    const start = parseDayKey(range.from);
    const checkout = parseDayKey(range.to);
    if (!start || !checkout || start >= checkout) continue;

    let cursor = start;
    let guard = 0;
    while (cursor < checkout && guard < MAX_NIGHTS_PER_RANGE) {
      nights.add(dayKey(cursor));
      cursor = addDays(cursor, 1);
      guard += 1;
    }
  }

  return nights;
}

/**
 * One month as a flat list of cells, padded to whole weeks, Monday first (as
 * used across Europe — a Sunday-first grid would quietly shift every date one
 * column left for the people actually booking this place).
 *
 * `null` is a leading or trailing blank.
 */
export function monthCells(year: number, month: number): (Date | null)[] {
  const firstDayOfWeek = new Date(Date.UTC(year, month, 1, 12)).getUTCDay();
  const lead = (firstDayOfWeek + 6) % 7;
  // Day 0 of the next month is the last day of this one.
  const dayCount = new Date(Date.UTC(year, month + 1, 0, 12)).getUTCDate();

  const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= dayCount; day += 1) {
    cells.push(new Date(Date.UTC(year, month, day, 12)));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

/** Whole nights between an arrival and a departure. */
export function nightsBetween(arrival: Date, departure: Date): number {
  const ms = utcNoon(departure).getTime() - utcNoon(arrival).getTime();
  return Math.round(ms / 86_400_000);
}

/**
 * True when every night from `arrival` up to (not including) `departure` is
 * free. Departure day itself is never checked — the guest leaves that morning.
 */
export function rangeIsFree(
  arrival: Date,
  departure: Date,
  nights: Set<string>,
): boolean {
  let cursor = utcNoon(arrival);
  const checkout = utcNoon(departure);
  if (cursor >= checkout) return false;

  while (cursor < checkout) {
    if (nights.has(dayKey(cursor))) return false;
    cursor = addDays(cursor, 1);
  }
  return true;
}

/**
 * Whether the night beginning on this day is taken.
 *
 * A day is either free or booked — nothing else. There used to be a third
 * "changeover" state for the morning after a stay ends, but the distinction
 * only mattered visually; the booking rules never used it. A day whose night is
 * free is bookable regardless of what happened the night before.
 */
export function isBooked(date: Date, nights: Set<string>): boolean {
  return nights.has(dayKey(utcNoon(date)));
}
