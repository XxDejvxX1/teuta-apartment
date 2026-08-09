import MapEmbed from "@/components/MapEmbed";

export default function GettingHere({
  copy,
}: {
  copy: {
    eyebrow: string;
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
      className="bg-ink px-5 py-20 text-on-ink md:px-11 md:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal="fade" className="mb-12 md:mb-16">
          <p className="eyebrow mb-4 text-accent-soft">{copy.eyebrow}</p>
          <span data-reveal="mask" className="block">
            <h2 className="t-h3 max-w-[22ch] text-white">{copy.title}</h2>
          </span>
        </div>

        {/*
          Map beside the arrivals, not underneath them.

          Stacked, this was the tallest section on the page — taller than the
          hero — for what is ultimately reference information. Side by side it
          costs roughly half the height and puts the map next to the words that
          describe it.

          The 01/02/03 numbering is gone: these are three alternatives — fly,
          be collected, or drive — and numbering them implied an order that does
          not exist.
        */}
        <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start md:gap-16">
          <ul data-reveal="fade" style={{ ["--stagger-i" as string]: 1 }}>
            {copy.steps.map((step, index) => (
              <li
                key={step.title}
                className={[
                  "border-t border-white/20 py-6",
                  index === copy.steps.length - 1 ? "border-b" : "",
                ].join(" ")}
              >
                <p className="mb-2 text-[20px] text-white">{step.title}</p>
                <p className="text-[16px] leading-[1.65] text-on-dark">{step.body}</p>
              </li>
            ))}
          </ul>

          <div data-reveal="fade" style={{ ["--stagger-i" as string]: 2 }}>
            <MapEmbed copy={copy} />
          </div>
        </div>
      </div>
    </section>
  );
}
