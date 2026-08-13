"use client";

import { useEffect, useMemo, useState } from "react";

import {
  addDays,
  dayKey,
  isBooked,
  monthCells,
  nightsBetween,
  parseDayKey,
  rangeIsFree,
  utcNoon,
} from "@/lib/availability";
import { site, whatsappLink } from "@/content/site";
import { interpolate } from "@/lib/dictionary";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";

type Copy = {
  title: string;
  /*
    No longer drawn as a legend under the heading. The two words are still the
    only non-visual signal of whether a night is free or taken — they are the
    `statusText` in each day cell's screen-reader label — so removing the
    strings would leave colour as the sole channel.
  */
  legend: { free: string; booked: string };
  previousMonth: string;
  nextMonth: string;
  cta: string;
  ctaWithDates: string;
  minStay: string;
  arrival: string;
  departure: string;
  today: string;
  guests: string;
  clear: string;
  nightsOne: string;
  nightsOther: string;
  guestsOne: string;
  guestsOther: string;
  tooShort: string;
  rangeTaken: string;
  prefillDates: string;
  closedSeason: string;
};

/** The apartment is only open April–September; see site.season.openMonths. */
function isOpen(date: Date): boolean {
  return site.season.openMonths.includes(date.getUTCMonth());
}

const MONTHS_AHEAD = 11;

