import { describe, expect, it } from "vitest";

import { blockedNights, dayKey, isBooked, monthCells, parseDayKey } from "@/lib/availability";

describe("parseDayKey", () => {
  it("anchors at 12:00 UTC", () => {
    const date = parseDayKey("2026-08-10")!;
    expect(date.getUTCFullYear()).toBe(2026);
    expect(date.getUTCMonth()).toBe(7);
    expect(date.getUTCDate()).toBe(10);
    expect(date.getUTCHours()).toBe(12);
  });

  it("tolerates surrounding whitespace", () => {
    expect(dayKey(parseDayKey("  2026-08-10 ")!)).toBe("2026-08-10");
  });

  it("rejects malformed input", () => {
    expect(parseDayKey("10/08/2026")).toBeNull();
    expect(parseDayKey("2026-8-10")).toBeNull();
    expect(parseDayKey("")).toBeNull();
  });

  it("rejects dates that do not exist rather than rolling them over", () => {
    // Date would silently turn this into 3 March.
    expect(parseDayKey("2026-02-31")).toBeNull();
    expect(parseDayKey("2026-13-01")).toBeNull();
  });
});

describe("blockedNights — `to` is the checkout day", () => {
  it("blocks exactly nights 10-13 for a 10-14 August booking", () => {
    const nights = blockedNights([{ from: "2026-08-10", to: "2026-08-14" }]);
    expect([...nights].sort()).toEqual(["2026-08-10", "2026-08-11", "2026-08-12", "2026-08-13"]);
  });

  it("leaves the checkout day open to arrive on", () => {
    const nights = blockedNights([{ from: "2026-08-10", to: "2026-08-14" }]);
    expect(nights.has("2026-08-14")).toBe(false);
  });

  it("merges back-to-back bookings without double counting", () => {
    const nights = blockedNights([
      { from: "2026-08-10", to: "2026-08-14" },
      { from: "2026-08-14", to: "2026-08-16" },
    ]);
    expect([...nights].sort()).toEqual([
      "2026-08-10",
      "2026-08-11",
      "2026-08-12",
      "2026-08-13",
      "2026-08-14",
      "2026-08-15",
    ]);
  });

  it("crosses a month boundary", () => {
    const nights = blockedNights([{ from: "2026-08-30", to: "2026-09-02" }]);
    expect([...nights].sort()).toEqual(["2026-08-30", "2026-08-31", "2026-09-01"]);
  });

  it("handles a single night", () => {
    const nights = blockedNights([{ from: "2026-08-10", to: "2026-08-11" }]);
    expect([...nights]).toEqual(["2026-08-10"]);
  });

  /** A typo in the bookings file must never take the page down. */
  it("skips reversed, empty and malformed ranges", () => {
    const nights = blockedNights([
      { from: "2026-08-14", to: "2026-08-10" }, // reversed
      { from: "2026-08-10", to: "2026-08-10" }, // zero nights
      { from: "nonsense", to: "2026-08-12" },
      { from: "2026-02-31", to: "2026-03-04" }, // date does not exist
      { from: "2026-09-01", to: "2026-09-03" }, // the one good row
    ]);
    expect([...nights].sort()).toEqual(["2026-09-01", "2026-09-02"]);
  });

  it("caps a runaway range instead of hanging", () => {
    const nights = blockedNights([{ from: "2026-08-10", to: "2999-08-10" }]);
    expect(nights.size).toBe(400);
  });
});

describe("isBooked", () => {
  const nights = blockedNights([{ from: "2026-08-10", to: "2026-08-14" }]);

  it("reports an occupied night as booked", () => {
    expect(isBooked(parseDayKey("2026-08-12")!, nights)).toBe(true);
  });

  it("leaves the checkout morning bookable", () => {
    expect(isBooked(parseDayKey("2026-08-14")!, nights)).toBe(false);
  });

  it("leaves the day before arrival bookable", () => {
    expect(isBooked(parseDayKey("2026-08-09")!, nights)).toBe(false);
  });
});

describe("monthCells", () => {
  it("pads to whole weeks", () => {
    for (let month = 0; month < 12; month += 1) {
      expect(monthCells(2026, month).length % 7).toBe(0);
    }
  });

  it("keeps every day of the month", () => {
    expect(monthCells(2026, 1).filter(Boolean)).toHaveLength(28);
    expect(monthCells(2028, 1).filter(Boolean)).toHaveLength(29); // leap year
    expect(monthCells(2026, 0).filter(Boolean)).toHaveLength(31);
    expect(monthCells(2026, 3).filter(Boolean)).toHaveLength(30);
  });

  it("starts a Monday month in the first column", () => {
    // 1 January 2024 was a Monday.
    expect(monthCells(2024, 0)[0]?.getUTCDate()).toBe(1);
  });

  it("places every date under its own weekday column", () => {
    // The invariant that actually matters: the column index must equal the
    // Monday-first weekday of the date sitting in it.
    for (let month = 0; month < 12; month += 1) {
      monthCells(2026, month).forEach((date, index) => {
        if (!date) return;
        expect(index % 7).toBe((date.getUTCDay() + 6) % 7);
      });
    }
  });

  it("only ever pads with nulls at the edges", () => {
    const cells = monthCells(2026, 7);
    const first = cells.findIndex(Boolean);
    const last = cells.length - 1 - [...cells].reverse().findIndex(Boolean);
    expect(cells.slice(first, last + 1).every(Boolean)).toBe(true);
  });
});

describe("timezone independence", () => {
  /**
   * Every function here formats from UTC parts, so these hold whatever TZ the
   * host is in. `npm run test:tz` reruns the suite under UTC+14 and UTC-11; if
   * local-time parsing ever creeps in, these literals start failing there and
   * only there.
   */
  it("keys a date to the day it was written as", () => {
    expect(dayKey(parseDayKey("2026-08-10")!)).toBe("2026-08-10");
    expect(dayKey(parseDayKey("2026-12-31")!)).toBe("2026-12-31");
    expect(dayKey(parseDayKey("2026-01-01")!)).toBe("2026-01-01");
  });

  it("keys a date across a DST boundary correctly", () => {
    // Europe/Tirane springs forward on 2026-03-29.
    expect(dayKey(parseDayKey("2026-03-29")!)).toBe("2026-03-29");
  });
});
