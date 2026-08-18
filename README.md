# Teuta Apartment

Direct-booking site for a beachfront apartment in Durrës, Albania. Next.js 16
(App Router), Tailwind v4, English, with a hand-maintained availability
calendar that prices a stay and hands the dates to WhatsApp.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

> **Note on `npm install`.** The globally-installed npm on the current machine
> is v12 against Node v20 and cannot resolve, so a plain `npm install` fails
> with `ERR_REQUIRE_ESM`. Node's own bundled npm works:
> `node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" install`.
> Every other script (`npm run dev`, `build`, `test`) is unaffected.

| Command | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm test` | unit tests (booking dates, calendar maths) |
| `npm run test:tz` | the same tests under four timezones — see below |
| `npm run placeholders` | regenerate stand-in photos (only needed if a real photo goes missing) |

---

## Before this goes live

Four things need real values. Each is marked `TODO` in the code.

### 1. Photos — swapping in better ones

Every current photo is **1024px wide or less**, and two of them run full-bleed
across the whole screen. At 1024px those look soft on any desktop monitor and on
every modern phone, which render at 2–3× pixel density. This is the single
biggest quality problem left on the site, and only bigger files fix it.

**To replace one:** save it as a JPEG with the exact filename below, drop it in
`public/photos/` over the old one, and restart `npm run dev`. Nothing else to
change — Next reads the new dimensions, generates the AVIF/WebP versions, builds
the `srcset` and makes the blur-up placeholder automatically.

| File | Where it appears | Ratio | Minimum | Aim for |
|---|---|---|---|---|
| `hero-window.jpg` | Hero (full screen) + social preview | 3:2 landscape | 2400 × 1600 | **3000 × 2000** |
| `beach.jpg` | Closing section (full screen) + gallery | 3:2 landscape | 2400 × 1600 | **3000 × 2000** |
| `balcony.jpg` | "The apartment" + gallery | 3:2 landscape | 1600 × 1067 | **2400 × 1600** |
| `bedroom.jpg` | Gallery | 3:2 landscape | 1400 × 933 | **2400 × 1600** |
| `kitchen.jpg` | Gallery | 3:2 landscape | 1400 × 933 | **2400 × 1600** |
| `living-room.jpg` | Gallery | 3:2 landscape | 1400 × 933 | **2400 × 1600** |
| `host.jpg` | Portrait of you both — not added yet | 1:1 square | 600 × 600 | **800 × 800** |

**Ratio matters more than resolution.** Everything except the host photo is
cropped to **3:2 landscape**. Shoot landscape, not portrait — `living-room.jpg`
is currently the one portrait shot and loses its top and bottom.

**The two full-screen photos are a special case.** The hero is cropped to
whatever shape the visitor's screen is: very wide on a laptop, very tall and
narrow on a phone. Keep the subject near the middle and leave slack around all
four edges, or phones will cut the sides off. Its focal point sits fractionally
above centre.

**Exporting:** JPEG, quality around 90, sRGB colour. Do not compress hard or
resize down first — Next re-encodes anyway, so a big clean original gives the
best result. Files up to about 8 MB are fine. Bake in any rotation rather than
relying on EXIF.

**For the host photo**, also set `photoSrc: "/photos/host.jpg"` in
`content/host.ts`. Until then the block shows your initials.

#### Adding a photo, rather than replacing one

Replacing is one step. *Adding* a seventh photo to the gallery is five, across
five files. Say the new one is `terrace.jpg`:

1. Put the file in `public/photos/` — 3:2, 2400 × 1600.
2. In `content/photos.ts`, add
   `import terrace from "@/public/photos/terrace.jpg"`.
3. Add `"terrace"` to the `PhotoKey` list just above it.
4. Add `{ key: "terrace", image: terrace }` to `galleryPhotos`. Its position in
   that array is its position in the gallery.
5. Add a `"terrace"` entry with `title` and `alt` under `gallery.photos` in
   `content/copy.json`.

**Step 5 fails silently.** Miss it and the photo still appears, but with no alt
text and no label — no error, no warning, just an invisible hole for screen
readers and for Google.

There is no limit in the code, and extra photos cost nothing at load: only
three are ever downloaded, however many exist, because the deck skips the ones
parked behind the stack. The practical ceiling is about ten to twelve — past
that the row of dots gets too wide for a phone, and thumbnails or a plain grid
would serve better.

**Alt text** lives under `gallery.photos.<key>.alt` in `content/copy.json`.
Update it to describe the new picture — it is what
Google reads and what a screen reader announces. The photo names there are no
longer printed on the images; they are only used as labels for assistive
technology.

### 2. The booked dates

Edit `content/availability.ts`. One line per booking:

```ts
{ from: "2026-08-10", to: "2026-08-14" },
```

`to` is the **checkout day and is not itself booked** — the guest leaves that
morning, so someone else can arrive the same afternoon. These are the same two
dates shown on a Booking.com reservation, so you can copy them straight across
without doing any arithmetic.

The file currently holds four example rows. Delete them.

A typo can't break the page: reversed, empty and impossible dates
(`2026-02-31`) are skipped rather than throwing.

### 3. Street address

Coordinates are set from the map link you sent (41.313574, 19.475329) and drive
the map and the structured data Google reads. The street address in
`content/site.ts` is still a placeholder — fill it in for the JSON-LD.

### 4. A photograph of the host

`public/photos/host.jpg` is 400×400, which is the smallest file on the site and
the reason the portrait in **Meet the host** is capped at 208px — anything wider
is upscaled. A 1:1 crop at 800×800 would let that block breathe properly.

Worth saying plainly: the current shot is you at a desk with a laptop. It reads
as work, not as the person who meets guests at the door and hands over the keys,
which is what that section is arguing. A daylight portrait — ideally near the
building or the water — would do more for that block than any amount of layout.

---

## Writing a guide

The articles behind **What to do** (`/guide`). They exist to catch someone
searching "what to do in Durrës" who has not chosen where to stay yet, so they
live on this domain rather than on a blog somewhere else.

### Adding one

Create `content/guides/<slug>.<lang>.md`. The slug is the URL, so keep it short
and in words, not dates:

```markdown
---
title: The amphitheatre in the middle of town
summary: One sentence. It is the card blurb, the meta description and the social preview.
category: history
date: 2026-06-14
cover: amphitheatre
---

