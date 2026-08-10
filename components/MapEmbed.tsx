"use client";

import { useEffect, useRef, useState } from "react";

import { site } from "@/content/site";

/** Exact coordinates beat a text search — a name lookup can drift streets away. */
const MAPS_QUERY = `${site.geo.lat},${site.geo.lng}`;

const EXTERNAL_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

/** How long to wait for the iframe before assuming something blocked it. */
const LOAD_TIMEOUT_MS = 6000;

type State = "idle" | "loading" | "ready" | "blocked";

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
    <div className="overflow-hidden rounded-[20px] bg-deep shadow-(--shadow-float)">
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
        <div className="relative flex h-[320px] w-full flex-col items-center justify-center gap-5 px-6 md:h-[420px]">
          {/*
            Suggestion of a map, not a fake one.

            What was here was a 56px square grid under a teal wash fading up
            from the bottom edge. The wash said nothing — a gradient used as
            decoration, which the design system bans outright — and graph paper
            is what every placeholder everywhere looks like.

            This draws the one fact the map exists to prove: the building is on
            the shoreline, not a road back from it. Lines running parallel to
            the coast are the language a sea chart already uses, and the mark
            sits on the shore rather than floating over a grid. Deliberately
            abstract — no real coastline geometry, no place names — so it reads
            as a diagram waiting for a map rather than a counterfeit of one.
          */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
          >
            {[
              { d: "M0 16 C 70 22, 130 20, 200 20 S 330 18, 400 22", o: 0.14 },
              { d: "M0 31 C 70 37, 130 35, 200 35 S 330 33, 400 37", o: 0.17 },
              { d: "M0 46 C 70 52, 130 50, 200 50 S 330 48, 400 52", o: 0.2 },
              { d: "M0 61 C 70 67, 130 65, 200 65 S 330 63, 400 67", o: 0.24 },
            ].map((line) => (
              <path
                key={line.d}
                d={line.d}
                fill="none"
                stroke="var(--color-accent-soft)"
                strokeWidth="1"
                opacity={line.o}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {/* The shoreline. Passes through (200, 78) by construction, which is
                where the marker is pinned. */}
            <path
              d="M0 74 C 70 80, 130 78, 200 78 S 330 76, 400 80"
              fill="none"
              stroke="var(--color-accent-soft)"
              strokeWidth="1"
              opacity="0.55"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <span aria-hidden className="map-mark" />

          {state === "blocked" ? (
            <>
              <p
                role="status"
                className="relative max-w-[38ch] text-center text-[15px] leading-[1.55] text-on-dark-strong"
              >
                {copy.mapBlocked}
              </p>
              <div className="relative flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={load}
                  className="btn-light rounded-full bg-white px-6 py-3 text-[15px] text-deep"
                >
                  {copy.mapRetry}
                </button>
                <a
                  href={EXTERNAL_MAP_URL}
                  target="_blank"
                  rel="noopener"
                  className="link-underline text-[15px] text-white"
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
                className="btn-light relative rounded-full bg-white px-6 py-3 text-[15px] text-deep"
              >
                {copy.mapLoad}
              </button>
              <p className="relative text-center text-[13px] text-on-dark-strong">
                {copy.mapNote}
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 bg-panel px-6 py-5">
        <p className="text-[15px] text-on-dark-strong">{copy.mapCaption}</p>
        <a
          href={EXTERNAL_MAP_URL}
          target="_blank"
          rel="noopener"
          className="link-underline text-[14px] text-white"
        >
          {copy.mapOpen}
        </a>
      </div>
    </div>
  );
}
