/**
 * Hand-drawn accents, ported from the Claude Design "Site Accents" sheet.
 *
 * The sheet drew them in ink brown on warm paper, captioned in a handwriting
 * face. None of that came over: DESIGN.md rules out a second accent hue and a
 * third typeface, and scripts/audit/design.mjs fails the build on a hex in
 * components/ or a font size set by hand. (It fails on one written in a comment
 * too — it is a substring test, deliberately, so this sentence is phrased the
 * long way round.) What came over is the *line* — the same paths, drawn on the
 * same way — wearing the site's own palette. Every stroke here is
 * `currentColor` over a token text class, and there is no <text> in this file
 * at all; the circled price wraps the real DOM number instead of redrawing it.
 *
 * The sheet offered eight accents. Four were built and two survived: the swash
 * and the circle. Two gulls crossing a horizon above the gallery and a small
 * sun beside the host heading were cut on sight, and the horizon line the
 * gulls crossed went with them — the gallery is back to the plain `border-t`
 * hairline it had before. Do not re-add the other six without a reason; the
 * count is the constraint.
 *
 * How the drawing-on works, and why it is safe with no JavaScript:
 *
 *   Every accent renders **complete** by default. The `.accent-*` animations in
 *   globals.css only attach under a `[data-shown]` ancestor, and `data-shown` is
 *   set by RevealController at runtime. So a visitor with the bundle blocked
 *   gets finished artwork rather than an invisible one — the same way round as
 *   house rule 4 — and a visitor who asked for reduced motion gets it too, for
 *   free, because RevealController returns before setting `data-shown` at all.
 */

/**
 * The swash under a section heading. One heading only — Availability's.
 *
 * It is an underline, not a row. The caller gives it a `relative inline-block`
 * wrapper that hugs the heading text and this positions itself against that,
 * so it costs no vertical space and stretches to exactly the width of the word
 * above it however long that word is. `preserveAspectRatio="none"` is what buys
 * the stretch, and `vector-effect="non-scaling-stroke"` stops the stretch
 * fattening the line with it — which also means the stroke widths below are
 * screen pixels rather than user units.
 *
 * It must sit *outside* the `data-reveal="mask"` span rather than inside it.
 * That span is `overflow: hidden` in order to clip the heading's rise, and an
 * underline tucked below the baseline is exactly the thing it would clip.
 *
 * Nine of these would be a template rather than a signature, which is why this
 * is called in exactly one place and there is no `variant` prop inviting a
 * second.
 */
export function HeadingSwash() {
  return (
    <svg
      aria-hidden
      viewBox="10 0 240 34"
      preserveAspectRatio="none"
      fill="none"
      className="pointer-events-none absolute inset-x-0 -bottom-1 h-[14px] w-full overflow-visible text-accent-soft"
    >
      <path
        className="accent-ink"
        d="M 10 18 Q 66 4 132 16 Q 196 28 250 10"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* The second, lighter pass a hand makes when it underlines something
          twice. Delayed rather than simultaneous, or the two read as one thick
          stroke with a gap down the middle of it. */}
      <path
        className="accent-ink accent-ink--trail"
        d="M 18 28 Q 96 18 208 26"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.7}
      />
    </svg>
  );
}

/**
 * The scribbled ellipse around the stay total.
 *
 * Wraps its children rather than drawing its own number, so the price stays in
 * the display serif on the twelve-step scale and keeps whatever markup the
 * caller gave it. The ellipse stretches to whatever that number measures —
 * €90 and €1,080 both get a circle that fits — and `non-scaling-stroke` keeps
 * the line the same weight at either width.
 *
 * Give it a `key` derived from the selected range. Re-keying remounts it, which
 * restarts the draw: the circle is the gesture that says *this is the answer to
 * what you just clicked*, and one that sat still while the number under it
 * changed would be worse than no circle at all.
 */
export function CircledPrice({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <svg
        aria-hidden
        viewBox="0 0 220 64"
        preserveAspectRatio="none"
        fill="none"
        /*
          Both dimensions are stated, and both have to be. An <svg> carrying a
          viewBox is a *replaced* element with an intrinsic aspect ratio, and an
          absolutely positioned replaced element resolves an over-constrained
          box by keeping its ratio and dropping an inset — not by stretching
          between them. Insets alone therefore drew the ellipse twice wrong:
          `-inset-y-2` gave a 32px-tall circle over a 30px number that started
          8px high and clipped the bottom off the digits, and fixing the height
          alone then let the ratio drive the width instead, throwing the circle
          76px off to the right. Sizing from the content box is the only form
          that holds: 28px of air each side, 8px above and below.
        */
        className="absolute -top-2 -left-7 h-[calc(100%+1rem)] w-[calc(100%+3.5rem)] overflow-visible text-accent"
      >
        <path
          className="accent-ink"
          d="M 56 6 C 0 8 2 60 108 62 C 212 64 220 10 156 4 C 110 0 66 2 48 16"
          pathLength={1}
          stroke="currentColor"
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {children}
    </span>
  );
}
