import Image from "next/image";

import { heroPhoto } from "@/content/photos";

export default function Hero({
  copy,
  imageAlt,
}: {
  copy: { eyebrow: string; titleLines: string[]; scroll: string };
  imageAlt: string;
}) {
  return (
    <section
      id="hero"
      data-on-dark=""
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-deep"
    >
      {/* The header watches this to decide when to go solid — cheaper and
          steadier than a scroll listener. */}
      <div
        data-scroll-sentinel
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[120px] w-full"
      />

      {/* Oversized so the parallax shift never exposes an edge. */}
      <div className="hero-parallax absolute -top-[12%] left-0 h-[124%] w-full overflow-hidden">
        <Image
          src={heroPhoto}
          alt={imageAlt}
          priority
          fetchPriority="high"
          placeholder="blur"
          sizes="100vw"
          className="hero-img h-full w-full object-cover object-[center_52%]"
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,rgba(12,26,34,0.44) 0%,rgba(12,26,34,0.06) 26%,rgba(12,26,34,0.18) 58%,rgba(12,26,34,0.78) 100%),linear-gradient(100deg,rgba(10,22,30,0.6) 0%,rgba(10,22,30,0.3) 30%,rgba(10,22,30,0.05) 52%,rgba(10,22,30,0) 66%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[190px]"
        style={{
          background:
            "linear-gradient(180deg,rgba(8,20,28,0.62) 0%,rgba(8,20,28,0.34) 45%,rgba(8,20,28,0) 100%)",
        }}
      />

      {/*
        Sits clear of the Apartment section, which pulls itself up over the
        bottom 72px of the hero as a rounded sheet. At the design's 40px offset
        the title's descenders were tucked underneath that edge.
      */}
      <div className="absolute inset-x-5 bottom-[124px] flex flex-wrap items-end justify-between gap-8 text-white md:inset-x-11 md:bottom-[152px] md:gap-14">
        <div>
          <p
            className="eyebrow hero-fade mb-5 text-white/[0.78]"
            style={{ ["--stagger-i" as string]: 0 }}
          >
            {copy.eyebrow}
          </p>

          {/*
            Line breaks are authored in the dictionary rather than left to the
            browser. A phrase this short reads badly when it is allowed to wrap
            wherever the box happens to end, and authored lines also give each
            line its own clip mask to rise out of.
          */}
          <h1 className="t-hero" style={{ textShadow: "0 2px 34px rgba(8,20,28,0.35)" }}>
            {copy.titleLines.map((line, index) => (
              <span
                key={line}
                className="hero-rise"
                style={{ ["--stagger-i" as string]: index + 1 }}
              >
                <span>{line}</span>
              </span>
            ))}
          </h1>
        </div>

        {/* Was 11px at 80% white over a photo — effectively invisible. Full
            white, a size up, and its own shadow so it holds against any crop. */}
        {/*
          The offset lives on this wrapper rather than on the link, because
          `hero-fade` animates the link's own transform and would wipe it. And
          the cue stays a flex item rather than being positioned against the
          section: `justify-between` is what holds it clear of the headline at
          every width, and on a 375px phone an absolutely positioned cue lands
          on the last title line.
        */}
        <div className="translate-y-10 md:translate-y-14">
          {/* Points at the next section, not past it. Linking straight to
              #gallery taught the visitor to skip the section the nav lists first. */}
          <a
            href="#apartment"
            className="hero-cue hero-fade flex flex-col items-center gap-2.5 text-[12px] uppercase tracking-[0.18em] text-white transition-opacity duration-500 hover:opacity-70"
            style={{
              ["--stagger-i" as string]: copy.titleLines.length + 1,
              textShadow: "0 1px 16px rgba(8,20,28,0.7)",
            }}
          >
            <span>{copy.scroll}</span>
            <span aria-hidden className="hero-cue-rail">
              <span className="hero-cue-drop" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
