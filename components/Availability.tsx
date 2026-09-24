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
} from "@/lib/availability";
import { site, whatsappLink } from "@/content/site";
import { rates, stayCost } from "@/content/rates";
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
  /*
    The two states of the empty summary. This box used to reserve 24px of blank
    height so the WhatsApp button would not jump when a date was clicked; the
    reservation is gone because there is now always a line of text in it, and a
    line that tells the guest what to do next is worth more than the same
    height left empty.
  */
  hintArrival: string;
  hintDeparture: string;
  nightsOne: string;
  nightsOther: string;
  guestsOne: string;
  guestsOther: string;
  tooShort: string;
  rangeTaken: string;
  totalLabel: string;
  totalNote: string;
  prefillDates: string;
  closedSeason: string;
};

/** The apartment is only open April–October; see site.season.openMonths. */
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
    // Correcting a prerendered value on mount is the one case this rule cannot
    // see: rendering the real date instead would break hydration. Runs once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  /*
    What the stay costs, once both ends are chosen.

    null means at least one night has no published price, and then nothing is
    shown — a guest is never given a number the rate card cannot account for.
  */
  const total = selected
    ? stayCost(parseDayKey(selected.arrival)!, parseDayKey(selected.departure)!)
    : null;

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
    <section id="availability" className="bg-oat px-5 pb-24 pt-20 md:px-11 md:pb-32 md:pt-28">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-12 md:mb-16">
          <span className="rise mb-5">
            <h2 className="t-headline text-ink">{copy.title}</h2>
          </span>
          {/* The minimum-stay rule used to live ~1,900px further down the page,
              so people planned stays that would be refused. */}
          <p className="max-w-[52ch] text-body-md leading-[1.6] text-ink-soft">{copy.minStay}</p>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setOffset((v) => Math.max(0, v - 1))}
            disabled={offset === 0}
            aria-label={copy.previousMonth}
            className="btn-keyline flex h-11 w-11 shrink-0 items-center justify-center text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowIcon direction="left" />
          </button>

          <div className="flex flex-1 justify-around gap-4">
            {[0, 1].map((slot) => (
              <p
                key={slot}
                className={[
                  "t-display text-center text-title text-ink md:text-title-lg",
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
            className="btn-keyline flex h-11 w-11 shrink-0 items-center justify-center text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>

        {/*
          Two months side by side from 768px, one on a phone. Each is a real
          <table> with a caption, so a screen reader can move by week and day.
        */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          {[0, 1].map((slot) => {
            const monthStart = monthStartFor(slot);
            const cells = monthCells(monthStart.getUTCFullYear(), monthStart.getUTCMonth());

            return (
              <table
                key={slot}
                className={["w-full border-collapse", slot === 1 ? "hidden md:table" : ""].join(
                  " ",
                )}
              >
                <caption className="sr-only">{monthFormatter.format(monthStart)}</caption>
                <thead>
                  <tr>
                    {weekdayNames.map((name) => (
                      <th
                        key={name}
                        scope="col"
                        className="label pb-3 text-caption font-normal text-ink-mute"
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
                        if (!date) return <td key={index} className="py-0.5" />;

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
                          <td key={index} className="py-0.5 text-center">
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

        {/* The selection, the price, and the handoff to WhatsApp. */}
        <div className="plate corners mx-auto mt-12 max-w-[680px] px-6 py-8 text-center md:mt-14 md:px-10 md:py-10">
          <div aria-live="polite">
            {problem ? (
              <p className="text-control leading-[1.55] text-madder">{problem}</p>
            ) : selected ? (
              // Each label keeps its date on the same line; a phone wraps
              // between the pairs, never inside one.
              <p className="text-body-md leading-[1.7] text-ink">
                <span className="whitespace-nowrap">
                  <span className="label text-caption text-ink-mute">{copy.arrival}</span>{" "}
                  {dateFormatter.format(parseDayKey(selected.arrival)!)}
                </span>
                <span aria-hidden className="mx-3 text-madder">
                  ·
                </span>
                <span className="whitespace-nowrap">
                  <span className="label text-caption text-ink-mute">{copy.departure}</span>{" "}
                  {dateFormatter.format(parseDayKey(selected.departure)!)}
                </span>
                <span aria-hidden className="mx-3 text-madder">
                  ·
                </span>
                <span className="whitespace-nowrap">
                  {plural(copy.nightsOne, copy.nightsOther, nightCount)}
                </span>
              </p>
            ) : arrival ? (
              <>
                <p className="text-body-md text-ink">
                  <span className="label text-caption text-ink-mute">{copy.arrival}</span>{" "}
                  {dateFormatter.format(parseDayKey(arrival)!)}
                </p>
                <p className="mt-1 text-note text-ink-soft">{copy.hintDeparture}</p>
              </>
            ) : (
              <p className="text-body-md text-ink-soft">{copy.hintArrival}</p>
            )}
            {/*
              Inside the live region on purpose: the price is part of what just
              changed, and a screen-reader user choosing a departure should hear
              the total in the same announcement as the nights.
            */}
            {selected && total !== null && (
              <p className="mt-7">
                <span className="label block text-caption text-ink-mute">{copy.totalLabel}</span>
                {/*
                  Keyed on the range so a new choice remounts the frame and it
                  is sewn on again — the stitching is what says "this is the
                  answer to what you just picked".
                */}
                <span key={`${selected.arrival}/${selected.departure}`} className="sewn mt-3">
                  <span className="stitch-x block text-stitch-lg text-madder">
                    {rates.currencySymbol}
                    {total}
                  </span>
                </span>
                <span className="mt-3 block text-note leading-[1.5] text-ink-soft">
                  {copy.totalNote}
                </span>
              </p>
            )}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <label className="flex items-center gap-3 text-control text-ink-soft">
              {copy.guests}
              <select
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
                className="rounded-[3px] border border-ink-mute bg-linen px-4 py-2 text-control text-ink"
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
                className="link-stitch px-1 py-2 text-note text-ink-soft"
              >
                {copy.clear}
              </button>
            )}
          </div>

          <div className="mt-7">
            <a
              href={href}
              target="_blank"
              rel="noopener"
              className="btn-thread inline-flex items-center justify-center gap-2.5 px-7 py-4 text-body-md"
            >
              <WhatsAppIcon size={18} />
              {selected ? copy.ctaWithDates : copy.cta}
            </a>
          </div>
        </div>

        {children}
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

  const shared = [
    "day",
    isEdge ? "day--edge" : inRange ? "day--range" : "",
    isToday ? "day--today" : "",
  ].join(" ");

  const content = (
    <>
      {date.getUTCDate()}
      <span className="sr-only">
        {` — ${label}${isToday ? `, ${todayLabel}` : ""}, ${statusText}`}
      </span>
    </>
  );

  if (isPast) {
    // Readable (4.6:1) but crossed through, so "past" needs no legend entry.
    // Hidden from assistive tech: a date already gone carries no information.
    return (
      <span className={`${shared} day--off`} aria-hidden>
        {date.getUTCDate()}
      </span>
    );
  }

  /*
    A night you cannot have looks the same however it came to be unavailable —
    quiet, crossed through with one diagonal thread, and not a button. Closed
    for the season and already booked share this; a past date differs only in
    being hidden from assistive tech.

    The thread is not the only signal: `statusText` still carries "Taken" into
    each cell's screen-reader label, so the state survives with no colour and
    no line at all.
  */
  if (closed || booked) {
    return (
      <span className={`${shared} day--off`} aria-disabled="true">
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
    <button type="button" onClick={onPick} aria-pressed={isEdge} className={shared}>
      {content}
    </button>
  );
}
