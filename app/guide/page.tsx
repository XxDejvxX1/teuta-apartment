import type { Metadata } from "next";

import { copyText, interpolate } from "@/lib/dictionary";
import { guides, guideCategories } from "@/lib/guides";
import { parseDayKey } from "@/lib/availability";
import { site, whatsappLink } from "@/content/site";

import Header from "@/components/Header";
import GuideFeatured from "@/components/GuideFeatured";
import GuideFilters from "@/components/GuideFilters";
import GuideCard from "@/components/GuideCard";
import Contact from "@/components/Contact";
import MobileCta from "@/components/MobileCta";
import RevealController from "@/components/RevealController";

const copy = copyText.guides;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: { canonical: "/guide" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: copy.metaTitle,
    description: copy.metaDescription,
    url: "/guide",
    locale: site.ogLocale,
    /*
      Named explicitly because declaring an openGraph object here replaces the
      parent one wholesale — including the image Next infers from
      app/opengraph-image.tsx. Without this line the page shipped with no
      og:image at all, and sharing it produced a bare block of text.
    */
    images: ["/opengraph-image"],
  },
  // Same reason: twitter is inherited whole, so without this the card showed
  // the homepage title and description on every guide URL.
  twitter: {
    card: "summary_large_image",
    title: copy.metaTitle,
    description: copy.metaDescription,
    images: ["/opengraph-image"],
  },
};

export default function GuideIndex() {
  const whatsappHref = whatsappLink(copyText.contact.prefill);

  const articles = guides();

  /*
    The newest article runs full-width above the grid, so the grid holds the
    rest. It used to hold everything, which put the same link on the screen
    twice — once as the featured card and again as the first card under it.

    The chips count `rest`, not `articles`, so "All" always matches what is
    actually below it. A category whose only article is the featured one
    therefore drops out of the row entirely, which is right: a filter that
    empties the grid is worse than no filter.
  */
  const [featured, ...rest] = articles;
  const categories = guideCategories(rest);

  const dateFormat = new Intl.DateTimeFormat(site.localeTag, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /** House rule 3: never parse a day key at local midnight. */
  const formatDate = (iso: string) => {
    const date = parseDayKey(iso);
    return date ? dateFormat.format(date) : "";
  };

  const minutesLabel = (minutes: number) => interpolate(copy.minutes, { count: minutes });

  return (
    <>
      <Header
        nav={copyText.nav}
        whatsappHref={whatsappHref}
        solid
        showGuides={articles.length > 0}
      />

      <main id="main">
        {/*
          The page's own heading, above the newest article. "What to do in
          Durrës" is the search phrase this page is built to answer, so it is
          the h1 — see GuideFeatured for why the article title is not.
        */}
        <header className="mx-auto max-w-[1400px] px-5 pb-12 pt-[136px] md:px-11 md:pb-16 md:pt-[184px]">
          <div data-reveal="fade">
            <span data-reveal="mask" className="mb-6 block">
              <h1 className="t-h3 max-w-[18ch] text-ink">{copy.title}</h1>
            </span>
            <p className="max-w-[54ch] text-[17px] leading-[1.65] text-body-soft md:text-[18px]">
              {copy.intro}
            </p>
          </div>
        </header>

        {articles.length === 0 ? (
          // An empty grid would read as a broken page; this says what is true.
          <div className="mx-auto max-w-[820px] px-5 pb-24 md:px-11 md:pb-28">
            <p className="border-t border-line pt-8 text-[17px] leading-[1.65] text-body-mute">
              {copy.empty}
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <GuideFeatured
                guide={featured}
                readLabel={copy.readArticle}
                meta={[
                  copy.categories[featured.category],
                  formatDate(featured.date),
                  minutesLabel(featured.minutes),
                ].join(" · ")}
              />
            )}

            {rest.length > 0 && (
              <section className="guide-index mx-auto max-w-[1400px] px-5 pb-24 pt-16 md:px-11 md:pb-28 md:pt-24">
                <GuideFilters copy={copy} categories={categories} total={rest.length} />

                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article, index) => (
                    <GuideCard
                      key={article.slug}
                      guide={article}
                      categoryLabel={copy.categories[article.category]}
                      minutesLabel={minutesLabel(article.minutes)}
                      index={index}
                    />
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        {/*
          The same closing section and footer as the homepage, not a shortened
          variant of it. Someone arriving on an article from a search result has
          seen none of the apartment, so this is the first and only ask — and a
          second, differently-worded version of it was one more thing to keep in
          step for no benefit.
        */}
        <Contact
          copy={{
            ...copyText.contact,
            cta: interpolate(copyText.contact.cta, { phone: site.phoneDisplay }),
          }}
          footer={copyText.footer}
          whatsappHref={whatsappHref}
          imageAlt=""
        />
      </main>

      <MobileCta label={copyText.nav.whatsapp} href={whatsappHref} />
      <RevealController />
    </>
  );
}