export default function Availability({
  copy,
  localeTag,
  ctaHref,
  blockedNights,
  serverToday,
  children,
}: {
  copy: Copy;
  localeTag: string;
  ctaHref: string;
  blockedNights: string[];
  serverToday: string;
  /** Rates block, rendered on the server and passed through. */
  children?: React.ReactNode;
}) {
  const [todayKey, setTodayKey] = useState(serverToday);
  const [offset, setOffset] = useState(0);
  const [arrival, setArrival] = useState<string | null>(null);
  const [departure, setDeparture] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [problem, setProblem] = useState<string | null>(null);

  // The page is prerendered, so build-time "today" can be stale. Render the
  // server's date first so hydration matches, then correct on mount.
  useEffect(() => {
    const actual = dayKey(new Date());
    if (actual !== serverToday) setTodayKey(actual);
  }, [serverToday]);

  const nights = useMemo(() => new Set(blockedNights), [blockedNights]);
  const today = useMemo(() => parseDayKey(todayKey) ?? new Date(), [todayKey]);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(localeTag, { day: "numeric", month: "long", timeZone: "UTC" }),
    [localeTag],
  );
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(localeTag, { month: "long", year: "numeric", timeZone: "UTC" }),
    [localeTag],
  );
  const weekdayNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(localeTag, { weekday: "short", timeZone: "UTC" });
    // 1 January 2024 was a Monday.
    return Array.from({ length: 7 }, (_, i) =>
      formatter.format(new Date(Date.UTC(2024, 0, 1 + i, 12))),
    );
  }, [localeTag]);

  const plural = (one: string, other: string, count: number) =>
    interpolate(count === 1 ? one : other, { count });

  /** High season carries a longer minimum, so the rule depends on arrival. */
  const minNightsFor = (day: Date) =>
    site.stay.highSeasonMonths.includes(day.getUTCMonth())
      ? site.stay.minNights.high
      : site.stay.minNights.standard;

  const clear = () => {
    setArrival(null);
    setDeparture(null);
    setProblem(null);
  };

  const pick = (key: string) => {
    const day = parseDayKey(key);
    if (!day) return;

    // No arrival yet, or a complete range already chosen: start over from here.
    if (!arrival || departure) {
      setArrival(key);
      setDeparture(null);
      setProblem(null);
      return;
    }

    const start = parseDayKey(arrival)!;
    if (day <= start) {
      setArrival(key);
      setProblem(null);
      return;
    }

    // Every night in the range must be both free and inside the open season —
    // a stay running from September into October is not bookable.
    let cursor = start;
    while (cursor < day) {
      if (!isOpen(cursor)) {
        setArrival(key);
        setDeparture(null);
        setProblem(copy.closedSeason);
        return;
      }
      cursor = addDays(cursor, 1);
    }

    if (!rangeIsFree(start, day, nights)) {
      setArrival(key);
      setDeparture(null);
      setProblem(copy.rangeTaken);
      return;
    }

    const count = nightsBetween(start, day);
    const min = minNightsFor(start);
    if (count < min) {
      setDeparture(null);
      setProblem(
        interpolate(copy.tooShort, {
          count: plural(copy.nightsOne, copy.nightsOther, count),
          min: plural(copy.nightsOne, copy.nightsOther, min),
        }),
      );
      return;
    }

    setDeparture(key);
    setProblem(null);
  };

  const selected = arrival && departure ? { arrival, departure } : null;
  const nightCount = selected
    ? nightsBetween(parseDayKey(selected.arrival)!, parseDayKey(selected.departure)!)
    : 0;

  /** The whole point of the calendar: hand the dates to WhatsApp, not the guest. */
  const href = selected
    ? whatsappLink(
        interpolate(copy.prefillDates, {
          from: dateFormatter.format(parseDayKey(selected.arrival)!),
          to: dateFormatter.format(parseDayKey(selected.departure)!),
          nights: plural(copy.nightsOne, copy.nightsOther, nightCount),
          guests: plural(copy.guestsOne, copy.guestsOther, guests),
        }),
      )
    : ctaHref;

  const monthStartFor = (slot: number) =>
    new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + offset + slot, 1, 12));

  return (
    // Asymmetric padding on purpose. The gallery above already ends with 96px
    // (128px on desktop) of its own bottom padding, and a matching top pad here
    // stacked into 248px of empty page between the last photo control and this
    // heading. The top is trimmed to roughly a third of the bottom so the two
    // sections read as adjacent; the generous bottom is kept, because the rates
    // block below it is the last thing before a different section colour.
    <section
      id="availability"
      className="bg-sand px-5 pb-20 pt-6 md:px-11 md:pb-[120px] md:pt-8"
    >
      <div className="mx-auto max-w-[900px]">
        <div data-reveal="fade" className="mb-10 text-center md:mb-14">
          <span data-reveal="mask" className="mb-5 block">
            <h2 className="t-h3 text-ink">{copy.title}</h2>
          </span>
          {/* The minimum-stay rule used to live ~1,900px further down the page,
              so people planned stays that would be refused. */}
          <p className="mx-auto max-w-[52ch] text-[14px] leading-[1.6] text-muted">
            {copy.minStay}
          </p>
        </div>

        <div data-reveal="fade" style={{ ["--stagger-i" as string]: 1 }}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setOffset((v) => Math.max(0, v - 1))}
              disabled={offset === 0}
              aria-label={copy.previousMonth}
              className="btn-outline flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-ink"
            >
              <ArrowIcon direction="left" />
            </button>

            <div className="flex flex-1 justify-around gap-4">
              {[0, 1].map((slot) => (
                <p
                  key={slot}
                  className={[
                    "t-display text-center text-[22px] text-ink md:text-[26px]",
                    slot === 1 ? "hidden md:block" : "",
                  ].join(" ")}
                >
                  {monthFormatter.format(monthStartFor(slot))}
                </p>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setOffset((v) => Math.min(MONTHS_AHEAD, v + 1))}
              disabled={offset >= MONTHS_AHEAD}
              aria-label={copy.nextMonth}
              className="btn-outline flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-ink"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>

          <div className="grid gap-10 md:grid-cols-2 md:gap-14">
            {[0, 1].map((slot) => {
              const monthStart = monthStartFor(slot);
              const cells = monthCells(monthStart.getUTCFullYear(), monthStart.getUTCMonth());

              return (
                <table
                  key={slot}
                  className={["w-full border-collapse", slot === 1 ? "hidden md:table" : ""].join(" ")}
                >
                  <caption className="sr-only">{monthFormatter.format(monthStart)}</caption>
                  <thead>
                    <tr>
                      {weekdayNames.map((name) => (
                        <th
                          key={name}
                          scope="col"
                          className="pb-3 text-[12px] font-normal uppercase tracking-[0.1em] text-muted"
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: cells.length / 7 }, (_, week) => (
                      <tr key={week}>
                        {cells.slice(week * 7, week * 7 + 7).map((date, index) => {
                          if (!date) return <td key={index} className="p-0.5" />;

                          const key = dayKey(date);
                          const closed = !isOpen(date);
                          const isPast = key < todayKey;
                          const isToday = key === todayKey;
                          const booked = isBooked(date, nights);

                          const isArrival = key === arrival;
                          const isDeparture = key === departure;
                          const inRange =
                            !!arrival && !!departure && key > arrival && key < departure;

                          // A guest can arrive on any night that is free, and
                          // depart on any later day whose intervening nights are.
                          const selectable =
                            !isPast && !closed && (!booked || (!!arrival && !departure));

                          return (
                            <td key={index} className="p-0.5 text-center">
                              <DayCell
                                date={date}
                                label={dateFormatter.format(date)}
                                statusText={
                                  closed
                                    ? copy.closedSeason
                                    : booked
                                      ? copy.legend.booked
                                      : copy.legend.free
                                }
                                booked={booked}
                                closed={closed}
                                isPast={isPast}
                                isToday={isToday}
                                todayLabel={copy.today}
                                isArrival={isArrival}
                                isDeparture={isDeparture}
                                inRange={inRange}
                                selectable={selectable}
                                onPick={() => pick(key)}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })}
          </div>

          {/* Selection summary + the handoff */}
          <div className="mt-10 rounded-2xl border border-line bg-white/50 p-6 md:p-7">
            <div aria-live="polite" className="min-h-[1.5rem]">
              {problem ? (
                <p className="text-center text-[15px] leading-[1.55] text-accent">{problem}</p>
              ) : selected ? (
                <p className="text-center text-[16px] text-ink">
                  <span className="text-muted">{copy.arrival}</span>{" "}
                  {dateFormatter.format(parseDayKey(selected.arrival)!)}
                  <span aria-hidden className="mx-2 text-muted">
                    ·
                  </span>
                  <span className="text-muted">{copy.departure}</span>{" "}
                  {dateFormatter.format(parseDayKey(selected.departure)!)}
                  <span aria-hidden className="mx-2 text-muted">
                    ·
                  </span>
                  {plural(copy.nightsOne, copy.nightsOther, nightCount)}
                </p>
              ) : arrival ? (
                <p className="text-center text-[16px] text-ink">
                  <span className="text-muted">{copy.arrival}</span>{" "}
                  {dateFormatter.format(parseDayKey(arrival)!)}
                </p>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
              <label className="flex items-center gap-2.5 text-[15px] text-body-soft">
                {copy.guests}
                <select
                  value={guests}
                  onChange={(event) => setGuests(Number(event.target.value))}
                  className="rounded-full border border-line bg-sand px-4 py-2 text-[15px] text-ink"
                >
                  {Array.from({ length: site.capacity.guests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              {(arrival || departure) && (
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-full px-3 py-2 text-[14px] text-muted underline underline-offset-4 transition-colors duration-300 hover:text-ink"
                >
                  {copy.clear}
                </button>
              )}
            </div>

            <div className="mt-6 text-center">
              <a
                href={href}
                target="_blank"
                rel="noopener"
                className="btn-light inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-4 text-[16px] text-white"
              >
                <WhatsAppIcon size={18} />
                {selected ? copy.ctaWithDates : copy.cta}
              </a>
            </div>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}

function DayCell({
  date,
  label,
  statusText,
  booked,
  closed,
  isPast,
  isToday,
  todayLabel,
  isArrival,
  isDeparture,
  inRange,
  selectable,
  onPick,
}: {
  date: Date;
  label: string;
  statusText: string;
  booked: boolean;
  closed: boolean;
  isPast: boolean;
  isToday: boolean;
  todayLabel: string;
  isArrival: boolean;
  isDeparture: boolean;
  inRange: boolean;
  selectable: boolean;
  onPick: () => void;
}) {
  const isEdge = isArrival || isDeparture;

  const surface = isEdge
    ? "bg-accent text-white"
    : inRange
      ? "bg-highlight text-ink"
      : "text-ink";

  const content = (
    <>
      {date.getUTCDate()}
      <span className="sr-only">
        {` — ${label}${isToday ? `, ${todayLabel}` : ""}, ${statusText}`}
      </span>
    </>
  );

  const shared = [
    "relative mx-auto flex h-10 w-10 items-center justify-center rounded-full text-[15px] tabular-nums transition-colors duration-200",
    surface,
    isToday && !isEdge ? "ring-1 ring-accent ring-offset-1 ring-offset-sand" : "",
  ].join(" ");

  if (isPast) {
    // Readable (4.6:1) but struck through, so "past" needs no legend entry.
    // Hidden from assistive tech: a date already gone carries no information.
    return (
      <span className={`${shared} text-muted line-through decoration-1`} aria-hidden>
        {date.getUTCDate()}
      </span>
    );
  }

  /*
    A night you cannot have looks the same however it came to be unavailable:
    struck through, quiet, and not a button. Closed for the season and already
    booked share this treatment; a past date differs only in being hidden from
    assistive tech, since a date already gone carries no information.

    Booked nights used to be a filled block instead. That made one grid read as
    two systems at once — some dates greyed out, some coloured in — leaving the
    reader to work out which meant what, and it drew the eye hardest to exactly
    the dates that are no use to anyone.

    The strike is not colour-substitution: `statusText` still carries "Taken"
    into each cell's screen-reader label, so the state survives with no colour
    and no strike at all.
  */
  if (closed || booked) {
    return (
      <span className={`${shared} text-muted line-through decoration-1`} aria-disabled="true">
        {content}
      </span>
    );
  }

  if (!selectable) {
    return (
      <span className={shared} aria-disabled="true">
        {content}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={isEdge}
      className={`${shared} cursor-pointer hover:bg-highlight`}
    >
      {content}
    </button>
  );
}
