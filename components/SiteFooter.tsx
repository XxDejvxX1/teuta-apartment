/**
 * The page footer. Extracted from Contact when the guide pages needed the same
 * one — a real <footer>, so screen readers get the contentinfo landmark.
 *
 * Always rendered inside the closing photographic section, never after it, so
 * every page ends on the same dark block. It had a light variant briefly, which
 * put a white strip under the beach photograph on the guide pages and made the
 * page look like it had two endings.
 */
export default function SiteFooter({
  footer,
}: {
  footer: { location: string; tagline: string };
}) {
  return (
    <footer className="relative flex flex-col justify-between gap-2 border-t border-white/[0.18] px-5 py-6 text-[13px] text-white/65 sm:flex-row sm:gap-5 md:px-10">
      <span>{footer.location}</span>
      <span>{footer.tagline}</span>
    </footer>
  );
}