Body copy starts here. Use `##` for headings — the article's own title is the
only `#` and it comes from the frontmatter.
```

That is the whole job. The route, the homepage card, the sitemap entry, the
reading time and the JSON-LD all follow from the file.

| Field | |
|---|---|
| `title` | Required. Shown over the cover. |
| `summary` | Required. One sentence, used in three places — write it as a sentence, not a fragment. |
| `category` | Required, and must be one of `history`, `sea`, `food`, `trips`. Anything else **fails the build** rather than quietly inventing a fifth filter chip. |
| `date` | Required, `yyyy-mm-dd`. Newest article becomes the featured one at the top of the index. |
| `cover` | Optional. See below. |

Reading time is counted from the text, never written by hand, so it cannot drift
away from the article.

### Covers

`cover` names a photograph in `public/photos/` **without its extension** —
`cover: amphitheatre` means `public/photos/amphitheatre.jpg`. Same folder, same
3:2 crop and same `npm run photos` step as every other picture on the site:

1. Save the JPEG as `public/photos/amphitheatre.jpg`, 2400 × 1600.
2. Run `npm run photos`.
3. Add `cover: amphitheatre` to the frontmatter.

**Leave `cover` out and the page draws one instead** — a shoreline at dusk, with
a horizon, a low sun and contour lines, generated from the slug so it is the
same every build. It is deliberately a drawing rather than a grey placeholder
box, so a page can be judged before its artwork exists. **No article uses it
today** — all four have their own postcard — so it is now purely the fallback for
the next article you write before you have made its cover.

**Name the file after the slug.** `day-trips.jpg` for `day-trips.md`. Lowercase,
hyphens, no spaces — the image loader keys on the filename, and a space has to
be URL-encoded everywhere it appears. The three covers added in August 2026
arrived as `FourDays.jpg`, `EatingInDurres.jpg` and `The beach.jpg` and were
renamed on the way in.

Titles sit *on* the cover in white. The scrim underneath is measured against
warm sand, the brightest ground the site has, where the title holds 7.7:1 and
the eyebrow 5.1:1. Anything darker than sand — which is every photograph and
every one of the postcards — can only improve on that.

**Two things to know if you keep using illustrated postcards.** They carry their
own headline text, and the article title is set over the lower third of the
card, so keep the artwork's lettering in the upper half or the two collide. And
the article's own page runs its cover full-bleed at roughly 2.5:1, which crops a
1.4:1 postcard to about the middle 57% — on `day-trips` that clips the top of
the word ADVENTURE. It reads as a deliberate close-up rather than a mistake, but
if you want the whole card visible there, say so and the hero can become a
contained panel instead of full-bleed.


### Where it appears

Three cards on the homepage, between **Good to know** and the closing section.
Low on the page on purpose: articles compete with booking, so they should catch
someone still browsing without pulling away anyone already reading dates.

Every article ends with a WhatsApp CTA back to the apartment. That is the only
commercial reason the articles exist — someone arriving from a search result
knows nothing about the apartment yet.

---

## Hosting

**Cloudflare Workers: a static export plus a very small Worker.**

`next build` writes plain HTML to `out/` (`output: "export"`). Cloudflare serves
that directly, including `/` itself.

`worker/index.ts` exists for one reason: the site used to live under `/en` and
moved to the root in August 2026 when Albanian and Italian were dropped. It 301s
`/en` to `/` and `/en/guide/day-trips` to `/guide/day-trips`, so nothing already
indexed breaks. `run_worker_first` in `wrangler.jsonc` narrows it to `/en/*`, so
every other request is a static asset — faster, and not billed as a Worker
request. `worker/index.test.ts` covers the redirect, including that it does not
swallow paths like `/energy`. Once search engines have followed the redirects,
the file can be deleted outright.

```
npm run build        write the static export to out/
npm run cf:preview   build, then serve it locally exactly as Cloudflare will
npm run cf:deploy    build, then deploy
```

Cloudflare's build settings must match: **build command `npm run build`**, deploy
command `npx wrangler deploy`.

**Security headers live in `public/_headers`, not `next.config.ts`.** `headers()`
needs a server and there isn't one; Cloudflare applies `_headers` to every static
response instead. `next.config.ts` keeps a looser copy of the CSP for `next dev`
only — change one, change both. `_headers` also sets `Content-Type: image/png` on
`/*/opengraph-image`, which Next exports without a file extension and Cloudflare
would otherwise serve as `application/octet-stream`, quietly breaking every
social preview.

Set `NEXT_PUBLIC_SITE_URL` to the real origin in the build environment. Canonical
URLs, the sitemap and the social preview all derive from it, and
a production build **fails** rather than quietly emitting `localhost`.

No bindings beyond the assets — no R2, KV, Images or D1 — because nothing here
needs one and each is billable. The only metered dimension is Worker requests on
`/`.

`@opennextjs/cloudflare` was tried first and does not work: its build completes
but copies none of the prerendered HTML into the bundle, so every locale route
404s. Reproduced on Windows and on Cloudflare's own Linux builders. Don't reach
for it again without checking that upstream.

---

## How it is put together

```
app/[lang]/          the page, per-locale metadata, JSON-LD, social card
app/[lang]/guide/    the What to do index and one route per article
components/          one file per section
content/             all copy, the bookings, the photo manifest, site.ts
content/guides/      the articles, as <slug>.<lang>.md
lib/                 availability maths, locale matching, guide loading
worker/index.ts      the only per-request code: language choice on `/`
public/_headers      production response headers
wrangler.jsonc       Cloudflare Worker config
```

To change wording, edit `content/copy.json` — you should not need to
touch a component. The hero's line breaks are authored there too, as
`hero.titleLines`, because a phrase that short reads badly when it is left to
wrap wherever the box happens to end.

### The calendar's one sharp edge

`to` is **exclusive**. A booking of 10–14 August occupies the nights of the
10th, 11th, 12th and 13th; the guest leaves on the morning of the 14th, so the
14th is free to arrive on. Treating it as inclusive blocks one night too many on
every booking and turns away guests on exactly the changeover days that are
easiest to fill.

The related trap is parsing `2026-08-10` as local midnight, which lands on the
9th for anyone east of UTC — Albania included. Dates are anchored at 12:00 UTC
instead. `npm run test:tz` runs the whole suite under UTC, Europe/Tirane, UTC+14
and UTC−11 to keep both properties honest.

### Motion

Scroll reveals are hidden by JavaScript at runtime, never by the stylesheet, and
only for elements that are off-screen at the time. So with JS disabled or
broken, nothing is hidden and the page simply reads as a complete document. The
hero entrance and the parallax are pure CSS; the parallax uses a scroll-driven
animation and is skipped entirely on browsers that don't support one.
Everything respects `prefers-reduced-motion`.

There are three reveal variants. `fade` is deliberately slight — 14px, no
scale — because it carries whole prose sections, and a dozen of them arriving
with the same big lift reads as one repeated effect rather than a composition.
`mask` is for display headings, which rise out from behind a clip. `rise` is the
newest and is for **grids of cards only** — the guide cards and the three rate
bands — where a longer lift and a touch of scale make them land as objects
rather than fade up as text. Do not reach for `rise` on a paragraph.

The header is a floating frosted pill rather than a bar welded to the top edge.
It is a pill in both states, so only its colours cross-fade on scroll — no
width, radius or position animates.

The category filter on the guide index uses no JavaScript at all: a radio group
and `:has()`. With the bundle disabled, or on a browser without `:has()`, every
article stays on the page, which is the right thing for a filter to degrade to.

---

## Not built (deliberately)

Still genuinely not built — each is additive:

- **Reading the dates from Booking.com automatically.** Booking.com publishes an
  iCal export (Calendar → Sync calendars). Wiring it up would remove the manual
  step in `content/availability.ts` entirely, at the cost of a server-side fetch
  and keeping that URL secret.
- **A book-direct pitch.** The commercial reason to own a direct site, and still
  missing. Booking.com's terms include narrow rate-parity clauses, so the offer
  has to be a perk — free airport transfer, late checkout — rather than a lower
  nightly rate. Nothing on the page currently gives a reason to book here rather
  than on the platform.

Four things that used to be on this list have since been built, and are noted
here because the list read as current for a while after they were not:

- **Date-prefilled WhatsApp enquiry.** Built. Picking a range writes the dates,
  the night count and the guest count into the message.
- **Prices.** Built. The rate card carries the three bands, and the calendar
  shows the total for the selected stay, summed night by night across bands.
- **Guest reviews.** Built. Three real ones, verbatim, in `content/reviews.ts`.
- **"What to do in Durrës".** Built, August 2026. See *Writing a guide* above.
