import type { Metadata } from "next";
import Link from "next/link";

import { copyText } from "@/lib/dictionary";
import { whatsappLink } from "@/content/site";
import { guides } from "@/lib/guides";
import { keepTogether } from "@/lib/typography";

import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import Seam from "@/components/Seam";
import { ArrowIcon } from "@/components/icons";

const copy = copyText.notFound;

/*
  wrangler.jsonc sets not_found_handling: "404-page", so Cloudflare serves the
  out/404.html this route produces for every unmatched path. Before this file
  existed that was Next's own default — no header, no way back, and two <title>
  tags in the document, since the inherited one and the built-in one both
  rendered.
*/
export const metadata: Metadata = {
  title: copy.metaTitle,
  // No robots key: Next already emits noindex for this route, and setting it
  // here as well put two robots meta tags in the document saying the same thing.
};

export default function NotFound() {
  const whatsappHref = whatsappLink(copyText.contact.prefill);
  const hasGuides = guides().length > 0;

  return (
    <>
      <Header nav={copyText.nav} whatsappHref={whatsappHref} solid showGuides={hasGuides} />

      {/* Oat under the header, then the band, then a dark field that fills the
          rest of the screen however short the message is. */}
      <main id="main" className="flex min-h-svh flex-col pt-24 md:pt-28">
        <Seam from="oat" to="night" motif="water" />
        <div data-on-dark="" className="flex flex-1 flex-col bg-night text-on-night">
          <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col justify-center px-5 py-24 md:px-11">
            {/* 404 in cross-stitch: the one place a number is the whole message. */}
            <p aria-hidden className="stitch-x mb-8 text-stitch-xl text-madder-bright">
              404
            </p>
            <h1 className="t-headline mb-6 max-w-[16ch] text-on-night">
              {keepTogether(copy.title)}
            </h1>
            <p className="mb-11 max-w-[52ch] text-body-lg leading-[1.65] text-on-night-soft md:text-body-xl">
              {copy.body}
            </p>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-9">
              <Link
                href="/"
                className="btn-linen inline-flex items-center justify-center gap-3 self-start px-8 py-4 text-body-md"
              >
                <span className="nudge nudge--left">
                  <ArrowIcon direction="left" size={16} />
                </span>
                {copy.home}
              </Link>
              {hasGuides && (
                <Link href="/guide" className="self-start py-1 text-control text-on-night">
                  <span className="link-stitch">{copy.guides}</span>
                </Link>
              )}
            </div>
          </div>

          <SiteFooter footer={copyText.footer} />
        </div>
      </main>
    </>
  );
}
