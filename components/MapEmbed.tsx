"use client";

import { useEffect, useRef, useState } from "react";

import { site } from "@/content/site";

/** Exact coordinates beat a text search — a name lookup can drift streets away. */
const MAPS_QUERY = `${site.geo.lat},${site.geo.lng}`;

const EXTERNAL_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

/** How long to wait for the iframe before assuming something blocked it. */
const LOAD_TIMEOUT_MS = 6000;

type State = "idle" | "loading" | "ready" | "blocked";

/*
  The stitched chart that stands in for the map until someone asks for it.

  It draws the one fact the map exists to prove — the building is on the
  shoreline, not a road back from it — as a piece of embroidery: sand in
  scattered knots, water in rows of wave stitches, the shore as a running
  stitch, and the apartment as a single madder cross sewn onto that line.
  Deliberately abstract: no real coastline, no place names, so it reads as a
  chart waiting for a map rather than a counterfeit of one.

  Computed once at module load and identical on every build.
*/
const CELL = 10;
const COLS = 48;
const MARK_COL = 28;

/** The shore's row in each column: a slow swell with a shorter one riding on it. */
const shoreRow = Array.from({ length: COLS + 1 }, (_, col) =>
  Math.round(8 + 1.8 * Math.sin(col / 6.5) + 0.9 * Math.sin(col / 2.7 + 1)),
);

/** The shoreline as stairs: along each column, then down or up to the next. */
const shorePath = shoreRow
  .map((row, col) => {
    const x = col * CELL;
    const y = row * CELL;
    return col === 0 ? `M0 ${y}` : `V${y}H${x}`;
  })
  .join("");

// The middle of that column's run of shore, so the cross sits on the line.
const markX = MARK_COL * CELL - CELL / 2;
const markY = shoreRow[MARK_COL] * CELL;

function StitchedChart() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${COLS * CELL} 220`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="chart-sand" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect x="9" y="9" width="2" height="2" fill="var(--color-on-night-soft)" opacity="0.4" />
        </pattern>
        <pattern id="chart-sea" width="20" height="14" patternUnits="userSpaceOnUse">
          <path
            d="M2 9l4-4 4 4 4-4 4 4"
            fill="none"
            stroke="var(--color-night-line)"
            strokeWidth="1.5"
          />
        </pattern>
      </defs>

      {/* Sand above the shore, water below it. */}
      <path d={`${shorePath}V0H0Z`} fill="url(#chart-sand)" />
      <path d={`${shorePath}V220H0Z`} fill="url(#chart-sea)" />

      <path
        d={shorePath}
        fill="none"
        stroke="var(--color-on-night)"
        strokeWidth="2"
        strokeDasharray="6 4"
        opacity="0.8"
      />

      {/* The apartment: one cross, on the line itself. */}
      <g stroke="var(--color-madder-bright)" strokeWidth="3" strokeLinecap="square">
        <path d={`M${markX - 7} ${markY - 7}l14 14M${markX + 7} ${markY - 7}l-14 14`} />
      </g>
    </svg>
  );
}

/**
 * The design embedded Google Maps directly. That iframe sets cookies the moment
 * the page loads, which needs consent under GDPR and costs roughly half a
 * megabyte before anyone has asked to see a map. Here it loads on click.
 */
export default function MapEmbed({
  copy,
}: {
  copy: {
    mapCaption: string;
    mapOpen: string;
    mapLoad: string;
    mapNote: string;
    mapAlt: string;
    mapBlocked: string;
    mapRetry: string;
  };
}) {
  const [state, setState] = useState<State>("idle");
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const load = () => {
    setState("loading");
    // Content blockers are exactly the audience click-to-load exists for, and a
    // blocked iframe never fires onLoad. Without this the section used to be a
    // permanent 420px void with no way back to the button.
    timeoutRef.current = window.setTimeout(
      () => setState((current) => (current === "loading" ? "blocked" : current)),
      LOAD_TIMEOUT_MS,
    );
  };

  const onFrameLoad = () => {
    window.clearTimeout(timeoutRef.current);
    setState("ready");
  };

  const showFrame = state === "loading" || state === "ready";

  return (
    <div className="mount bg-deep">
      {showFrame ? (
        <iframe
          title={copy.mapAlt}
          src={`https://www.google.com/maps?q=${MAPS_QUERY}&z=16&output=embed`}
          onLoad={onFrameLoad}
          className="block h-[320px] w-full border-0 md:h-[420px]"
          style={{ filter: "grayscale(0.15) contrast(1.02)" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="relative flex h-[320px] w-full flex-col items-center justify-end gap-4 px-6 pb-9 md:h-[420px] md:pb-11">
          <StitchedChart />

          {state === "blocked" ? (
            <>
              <p
                role="status"
                className="relative max-w-[38ch] bg-deep/80 px-3 py-2 text-center text-control leading-[1.55] text-on-night"
              >
                {copy.mapBlocked}
              </p>
              <div className="relative flex flex-wrap items-center justify-center gap-4">
                <button type="button" onClick={load} className="btn-linen px-6 py-3 text-control">
                  {copy.mapRetry}
                </button>
                <a
                  href={EXTERNAL_MAP_URL}
                  target="_blank"
                  rel="noopener"
                  className="link-stitch text-control text-on-night"
                >
                  {copy.mapOpen}
                </a>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={load}
                className="btn-linen relative px-6 py-3 text-control"
              >
                {copy.mapLoad}
              </button>
              <p className="relative text-center text-caption text-on-night-soft">{copy.mapNote}</p>
            </>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-night-line bg-night px-6 py-5">
        <p className="text-control text-on-night-soft">{copy.mapCaption}</p>
        <a
          href={EXTERNAL_MAP_URL}
          target="_blank"
          rel="noopener"
          className="link-stitch text-note text-on-night"
        >
          {copy.mapOpen}
        </a>
      </div>
    </div>
  );
}
