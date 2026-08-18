import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { copyText, interpolate } from "@/lib/dictionary";
import { guide, guideParams } from "@/lib/guides";
import { parseDayKey } from "@/lib/availability";
import { site, siteUrl, whatsappLink } from "@/content/site";

import Header from "@/components/Header";
import GuideCover from "@/components/GuideCover";
import Contact from "@/components/Contact";
import RevealController from "@/components/RevealController";
import { ArrowIcon } from "@/components/icons";

export function generateStaticParams() {
  return guideParams();
}

/** A slug with no file is a 404, never an empty page. */
export const dynamicParams = false;

const copy = copyText.guides;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = guide(slug);
  if (!article) return {};

  /*
    An article shared on WhatsApp should show its own photograph, not the
    apartment card every other page uses. Falls back to the site card for an
    article whose cover is the drawn shoreline rather than a photo.

    This has to be spelled out on both openGraph and twitter: declaring either
    object replaces the parent entirely, so these pages previously shipped with
    no og:image and with the homepage's Twitter title.
  */
  const image = article.cover ? `/photos/${article.cover}-1200.webp` : "/opengraph-image";

  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/guide/${slug}` },
    openGraph: {
      type: "article",
      siteName: site.name,
      title: article.title,
      description: article.summary,
      url: `/guide/${slug}`,
      publishedTime: article.date,
      locale: site.ogLocale,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [image],
    },
  };
}

function ArticleJsonLd({ slug }: { slug: string }) {
  const article = guide(slug);
  if (!article) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    inLanguage: site.localeTag,
    mainEntityOfPage: `${siteUrl()}/guide/${slug}`,
    // Only claim an image when one exists — an empty or invented URL is a
    // broken entity, and the drawn cover is a placeholder, not a photograph.
    ...(article.cover ? { image: [`${siteUrl()}/photos/${article.cover}.webp`] } : {}),
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <script
      type="application/ld+json"
      // Same escape as the homepage's JSON-LD: a literal `</script>` in a title
      // would otherwise close this tag early. No user input reaches it.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function GuideArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = guide(slug);
  if (!article) notFound();

  const whatsappHref = whatsappLink(copyText.contact.prefill);

  const date = parseDayKey(article.date);
  const dateLabel = date
    ? new Intl.DateTimeFormat(site.localeTag, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date)
    : "";

  const meta = [
    copy.categories[article.category],
    dateLabel,
    interpolate(copy.minutes, { count: article.minutes }),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <ArticleJsonLd slug={slug} />
      <Header nav={copyText.nav} whatsappHref={whatsappHref} solid showGuides />

      <main id="main">
        <article>
          {/* The cover carries the title, as on the index — one treatment for
              an article whether you meet it in the grid or on its own page. */}
          <header
            data-on-dark=""
            className="relative flex min-h-[440px] items-end overflow-hidden bg-surface-warm md:min-h-[560px]"
          >
            <div className="absolute inset-0">
              <GuideCover slug={article.slug} cover={article.cover} alt="" sizes="100vw" priority />
            </div>

            <div aria-hidden className="guide-scrim-featured absolute inset-0" />

            <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-12 pt-32 md:px-11 md:pb-16">
              <p className="eyebrow hero-fade mb-4 text-white/80">{meta}</p>

              {/*
                The margin goes on a wrapper, never on .hero-rise itself: that
                rule is unlayered and its `margin-bottom: -0.14em` (which pays
                back the padding holding descenders off the mask) beats any
                Tailwind mb-* on the same element, collapsing the gap to nothing.
              */}
              <div className="mb-5">
                <span className="hero-rise">
                  <h1 className="t-display max-w-[17ch] text-headline leading-[1.06] text-white">
                    {article.title}
                  </h1>
                </span>
              </div>

              <p
                className="hero-fade max-w-[54ch] text-body-md leading-[1.6] text-white/85 md:text-body-lg"
                style={{ ["--stagger-i" as string]: 1 }}
              >
                {article.summary}
              </p>
            </div>
          </header>

          {/*
            The body is authored Markdown from this repository, rendered at build
            time — the same trust level as content/copy.json. `prose-guide`
            styles it; see globals.css.
          */}
          <div
            className="prose-guide mx-auto max-w-[680px] px-5 py-16 md:px-0 md:py-24"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          <div className="mx-auto max-w-[680px] px-5 pb-20 md:px-0 md:pb-24">
            <Link
              href="/guide"
              className="guide-back inline-flex items-center gap-2.5 border-t border-line pt-8 text-control text-accent"
            >
              {/* ArrowIcon sets transform inline to mirror itself, so the
                  hover nudge has to move a wrapper rather than the svg. */}
              <span className="guide-back-arrow">
                <ArrowIcon direction="left" size={16} />
              </span>
              {copy.backToIndex}
            </Link>
          </div>
        </article>

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

      <RevealController />
    </>
  );
}
