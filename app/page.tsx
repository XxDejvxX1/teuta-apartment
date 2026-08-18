import { copyText, interpolate } from "@/lib/dictionary";
import { site, siteUrl, whatsappLink } from "@/content/site";
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

/*
  The Apartment and FAQPage graph, which used to sit in the root layout and so
  appeared on all six URLs. Google asks that FAQ markup describe content the
  visitor can actually see on that page, and /guide/day-trips shows none of the
  Good to know rows, the amenities or the address. It belongs to this page only.

  Rendered in the body rather than the head on purpose — that is where the
  article JSON-LD lives too, and Google reads it either way.
*/
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
      // Same rule as the article image below: claim it only when it is real.
      // site.address.street is deliberately empty until the owners confirm it.
      ...(site.address.street ? { streetAddress: site.address.street } : {}),
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
      <StructuredData />
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
