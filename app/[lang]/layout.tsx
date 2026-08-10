import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";

import "@/app/globals.css";
import { LOCALES, LOCALE_TAGS, isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
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

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/** Unknown locales 404 rather than rendering an empty shell. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = getDictionary(lang);

  return {
    metadataBase: new URL(siteUrl()),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        sq: "/sq",
        it: "/it",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${lang}`,
      locale: LOCALE_TAGS[lang].replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    robots: { index: true, follow: true },
  };
}

function StructuredData({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  const data = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: site.name,
    description: dict.meta.description,
    url: `${siteUrl()}/${lang}`,
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
    amenityFeature: Object.values(dict.amenities.items).map((item) => ({
      "@type": "LocationFeatureSpecification",
      name: item.title,
      value: true,
    })),
    telephone: `+${site.whatsappNumber}`,
  };

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

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={LOCALE_TAGS[lang]}
      className={`${dmSans.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <StructuredData lang={lang} />
      </head>
      <body>{children}</body>
    </html>
  );
}
