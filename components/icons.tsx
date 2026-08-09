/** Icon paths carried over verbatim from the design source. */

type IconProps = { className?: string; size?: number };

export function WhatsAppIcon({ className, size = 17 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.04 2.5a9.44 9.44 0 0 0-8.06 14.32L2.5 21.5l4.8-1.42A9.44 9.44 0 1 0 12.04 2.5Zm0 1.72a7.72 7.72 0 1 1-3.94 14.36l-.28-.17-2.85.84.85-2.78-.18-.29A7.72 7.72 0 0 1 12.04 4.22Zm-3.3 3.9c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.68 4.16 3.66 2.06.8 2.48.64 2.93.6.45-.04 1.45-.59 1.66-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.19-.46-.39-.4-.54-.4Z" />
    </svg>
  );
}

/**
 * Drawn arrows and a drawn cross, rather than the "←" "→" "✕" characters the
 * design used. Glyphs inherit whatever the text font decides — they sit off the
 * optical centre, vary wildly between families, and never match the 1.4 stroke
 * of the amenity icons.
 */
export function ArrowIcon({
  direction,
  size = 18,
}: {
  direction: "left" | "right";
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={direction === "left" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function Stroke({ children, size = 26 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const amenityIcons = {
  balcony: () => (
    <Stroke>
      <path d="M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </Stroke>
  ),
  wifi: () => (
    <Stroke>
      <path d="M2.5 8.5a15 15 0 0 1 19 0" />
      <path d="M5.5 12.2a10.5 10.5 0 0 1 13 0" />
      <path d="M8.8 15.8a5.5 5.5 0 0 1 6.4 0" />
      <path d="M12 19.4h.01" />
    </Stroke>
  ),
  parking: () => (
    <Stroke>
      <path d="M3 16h18v-4.2L18.8 8H5.2L3 11.8V16z" />
      <path d="M5.5 16v2.4M18.5 16v2.4" />
      <path d="M6.6 12.8h1.2M16.2 12.8h1.2" />
    </Stroke>
  ),
  ac: () => (
    <Stroke>
      <path d="M12 2.5v19M3.8 7.2l16.4 9.6M20.2 7.2 3.8 16.8" />
      <path d="M12 6.2 9.6 4.4M12 6.2l2.4-1.8M12 17.8l-2.4 1.8M12 17.8l2.4 1.8" />
    </Stroke>
  ),
  kitchen: () => (
    <Stroke>
      <path d="M4 9.5h16v5.5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9.5z" />
      <path d="M2 11.6h2M20 11.6h2" />
      <path d="M9 6.6V4.2M12 6.6V3.4M15 6.6V4.2" />
    </Stroke>
  ),
  sleeps: () => (
    <Stroke>
      <path d="M3 19v-9.5h13a4.5 4.5 0 0 1 4.5 4.5V19" />
      <path d="M3 15.2h17.5" />
      <path d="M6.6 9.5V7.2h4.2v2.3" />
    </Stroke>
  ),
} as const;

export type AmenityKey = keyof typeof amenityIcons;
