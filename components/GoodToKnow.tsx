export default function GoodToKnow({
  copy,
}: {
  copy: {
    title: string;
    /*
      `question` is not rendered here — the visible list uses the short term
      ("The keys"). It is read by the FAQPage markup on the homepage, which
      needs the same fact phrased the way a guest would type it. Typing it away
      meant the page that does use it had no guarantee it was there.
    */
    rows: { term: string; question: string; body: string }[];
    payment: { term: string; question: string; body: string };
  };
}) {
  // "How do I pay?" is a top pre-booking question with no answer on the page.
  // The row appears once you write one in the dictionaries — left blank rather
  // than filled with terms I'd be inventing on your behalf.
  const rows = copy.payment.body.trim() ? [...copy.rows, copy.payment] : copy.rows;
  return (
    <section id="good-to-know" className="mx-auto max-w-[780px] px-5 py-24 md:px-11 md:py-[130px]">
      <span data-reveal="mask" className="mb-12 block md:mb-[54px]">
        <h2 className="t-h3 text-center text-ink">{copy.title}</h2>
      </span>

      <dl>
        {rows.map((row, index) => (
          <div
            key={row.term}
            data-reveal="fade"
            style={{ ["--stagger-i" as string]: index }}
            className={[
              "flex flex-col gap-3 border-t border-line py-7 sm:flex-row sm:gap-[34px]",
              index === rows.length - 1 ? "border-b" : "",
            ].join(" ")}
          >
            <dt className="text-body-lg text-ink sm:flex-[0_0_190px]">{row.term}</dt>
            <dd className="text-body-md leading-[1.65] text-body-mute">{row.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
