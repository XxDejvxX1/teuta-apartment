/**
 * The page footer — a real <footer>, so screen readers get the contentinfo
 * landmark. Always rendered inside a dark closing section, so every page ends
 * on the same dark block rather than a strip of a different colour.
 */
export default function SiteFooter({ footer }: { footer: { location: string; tagline: string } }) {
  return (
    <footer className="relative flex flex-col justify-between gap-2 px-5 py-6 text-caption text-on-night-soft sm:flex-row sm:gap-5 md:px-10">
      <span aria-hidden className="rule-stitch absolute inset-x-0 top-0 h-px text-night-line" />
      <span className="label">{footer.location}</span>
      <span className="label">{footer.tagline}</span>
    </footer>
  );
}
