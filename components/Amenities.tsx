import { amenityIcons, type AmenityKey } from "@/components/icons";

type Item = { title: string; note: string };

export default function Amenities({
  copy,
}: {
  // Keyed by the icon map's own union: an amenity in the copy with no icon,
  // or an icon with no copy, is now a build error rather than a blank cell.
  copy: { title: string; items: Record<AmenityKey, Item> };
}) {
  const entries = Object.entries(copy.items) as [AmenityKey, Item][];

  return (
    // The bottom meets #host, which is the same bg-mist, so the two paddings
    // stacked into one 222px band of empty colour with no edge to justify it.
    // Trimmed here and again on the host side of the join.
    <section id="amenities" className="bg-mist px-5 pb-16 pt-20 md:px-11 md:pb-20 md:pt-28">
      <div className="mx-auto max-w-[1100px]">
        <div
          data-reveal="fade"
          className="mb-12 flex flex-wrap items-baseline justify-between gap-4 md:mb-16"
        >
          <h2 className="t-h3 text-ink">{copy.title}</h2>
        </div>

        {/*
          A hairline list, not six cards.

          Six same-size boxes of icon + heading + text is the category default,
          and it made every amenity look like a separate product. Rules group
          them into one readable set, match the hairlines already used in
          "Good to know" and "Getting here", and let the two columns breathe
          instead of each item carrying its own container.
        */}
        <dl
          data-reveal="fade"
          style={{ ["--stagger-i" as string]: 1 }}
          className="grid gap-x-16 sm:grid-cols-2"
        >
          {entries.map(([key, item], index) => {
            const Icon = amenityIcons[key];
            return (
              <div
                key={key}
                className={[
                  "flex items-start gap-5 border-t border-ink/10 py-6",
                  // The last row of each column closes the set.
                  index >= entries.length - 2 ? "sm:border-b" : "",
                  index === entries.length - 1 ? "border-b sm:border-b" : "",
                ].join(" ")}
              >
                <span aria-hidden className="mt-0.5 shrink-0 text-accent">
                  {Icon && <Icon />}
                </span>
                <div>
                  <dt className="text-body-xl text-ink">{item.title}</dt>
                  <dd className="mt-1 text-note leading-[1.55] text-body-soft">{item.note}</dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
