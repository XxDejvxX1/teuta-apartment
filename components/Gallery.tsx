"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { galleryPhotos } from "@/content/photos";
import { interpolate } from "@/lib/dictionary";
import { useDeck, deckItemStyle } from "@/components/useDeck";
import DeckControls from "@/components/DeckControls";

const Lightbox = dynamic(() => import("@/components/Lightbox"));

type PhotoCopy = { title: string; alt: string };

type Copy = {
  title: string;
  counter: string;
  previous: string;
  next: string;
  open: string;
  close: string;
  region: string;
  photos: Record<string, PhotoCopy>;
};

/**
 * The photographs, as a deck on the dark field: a coverflow from 768px, where
 * the centre photograph faces the visitor and the rest turn away behind it,
 * and a swipe row on a phone. The layout is CSS (`.deck` in globals.css); the
 * script only tracks which photograph is at the front, and loads the lightbox
 * on first open.
 */
export default function Gallery({ copy }: { copy: Copy }) {
  const [lightboxAt, setLightboxAt] = useState<number | null>(null);

  const slides = useMemo(
    () =>
      galleryPhotos.map((photo) => ({
        image: photo.image,
        ...(copy.photos[photo.key] ?? { title: "", alt: "" }),
      })),
    [copy.photos],
  );

  const count = slides.length;
  const { active, coverflow, trackRef, show, onKeyDown, geometry } = useDeck(count);

  return (
    <section
      id="gallery"
      data-on-dark=""
      className="deck-field bg-night pb-24 pt-20 text-on-night md:pb-32 md:pt-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-11">
        <div className="mb-10 flex items-baseline justify-between gap-6 md:mb-14">
          <span className="rise">
            <h2 className="t-headline text-on-night">{copy.title}</h2>
          </span>
          <p
            className="text-caption tabular-nums tracking-[0.02em] text-on-night-soft"
            aria-live="polite"
          >
            {interpolate(copy.counter, { current: active + 1, total: count })}
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        className="deck"
        role="group"
        aria-roledescription="carousel"
        aria-label={copy.region}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {slides.map((slide, index) => {
          const g = geometry(index);

          // The card opposite the front one sits behind the stack at opacity 0.
          // Skipping its markup saves a photograph nobody can see.
          const worthLoading = !coverflow || g.distance <= 2;

          return (
            <div
              key={slide.image.src}
              data-index={index}
              className="deck-item"
              style={deckItemStyle(g)}
            >
              {worthLoading && (
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  placeholder="blur"
                  sizes="(max-width: 767px) 86vw, 620px"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              {/* The photo's name is the button's accessible name, not a printed
                  caption: a caption states a fact about the room, and each has
                  to be checked against its picture before one is printed. */}
              <button
                type="button"
                onClick={() => (g.isActive ? setLightboxAt(index) : show(index))}
                // Items parked behind the stack were still in the tab order, so
                // keyboard focus landed on something invisible.
                tabIndex={g.visible ? 0 : -1}
                aria-hidden={g.visible ? undefined : true}
                className={[
                  "absolute inset-0",
                  g.isActive ? "cursor-zoom-in" : "cursor-pointer",
                ].join(" ")}
              >
                <span className="sr-only">
                  {g.isActive ? `${copy.open}: ${slide.title}` : slide.title}
                </span>

                {/* The centre card opens the lightbox, a side card advances the
                    stack. Without this mark they look identical. */}
                {g.isActive && (
                  <span
                    aria-hidden
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-deep/45 text-white backdrop-blur-sm"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <DeckControls
        count={count}
        active={active}
        onShow={show}
        labels={{ previous: copy.previous, next: copy.next }}
        itemLabel={(index) => slides[index].title}
      />

      {lightboxAt !== null && (
        <Lightbox
          slides={slides}
          index={lightboxAt}
          labels={{
            close: copy.close,
            previous: copy.previous,
            next: copy.next,
            counter: copy.counter,
          }}
          onClose={() => setLightboxAt(null)}
          onPrev={() => setLightboxAt((at) => (((at! - 1) % count) + count) % count)}
          onNext={() => setLightboxAt((at) => (at! + 1) % count)}
        />
      )}
    </section>
  );
}
