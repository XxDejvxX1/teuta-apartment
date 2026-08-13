# Teuta Apartment

Direct-booking site for a beachfront apartment in Durrës, Albania. Next.js 16
(App Router), Tailwind v4, English / Albanian / Italian, with a live
availability calendar read from the Booking.com iCal export.

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it redirects to `/en`, `/sq` or `/it` based on
the browser's `Accept-Language`.

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
   **all three** files in `content/dictionaries/`.

**Step 5 fails silently.** Miss a language and the photo still appears there,
but with no alt text and no label — no error, no warning, just an invisible
hole for screen readers and for Google. If you add a photo, check all three.

There is no limit in the code, and extra photos cost nothing at load: only
three are ever downloaded, however many exist, because the deck skips the ones
parked behind the stack. The practical ceiling is about ten to twelve — past
that the row of dots gets too wide for a phone, and thumbnails or a plain grid
would serve better.

**Alt text** lives under `gallery.photos.<key>.alt` in each file in
`content/dictionaries/`. Update it to describe the new picture — it is what
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

### 4. The Albanian and Italian copy

`content/dictionaries/sq.json` and `it.json` are a first draft written to match
the English tone, not a professional translation. Read them through and fix
anything that sounds off — particularly `apartment.tags`, where the phrasing for
"sofa bed" is awkward in Albanian.

---

## Hosting

**Cloudflare Workers, via `@opennextjs/cloudflare`.** Configured in
`wrangler.jsonc` and `open-next.config.ts`.

```
npm run cf:build     bundle the Worker into .open-next/
npm run cf:preview   build, then run it locally in workerd
npm run cf:deploy    build, then deploy
```

Everything but `/` is prerendered. `/` is server-rendered because it reads
`Accept-Language` to choose a language — that is why a purely static export will
not do.

Set `NEXT_PUBLIC_SITE_URL` to the real origin in the build environment. Canonical
URLs, `hreflang` tags, the sitemap and the social preview all derive from it, and
a production build now **fails** rather than quietly emitting `localhost`.

Two deliberate omissions in `wrangler.jsonc`, both paid Cloudflare products this
site does not need: the R2 incremental cache (nothing revalidates) and the Images
binding (photographs are re-encoded to WebP at build time by `npm run photos`).

**Known problem: the adapter's build does not work on Windows.** It completes,
but copies none of the prerendered HTML into the bundle, so every locale route
404s under `cf:preview`. OpenNext says as much itself and recommends WSL.
Cloudflare builds on Linux, so this may not affect a real deployment — confirm
with a Cloudflare preview deployment before pointing a domain at it.

---

## How it is put together

```
app/[lang]/          the page, per-locale metadata, JSON-LD, social card
components/          one file per section
content/             all copy, the bookings, the photo manifest, site.ts
lib/                 availability maths, locale matching
app/page.tsx         locale detection and redirect for `/`
wrangler.jsonc       Cloudflare Worker config
open-next.config.ts  adapter config
```

To change wording, edit `content/dictionaries/*.json` — you should not need to
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

---

## Not built (deliberately)

Discussed and left out of this pass — each is additive:

- **Date-prefilled WhatsApp enquiry.** Pick dates on the calendar, get a message
  pre-written with the dates and guest count.
- **Reading the dates from Booking.com automatically.** Booking.com publishes an
  iCal export (Calendar → Sync calendars). Wiring it up would remove the manual
  step in `content/availability.ts` entirely, at the cost of a server-side fetch
  and keeping that URL secret.
- **Prices.** There is currently no price anywhere on the site, so most visitors
  will go back to Booking.com to find one.
- **Guest reviews and a book-direct pitch.** The commercial reason to own a
  direct site. Note that Booking.com's terms include narrow rate-parity clauses,
  so owners usually advertise a perk — free airport transfer, late checkout —
  rather than undercutting the listed rate.
