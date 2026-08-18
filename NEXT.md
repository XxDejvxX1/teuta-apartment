# Next up

Handoff for a fresh session. Read `PRODUCT.md` first (product truth), then
`README.md` (how to run it and maintain the content). This file covers only
what has been **decided but not built**, plus the conventions that are easy to
break without noticing.

---

## Where the site is now

A one-page direct-booking site for Teuta Apartment, Durrës. Next.js 16 (App
Router), Tailwind v4, English only, served from the root. Sections in
order: hero, the apartment, gallery, availability + rates, amenities, host +
reviews, getting here, good to know, contact.

Working and verified: date selection that writes the dates into a prefilled
WhatsApp message, a hand-maintained booking calendar closed outside April–
September, real prices, three real guest reviews, both hosts named. Zero WCAG
contrast failures, no horizontal scroll at any width, full readability with
JavaScript disabled, 52 tests green across four timezones, and `npm run check` (format, lint, types, tests, build, five audits) clean.

The last full review is in `.impeccable/critique/` — a `/impeccable critique`
snapshot scored 24/40 before a fix pass; a follow-up `/impeccable audit` scored
19/20 after it.

---

## Built (August 2026): "What to do in Durrës"

A section linking to travel articles the owners write themselves. **This is
now built** — four English articles, an index at `/<lang>/guide`, a route per
article, and three cards on the homepage. What follows is kept because the
reasoning still governs how it should be extended; `README.md` has the
day-to-day instructions for writing one.

**Still outstanding on it:**

- **Photographs of Durrës.** Every article currently draws its own cover — a
  shoreline at dusk, generated from the slug — because there are no photographs
  of the town, only of the apartment. This is the biggest visual gap on those
  pages. Drop a 3:2 JPEG in `public/photos/`, run `npm run photos`, add
  `cover: <name>` to the frontmatter.
- ~~**Albanian and Italian.**~~ Both editions were removed in August 2026; the
  site is English only and lives at the root. Nothing about the guides is
  language-aware any more — files are `<slug>.md`, not `<slug>.<lang>.md`.
- **A read-through of the four articles.** They were drafted to match the site's
  voice and deliberately carry no opening hours, ticket prices or restaurant
  names — anything that goes stale or could not be verified. Read them for
  anything that is simply wrong about the town.

### Why it exists

Someone searching "what to do in Durrës" has not chosen accommodation yet. The
article is the door; the apartment is behind it. This only works if the
articles live **on this domain** — putting them on Medium or a separate blog
hands the search ranking and the traffic to someone else and forces the reader
to travel back. That was the decision, and it is the whole point of the
feature.

### Shape (as built)

- **Files:** one Markdown file per article, in `content/guides/`, named
  `<slug>.md`. Frontmatter carries `title`, `summary`, `category`, `date` and an
  optional `cover`. `cover` names a photograph in `assets/photos-src/` rather
  than a folder of its own, so it goes through the existing `npm run photos`
  step and image loader unchanged. `npm test` checks that every cover resolves
  to files really on disk at every width.
- **Route:** `app/guide/[slug]/page.tsx`, with `generateStaticParams` over the
  slugs and `dynamicParams = false`, matching the existing page.
- **Homepage section:** three cards, placed **after "Good to know" and before
  the contact section**. Low on the page on purpose — guides compete with
  booking, so they should catch browsers without pulling away anyone already
  ready to message.
- **Each article ends with a WhatsApp CTA** back to the apartment. That is the
  only reason the article exists commercially.

### The language rule that matters

An article appears **only in the languages it has actually been written in**.
*Obsolete since August 2026 — the site is English only.* It is kept here
because the reasoning would apply again if a language is ever added back: an
article appears only in a language it was actually written in, never
machine-translated, and adding a language multiplies the writing rather than
the code.

### Dependencies

Two, both build-time only and both now installed: `gray-matter` for frontmatter
and `marked` for the Markdown. No CMS, no external service.

**Installing anything here needs care.** The globally-installed npm on this
machine is v12 against Node v20 and cannot resolve, so a plain `npm install`
fails with `ERR_REQUIRE_ESM`. Node's own bundled npm works:

```bash
node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" install <pkg>
```

### Reuse rather than rebuild

`copyText` from `lib/dictionary.ts`, `site.localeTag` and `siteUrl()` from
`content/site.ts`, the `data-reveal="fade"` / `data-reveal="mask"` motion
attributes, `.t-h3` for headings, and the section padding convention
`px-5 py-20 md:px-11 md:py-28`. Extend `app/sitemap.ts` to include guide
routes and add `Article` JSON-LD; the social card in
`app/opengraph-image.tsx` is the pattern to copy for article images. Note that
declaring an `openGraph` object in a route replaces the parent one whole,
image included — which is how `/guide` and all four articles shipped with no
`og:image` at all. `scripts/audit/seo.mjs` now fails on that.

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
9. ~~**A change is not done until it works in all three languages.**~~ English
   only since August 2026. What survives of this rule: dates, plurals and
   authored line breaks still go through `Intl` and `site.localeTag` rather than
   being hardcoded, so adding a language back is a content job. Formerly —
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
- **Responsive images.** `unoptimized: true` means no `srcset`, so a phone
  downloads the same 1536px file a desktop does — measured 642 KB on a 375px
  screen for images displayed at 323–375px. The fix without any paid service:
  have `npm run photos` emit several widths (480/768/1200/1536) and add a custom
  Next image loader that maps to them. Biggest remaining win for guests on
  mobile data.
- **The social card weighs 1.8 MB.** `opengraph-image.tsx` composites a PNG from
  the full-size hero JPEG. Within every platform's limit, but heavier than it
  needs to be; the same build-time re-encoding would fix it.
