"use client";

import { reviews, SCORE_MAX } from "@/content/reviews";
import { interpolate } from "@/lib/dictionary";
import { useDeck, deckItemStyle } from "@/components/useDeck";
import DeckControls from "@/components/DeckControls";

export default function ReviewsDeck({
  copy,
}: {
  copy: {
    reviewsTitle: string;
    stayed: string;
    scoreLabel: string;
    previous: string;
    next: string;
    region: string;
  };
}) {
  const count = reviews.length;
  const { active, trackRef, show, onKeyDown, geometry } = useDeck(count);

  return (
    <>
      <h3 className="t-display mb-8 text-center text-[26px] text-ink md:mb-12 md:text-[30px]">
        {copy.reviewsTitle}
      </h3>

      <div
        ref={trackRef}
        className="deck deck--reviews"
        role="group"
        aria-roledescription="carousel"
        aria-label={copy.region}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {reviews.map((review, index) => {
          const g = geometry(index);

          return (
            <figure
              key={`${review.name}-${review.text.slice(0, 24)}`}
              data-index={index}
              className="deck-item flex flex-col bg-sand px-7 py-6 md:px-8 md:py-7"
              // rotate: 0 and dim: 1 — rotated body text is unreadable, and
              // dimming it to 0.72 would drop this copy under 4.5:1. Depth here
              // comes from scale and shadow instead.
              style={deckItemStyle(g, { rotate: 0, dim: 1 })}
              aria-hidden={g.visible ? undefined : true}
            >
              {(review.title || review.score !== undefined) && (
                <div className="mb-4 flex items-baseline gap-3">
                  {review.score !== undefined && (
                    <span className="shrink-0 rounded-lg bg-accent px-2.5 py-1 text-[14px] tabular-nums text-white">
                      <span aria-hidden>
                        {review.score}/{SCORE_MAX}
                      </span>
                      <span className="sr-only">
                        {interpolate(copy.scoreLabel, {
                          score: review.score,
                          max: SCORE_MAX,
                        })}
                      </span>
                    </span>
                  )}
                  {review.title && <p className="text-[17px] text-ink">{review.title}</p>}
                </div>
              )}

              <blockquote className="flex-1 overflow-hidden text-[16px] leading-[1.6] text-body-soft">
                {review.text}
              </blockquote>

              <figcaption className="mt-4 text-[14px] text-muted">
                {review.name}
                {review.from ? `, ${review.from}` : ""}
                {review.stayed
                  ? ` — ${interpolate(copy.stayed, { when: review.stayed })}`
                  : ""}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <DeckControls
        count={count}
        active={active}
        onShow={show}
        labels={{ previous: copy.previous, next: copy.next }}
        itemLabel={(index) => reviews[index].title ?? reviews[index].name}
      />
    </>
  );
}
