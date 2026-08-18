import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";

import "@/app/globals.css";
import { copyText } from "@/lib/dictionary";
import { site, siteUrl } from "@/content/site";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

/*
  `latin-ext` on both faces is not leftover from the Albanian and Italian
  editions. The apartment is in Durrës and the host writes Fërgesë and Kruja
  into the guides — ë and ç are Latin Extended-A, and dropping the subset would
  leave the page falling back to Georgia mid-word.
*/

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: copyText.meta.title,
  description: copyText.meta.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: copyText.meta.title,
    description: copyText.meta.description,
    url: "/",
    locale: site.localeTag,
  },
  twitter: {
    card: "summary_large_image",
    title: copyText.meta.title,
    description: copyText.meta.description,
  },
  robots: { index: true, follow: true },
};

function StructuredData() {
  const apartment = {
    "@type": "Apartment",
    name: site.name,
    description: copyText.meta.description,
    url: siteUrl(),
    /*
      Schema with no image is a weaker entity than one with it, and this was the
      only obvious gap. Real files rather than the generated OG card, so the URLs
      stay stable across builds.
    */
    image: [
      `${siteUrl()}/photos/hero-window.jpg`,
      `${siteUrl()}/photos/balcony.jpg`,
      `${siteUrl()}/photos/bedroom.jpg`,
    ],
    numberOfRooms: site.capacity.bedrooms,
    numberOfBedrooms: site.capacity.bedrooms,
    numberOfBathroomsTotal: site.capacity.bathrooms,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: site.capacity.guests,
      unitText: "guests",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    amenityFeature: Object.values(copyText.amenities.items).map((item) => ({
      "@type": "LocationFeatureSpecification",
      name: item.title,
      value: true,
    })),
    telephone: `+${site.whatsappNumber}`,
  };

  /*
    The Good to know rows, marked up as questions.

    The visible list is a definition list with short terms ("The keys"), which
    is the right thing to read; the `question` field carries the same content
    phrased as the question a guest actually types. The payment row follows the
    same condition GoodToKnow itself uses, so the markup never describes a row
    that is not on the page.
  */
  const faqRows = copyText.goodToKnow.payment.body.trim()
    ? [...copyText.goodToKnow.rows, copyText.goodToKnow.payment]
    : copyText.goodToKnow.rows;

  const faq = {
    "@type": "FAQPage",
    mainEntity: faqRows.map((row) => ({
      "@type": "Question",
      name: row.question,
      acceptedAnswer: { "@type": "Answer", text: row.body },
    })),
  };

  const data = { "@context": "https://schema.org", "@graph": [apartment, faq] };

  return (
    <script
      type="application/ld+json"
      // Static, author-controlled content — no user input reaches this string.
      // The `<` escape is belt and braces: a literal `</script>` anywhere in an
      // amenity title or address would otherwise close this tag early and drop
      // the rest of the JSON into the document as markup. `<` is valid
      // inside a JSON string, so consumers still parse it as `<`.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={site.localeTag}
      className={`${dmSans.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <StructuredData />
      </head>
      <body>{children}</body>
    </html>
  );
}
