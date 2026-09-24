import Image from "next/image";

import { apartmentPhoto } from "@/content/photos";
import { keepTogether } from "@/lib/typography";
import { ArrowIcon, StitchCross } from "@/components/icons";
import Seam from "@/components/Seam";

export default function Apartment({
  copy,
}: {
  copy: {
    title: string;
    tags: string[];
    imageAlt: string;
    seePhotos: string;
  };
}) {
  return (
    /*
      Pulled up 72px over the hero, exactly as the rounded sheet it replaces
      was, so nothing in the hero's own composition moves: the headline and
      the scroll cue still clear this edge by the same margins. What rises over
      the photograph now is the hem — the first woven band — rather than a
      card with an upward shadow. The band rides a few stitches above this
      section's edge, so the photograph shows between its teeth.
    */
    <section id="apartment" className="relative z-[2] -mt-[72px] bg-oat">
      <Seam from="photo" to="oat" motif="lozenge" />

      <div className="px-5 pb-24 pt-16 md:px-11 md:pb-32 md:pt-24">
        {/*
          Side by side from 1024px. At tablet width the text column was too
          narrow for the plate, and "2 sofa beds" broke across two lines.
        */}
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20 xl:gap-24">
          <div>
            <span className="rise mb-10 md:mb-12">
              <h2 className="t-headline max-w-[22ch] text-ink">{keepTogether(copy.title)}</h2>
            </span>

            {/* The four facts as a ruled plate, two by two, each led by a madder cross. */}
            <ul className="ruled max-w-[640px] grid-cols-2">
              {copy.tags.map((tag) => (
                <li
                  key={tag}
                  className="label flex items-center gap-2.5 px-4 py-4 text-body-lg text-ink sm:gap-3 sm:px-5 sm:text-body-xl lg:py-5 xl:gap-4 xl:px-6 xl:text-subtitle"
                >
                  <StitchCross className="h-2.5 w-2.5 shrink-0 text-madder xl:h-[15px] xl:w-[15px]" />
                  {keepTogether(tag)}
                </li>
              ))}
            </ul>
          </div>

          {/*
            The photograph is also the way into the gallery below it. The whole
            picture is the link; the label says where it goes, and on a screen
            with a pointer it only appears on hover or focus.
          */}
          <figure className="apartment-photo mount">
            <div className="relative aspect-[4/3] overflow-hidden bg-flax lg:aspect-auto lg:h-[520px]">
              <Image
                src={apartmentPhoto}
                alt={copy.imageAlt}
                placeholder="blur"
                sizes="(max-width: 1023px) 92vw, 52vw"
                className="apartment-photo-image h-full w-full object-cover object-[center_60%]"
              />
              <a href="#gallery" className="apartment-photo-link absolute inset-0">
                {/* Two spans: `.btn-linen` sets its own position, which would
                    beat the utility placing the label on the photograph. */}
                <span className="apartment-photo-cue absolute bottom-5 left-5 md:bottom-7 md:left-7">
                  <span className="btn-linen inline-flex items-center gap-2.5 px-5 py-3 text-control">
                    {copy.seePhotos}
                    <span className="nudge nudge--right">
                      <ArrowIcon direction="right" size={16} />
                    </span>
                  </span>
                </span>
              </a>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
