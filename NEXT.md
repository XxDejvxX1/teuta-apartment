# Next up

Handoff for a fresh session. Read `PRODUCT.md` first (product truth), then
`README.md` (how to run it and maintain the content). This file covers only
what has been **decided but not built**, plus the conventions that are easy to
break without noticing.

---

## Where the site is now

A one-page direct-booking site for Teuta Apartment, Durrës. Next.js 16 (App
Router), Tailwind v4, three locales (`en` default, `sq`, `it`). Sections in
order: hero, the apartment, gallery, availability + rates, amenities, host +
reviews, getting here, good to know, contact.

Working and verified: date selection that writes the dates into a prefilled
WhatsApp message, a hand-maintained booking calendar closed outside April–
September, real prices, three real guest reviews, both hosts named. Zero WCAG
contrast failures, no horizontal scroll at any width, full readability with
JavaScript disabled, 21 tests green across four timezones.

The last full review is in `.impeccable/critique/` — a `/impeccable critique`
snapshot scored 24/40 before a fix pass; a follow-up `/impeccable audit` scored
19/20 after it.

---

## Decided, not built: "What to do in Durrës"

A section linking to travel articles the owners write themselves.

### Why it exists

Someone searching "what to do in Durrës" has not chosen accommodation yet. The
article is the door; the apartment is behind it. This only works if the
articles live **on this domain** — putting them on Medium or a separate blog
hands the search ranking and the traffic to someone else and forces the reader
to travel back. That was the decision, and it is the whole point of the
feature.

### Shape

- **Files:** one Markdown file per article per language, in `content/guides/`,
  named `<slug>.<lang>.md` — e.g. `roman-amphitheatre.en.md`. Frontmatter
  carries `title`, `summary`, `cover` (a filename in `public/guides/`) and
  `date`.
- **Route:** `app/[lang]/guide/[slug]/page.tsx`, with `generateStaticParams`
  over language × slug and `dynamicParams = false`, matching the existing page.
- **Homepage section:** three cards, placed **after "Good to know" and before
  the contact section**. Low on the page on purpose — guides compete with
  booking, so they should catch browsers without pulling away anyone already
  ready to message.
- **Each article ends with a WhatsApp CTA** back to the apartment. That is the
  only reason the article exists commercially.

### The language rule that matters

An article appears **only in the languages it has actually been written in**.
If `roman-amphitheatre.it.md` does not exist, the Italian homepage does not
list that article. Never show an untranslated one, and never machine-translate
into a guest-facing page.

Flag to the owners before starting: three locales means roughly three times the
writing. They may reasonably choose to write only in English at first, which
this design supports.

### Dependencies

Two small ones, both needed only at build time: a frontmatter parser
(`gray-matter`) and a Markdown renderer (`marked` is enough — sync, tiny, no
plugin pipeline required). No CMS, no external service.

### Reuse rather than rebuild

`getDictionary()` and `LOCALE_TAGS` from `lib/`, `siteUrl()` from
`content/site.ts`, the `data-reveal="fade"` / `data-reveal="mask"` motion
attributes, `.t-h3` for headings, and the section padding convention
`px-5 py-20 md:px-11 md:py-28`. Extend `app/sitemap.ts` to include guide
routes and add `Article` JSON-LD; the per-locale social card in
`app/[lang]/opengraph-image.tsx` is the pattern to copy for article images.

### Honest expectation

This is a slow SEO play — months, not weeks. It is a good bet here because
Durrës content is thin and the owners actually live there, but it will not move
bookings this season.

---

## Optional: a photo manifest generator

Adding a photo is currently five manual steps across five files (see
`README.md`). A script that scans `public/photos/`, reads each file's real
dimensions and writes the manifest would cut that to: drop the file in, run
`npm run photos`, write the alt text.

Worth doing only if the gallery is going to keep growing. For one or two more
photos the manual route is fine.

---

## House rules a new session must not break

These were each fixed once already. Re-breaking them is the most likely way to
do damage.

1. **Never fabricate guest-facing facts.** Prices, reviews, host details and
   ratings render *nothing* when empty rather than showing a placeholder. An
   invented review is a fabricated record and an unfair commercial practice in
   the EU. `content/rates.ts`, `content/reviews.ts` and `content/host.ts` are
   all built around this.
2. **`to` in a booked range is the checkout day and is exclusive.** 10–14
   August occupies four nights, not five. Treating it as inclusive blocks a
   night too many on every booking.
3. **Dates parse at 12:00 UTC, never local midnight.** Midnight lands on the
   previous day for anyone east of UTC, Albania included. `npm run test:tz`
   exists to catch exactly this.
4. **Scroll reveals are hidden by JavaScript at runtime, never by the
   stylesheet**, and only for elements off-screen at the time. If the bundle
   never runs, nothing is hidden. The original design got this backwards and
   blanked most of the page.
5. **Animate `transform` and `opacity` only.** Two exceptions exist — the
   header's padding and the gallery dot's width — and both are documented and
   bounded with `contain: layout style`. Do not add a third casually.
6. **Reduced motion means less movement, not less feedback.** Colour
   transitions survive on purpose; do not reinstate a blanket
   `transition-duration: 0.01ms` kill.
7. **Contrast ≥ 4.5:1 for body text, interactive targets ≥ 24×24.** The
   palette tokens carry their measured ratios in comments in `globals.css`.
8. **Colours come from tokens.** There are currently zero hard-coded hexes in
   `components/`.
9. **A change is not done until it works in all three languages** — including
   line breaks, plurals and date formats.
10. **The page must stay readable with JavaScript disabled.**

---

## Still waiting on the owners

- **A photograph of Rudi and Dejv** → `public/photos/host.jpg`, then set
  `photoSrc` in `content/host.ts`. Two of the three reviews praise them by
  role; a face is the cheapest trust on the site.
- **Larger photo files.** Every current image is ≤1024px and two run
  full-bleed. No code change fixes this. Spec is in `README.md`.
- **Cancellation policy** and the **street address** — both still recorded as
  open in `PRODUCT.md`. Nothing may state them until the owners do.
- **A copy pass on first person.** The site still says "I" in several places
  ("I answer on WhatsApp", "I meet you at the apartment") but there are two
  hosts. Only the host block says "we". The owners said they would do their own
  copy pass; do not switch the rest unasked.
- **Booking.com overall score and review count**, if they want it shown. The
  three reviews on the page must not be averaged and presented as the
  property's rating.
- **A hosting decision.** Needs a Node host because the locale redirect in
  `proxy.ts` runs per request; Vercel's free tier is zero-config.
