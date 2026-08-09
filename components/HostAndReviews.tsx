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
    intro: string;
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
    <section id="host" className="bg-mist px-5 py-20 md:px-11 md:py-[110px]">
      <div className="mx-auto max-w-[900px]">
        {showHost && (
          <div data-reveal="fade" className="flex flex-col items-center gap-7 text-center">
            {host.photoSrc ? (
              <Image
                src={host.photoSrc}
                alt={nameList}
                width={112}
                height={112}
                className="h-28 w-28 rounded-full object-cover"
              />
            ) : (
              <span aria-hidden className="flex -space-x-4">
                {names.map((name) => (
                  <span
                    key={name}
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-[32px] text-white ring-4 ring-mist"
                  >
                    {name.trim().charAt(0).toUpperCase()}
                  </span>
                ))}
              </span>
            )}

            <div>
              <span data-reveal="mask" className="mb-4 block">
                <h2 className="t-h3 text-ink">{copy.title}</h2>
              </span>
              <p className="mx-auto max-w-[46ch] text-[17px] leading-[1.65] text-body-soft">
                {copy.intro}
              </p>
              <p className="mt-5 text-[17px] text-ink">{nameList}</p>
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
