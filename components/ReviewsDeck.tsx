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
              className="deck-item bg-sand review-card"
              // rotate: 0 and dim: 1 — rotated body text is unreadable, and
              // dimming it to 0.72 would drop this copy under 4.5:1. Depth here
              // comes from scale and shadow instead.
              style={deckItemStyle(g, { rotate: 0, dim: 1 })}
              aria-hidden={g.visible ? undefined : true}
            >
              {(review.title || review.score !== undefined) && (
                <p className="review-head">
                  {review.title && (
                    <span className="t-display review-title">{review.title}</span>
                  )}
                  {/*
                    "10/10" alone is ambiguous read aloud, so the visible figure
                    is hidden from the accessibility tree and the full sentence
                    sits beside it.
                  */}
                  {review.score !== undefined && (
                    <span className="review-score">
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
                </p>
              )}

              <blockquote className="review-quote">{review.text}</blockquote>

              <figcaption className="review-by">
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
