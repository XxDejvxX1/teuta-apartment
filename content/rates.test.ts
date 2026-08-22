import { describe, expect, it } from "vitest";

import { parseDayKey } from "@/lib/availability";
import { perNightOn, rates, seasonMonths, stayCost } from "@/content/rates";
import { site } from "@/content/site";

const day = (key: string) => parseDayKey(key)!;

/** The published prices, so a change to rates.ts fails these loudly. */
const SPRING = 60;
const JUNE = 80;
const PEAK = 90;
const SEPTEMBER = 70;

describe("season bands", () => {
  it("matches the published prices", () => {
    expect(perNightOn(day("2026-04-15"))).toBe(SPRING);
    expect(perNightOn(day("2026-05-15"))).toBe(SPRING);
    expect(perNightOn(day("2026-10-15"))).toBe(SPRING);
    expect(perNightOn(day("2026-06-15"))).toBe(JUNE);
    expect(perNightOn(day("2026-09-15"))).toBe(SEPTEMBER);
    expect(perNightOn(day("2026-07-15"))).toBe(PEAK);
    expect(perNightOn(day("2026-08-15"))).toBe(PEAK);
  });

  /**
   * The invariant that keeps the calendar and the rate card honest: the
   * calendar will happily offer any night in an open month, so every open month
   * needs a price or a guest can select a stay that cannot be totalled.
   */
  it("prices every month the apartment is open, exactly once", () => {
    for (const month of site.season.openMonths) {
      const bands = Object.values(seasonMonths).filter((months) => months.includes(month));
      expect(bands, `month ${month} should sit in exactly one band`).toHaveLength(1);
    }
  });

  it("does not price a closed month", () => {
    // January, February, March, November, December.
    for (const month of [0, 1, 2, 10, 11]) {
      expect(site.season.openMonths).not.toContain(month);
      const iso = `2026-${String(month + 1).padStart(2, "0")}-15`;
      expect(perNightOn(day(iso))).toBeNull();
    }
  });

  it("prices the first of a month in that month's band", () => {
    // The boundary local-midnight parsing would get wrong: east of UTC, 1 July
    // read locally can land on 30 June and be charged at the June rate.
    expect(perNightOn(day("2026-07-01"))).toBe(PEAK);
    expect(perNightOn(day("2026-06-30"))).toBe(JUNE);
  });
});

describe("stayCost", () => {
  it("charges for nights, not days — departure is exclusive", () => {
    // 10-14 August is four nights: the 10th, 11th, 12th and 13th.
    expect(stayCost(day("2026-08-10"), day("2026-08-14"))).toBe(4 * PEAK);
  });

  it("charges one night for a one-night stay", () => {
    expect(stayCost(day("2026-08-10"), day("2026-08-11"))).toBe(PEAK);
  });

  it("splits a stay that crosses a band", () => {
    // 28 June to 3 July: three June nights, two July nights. Multiplying five
    // nights by either rate gives the wrong answer in both directions.
    expect(stayCost(day("2026-06-28"), day("2026-07-03"))).toBe(3 * JUNE + 2 * PEAK);
  });

  it("splits September into October", () => {
    // 29 September to 2 October is three nights — the 29th, the 30th and the
    // 1st. Two at September's rate, one at October's.
    expect(stayCost(day("2026-09-29"), day("2026-10-02"))).toBe(2 * SEPTEMBER + 1 * SPRING);
  });

  it("returns null when any night is unpriced, rather than a partial total", () => {
    // 30 March to 2 April: two closed nights, one priced. A partial total here
    // would undercharge by two nights and look authoritative doing it.
    expect(stayCost(day("2026-03-30"), day("2026-04-02"))).toBeNull();
  });

  it("returns null for an empty or reversed range", () => {
    expect(stayCost(day("2026-08-10"), day("2026-08-10"))).toBeNull();
    expect(stayCost(day("2026-08-14"), day("2026-08-10"))).toBeNull();
  });

  it("totals a long stay that spans three bands", () => {
    // 29 May to 2 July: 3 May nights, 30 June nights, 1 July night.
    expect(stayCost(day("2026-05-29"), day("2026-07-02"))).toBe(3 * SPRING + 30 * JUNE + 1 * PEAK);
  });

  it("agrees with the published rate card", () => {
    // Nothing here should be able to drift from content/rates.ts silently.
    const byKey = Object.fromEntries(rates.seasons.map((s) => [s.key, s.perNight]));
    expect(byKey.spring).toBe(SPRING);
    expect(byKey.june).toBe(JUNE);
    expect(byKey.peak).toBe(PEAK);
    expect(byKey.september).toBe(SEPTEMBER);
  });
});
