import Image from "next/image";

import { closingPhoto } from "@/content/photos";
import { WhatsAppIcon } from "@/components/icons";

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
    <section id="contact" data-on-dark="" className="relative overflow-hidden bg-deep">
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
          background:
            "linear-gradient(180deg,rgba(10,24,32,0.55),rgba(10,24,32,0.85))",
        }}
      />

      <div
        data-reveal="fade"
        className="relative mx-auto max-w-[1400px] px-5 py-24 text-center text-white md:px-10 md:pb-[110px] md:pt-[130px]"
      >
        {/* Measure on the heading, not the mask — see GettingHere. */}
        <span data-reveal="mask" className="mb-7 block">
          <h2
            className="t-display mx-auto max-w-[15ch]"
            style={{ fontSize: "clamp(2.375rem,5vw,5rem)", lineHeight: 1.04 }}
          >
            {copy.title}
          </h2>
        </span>

        <p className="mx-auto mb-10 max-w-[48ch] text-[17px] leading-[1.6] text-white/85 md:mb-11 md:text-[18px]">
          {copy.body}
        </p>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener"
          className="btn-light inline-flex items-center justify-center gap-3 rounded-full bg-white px-9 py-4 text-[16px] tracking-[0.01em] text-deep md:px-11 md:py-[19px] md:text-[17px]"
        >
          <WhatsAppIcon size={19} />
          {copy.cta}
        </a>
      </div>

      {/* A real <footer>, so screen readers get the contentinfo landmark. It
          was a plain div, which meant no "jump to footer". */}
      <footer className="relative flex flex-col justify-between gap-2 border-t border-white/[0.18] px-5 py-6 text-[13px] text-white/65 sm:flex-row sm:gap-5 md:px-10">
        <span>{footer.location}</span>
        <span>{footer.tagline}</span>
      </footer>
    </section>
  );
}
