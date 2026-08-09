import { notFound } from "next/navigation";

import { isLocale, LOCALE_TAGS } from "@/lib/i18n";
import { getDictionary, interpolate } from "@/lib/dictionary";
import { site, whatsappLink } from "@/content/site";
import { bookedRanges } from "@/content/availability";
import { blockedNights, dayKey } from "@/lib/availability";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Apartment from "@/components/Apartment";
import Gallery from "@/components/Gallery";
import Availability from "@/components/Availability";
import Rates from "@/components/Rates";
import Amenities from "@/components/Amenities";
import HostAndReviews from "@/components/HostAndReviews";
import GettingHere from "@/components/GettingHere";
import GoodToKnow from "@/components/GoodToKnow";
import Contact from "@/components/Contact";
import MobileCta from "@/components/MobileCta";
import RevealController from "@/components/RevealController";

/**
 * Re-render hourly. The page is otherwise fully static, but the calendar needs
 * the server's idea of "today" to stay current — without this, a page built in
 * August would still be greying out August dates in October.
 */
export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const whatsappHref = whatsappLink(dict.contact.prefill);

  const gettingHere = {
    ...dict.gettingHere,
    steps: dict.gettingHere.steps.map((step) => ({
      ...step,
      title: interpolate(step.title, { price: site.shuttlePrice }),
    })),
  };

  const contact = {
    ...dict.contact,
    cta: interpolate(dict.contact.cta, { phone: site.phoneDisplay }),
  };

  return (
    <>
      <Header lang={lang} nav={dict.nav} whatsappHref={whatsappHref} />

      <main id="main">
        <Hero copy={dict.hero} imageAlt={dict.gallery.photos.window.alt} />
        <Apartment copy={dict.apartment} />
        <Gallery copy={dict.gallery} />
        <Availability
          copy={dict.availability}
          localeTag={LOCALE_TAGS[lang]}
          ctaHref={whatsappHref}
          blockedNights={[...blockedNights(bookedRanges)]}
          serverToday={dayKey(new Date())}
        >
          <Rates copy={dict.rates} />
        </Availability>
        <Amenities copy={dict.amenities} />
        {/* Trust before logistics: who you're dealing with, then how to get here. */}
        <HostAndReviews copy={dict.host} localeTag={LOCALE_TAGS[lang]} />
        <GettingHere copy={gettingHere} />
        <GoodToKnow copy={dict.goodToKnow} />
        <Contact
          copy={contact}
          footer={dict.footer}
          whatsappHref={whatsappHref}
          imageAlt=""
        />
      </main>

      <MobileCta label={dict.nav.whatsapp} href={whatsappHref} />
      <RevealController />
    </>
  );
}
