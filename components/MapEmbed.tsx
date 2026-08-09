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
          {/* Suggestion of a map, not a fake one. */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-accent-soft) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent-soft) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background:
                "linear-gradient(180deg, rgba(31,111,106,0) 0%, rgba(31,111,106,0.35) 100%)",
            }}
          />

          <svg
            viewBox="0 0 24 24"
            width="30"
            height="30"
            fill="none"
            stroke="var(--color-highlight)"
            strokeWidth="1.3"
            aria-hidden
            className="relative"
          >
            <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.4" />
          </svg>

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
