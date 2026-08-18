import Image from "next/image";

import { closingPhoto } from "@/content/photos";
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
      // MobileCta queries this: the sticky WhatsApp bar hides once this
      // section is on screen, so the page never shows the same call to action
      // twice at once.
      data-final-cta=""
      className="relative overflow-hidden bg-deep"
    >
      {/* Closes on a photo the visitor has not already seen full-bleed. The
          hero at 50% opacity made the last impression a faded copy of the
          first, which is the weakest possible use of the peak-end moment. */}
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

      <div
        data-reveal="fade"
        className="relative mx-auto max-w-[1400px] px-5 py-24 text-center text-white md:px-10 md:pb-[110px] md:pt-[130px]"
      >
        {/* Measure on the heading, not the mask — see GettingHere. */}
        <span data-reveal="mask" className="mb-7 block">
          {/*
            The documented display step, not the inline clamp that used to be
            here — that was a fourth display size, 38-80px, sitting between
            headline and display and written into a style attribute where no
            audit could see it.
          */}
          <h2 className="t-display mx-auto max-w-[15ch] text-display leading-[1.04]">
            {copy.title}
          </h2>
        </span>

        <p className="mx-auto mb-10 max-w-[48ch] text-body-lg leading-[1.6] text-white/85 md:mb-11 md:text-body-xl">
          {copy.body}
        </p>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener"
          className="btn-light inline-flex items-center justify-center gap-3 rounded-full bg-white px-9 py-4 text-body-md tracking-[0.01em] text-deep md:px-11 md:py-[19px] md:text-body-lg"
        >
          <WhatsAppIcon size={19} />
          {copy.cta}
        </a>
      </div>

      <SiteFooter footer={footer} />
    </section>
  );
}
