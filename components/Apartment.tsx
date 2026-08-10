import Image from "next/image";

import { apartmentPhoto } from "@/content/photos";

export default function Apartment({
  copy,
}: {
  copy: {
    title: string;
    body: string;
    tags: string[];
    imageAlt: string;
  };
}) {
  return (
    <section
      id="apartment"
      className="relative z-[2] -mt-[72px] rounded-t-[34px] bg-sand px-5 pb-20 pt-14 shadow-(--shadow-sheet) md:px-11 md:pb-24 md:pt-[70px]"
    >
      {/* A bottom-sheet grab handle only means anything on a touch screen —
          on desktop it advertises a drag that does not exist. */}
      <div aria-hidden className="mx-auto mb-12 h-1 w-14 rounded-full bg-line md:hidden" />

      <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-[70px]">
        <div data-reveal="fade">
          <span data-reveal="mask" className="mb-6 block">
            <h2 className="t-h3 max-w-[19ch] text-ink">{copy.title}</h2>
          </span>

          <p className="mb-8 max-w-[44ch] text-[17px] leading-[1.65] text-body-soft md:text-[18px]">
            {copy.body}
          </p>

          <ul className="flex flex-wrap gap-2.5">
            {copy.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line-soft px-[18px] py-2.5 text-[14px] text-body-soft"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Hidden on phones: stacked under the copy it read as a second,
            unrelated hero and pushed the tags off the first screen. The gallery
            directly below already carries the photography on mobile. */}
        <div
          data-reveal="fade"
          style={{ ["--stagger-i" as string]: 1 }}
          className="relative hidden h-[420px] overflow-hidden rounded-[20px] bg-surface-warm shadow-(--shadow-lift) md:block"
        >
          <Image
            src={apartmentPhoto}
            alt={copy.imageAlt}
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, 45vw"
            className="h-full w-full object-cover object-[center_60%]"
          />
        </div>
      </div>
    </section>
  );
}
