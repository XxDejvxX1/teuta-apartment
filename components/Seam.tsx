/**
 * The woven band on the join between two sections.
 *
 * Every section on the page meets the next one here rather than at a straight
 * edge: the upper field bites down into the band as a row of stepped teeth, the
 * lower field bites up, and a row of motifs runs between them. The band is one
 * element drawn in background gradients — see `.seam` in globals.css for why,
 * and for the grids the rows are read from.
 *
 * Decorative, so hidden from assistive technology, and a server component: it
 * stands still and needs no script at all.
 */

/**
 * What a band can join. The fields are `--color-*` tokens. A photograph is its
 * own ground: the band rides over the picture's edge and the picture shows
 * between its teeth. Never name the `deep` under a photograph instead — the
 * teeth would be drawn in near-black against a picture that is not.
 */
export type Ground = "oat" | "linen" | "flax" | "night" | "photo";

type Motif = "lozenge" | "star" | "water" | "running";

const colour = (ground: Ground) => (ground === "photo" ? "transparent" : `var(--color-${ground})`);

export default function Seam({
  from,
  to,
  motif = "lozenge",
  tone = "dark",
}: {
  /** The ground above. */
  from: Ground;
  /** The ground below. */
  to: Ground;
  motif?: Motif;
  /**
    Dark bands (slate ground) mark the big turns — into and out of the dark
    fields and the photographs. Light bands (flax ground) sit between two
    light sections, so a run of them never reads as a row of black stripes.
  */
  tone?: "dark" | "light";
}) {
  return (
    <div
      aria-hidden
      data-motif={motif}
      className={[
        "seam",
        tone === "light" && "seam--light",
        from === "photo" && "seam--from-photo",
        to === "photo" && "seam--to-photo",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        ["--seam-from" as string]: colour(from),
        ["--seam-to" as string]: colour(to),
      }}
    />
  );
}
