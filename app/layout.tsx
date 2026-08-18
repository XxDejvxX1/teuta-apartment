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
    <html lang={site.localeTag} className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
