/**
 * Single source of truth for the facts about the apartment.
 *
 * Anything marked TODO is a placeholder that needs the real value before launch.
 */

export const site = {
  name: "Teuta Apartment",
  /** E.164, digits only — used to build wa.me links. */
  whatsappNumber: "355686075195",
  /** Human-readable, used as link text. */
  phoneDisplay: "+355 68 607 5195",

  geo: { lat: 41.313574, lng: 19.475329 },

  address: {
    // TODO: exact street and number.
    street: "Rruga Pavarësia",
    locality: "Durrës",
    region: "Durrës County",
    postalCode: "2001",
    country: "AL",
  },

  checkIn: "14:00",
  checkOut: "11:00",

  stay: {
    minNights: { high: 4, standard: 3 },
    /** 0-indexed months treated as high season. July and August. */
    highSeasonMonths: [6, 7] as readonly number[],
  },

  season: {
    /**
     * 0-indexed months the apartment is open: April through September.
     * Everything else is closed, so the calendar refuses those dates rather
     * than letting someone send an enquiry that can only be turned down.
     */
    openMonths: [3, 4, 5, 6, 7, 8] as readonly number[],
  },

  capacity: {
    guests: 5,
    bedrooms: 1,
    beds: 3,
    bathrooms: 1,
  },

  /** Airport transfer price in EUR. Was a tunable prop in the design. */
  shuttlePrice: 30,
} as const;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  /*
    Every canonical, every hreflang, the OG url, all three sitemap entries and
    the JSON-LD `url` are built from this one value. Falling back silently meant
    a build with the variable unset produced a site that looked completely
    normal while telling Google it lived on a laptop — the kind of mistake that
    is invisible until the search results are wrong.

    Dev keeps the localhost default; a production build refuses.
  */
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set. Set it to the public origin " +
        "(for example https://teuta-apartment.com) in the build environment " +
        "before running `next build`.",
    );
  }

  return "http://localhost:3000";
}
