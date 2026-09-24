import type { Metadata } from "next";
import { Handjet, Instrument_Serif, Sofia_Sans } from "next/font/google";

import "@/app/globals.css";
import { copyText } from "@/lib/dictionary";
import { site, siteUrl } from "@/content/site";

const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  variable: "--font-sofia-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const handjet = Handjet({
  subsets: ["latin"],
  axes: ["ELSH", "ELGR"],
  variable: "--font-handjet",
  display: "swap",
});

const DESIGN_CONTRACT = `<!--
THESIS: Below the photograph the page is one length of cloth. Every join between sections is a woven band, standing still. Refuses stacked cream sections; the gallery's deck is the one rounded shape, kept at the owner's request.
OWN-WORLD: Oatmeal linen ground, slate thread, one madder red. Stepped kilim teeth, lozenges, stars and water chevrons on a stitch grid; keyline mounts with madder corners; running-stitch rules. Instrument Serif for sentences, Handjet cross-stitch for numbers, Sofia Sans for reading.
STORY: The sea from the window; what the apartment is; every photograph; free nights and the total; what guests said under the 9.7; how to arrive; the dates sent on WhatsApp.
FIRST VIEWPORT: The hero photograph and serif headline as before (tracking opened), header pill on top, hemmed along the bottom edge by the first woven band.
FORM: Regional ornament program, chosen challenger. Seed e1d377f0.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

/*
  Three faces, each with one job. Instrument Serif sets sentences — the hero
  and every headline. Handjet, a face built from separate elements on a grid,
  is opened into cross-stitch for numbers and closed up for small labels.
  Sofia Sans carries everything meant to be read at length.

  next/font self-hosts all three from the build, so no request leaves the
  site's own origin (the CSP allows fonts from 'self' only).

  `subsets` decides what is preloaded, not what exists. Every subset a family
  offers is still emitted with its unicode-range, and a browser fetches one
  only when the page uses a character inside it. So "latin" alone is not a
  loss of coverage: ë and ç — Durrës, Fërgesë — are Latin-1 and sit in the
  latin files, and anything rarer still loads from latin-ext on demand. Listing
  latin-ext here as well used to preload three files on every visit that no
  English page ever reads: about 44 KB of the 116 KB that went down before a
  word was shown.
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
    locale: site.ogLocale,
  },
  /*
    No `robots` key. "index, follow" is what a crawler does with no instruction
    at all, so declaring it bought nothing — and because metadata is inherited,
    it reached the 404 page and sat there contradicting the noindex Next emits
    for that route. Pages that need a rule state it themselves.
  */
  twitter: {
    card: "summary_large_image",
    title: copyText.meta.title,
    description: copyText.meta.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={site.localeTag}
      className={`${sofiaSans.variable} ${instrumentSerif.variable} ${handjet.variable}`}
    >
      <body>
        {/*
          The design contract, in the markup while `next dev` runs so a review of
          any page can be held against it. Not shipped: it is working notes, and
          every visitor and crawler would download it on every page. DESIGN.md
          is the full version.
        */}
        {process.env.NODE_ENV === "development" && (
          <div hidden dangerouslySetInnerHTML={{ __html: DESIGN_CONTRACT }} />
        )}
        {children}
      </body>
    </html>
  );
}
