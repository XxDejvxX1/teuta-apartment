import { bookingScore, reviews, SCORE_MAX } from "@/content/reviews";
import { interpolate } from "@/lib/dictionary";
import { keepTogether } from "@/lib/typography";

/**
 * What guests have said, headed by the Booking.com score.
 *
 * Renders nothing while content/reviews.ts is empty, so no invented review can
 * ship. The heading carries the score only while one is recorded there, and
 * the score is set in the stitched face inside the serif sentence — the one
 * number in a headline on the page.
 *
 * Laid out as a masonry of plates (CSS columns) rather than a carousel: all
 * five are readable at once, reviews of different lengths pack without gaps,
 * and nothing about it needs a script.
 */
export default function Reviews({
  copy,
}: {
  copy: {
    title: string;
    titleWithScore: string;
    stayed: string;
    scoreLabel: string;
  };
}) {
  if (reviews.length === 0) return null;

  // Split rather than interpolated, so the score can wear its own face.
  const [beforeScore, afterScore] = copy.titleWithScore.split("{score}");

  return (
    <section id="reviews" className="bg-flax px-5 py-24 md:px-11 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <span className="rise mb-12 md:mb-16">
          <h2 className="t-headline text-ink">
            {bookingScore === null ? (
              keepTogether(copy.title)
            ) : (
              <>
                {keepTogether(beforeScore)}
                <span className="stitch-x text-madder">{bookingScore}</span>
                {keepTogether(afterScore)}
              </>
            )}
          </h2>
        </span>

        <div className="reviews">
          {reviews.map((review) => (
            <figure
              key={`${review.name}-${review.text.slice(0, 24)}`}
              className="plate px-6 py-6 md:px-7 md:py-7"
            >
              {(review.title || review.score !== undefined) && (
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  {review.title && (
                    <p className="t-display text-title leading-[1.1] text-ink">
                      {keepTogether(review.title)}
                    </p>
                  )}
                  {/*
                    "10/10" alone is ambiguous read aloud, so the visible figure
                    is hidden and the full sentence sits beside it.
                  */}
                  {review.score !== undefined && (
                    <p className="shrink-0 text-body-md font-medium tabular-nums text-madder">
                      <span aria-hidden>
                        {review.score}/{SCORE_MAX}
                      </span>
                      <span className="sr-only">
                        {interpolate(copy.scoreLabel, { score: review.score, max: SCORE_MAX })}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Verbatim, typos and emoji included — see content/reviews.ts. */}
              <blockquote className="text-body-md leading-[1.65] text-ink-soft">
                {review.text}
              </blockquote>

              <figcaption className="relative mt-6 pt-4">
                <span
                  aria-hidden
                  className="rule-stitch absolute inset-x-0 top-0 h-px text-keyline"
                />
                <span className="label text-caption text-ink-mute">
                  {review.name}
                  {review.from ? `, ${review.from}` : ""}
                  {review.stayed ? ` — ${interpolate(copy.stayed, { when: review.stayed })}` : ""}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
