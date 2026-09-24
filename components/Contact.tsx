import Image from "next/image";

import { closingPhoto } from "@/content/photos";
import { keepTogether } from "@/lib/typography";
import { WhatsAppIcon } from "@/components/icons";
import SiteFooter from "@/components/SiteFooter";

export default function Contact({
  copy,
  footer,
  whatsappHref,
  imageAlt,
}: {
  copy: { title: string; body: string; cta: string };
  footer: { location: string; tagline: string };
  whatsappHref: string;
  imageAlt: string;
}) {
  return (
    <section
      id="contact"
      data-on-dark=""
      // MobileCta queries this: the sticky WhatsApp bar stands down once this
      // section is on screen, so the page never shows the same action twice.
      data-final-cta=""
      className="relative overflow-hidden bg-deep"
    >
      {/* Closes on a photograph the visitor has not already seen full-bleed:
          the last impression should be a new one, not a faded hero. */}
      <Image
        src={closingPhoto}
        alt={imageAlt}
        placeholder="blur"
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-[center_40%] opacity-50"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg,rgba(10,24,32,0.55),rgba(10,24,32,0.85))",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-5 py-28 text-center text-white md:px-10 md:pb-[120px] md:pt-[150px]">
        {/*
          The serif at display size belongs to the two photographs — the hero
          and this close — so the page opens and ends in the same voice.
        */}
        <span className="rise mb-7">
          <h2 className="t-display mx-auto max-w-[15ch] text-display leading-[1.04]">
            {keepTogether(copy.title)}
          </h2>
        </span>

        <p className="mx-auto mb-11 max-w-[48ch] text-body-lg leading-[1.6] text-white/85 md:text-body-xl">
          {copy.body}
        </p>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener"
          className="btn-linen inline-flex items-center justify-center gap-3 px-9 py-4 text-body-md md:px-11 md:py-5 md:text-body-lg"
        >
          <span className="text-madder">
            <WhatsAppIcon size={19} />
          </span>
          {copy.cta}
        </a>
      </div>

      <SiteFooter footer={footer} />
    </section>
  );
}
