import MapEmbed from "@/components/MapEmbed";
import { keepTogether } from "@/lib/typography";

export default function GettingHere({
  copy,
}: {
  copy: {
    title: string;
    steps: { title: string; body: string }[];
    mapCaption: string;
    mapOpen: string;
    mapLoad: string;
    mapNote: string;
    mapAlt: string;
    mapBlocked: string;
    mapRetry: string;
  };
}) {
  return (
    <section
      id="getting-here"
      data-on-dark=""
      className="bg-night px-5 py-24 text-on-night md:px-11 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <span className="rise mb-12 md:mb-16">
          <h2 className="t-headline max-w-[19ch] text-on-night">{keepTogether(copy.title)}</h2>
        </span>

        {/*
          The map beside the arrivals, not under them: stacked, this was the
          tallest section on the page for what is reference information. Even
          columns until `lg`, so the prose never gets the narrow one.

          Three alternatives — fly, be collected, drive — so no numbers: a
          numbered list would imply an order that does not exist.
        */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <ul>
            {copy.steps.map((step, index) => (
              <li key={step.title} className="relative py-7">
                <span
                  aria-hidden
                  className="rule-stitch absolute inset-x-0 top-0 h-px text-night-line"
                />
                {index === copy.steps.length - 1 && (
                  <span
                    aria-hidden
                    className="rule-stitch absolute inset-x-0 bottom-0 h-px text-night-line"
                  />
                )}
                <p className="mb-2 text-subtitle font-medium text-on-night">
                  {keepTogether(step.title)}
                </p>
                <p className="max-w-[46ch] text-body-md leading-[1.65] text-on-night-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ul>

          <MapEmbed copy={copy} />
        </div>
      </div>
    </section>
  );
}
