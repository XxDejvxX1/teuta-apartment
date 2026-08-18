import Image from "next/image";

/**
 * The picture at the top of a guide card or article.
 *
 * Two states, and the second one is temporary. When frontmatter names a `cover`
 * there is a real photograph in `public/photos/` and it is rendered through the
 * same loader and pre-generated widths as every other image on the site. When it
 * does not, we draw one.
 *
 * The drawn cover is not a grey box with an icon in it. A missing-image
 * placeholder that looks broken makes the whole page look broken, and these
 * pages have to be worth showing to the owners before the photographs exist. So
 * it is a shoreline at dusk: a horizon, a low sun on the water, and contour
 * lines that bulge the way the coast does, drawn from the site's own palette.
 * Deterministic from the slug, so an article keeps the same cover between
 * builds instead of shuffling.
 *
 * Drawn dark rather than in sand, for two reasons. It has to carry white type
 * under the same scrim a photograph would, and a near-white drawing under that
 * scrim just turns grey — it loses the drawing and gains nothing. And it should
 * not be mistaken for a photograph that failed to load; deep water and a drawn
 * sun read as a deliberate stand-in.
 *
 * To replace one: put `amphitheatre.jpg` in `public/photos/`, run
 * `npm run photos`, and add `cover: amphitheatre` to the article's frontmatter.
 * Nothing else changes.
 */

/** FNV-1a, then a small xorshift. Same slug, same drawing, on every machine. */
function seeded(slug: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i += 1) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const next = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h ^= h >>> 13;
    return ((h >>> 0) % 100000) / 100000;
  };

  /*
    Discard the first draw. FNV over a short, structured string leaves nearby
    seeds correlated, and the first output inherits that: "day-trips" and
    "eating-in-durres" put their suns 9px apart, which reads as one repeated
    drawing when the two cards sit side by side. One step of the xorshift
    decorrelates it. This widens the spread, it does not guarantee it — two
    slugs can still land close, and the real fix is a photograph.
  */
  next();
  return next;
}

function DrawnCover({ slug }: { slug: string }) {
  const random = seeded(slug);

  const horizon = 210 + random() * 80; // where the sea starts, 210-290 of 600
  const sunX = 170 + random() * 560;
  const sunR = 30 + random() * 18;
  const sunY = horizon - sunR * 0.85;

  // Contour lines below the horizon. They start tight and open out toward the
  // foreground, which is what gives the flat drawing its depth.
  const lines = Array.from({ length: 16 }, (_, i) => {
    const t = i / 15;
    const y = horizon + 18 + t * t * (600 - horizon - 6);
    const amplitude = 4 + t * 24 * (0.6 + random() * 0.8);
    const phase = random() * 900;
    const d = `M -40 ${y} C ${180 + phase * 0.1} ${y - amplitude}, ${420 + phase * 0.2} ${y + amplitude}, 940 ${y - amplitude * 0.4}`;
    return { d, opacity: 0.62 - t * 0.4, width: 1 + t * 1.5 };
  });

  const id = `cover-${slug}`;

  return (
    <svg
      viewBox="0 0 900 600"
      // Decorative: the article title beside it is the accessible name, so
      // announcing this as an image would just add noise to a screen reader.
      aria-hidden
      focusable="false"
      className="h-full w-full object-cover"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-deep)" />
          <stop offset="100%" stopColor="var(--color-panel)" />
        </linearGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-panel)" />
          <stop offset="100%" stopColor="var(--color-deep)" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="900" height="600" fill={`url(#${id}-sea)`} />
      <rect width="900" height={horizon} fill={`url(#${id}-sky)`} />

      <circle cx={sunX} cy={sunY} r={sunR * 3.4} fill={`url(#${id}-glow)`} />
      <circle cx={sunX} cy={sunY} r={sunR} fill="var(--color-highlight)" opacity="0.9" />

      {/* The horizon is the only full-strength line in the drawing. */}
      <line
        x1="-40"
        y1={horizon}
        x2="940"
        y2={horizon}
        stroke="var(--color-accent-soft)"
        strokeWidth="1.5"
        opacity="0.7"
      />

      {/* The sun's reflection, straight down the water. */}
      <rect
        x={sunX - sunR * 0.5}
        y={horizon}
        width={sunR}
        height={600 - horizon}
        fill="var(--color-highlight)"
        opacity="0.09"
      />

      {lines.map((line, i) => (
        <path
          key={i}
          d={line.d}
          fill="none"
          stroke="var(--color-accent-soft)"
          strokeWidth={line.width}
          strokeLinecap="round"
          opacity={line.opacity}
        />
      ))}
    </svg>
  );
}

export default function GuideCover({
  slug,
  cover,
  alt,
  sizes,
  priority,
}: {
  slug: string;
  cover?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!cover) return <DrawnCover slug={slug} />;

  return (
    <Image
      src={`/photos/${cover}.webp`}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      /*
        No `guide-cover` here. That class lives on the wrapper the card puts
        around this component, and having it on both meant the hover growth
        applied twice on a photograph — 1.05 x 1.05 — while a drawn cover, which
        has no inner element carrying the class, grew only once. Two cards side
        by side then zoomed by visibly different amounts.
      */
      className="object-cover"
    />
  );
}
