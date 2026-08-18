import type { Metadata } from "next";
import Link from "next/link";

import { copyText } from "@/lib/dictionary";
import { whatsappLink } from "@/content/site";
import { guides } from "@/lib/guides";

import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
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

      <main id="main" className="bg-deep">
        <div className="mx-auto flex min-h-[70vh] max-w-[820px] flex-col justify-center px-5 py-32 md:px-11">
          <p className="eyebrow mb-6 text-on-dark">404</p>
          <h1 className="t-h3 mb-6 max-w-[16ch] text-white">{copy.title}</h1>
          <p className="mb-10 max-w-[52ch] text-body-lg leading-[1.65] text-on-dark md:text-body-xl">
            {copy.body}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <Link
              href="/"
              className="btn-light inline-flex items-center justify-center gap-3 self-start rounded-full bg-white px-9 py-4 text-body-md text-deep"
            >
              <ArrowIcon direction="left" size={16} />
              {copy.home}
            </Link>
            {hasGuides && (
              <Link
                href="/guide"
                className="inline-flex items-center gap-2.5 self-start text-control text-on-dark-strong underline underline-offset-4"
              >
                {copy.guides}
              </Link>
            )}
          </div>
        </div>

        <SiteFooter footer={copyText.footer} />
      </main>
    </>
  );
}
