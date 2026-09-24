import { keepTogether } from "@/lib/typography";
import { amenityIcons, type AmenityKey } from "@/components/icons";

type Item = { title: string; note: string };

export default function Amenities({
  copy,
}: {
  // Keyed by the icon map's own union: an amenity in the copy with no icon,
  // or an icon with no copy, is a build error rather than a blank cell.
  copy: { title: string; items: Record<AmenityKey, Item> };
}) {
  const entries = Object.entries(copy.items) as [AmenityKey, Item][];

  return (
    <section id="amenities" className="bg-oat px-5 py-24 md:px-11 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] lg:gap-20">
        <span className="rise">
          <h2 className="t-headline text-ink">{keepTogether(copy.title)}</h2>
        </span>

        {/*
          One ruled list, not six cards: the keyline between the rows is the
          grid's own 1px gap, and each stitched drawing sits beside its words
          rather than above them. Six equal tiles of icon over heading over note
          is the features-grid template, and it made every amenity look like a
          separate product; as an inventory they read as one set.
        */}
        <dl className="ruled sm:grid-cols-2">
          {entries.map(([key, item]) => {
            const Icon = amenityIcons[key];
            return (
              <div key={key} className="flex items-start gap-5 px-5 py-6 md:gap-6 md:px-7 md:py-7">
                <span aria-hidden className="shrink-0 text-madder">
                  {Icon && <Icon />}
                </span>
                <div>
                  <dt className="text-body-lg font-medium text-ink">{item.title}</dt>
                  <dd className="mt-1.5 text-note leading-[1.55] text-ink-soft">{item.note}</dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
