import { keepTogether } from "@/lib/typography";

export default function GoodToKnow({
  copy,
}: {
  copy: {
    title: string;
    /*
      `question` is not rendered here — the visible list uses the short term
      ("The keys"). It is read by the FAQPage markup on the homepage, which
      needs the same fact phrased the way a guest would type it.
    */
    rows: { term: string; question: string; body: string }[];
    payment: { term: string; question: string; body: string };
  };
}) {
  // The payment row appears only while its body is written; blank renders nothing.
  const rows = copy.payment.body.trim() ? [...copy.rows, copy.payment] : copy.rows;

  return (
    <section id="good-to-know" className="bg-oat px-5 py-24 md:px-11 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] lg:gap-20">
        <span className="rise">
          <h2 className="t-headline text-ink">{keepTogether(copy.title)}</h2>
        </span>

        <dl>
          {rows.map((row, index) => (
            <div
              key={row.term}
              className="relative grid gap-3 py-8 sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] sm:gap-10"
            >
              <span
                aria-hidden
                className="rule-stitch absolute inset-x-0 top-0 h-px text-keyline"
              />
              {index === rows.length - 1 && (
                <span
                  aria-hidden
                  className="rule-stitch absolute inset-x-0 bottom-0 h-px text-keyline"
                />
              )}
              <dt className="t-display text-title leading-[1.1] text-ink">
                {keepTogether(row.term)}
              </dt>
              <dd className="max-w-[58ch] text-body-lg leading-[1.65] text-ink-soft">{row.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
