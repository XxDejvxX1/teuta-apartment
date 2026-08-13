# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Families with children, and couples, booking a summer stay on the Durrës
beachfront in Albania.

Families are the reason the five-person capacity and the two sofa beds matter;
couples use the bedroom and the balcony and ignore the rest. Both groups arrive
already knowing roughly where they want to be and are choosing between many
superficially similar apartments.

The site is published in English, Albanian and Italian. Albanian and Italian
speakers are served deliberately, but neither has been confirmed as a primary
audience — treat them as reach, not as the group the product is designed around.

## Product Purpose

A direct-booking site for a single apartment, so a guest can see which nights
are free and message the owner about specific dates without going through a
booking platform.

Success is one thing: a WhatsApp message that arrives containing real dates and
a guest count. An enquiry that arrives without dates has failed, because it
costs the owner a manual round-trip and gives the guest a reason to drift back
to the platform.

## Positioning

Two claims, both checkable, both true of this apartment and not of most of its
neighbours:

1. **First line.** You leave the building and you are on the sand. A large share
   of Durrës listings described as "beachfront" sit a road or two back. This is
   the difference the whole page is built around, and it is carried in the
   local idiom — *rreshti i parë* / *prima fila* — rather than the word
   "beachfront".
2. **A quiet stretch of the beachfront.** Away from the loud central strip and
   its bars. This is what makes it right for families and couples, and it is
   also what would make it wrong for a group looking for nightlife.

## Operating Context

- **One host, Dejv.** He answers WhatsApp himself, usually within the hour.
  The site presented two hosts, Rudi and Dejv, until August 2026; Rudi no longer
  hosts and the site now names Dejv alone. Yana's review still thanks Rudi by
  name — the reviews are verbatim and stay as written, so a visitor may meet a
  name that appears nowhere else on the page.
- He meets guests at the apartment and hands over the keys in person. There is
  no lockbox and no agency in between. Several of the guest reviews single this
  out, including one about waiting up for a late arrival.
- Availability is maintained **by hand** in `content/availability.ts`. There is
  no calendar sync with any platform, so every booking is a manual edit.
- **The Booking.com listing stays.** This site is supplementary reach, not a
  replacement. Booking.com's terms include narrow rate-parity clauses, so the
  direct price should not undercut the platform rate; any direct incentive
  should be a perk (transfer, late checkout) rather than a lower nightly price.
  The owner has not asked for a lower direct price.

## Capabilities and Constraints

**The apartment.** One bedroom plus two sofa beds, sleeps five, one bathroom,
sea-view balcony. Free WiFi, free parking beside the building, air conditioning
in the living room only — corrected by the owner in August 2026; the site
previously said the bedroom had one too. Full kitchen.

**Season.** Open **April to the end of September**. Closed October to March —
the calendar refuses those dates rather than letting someone send an enquiry
that can only be turned down.

**Prices.** Per night, whole apartment, up to five guests: **€60** April–May,
**€70** June and September, **€85** July–August.

**Booking rules.** Check-in from 14:00, check-out by 11:00. Minimum stay four
nights in July and August, three nights the rest of the year. Airport transfer
from Tirana on request, €30; the drive is 20–30 minutes.

**Location.** 41.313574, 19.475329.

**Contact.** WhatsApp only, +355 68 607 5195. No email address, no contact form,
no payment taken on the site.

**Technical.** Next.js 16 (App Router) and Tailwind v4. Three locales: `en`
(default), `sq`, `it`. Requires a Node host — the locale redirect runs per
request — so a purely static export is not an option. Hosting provider is not
yet chosen.

**Payment.** No deposit. Cash on arrival, in euros or lek. Nothing charged on
top — no cleaning fee, no booking fee. No money is taken through the site.

**Explicitly undecided.** Cancellation policy. The street address. These are
recorded as open, not inferred; nothing in the product may state them until the
owners do.

## Brand Commitments

- The name is **Teuta Apartment**.
- The voice is first person, understated and observational — it describes what
  is there rather than claiming benefits ("The sea is the first thing you see
  when the curtain moves in the morning"). This is a confirmed, deliberate
  choice and existing copy should not be rewritten into marketing register.
- **Resolved (August 2026):** the site speaks as "I" throughout, which is now
  simply correct — there is one host. The host block's "we" went with the
  paragraph that carried it. The only surviving "we" is in Good to know, "message
  me and we'll work it out", where it means the host and the guest together.
- "First line" is the established phrase for the location, in all three
  languages.

## Evidence on Hand

- **Photographs:** six of the apartment plus one of the host, in
  `public/photos/`. The apartment shots are 1536×1024 (the earlier note here
  said "1024px wide or less" — that was the height). Resolution is adequate;
  compression is not. They run 0.21–0.35 bytes per pixel where a well-encoded
  JPEG sits near 0.10, so every one is roughly two to three times its necessary
  weight.
- **Guest reviews:** three real ones in `content/reviews.ts` — Diana (UK, 10),
  Anca (Romania, 9), Lisa (Australia, 10). Held verbatim, typos and emoji
  included, because corrected reviews read as in-house copy. Any further review
  must also be copied word for word; an invented one is a fabricated record and
  an unfair commercial practice in the EU.
- **Booking.com overall rating: 9.8**, supplied by the owner in August 2026 and
  stated in the host paragraph. The review count is still not recorded. This is
  a published claim about a third-party score, so it has to match the listing:
  if the score moves, the copy moves with it in all three languages. The five
  reviews on the page must still never be averaged into a score of our own.
- **Host identity:** **Dejv**, hosting alone. No photograph yet; the block falls
  back to a single initial. One photograph is wanted, not one per person — the
  block renders a single 144px circle.
- **Prices:** published, see Capabilities.

Future work must not fill any of these gaps by invention. Each one is wired so
that an empty value renders nothing rather than a placeholder.

## Product Principles

1. **The visitor leaves with dates, not a question.** The page knows which
   nights are free; it is the page's job to carry that into the message, not
   the guest's job to retype it.
2. **Never claim what cannot be checked.** Prices, reviews, ratings and host
   details appear only when real. Empty renders nothing. This is enforced in
   code, not by discipline.
3. **The owner is the product.** The reason to book direct is that a specific
   person answers, meets you, and knows the place. Anything that makes the site
   feel like an agency listing works against it.
4. **Upkeep must earn itself.** Availability is edited by hand. Any feature that
   adds a recurring manual task has to be worth more than the burden it creates.
5. **Three languages are equal.** A change is not finished until it works in
   Albanian and Italian, including line breaks, plurals and date formats.

## Accessibility & Inclusion

No user-specific requirement has been established. Work to date has been held to
WCAG 2.2 AA — text contrast at or above 4.5:1, interactive targets at least
24×24, a complete keyboard path, and full readability with JavaScript disabled.
Future work should not regress this.
