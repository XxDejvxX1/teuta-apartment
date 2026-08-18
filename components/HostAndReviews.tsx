import Image from "next/image";

import { host, hasHost } from "@/content/host";
import { site } from "@/content/site";
import { reviews } from "@/content/reviews";
import ReviewsDeck from "@/components/ReviewsDeck";

/**
 * The trust moment. A visitor about to message a stranger abroad about money
 * and travel dates gets a name, a face, and other people's words.
 *
 * Each half renders only when there is something real to show: no host name,
 * no host block; no reviews pasted in, no reviews block. The section disappears
 * entirely when both are empty, so nothing invented ever ships.
 *
 * The composition is asymmetric — heading, then a portrait column beside the
 * paragraph — and that is the point. It was a centred stack: a 144px avatar
 * disc, a heading, a name and four centred lines of prose, every one of them at
 * roughly the same visual weight. Squinted at, nothing led, and the section that
 * carries the single most persuasive asset on a direct-booking page read like a
 * profile card on a platform. Left-aligning it also rhymes with The apartment,
 * which is the other section built as copy beside a photograph.
 */
export default function HostAndReviews({
  copy,
}: {
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
  // Intl rather than join(", ") so a second host would read "Rudi and Dejv"
  // rather than "Rudi, Dejv". One name formats to itself.
  const nameList = new Intl.ListFormat(site.localeTag, {
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
      className="overflow-hidden bg-mist px-5 pb-20 pt-8 md:px-11 md:pb-[110px] md:pt-12"
    >
      <div className="mx-auto max-w-[900px]">
        {showHost && (
          <div>
            <span data-reveal="mask" className="mb-9 block md:mb-12">
              <h2 className="t-h3 text-ink">{copy.title}</h2>
            </span>

            {/*
              208px, not larger. The source photograph is 400x400, so a frame
              much wider than this is being upscaled on any modern screen —
              208px is still a shade under 2x. A bigger file is the only thing
              that buys a bigger portrait; see README.
            */}
            <div className="grid gap-10 md:grid-cols-[208px_1fr] md:items-start md:gap-[68px]">
              {/* Centred on a phone, where the portrait and the name read as one
                  stacked unit; flush left beside the copy from 768px up. */}
              <div data-reveal="fade" className="flex justify-center md:block">
                <div className="host-portrait">
                  {host.photoSrc ? (
                    <Image
                      src={host.photoSrc}
                      alt={nameList}
                      width={208}
                      height={208}
                      sizes="(max-width: 768px) 168px, 208px"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    // Initials of everyone in `names`, filling the same frame,
                    // so the composition does not change shape when the
                    // photograph is missing.
                    <span
                      aria-hidden
                      className="flex h-full w-full items-center justify-center bg-accent text-[44px] tracking-[0.02em] text-white"
                    >
                      {names.map((name) => name.trim().charAt(0).toUpperCase()).join("")}
                    </span>
                  )}
                </div>
              </div>

              <div data-reveal="fade" style={{ ["--stagger-i" as string]: 1 }}>
                {/*
                  The name opens the text column rather than captioning the
                  picture. Under the photograph it read as a label on an image;
                  at the head of the paragraph it reads as the person saying it,
                  which is what the section is for. On a phone the column
                  collapses under the portrait, so it lands centred beneath the
                  face and the two still read as one unit.
                */}
                <p className="host-name">{nameList}</p>

                <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.7] text-body-soft md:text-[18px]">
                  {copy.intro}
                </p>
              </div>
            </div>
          </div>
        )}

        {showReviews && (
          <div
            data-reveal="fade"
            style={{ ["--stagger-i" as string]: 1 }}
            className={showHost ? "mt-16 border-t border-line pt-16 md:mt-20 md:pt-20" : ""}
          >
            <ReviewsDeck copy={copy} />
          </div>
        )}
      </div>
    </section>
  );
}
