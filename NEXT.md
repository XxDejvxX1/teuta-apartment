# Next up

Handoff for a fresh session. Read `PRODUCT.md` first (product truth), then
`README.md` (how to run it and maintain the content). This file covers only
what has been **decided but not built**, plus the conventions that are easy to
break without noticing.

---

## Where the site is now

A one-page direct-booking site for Teuta Apartment, Durrës. Next.js 16 (App
Router), Tailwind v4, English only, served from the root. Sections in
order: hero, the apartment, the photographs, availability + rates, reviews,
amenities, getting here, good to know, what to do, contact — each join a woven
band (`components/Seam.tsx`). Redesigned below the hero in September 2026; the
"Meet the host" block was removed at the owner's request.

Working and verified: date selection that writes the dates into a prefilled
WhatsApp message, a hand-maintained booking calendar closed outside April–
October, real prices, five real guest reviews under the Booking.com score. Zero WCAG
contrast failures, no horizontal scroll at any width, full readability with
JavaScript disabled, 58 tests green across four timezones, and `npm run check` (format, lint, types, tests, build, five audits) clean.

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
`content/site.ts`, `<Seam>` between two sections, `.rise` around a headline,
`.t-headline` for headings, and the section padding convention
`px-5 py-24 md:px-11 md:py-32`. Extend `app/sitemap.ts` to include guide
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
   the EU. `content/rates.ts` and `content/reviews.ts` are both built around
   this.
2. **`to` in a booked range is the checkout day and is exclusive.** 10–14
   August occupies four nights, not five. Treating it as inclusive blocks a
   night too many on every booking.
3. **Dates parse at 12:00 UTC, never local midnight.** Midnight lands on the
   previous day for anyone east of UTC, Albania included. `npm run test:tz`
   exists to catch exactly this.
4. **Nothing is hidden by a script.** The headline rises are CSS on a scroll
   timeline, and their resting state is the finished page; the seams stand
   still. The gallery's deck is laid out by CSS from what the server rendered,
   so without its script it still shows the first photograph at the front. A
   browser without scroll timelines, reduced motion and JavaScript off all get
   the page standing still. The original design hid every section until a
   script revealed it and blanked most of the page when the script did not run.
5. **Animate nothing that triggers layout.** Transform and opacity carry the
   motion; colour, and the clip-paths that sew the stay total's frame on and
   open the gallery's current dot, are paint-only. One exception exists — the
   header's padding — and it is bounded with `contain: layout style`. Do not
   add a second casually.
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

- **Larger photo files.** Every current image is ≤1024px and two run
  full-bleed. No code change fixes this. Spec is in `README.md`.
- **Cancellation policy** and the **street address** — both still recorded as
  open in `PRODUCT.md`. Nothing may state them until the owners do.
- **A copy pass on first person.** The site still says "I" in several places
  ("I answer on WhatsApp", "I meet you at the apartment") but there are two
  hosts. Only the host block says "we". The owners said they would do their own
  copy pass; do not switch the rest unasked.
- **The Booking.com review count.** The score is shown (9.7, September 2026,
  `bookingScore` in `content/reviews.ts`) and must be updated when the listing
  moves. The five reviews on the page must never be averaged into a rating.
- **`kitchen.jpg` shows a bed.** Its alt text says it is the kitchen. Either
  the picture or the words under `gallery.photos.kitchen` need to change;
  photo names are not printed on the page until they are all checked.
- **Responsive images.** `unoptimized: true` means no `srcset`, so a phone
  downloads the same 1536px file a desktop does — measured 642 KB on a 375px
  screen for images displayed at 323–375px. The fix without any paid service:
  have `npm run photos` emit several widths (480/768/1200/1536) and add a custom
  Next image loader that maps to them. Biggest remaining win for guests on
  mobile data.
- **The social card weighs 1.8 MB.** `opengraph-image.tsx` composites a PNG from
  the full-size hero JPEG. Within every platform's limit, but heavier than it
  needs to be; the same build-time re-encoding would fix it.
