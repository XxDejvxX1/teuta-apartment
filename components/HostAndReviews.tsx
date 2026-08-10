import Image from "next/image";

import { host, hasHost } from "@/content/host";
import { reviews } from "@/content/reviews";
import ReviewsDeck from "@/components/ReviewsDeck";

/**
 * The trust moment. A visitor about to message a stranger abroad about money
 * and travel dates gets a name, a face, and other people's words.
 *
 * Each half renders only when there is something real to show: no host name,
 * no host block; no reviews pasted in, no reviews block. The section disappears
 * entirely when both are empty, so nothing invented ever ships.
 */
export default function HostAndReviews({
  copy,
  localeTag,
}: {
  localeTag: string;
  copy: {
    title: string;
    reviewsTitle: string;
    stayed: string;
    scoreLabel: string;
    previous: string;
    next: string;
    region: string;
  };
}) {
  const showHost = hasHost();
  const showReviews = reviews.length > 0;
  if (!showHost && !showReviews) return null;

  const names = host.names.filter((name) => name.trim().length > 0);
  // "Rudi and Dejv" / "Rudi dhe Dejv" / "Rudi e Dejv" — the conjunction is not
  // the same word in all three languages, so let Intl join them.
  const nameList = new Intl.ListFormat(localeTag, {
    style: "long",
    type: "conjunction",
  }).format(names);

  return (
    // `overflow-hidden` for the same reason #gallery carries it: above 768px the
    // deck turns into a coverflow whose side cards are absolutely positioned and
    // translated outward, deliberately past their 900px column. Without a clip
    // they run past the viewport too and the whole page scrolls sideways — 173px
    // of it at a 945px window. The gallery was already contained; this one was
    // not, which is why the symptom only showed on desktop.
    <section
      id="host"
      className="overflow-hidden bg-mist px-5 py-20 md:px-11 md:py-[110px]"
    >
      <div className="mx-auto max-w-[900px]">
        {showHost && (
          <div data-reveal="fade" className="flex flex-col items-center gap-7 text-center">
            {/*
              One frame, both hosts — a single photograph of the two of them,
              not an avatar each. Two stacked initial discs read as two separate
              accounts on a platform, which is the opposite of what this section
              is for. Larger than the old 112px too: with the intro paragraph
              gone this picture carries the block on its own, and two faces need
              the room.
            */}
            {host.photoSrc ? (
              <Image
                src={host.photoSrc}
                alt={nameList}
                width={144}
                height={144}
                className="h-36 w-36 rounded-full object-cover"
              />
            ) : (
              // Initials of everyone in `names`, in one disc. 30px is the
              // documented Title-lg step; this used to sit at an unsanctioned
              // 32px.
              <span
                aria-hidden
                className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-[30px] tracking-[0.02em] text-white"
              >
                {names.map((name) => name.trim().charAt(0).toUpperCase()).join("")}
              </span>
            )}

            <div>
              <span data-reveal="mask" className="mb-4 block">
                <h2 className="t-h3 text-ink">{copy.title}</h2>
              </span>
              <p className="text-[17px] text-ink">{nameList}</p>
            </div>
          </div>
        )}

        {showReviews && (
          <div
            data-reveal="fade"
            style={{ ["--stagger-i" as string]: 1 }}
            className={showHost ? "mt-16 border-t border-line pt-16" : ""}
          >
            <ReviewsDeck copy={copy} />
          </div>
        )}
      </div>
    </section>
  );
}
