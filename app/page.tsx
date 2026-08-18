import { copyText, interpolate } from "@/lib/dictionary";
import { site, whatsappLink } from "@/content/site";
import { bookedRanges } from "@/content/availability";
import { blockedNights, dayKey } from "@/lib/availability";
import { guides } from "@/lib/guides";

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
import Guides from "@/components/Guides";
import Contact from "@/components/Contact";
import MobileCta from "@/components/MobileCta";
import RevealController from "@/components/RevealController";

/**
 * Re-render hourly. The page is otherwise fully static, but the calendar needs
 * the server's idea of "today" to stay current — without this, a page built in
 * August would still be greying out August dates in October.
 */
export const revalidate = 3600;

export default function Page() {
  const whatsappHref = whatsappLink(copyText.contact.prefill);
  const articles = guides();

  const gettingHere = {
    ...copyText.gettingHere,
    steps: copyText.gettingHere.steps.map((step) => ({
      ...step,
      title: interpolate(step.title, { price: site.shuttlePrice }),
    })),
  };

  const contact = {
    ...copyText.contact,
    cta: interpolate(copyText.contact.cta, { phone: site.phoneDisplay }),
  };

  return (
    <>
      <Header nav={copyText.nav} whatsappHref={whatsappHref} showGuides={articles.length > 0} />

      <main id="main">
        <Hero copy={copyText.hero} imageAlt={copyText.gallery.photos.window.alt} />
        <Apartment copy={copyText.apartment} />
        <Gallery copy={copyText.gallery} />
        <Availability
          copy={copyText.availability}
          localeTag={site.localeTag}
          ctaHref={whatsappHref}
          blockedNights={[...blockedNights(bookedRanges)]}
          serverToday={dayKey(new Date())}
        >
          <Rates copy={copyText.rates} />
        </Availability>
        <Amenities copy={copyText.amenities} />
        {/* Trust before logistics: who you're dealing with, then how to get here. */}
        <HostAndReviews copy={copyText.host} />
        <GettingHere copy={gettingHere} />
        <GoodToKnow copy={copyText.goodToKnow} />
        <Guides guides={articles} copy={copyText.guides} />
        <Contact copy={contact} footer={copyText.footer} whatsappHref={whatsappHref} imageAlt="" />
      </main>

      <MobileCta label={copyText.nav.whatsapp} href={whatsappHref} />
      <RevealController />
    </>
  );
}
