---
name: Teuta Apartment
description: A beachfront apartment in Durrës, sold on proximity to the water.
colors:
  sea-glass: "#1f6f6a"
  sea-glass-soft: "#7fc7c0"
  sea-foam: "#cfe7e3"
  warm-sand: "#faf8f4"
  sea-mist: "#edf0ee"
  warm-shell: "#eceae5"
  deep-water: "#0d1b22"
  wet-slate: "#12242e"
  harbour: "#183341"
  ink-body: "#1c2b33"
  ink-soft: "#3a4c56"
  ink-mute: "#5c6f79"
  ink-quiet: "#5f747e"
  tideline: "#dde7e5"
  tideline-soft: "#d5e2df"
  taken: "#cfdedb"
  taken-ink: "#46565e"
  pebble: "#a9b8b5"
  on-dark: "#b9c8cf"
  on-dark-strong: "#cddbe1"
  on-ink: "#f3f1ec"
  white: "#ffffff"
  scrim: "#08141c"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(2.75rem, 13.3vw, 6.5rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(1.875rem, 3.2vw, 3.125rem)"
    fontWeight: 400
    lineHeight: 1
  title-lg:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.1
  title:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.1
  subtitle:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.1
  body-xl:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 300
    lineHeight: 1.55
  body-lg:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 300
    lineHeight: 1.65
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: 1.6
  control:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 300
    lineHeight: 1.4
  note:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: 1.55
  caption:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 300
    lineHeight: 1.5
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 300
    letterSpacing: "0.2em"
rounded:
  focus: "3px"
  panel: "16px"
  card: "20px"
  sheet: "34px"
  pill: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter-desktop: "44px"
  section-mobile: "80px"
  section-desktop: "112px"
components:
  button-primary:
    backgroundColor: "{colors.sea-glass}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "16px 28px"
  button-primary-on-dark:
    backgroundColor: "#ffffff"
    textColor: "{colors.deep-water}"
    rounded: "{rounded.pill}"
    padding: "16px 36px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.wet-slate}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-outline-hover:
    backgroundColor: "{colors.wet-slate}"
    textColor: "#ffffff"
  calendar-day-free:
    backgroundColor: "transparent"
    textColor: "{colors.wet-slate}"
    rounded: "{rounded.pill}"
    size: "40px"
  calendar-day-taken:
    backgroundColor: "{colors.taken}"
    textColor: "{colors.taken-ink}"
    rounded: "{rounded.pill}"
    size: "40px"
  calendar-day-selected:
    backgroundColor: "{colors.sea-glass}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    size: "40px"
  deck-card:
    backgroundColor: "{colors.warm-shell}"
    rounded: "{rounded.card}"
  tag-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
---

# Design System: Teuta Apartment

## Overview

**Creative North Star: "The First Line"**

*Rreshti i parë. Prima fila.* The phrase a Durrës local uses for the buildings
that sit directly on the sand, with nothing between them and the Adriatic. It is
the apartment's only real advantage over hundreds of similar flats a road or two
back, and it is what this entire visual system exists to communicate — before a
single word is read.

Everything follows from proximity to water. The page opens full-bleed on the sea
with no chrome competing. The next section rises over that photograph as a
rounded sheet, the way the shoreline meets the beach. The one accent colour is
sea glass, and it is the only saturated thing on the page. Backgrounds are warm
sand and sea mist rather than white, because white is a hotel and this is
somebody's home.

The register is understated and observational throughout. Copy describes what is
there rather than claiming benefits, and the visual system matches: hairlines
instead of boxes, one serif doing all the display work, no gradients used as
decoration, no icon standing in for a photograph. The apartment is the product;
the interface gets out of its way.

**Key Characteristics:**
- Photography is full-bleed and uncropped by ornament; the sea is the hero
- One accent (sea glass) against warm neutrals — no secondary or tertiary hue
- Hairlines group content; cards are used only where something genuinely floats
- Serif display over sans body; a single serif carries every heading
- Flat by default, depth reserved for real elevation
- Every colour pairing clears WCAG AA by construction

## Colors

A shoreline read literally: warm sand underfoot, sea mist in the shallows, one
saturated sea glass, and deep water at either end of the page.

### Primary
- **Sea Glass** (`#1f6f6a`): The only accent in the system. Carries the primary
  WhatsApp action on light surfaces, amenity icons, focus rings, the selected
  range in the calendar, and the host initials. Measured 5.6:1 on Warm Sand, so
  it is safe for body-size text as well as icons.
- **Sea Glass Soft** (`#7fc7c0`): The same accent lifted for dark surfaces —
  eyebrows on the ink section, the map placeholder grid. 8.2:1 on Wet Slate.
- **Sea Foam** (`#cfe7e3`): The palest step. Hover on calendar days, the fill
  between a selected arrival and departure, hover on light buttons over photos.

### Neutral
- **Warm Sand** (`#faf8f4`): The page. Never white — white reads as a booking
  platform, and this is a home.
- **Sea Mist** (`#edf0ee`): The alternate section ground, cooler than sand, used
  to separate What's included and the host section without a rule or a border.
- **Warm Shell** (`#eceae5`): Sits behind an image while it loads. Warmer than
  Sea Mist on purpose so a loading photo does not flash cool.
- **Wet Slate** (`#12242e`): Every heading, and the ground of the Getting here
  section.
- **Deep Water** (`#0d1b22`): The two full-bleed photographic sections, hero and
  close. The darkest value in the system.
- **Harbour** (`#183341`): The caption bar beneath the map. The single mid-dark
  surface.
- **Ink Body** (`#1c2b33`), **Ink Soft** (`#3a4c56`), **Ink Mute** (`#5c6f79`),
  **Ink Quiet** (`#5f747e`): A four-step text ramp, every step at or above
  4.5:1 on Warm Sand. Ink Quiet is the floor at 4.62:1 — nothing quieter exists.
- **Tideline** (`#dde7e5`) and **Tideline Soft** (`#d5e2df`): Hairlines and
  borders, tinted toward the sea glass rather than left neutral grey.
- *(Removed August 2026: **Taken** `#cfdedb` and **Taken Ink** `#46565e`, the
  fill behind a booked night. Booked nights are now struck through in Ink Quiet
  like every other unavailable date, so the pair had no remaining use.)*
- **Pebble** (`#a9b8b5`): The resting state of a small control mark, currently
  the inactive deck dots.
- **White** (`#ffffff`): Text and button fills *on photographs only* — never a
  page or card ground. See The No-White Rule.
- **Scrim** (`#08141c`): Not a surface. This is the ink the hero and closing
  gradients are mixed from, used at varying alpha (0.05–0.9) and never at full
  strength. It is what makes white text legible over a photograph.

### The scrim system

The two photographic sections are readable because of two stacked gradients, not
one flat wash. A vertical pass darkens top and bottom; a 100° horizontal pass
darkens the left, where the words sit, and releases to fully transparent by 66%
so the right of the photograph stays bright. Measured against real image pixels,
the hero's headline holds 9.2–12.4:1 and the scroll cue never drops below
12.9:1, while the picture itself is barely touched on the side with no text.

**The Directional Scrim Rule.** Darken where the text is, not the whole
photograph. A uniform overlay is the lazy version and costs the image.

### Named Rules

**The One Accent Rule.** Sea Glass is the only saturated colour in the system.
There is no secondary and no tertiary hue, and adding one would break the
shoreline logic the palette is built on. If something needs to stand out and
Sea Glass is already spoken for, use weight, size or space instead.

**The No-White Rule.** Warm Sand is the lightest surface. Pure `#ffffff` appears
only as text or a button fill on top of a photograph, never as a page or card
background. White is what a booking platform looks like.

**The Readable Floor Rule.** Every text colour clears 4.5:1 on its own ground,
including disabled and secondary states. The ramp bottoms out at Ink Quiet
(4.62:1); if a value looks too quiet, the answer is a smaller size or more
space, never a lighter colour.

## Typography

**Display Font:** Instrument Serif (with Georgia, serif)
**Body Font:** DM Sans (with system-ui, sans-serif)

**Character:** A high-contrast literary serif against a plain geometric sans.
The serif does all the speaking — every heading on the page, at one size — while
the sans stays deliberately quiet at weight 300. The pairing reads closer to a
printed book than a listing, which is the point.

### Hierarchy

Serif from Subtitle up, sans from Body-lg down. The break between the two faces
is also the break between "this names something" and "this explains something".

- **Display** (serif 400, `clamp(2.75rem, 13.3vw, 6.5rem)`, 1.05): The hero, and
  only the hero. Line breaks are authored, never left to the browser. 1.05 is a
  constraint, not a preference: Instrument Serif needs 0.971em of baseline gap
  before a descender touches the next line's ascender, and the previous 0.95
  collided in all three languages.
- **Headline** (serif 400, `clamp(1.875rem, 3.2vw, 3.125rem)`, 1): Every section
  heading, at one size. The closing "Ask me about your dates" is the single
  exception, set larger to end the page.
- **Title-lg** (serif 400, 30px): Sub-headings that open a block — the rate
  card, the reviews.
- **Title** (serif 400, 26px): The same role at the mobile step, and the
  wordmark.
- **Subtitle** (serif 400, 22px): Calendar month labels.
- **Body-lg** (sans 300, 17px, 1.65): Primary running copy, held to ~44–52ch.
- **Body** (sans 300, 16px, 1.6): Secondary copy and guest quotes.
- **Control** (sans 300, 15px): Buttons, navigation, calendar days, form
  controls. The most-used step in the system by a distance.
- **Note** (sans 300, 14px, 1.55): Captions and supporting notes.
- **Caption** (sans 300, 13px): Fine print, the gallery counter, attributions.
- **Label** (sans 300, 0.75rem, 0.2em, uppercase): Eyebrows and the calendar
  weekday row.

### Known drift

Eleven steps is already more than a system this size needs, and six further
one-off sizes exist outside the scale above — 20px, 24px, 25px, 32px and 34px,
each used exactly once. They are not sanctioned; they are leftovers from porting
the original comp. The rate card's 34px price is the only one with a real
argument for existing.

Treat the eleven documented steps as the scale. Do not add a twelfth to solve a
local problem, and prefer collapsing a one-off into its nearest step when
touching that component anyway.

### Named Rules

**The One Heading Size Rule.** Every peer section heading is the same size.
There were once three sizes across sibling sections with no semantic reason, and
the gallery — the most persuasive section on the page — drew the smallest.
Hierarchy comes from position and space, not from a heading being 6px bigger.

**The Authored Break Rule.** The hero's line breaks live in the dictionary as an
array, not in the browser's wrapping. A phrase that short reads badly when it
breaks wherever the box happens to end, and authored lines let each one rise out
of its own mask.

**The Serif-Only Display Rule.** Instrument Serif carries every heading. DM Sans
never sets a heading, and no third face enters the system.

## Layout

A single centred column with two container widths: 1400px for full-width
sections, 900px where reading matters (the calendar, Good to know). Gutters are
20px on mobile and 44px from 768px up.

Vertical rhythm runs on a 4px grid: sections take 80px of padding on mobile and
112px on desktop, with the two photographic sections instead filling the
viewport. The one breakpoint that matters is 768px — below it every grid
collapses to a single column, the header becomes a sheet, and both decks become
scroll-snap rows.

Density is deliberately uneven, and that is the composition: the hero and the
gallery are generous and photographic, the calendar and Good to know are dense
and functional. Reference material (Getting here) sits beside its map rather
than above it, so logistics never outweigh the apartment.

**The Sheet Rule.** The Apartment section pulls itself up 72px over the hero
with a 34px top radius, so the page begins by rising over the photograph. Any
content in the hero must clear that overlap — 124px on mobile, 152px on desktop.

## Elevation & Depth

Flat by default; depth is an event, not a texture. Surfaces sit directly on
their ground and are separated by colour and hairlines. Four shadows exist, and
each marks something that genuinely floats above the page rather than decorating
a box.

### Shadow Vocabulary
- **Sheet** (`0 -30px 70px rgba(8, 20, 28, 0.28)`): Cast *upward* by the
  Apartment section onto the hero photograph. The only upward shadow.
- **Lift** (`0 24px 60px rgba(12, 36, 46, 0.16)`): A framed photograph resting
  above the page.
- **Float** (`0 28px 70px rgba(0, 0, 0, 0.35)`): The map, on the dark section.
- **Pill** (`0 6px 20px rgba(8, 20, 28, 0.22)`): The header's primary action,
  which sits over a photograph and needs separation from it.

Deck cards carry a shadow that scales with depth in the stack, from
`0 18px 44px` at rest to `0 40px 90px` on the centred card.

**The Earned Shadow Rule.** A shadow means the surface is above the page. Cards,
list rows and calendar cells get none. If a new surface wants one, the question
is whether it actually floats — if not, use a hairline.

## Shapes

Two radii, a pill, and a 3px focus-ring corner. Cards and photographs take 20px;
smaller panels and the rate cells take 16px; anything interactive is fully rounded —
buttons, calendar days, avatars, the deck dots. The one outlier is the 34px top
radius on the Apartment sheet, which is larger on purpose so the page reads as
rising over the hero.

Borders are always 1px and always a tideline colour. There are no heavy rules,
no coloured left-borders, and no dashed or dotted strokes anywhere.

**The Hairline-Over-Box Rule.** Related items are grouped by a 1px rule and
proximity, not by giving each one a container. Six amenities as six identical
cards made every amenity look like a separate product; as a hairline list they
read as one set.

## Components

### Buttons
- **Shape:** Fully rounded (pill) for every action; the header's WhatsApp button
  is the one 10px-radius exception, inherited from the original design.
- **Primary:** Sea Glass fill with white text on light grounds; white fill with
  Deep Water text on photographs. The fill adapts to the surface, the shape,
  glyph and label never do.
- **Hover / Focus:** Colour transition at 420ms on the house easing, plus a 2px
  lift on pointer devices. Focus shows a 2px Sea Glass ring at 3px offset, or
  Sea Foam on dark grounds.
- **Outline:** 1px Tideline border, transparent fill, inverting to Wet Slate on
  hover. Used for month paging and the gallery arrows.

**The One CTA Shape Rule.** Every WhatsApp action is a filled pill with the
WhatsApp glyph and the word "WhatsApp" in its label. There were once three
different treatments and the weakest sat at the point of highest intent.

### Cards / Containers
- **Corner Style:** 20px for photographic cards, 16px for panels.
- **Background:** Warm Sand on Sea Mist grounds; Warm Shell behind loading images.
- **Shadow Strategy:** None at rest. See The Earned Shadow Rule.
- **Border:** 1px Tideline where a card needs an edge without a fill.
- **Internal Padding:** 24–28px.

### Inputs / Fields
- **Style:** Pill, 1px Tideline border, Warm Sand fill. Only one exists — the
  guest count.
- **Focus:** The global 2px Sea Glass ring at 3px offset.

### Navigation
- Sans at 15px, transparent over the hero with a text shadow, becoming an
  85%-opacity Warm Sand bar with a backdrop blur once scrolled past.
- Links carry a 1px underline that wipes in from the left on hover, 420ms.
- Below 768px the nav becomes a translucent full-screen sheet at 70% opacity
  with a 40px backdrop blur, so the photograph stays legible behind it. The
  hamburger becomes a back arrow while open.

### The Deck (signature component)
The gallery and the reviews share one component. Below 768px it is a scroll-snap
row; above, a 3D coverflow where the centred item sits flat and neighbours are
pushed back in Z and turned on Y. Offsets are expressed as a ratio of card width
so the stack never collapses under zoom.

Its two decks differ only in parameters. Photographs turn 26° and dim to 0.72 —
they stay readable in the periphery. **Review cards turn 0° and stay at full
opacity**, because rotated body text is unreadable and dimming Ink Soft to 0.72
lands at 4.05:1, below the readable floor. Depth on the review deck comes from
scale and shadow alone.

### The Calendar (signature component)
40px circular cells on a Monday-first grid. A night is free or it is not.

**The One Unavailable Look Rule.** Every night you cannot have looks the same —
struck through, Ink Quiet, not a button — whether it is booked, out of season or
already past. Booked nights were once a Taken fill instead, which made one grid
read as two systems at once and drew the eye hardest to the dates of least use.
The strike is never the only signal: each cell's screen-reader label carries its
status in words.

Free nights are plain. Today carries a 1px Sea Glass ring; a selected range
fills Sea Foam with Sea Glass at each end.

## Do's and Don'ts

### Do:
- **Do** use Sea Glass (`#1f6f6a`) as the only accent, and reach for weight or
  space when something else needs emphasis.
- **Do** group related items with a 1px Tideline rule and proximity.
- **Do** keep every peer section heading at the same size.
- **Do** author hero line breaks in the dictionary rather than letting the
  browser wrap them.
- **Do** clear 4.5:1 for text and 24×24 for any target, in every state.
- **Do** let photographs run full-bleed and uncropped by ornament.
- **Do** animate `transform` and `opacity`; when a layout property is genuinely
  the design, bound it with `contain: layout style` and say why.

### Don't:
- **Don't** use `#ffffff` as a page or card background.
- **Don't** add a second accent hue, a third typeface, or a gradient used as
  decoration.
- **Don't** put six same-size icon-heading-text cards on the page as structure.
- **Don't** give a resting surface a shadow, or a non-interactive element a
  hover lift.
- **Don't** number a set of items unless the sequence carries information —
  Getting here lists three alternatives, not three steps.
- **Don't** dim body text below the readable floor to create depth; use scale
  and shadow.
- **Don't** print a photograph's name over the photograph.
