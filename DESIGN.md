---
name: Teuta Apartment
description: A first-line apartment in Durrës. The photograph opens it; below the photograph the page is one length of woven cloth.
colors:
  madder: "#a3302a"
  madder-deep: "#862520"
  madder-bright: "#d4705f"
  linen: "#f4efe5"
  oat: "#eae3d5"
  flax: "#dcd3c2"
  keyline: "#c5baa6"
  ink: "#2d3942"
  ink-soft: "#4c5862"
  ink-mute: "#5a6570"
  night: "#1b262e"
  night-line: "#3a464f"
  deep: "#0d1b22"
  on-night: "#e9e2d4"
  on-night-soft: "#b7b9b2"
  white: "#ffffff"
  scrim: "#08141c"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(2.75rem, 13.3vw, 6.5rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(2.25rem, 4.4vw, 3.875rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0.01em"
  stitch-xl:
    fontFamily: "Handjet, ui-monospace, monospace"
    fontSize: "clamp(4rem, 9vw, 7rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "'ELSH' 13, 'ELGR' 1.45"
  stitch-lg:
    fontFamily: "Handjet, ui-monospace, monospace"
    fontSize: "clamp(2.5rem, 4.4vw, 3.375rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "'ELSH' 13, 'ELGR' 1.45"
  title-lg:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.1
  title:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.1
  subtitle:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 500
    lineHeight: 1.3
  body-xl:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.7
  body-lg:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  control:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
  note:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
  caption:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Handjet, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.14em"
    fontVariation: "'ELSH' 2, 'ELGR' 1"
rounded:
  square: "0px"
  focus: "2px"
  control: "3px"
  deck: "20px"
  pill: "9999px"
spacing:
  stitch-mobile: "2px"
  stitch-desktop: "3px"
  gutter-mobile: "20px"
  gutter-desktop: "44px"
  section-mobile: "96px"
  section-desktop: "128px"
components:
  button-thread:
    backgroundColor: "{colors.madder}"
    textColor: "{colors.linen}"
    rounded: "{rounded.control}"
    padding: "16px 28px"
  button-thread-hover:
    backgroundColor: "{colors.madder-deep}"
    textColor: "{colors.linen}"
  button-linen:
    backgroundColor: "{colors.linen}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "16px 36px"
  button-linen-hover:
    backgroundColor: "{colors.flax}"
    textColor: "{colors.ink}"
  button-keyline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "44px"
  button-keyline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.linen}"
  plate:
    backgroundColor: "{colors.linen}"
    rounded: "{rounded.square}"
    padding: "28px"
  calendar-day-free:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.square}"
    height: "44px"
  calendar-day-chosen:
    backgroundColor: "{colors.madder}"
    textColor: "{colors.linen}"
    rounded: "{rounded.square}"
    height: "44px"
  calendar-day-between:
    backgroundColor: "{colors.flax}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    height: "44px"
  seam-dark:
    backgroundColor: "{colors.ink}"
    height: "45px"
  seam-light:
    backgroundColor: "{colors.flax}"
    height: "45px"
---

# Design System: Teuta Apartment

## Overview

**Creative North Star: "One Length of Cloth"**

The page opens on a photograph: the sea through the apartment's own window,
full-bleed, a serif line over it. That first screen belongs to the place and was
kept exactly as the owner wanted it. Everything below it is cloth. Oatmeal
linen for the ground, slate for the thread, one madder red, and a small set of
stepped motifs (teeth, lozenges, stars, water chevrons) of the kind stitched and
woven into Albanian textiles for generations. The photographs are mounted into
that cloth; they are never framed by it.

The system's one idea is where the sections meet. No section ends at a straight
edge. Every join is a woven band: the field above bites down into it as a row of
stepped teeth, the field below bites up, and a row of motifs runs between. The
bands stand still, and they are the reason the page reads as one piece rather
than a stack of blocks.

The register stays the owner's: understated, first person, descriptive. The
ornament lives at the seams, in the corner marks of a plate and in the stitched
numbers. It never climbs into the reading: paragraphs are plain text on plain
ground, and the headlines are sentences in a quiet serif.

**Key Characteristics:**
- The hero photograph and its serif headline open every visit; the cloth starts at the hem.
- Every join between sections is a woven band. There are no straight section edges.
- One accent, madder. Everything else is a ground (linen, oat, flax, night, deep) or a thread (ink, keyline).
- Three faces with one job each: serif for sentences, stitched face for counts and labels, sans for reading.
- Square corners on plates and photographs; 3px on controls; the header pill and the gallery's deck are the round shapes.
- Flat. Depth comes from the grounds and the keylines, never from shadows at rest.

## Colors

A length of undyed linen with slate thread and one madder dye. The two dark
grounds come from the hero photograph's own deep water, so the photograph and
the cloth read as one page.

### Primary
- **Madder** (#a3302a): The only accent, and the red of a dye rather than an alarm. Every WhatsApp action on a light ground, the chosen arrival and departure in the calendar, the stay total, the thread in each band, the corner marks on a plate, today's mark in the calendar, the crosses beside the apartment's four facts. 5.5:1 on oat, and linen on madder is 6.1:1.
- **Madder Deep** (#862520): Hover and pressed state of madder actions. Nothing else.
- **Madder Bright** (#d4705f): The same thread on the dark grounds: the bands' motif centres, the corner marks on the featured guide, the cross on the stitched map, the 404 numerals. 4.6:1 on night, so it holds for large text as well as ornament.

### Neutral
- **Linen** (#f4efe5): The lightest ground. Plates (the calendar summary, the review cards), the header pill once solid, the linen button. Never white.
- **Oat** (#eae3d5): The page. Most sections stand on it.
- **Flax** (#dcd3c2): The alternate field (reviews, the guides on the homepage), the ground of a light band, the nights between a chosen arrival and departure, the hover state of a linen button.
- **Keyline** (#c5baa6): Hairlines, frames, mounts, running-stitch rules. Decorative only; never carries text.
- **Ink** (#2d3942): Every heading and all primary text on light grounds, and the ground of a dark band. Slate rather than black: 9.2:1 on oat, 10.2:1 on linen.
- **Ink Soft** (#4c5862): Running copy and secondary text. 5.7:1 on oat, 4.9:1 on flax.
- **Ink Mute** (#5a6570): Captions, labels, the calendar's weekday row and struck nights, the borders of keyline controls. 4.6:1 on oat and 5.1:1 on linen, but only 4.0:1 on flax, so it never sits directly on flax.
- **Night** (#1b262e): The two dark fields: the photographs and Getting here. Also the 404 page and the lightbox.
- **Night Line** (#3a464f): Hairlines and mounts on night.
- **Deep** (#0d1b22): Under the two full-bleed photographs, the hero and the close, and the stitched map's panel.
- **On Night** (#e9e2d4) and **On Night Soft** (#b7b9b2): Text on the dark grounds, 12.2:1 and 7.8:1 on night.
- **White** (#ffffff): Text over a photograph and the header's WhatsApp button while it sits over the hero. Nowhere else.
- **Scrim** (#08141c): Not a surface. The ink the photographic scrims are mixed from, always at partial alpha.

### Named Rules

**The Madder Rule.** Madder is the only saturated colour on the page. If a second thing needs emphasis, use size, weight or a keyline; never a second hue.

**The Readable Floor Rule.** Every text colour clears 4.5:1 on the ground it actually sits on, including captions and disabled states. Ink Mute is the floor on oat and linen and is not allowed on flax.

**The Directional Scrim Rule.** Over a photograph, darken where the words are and leave the rest of the picture alone: a vertical pass plus a 100° pass that releases before the far edge. Used by the hero, the featured guide and every article header.

## Typography

**Display Font:** Instrument Serif (with Georgia, serif)
**Body Font:** Sofia Sans (with system-ui, sans-serif)
**Label/Numeral Font:** Handjet (variable; element shape and grid axes loaded)

**Character:** A quiet literary serif for what the host says, a warm humanist sans for everything read at length, and Handjet, a face built from separate elements on a grid, as the stitched lettering. Opened into crosses it is cross-stitch; closed up it reads as small woven capitals.

### Hierarchy
- **Display** (400, clamp(2.75rem, 13.3vw, 6.5rem), 1.05): The hero headline and the closing "Ask me about your dates". The two photographs speak in it; nothing else does. Line breaks are authored in `content/copy.json`. 1.05 is a constraint: Instrument Serif needs 0.971em of baseline gap before a descender touches the ascender below. Tracking is 0.02em because at zero the owner found the letters crowded.
- **Headline** (400, clamp(2.25rem, 4.4vw, 3.875rem), 1.02): Every section heading, at one size, and the guide index's h1. Sentences, balanced.
- **Stitch XL / Stitch LG** (500, clamp(4rem, 9vw, 7rem) / clamp(2.5rem, 4.4vw, 3.375rem), 1): Cross-stitched numbers: the 9.7 in the reviews heading, the four prices, the stay total, the 404. Element shape 13 (a cross), grid 1.45.
- **Title LG / Title** (400, 32px / 26px, 1.1): Month names, the rate card's heading, review headlines, guide card titles, the Good to know terms, prose h2 and h3.
- **Subtitle** (Sofia Sans 500, 21px): The three ways of getting here.
- **Body XL / LG / Body** (400, 19 / 17 / 16px, 1.65–1.7): Running copy, held to 44–58ch. Guide prose runs at 17px, 1.75, in a 680px column.
- **Control / Note / Caption** (400, 15 / 14 / 13px): Buttons and links, supporting notes, fine print.
- **Label** (Handjet 500, 13px, 0.14em, uppercase, closed grid): Stitched small capitals: the calendar's weekday row, the arrival and departure labels, "per night", the guide meta line, the footer, and the apartment's four facts (at larger steps, in a ruled plate). The class sets no size, so it is always paired with a step.

### The scale is enforced

Fourteen steps, defined as `@theme` tokens in `app/globals.css`: the twelve the
site had before the redesign, retuned, plus the two cross-stitch numeral steps.
`scripts/audit/design.mjs` rejects `text-[` and inline `fontSize` anywhere in
`components/` or `app/`, so a size set by hand fails `npm run check`. The one
exemption is `app/opengraph-image.tsx`, which is Satori and has no stylesheet.

The step named `body` here is `--text-body-md` in CSS, because Tailwind v4 shares
the `text-*` namespace between sizes and colours. Only sizes are declared;
leading stays explicit at the call site.

Custom classes in `globals.css` are unlayered and so beat Tailwind's layered
utilities. That is why `.label` and `.stitch` carry no font size: a size set
there could never be overridden where they are used.

### Named Rules

**The Three Voices Rule.** The serif sets sentences, the stitched face sets counts and labels, the sans sets everything read at length. A paragraph is never stitched, and a date is never serif.

**The Legible Zero Rule.** Handjet draws every zero with a bar through it. At display sizes that reads as a slashed zero; at text sizes 20 and 28 become too close to call. Dates, scores and any number below the stitch-lg step are set in Sofia Sans with tabular figures.

**The Authored Break Rule.** The hero's line breaks live in `content/copy.json` as an array. A phrase that short reads badly when the browser decides where it wraps.

**The Unbroken Phrase Rule.** A heading never ends a line on "to", "and", "your" or a bare number: "Good to / know" and "2 / sofa beds" were both on the page. Every heading balances its lines (`.t-headline` and `.t-display` both set `text-wrap: balance`), and every heading is rendered through `keepTogether()` in `lib/typography.ts`, which binds each short word to the word after it with a no-break space. Article headings get the same treatment when their Markdown is rendered. Headings carry no narrow `ch` caps that force a break the line length does not need.

## Layout

A single column with a 1400px container for full-width sections and narrower
measures where reading matters: 980px for the calendar, 680px for its summary
plate and for article prose. Gutters are 20px on a phone and 44px from 768px.
Sections take 96px of vertical padding on a phone and 128px from 768px, and
headings sit closer to what they introduce than to the seam above them.

The breakpoint that matters is 768px: grids open, the photographs go from a
swipe row to a coverflow, the reviews go from a swipe row to columns, and the
calendar shows two months. The navigation holds its burger until 1024px,
where the bar has room for the wordmark, four links and the WhatsApp button.

Section grounds alternate so that every seam is also a change of fabric. On the
homepage, in order: photograph, oat, night, oat, flax, oat, night, oat, flax,
photograph. Several sections set their heading in a narrow left column beside
the content (What's included, Good to know); the calendar, the rate card and the
reviews run full-width under theirs.

**The Seam Rule.** No two sections meet at a straight edge. Every join is a band
from `components/Seam.tsx`, whose top teeth take the colour of the field above
and whose bottom teeth take the field below. Dark bands (ink ground) mark the
turns into and out of the dark fields and the photographs; light bands (flax
ground, running stitch or star) sit between two light sections, so a run of
seams never becomes a row of black stripes. A photograph is a ground of its own,
`photo`: where a band meets one (the hero, an article's cover, the closing
section) the picture shows between the band's teeth, and the band rides four
stitches over its edge. Never name the `deep` under a photograph instead; the
teeth would come out near-black against a picture that is not.

**The Hem Rule.** The Apartment section still pulls up 72px over the hero, as the
rounded sheet it replaced did, so nothing in the hero's own composition moves.
Anything placed in the hero must clear that edge: 124px on a phone, 152px on
a desktop.

## Elevation & Depth

Flat. The page is cloth, and cloth does not float. Depth comes from the order of
the grounds (linen over oat over flax, night under all of them) and from
keylines, mounts and corner marks. Only two things cast a shadow, because only
two things actually hover over the page.

### Shadow Vocabulary
- **Pill** (`box-shadow: 0 6px 20px rgba(8, 20, 28, 0.22)`): The header's white WhatsApp button while it sits over the hero photograph.
- **Bar** (`box-shadow: 0 10px 30px rgba(8, 20, 28, 0.3)`): The phone's sticky WhatsApp bar, which rides over whatever section is under it.

### Named Rules

**The Flat Cloth Rule.** Plates, cards, photographs and calendar cells have no shadow. If a new surface seems to need one, it needs a keyline or a different ground instead.

## Shapes

Square by default. Plates, photographs, calendar cells, the seams and the
stitched map are square-cornered, because woven and stitched things are built
on a grid. Controls (buttons, the guest select, keyline buttons) take a 3px
radius, just enough to read as something to press. The focus ring has a 2px
corner. The header pill is fully round, inherited from the hero.

The gallery is the one exception. Its deck keeps the 20px corners, round arrow
buttons and pill dots it had before the woven redesign, because the owner asked
for that gallery back as it was. Its photographs are not mounted.

Lines are either a 1px keyline or a running stitch: a dash pattern of 55% thread
to 45% gap. The running stitch appears under captions, between list rows, as
link underlines, as the sewn edge 4px inside every button, and as the frame
round the stay total.

**The Mount Rule.** A photograph is mounted, never boxed: a 1px keyline set 6px
off the picture (an outline, so it costs no layout), keyline on light grounds and
night line on dark ones. The gallery's deck is the exception above.

## Components

### Buttons
- **Shape:** Squared woven labels (3px), with a running stitch sewn 4px inside the edge.
- **Thread (primary on light grounds):** Madder, linen lettering, the WhatsApp glyph and the word "WhatsApp" in the label. Every WhatsApp action on oat, linen or flax, and the phone's sticky bar.
- **Linen (primary on dark grounds and photographs):** Linen, ink lettering; the WhatsApp glyph in madder when it is a WhatsApp action. The closing section, the map's "Show map", the featured guide's "Read article", the 404's way home.
- **Keyline (secondary):** 44px squares with a 1px ink-mute border for month paging and the lightbox; they fill with ink (or on-night on dark grounds) on hover.
- **Deck arrows:** 48px circles with a night-line ring, under the gallery only; they fill with on-night on hover, on pointer devices only, so a tap on a phone does not leave one filled.
- **Hover / Focus:** Colour only, over 320ms on the house curve (`cubic-bezier(0.22, 0.9, 0.24, 1)`), plus a 1px press. Focus is a 2px madder ring at 3px offset, on-night on dark grounds.
- **The header's WhatsApp button** over the hero stays white with a 10px radius and the Pill shadow, as it was; once the header is solid it becomes a thread button.

### Links
Ink or on-night text with a running-stitch underline that closes into a solid thread, and turns madder, on hover. An arrow beside a link nudges 3px toward where it points.

### Plates
- **Corner Style:** Square.
- **Background:** Linen on oat or flax, with a 1px keyline.
- **Corner marks:** Madder L-marks at the four corners on the one plate that matters most, the calendar summary, and on the featured guide. Not on every card.
- **Internal Padding:** 24–40px.

### Inputs / Fields
- **Style:** The guest count select: linen fill, 1px ink-mute border (3:1 or better on oat), 3px radius. The only form control on the site.
- **Focus:** The global madder ring.

### Navigation
A floating frosted pill over the hero photograph (7% white, 22% white hairline,
14px backdrop blur), becoming linen at 90% with a keyline once the page scrolls.
Only colours cross-fade; the padding eases inside a `contain: layout style`
boundary, the one layout transition on the site. Links are sans 15px with a
running-stitch underline that wipes in from the left. Below 1024px the links
move to a translucent linen sheet with serif links on dashed keylines and a
thread WhatsApp button.

### The Seam (signature component)
Fifteen stitches tall: 2px stitches on a phone, 3px from 768px (30px and 45px).
Top to bottom: three stitches of teeth in the upper field's colour, a gap, a
seven-stitch motif row, a gap, three stitches of teeth in the lower field's
colour. Every bar of stitches is a background gradient on one element, so a band
changes thread by changing a colour. Motifs: lozenge (a hollow stepped diamond
with a madder centre), star (an eight-point star), water (a stepped chevron with
a drop beneath), running (a running stitch, no thread).

Until September 2026 the units were SVGs used as masks. On phones with a
fractional pixel ratio a masked strip leaked a one-pixel line along its edges,
and two of those crossed every band. `.seam` in globals.css records the two
rules that keep the gradients clean: no two layers end on the same line, and a
stitch and a half of each field lies across the band's own edges.

The ASCII grids the rows are read from:

```
teeth-down  ######   lozenge  .....##.....   star  .....##.....   water  #..........#
            .####.            ....#..#....         ..#..##..#..          .#........#.
            ..##..            ...#....#...         ...#.##.#...          ..#......#..
                              ..#......#..         .####..####.          ...#....#...
                              ...#....#...         ...#.##.#...          ....#..#....
                              ....#..#....         ..#..##..#..          .....##.....
                              .....##.....         .....##.....          ............
```

**The Still Band Rule.** The bands do not move. Their rows used to slide half a
unit into registration as each band crossed the screen; in September 2026 the
owner asked for them to stop moving while the page scrolls. The band is a
finished drawing standing still.

**The Rise.** A headline wrapped in `.rise` comes up from under the band above
it on a view timeline. Because it is scroll-driven, scrolling back up plays it
backwards. It is the page's only scroll motion.

### The Calendar (signature component)
A stitch chart. 44px square cells on a Monday-first grid, with the day numbers
in Sofia Sans tabular (see The Legible Zero Rule).

**The One Unavailable Look Rule.** Every night you cannot have looks the same,
whether it is booked, out of season or past: ink-mute, crossed by one diagonal
keyline thread, and not a button. A run of taken nights becomes a hatched block.
The line is never the only signal: each cell's screen-reader label says "Taken"
or "Closed for the season" in words.

Free nights are plain. Today carries a short madder stitch under its number.
A chosen arrival and departure fill madder with linen numbers; the nights
between fill flax. The summary plate beneath carries the dates, the night
count, and, once both ends are chosen, the total for the stay in cross-stitch
inside a madder running-stitch frame that is sewn on left to right (clip-path,
not width) each time a new range is picked. The total is summed night by
night, and withheld entirely if any night has no published price.

### The Rate Card
One ruled plate divided into a column per season (two across on a phone, four
from 1024px) by the grid's own 1px keyline gap. The price leads each cell in
cross-stitch; the season and its months are the caption beneath.

### The Reviews
Linen plates on the flax field: the guest's headline in the serif, the score in
madder Sofia Sans, the review verbatim, and the name and country as a stitched
caption under a running stitch. A swipe row on a phone, columns from 768px.
The section heading carries the Booking.com score inside the sentence, in
cross-stitch, while one is recorded.

### The Photographs
A deck on the night field, as it was before the redesign. From 768px it is a
coverflow: the front photograph faces the visitor, and two either side turn 26°
away and dim to 0.72 brightness. On a phone it is a swipe row. Round arrows and
pill dots sit beneath, the count ("1 / 6") beside the heading, and the front
card opens the lightbox. The rooms' names are the buttons' accessible names and
are not printed, because a printed caption is a claim about the room and each
has to be checked against its picture first.

The balcony photograph beside the apartment's heading is the way into the deck.
It is mounted like any other, and on hover the picture drifts in to 1.05, the
mount's keyline turns madder and steps out to 12px, and a linen label, "See the
photographs", comes up. On a phone there is no hover, so the label stays in
view. Transform, opacity and paint only.

### The Stitched Chart
The map's stand-in until someone asks for Google Maps: sand in scattered knots,
water in rows of wave stitches, the shoreline as a stepped running stitch, and
the apartment as a single madder-bright cross sewn on the line. Abstract on
purpose: no real coastline and no place names.

### The Guide Card
A mounted print with its caption: the cover at 3:2, the title beneath it in the
serif (turning madder on hover as the cover grows to 1.04 inside its mount), and
the category and reading time as a stitched caption. The featured card on the
index is the one that keeps its title on the photograph, under the directional
scrim, because at that width it is the page's opening picture.

## Do's and Don'ts

### Do:
- **Do** put a `<Seam>` on every join between two sections, with `from` and `to` naming the two grounds (`photo` for a photograph), and pick dark or light by whether the turn is into a dark field or photograph.
- **Do** keep madder (#a3302a) for WhatsApp actions, chosen dates, prices that are the answer, and thread. Use size, weight or a keyline for any other emphasis.
- **Do** set sentences in Instrument Serif, counts and labels in Handjet, and everything read at length in Sofia Sans.
- **Do** set dates, scores and small numbers in Sofia Sans with tabular figures.
- **Do** mount photographs with a keyline 6px off the picture, and keep their corners square. The gallery's deck is the one exception.
- **Do** draw new lines as a 1px keyline or a running stitch, and new icons as stitched paths (a 2.4 / 1.5 dash, butt caps) in madder.
- **Do** keep scroll motion to the headline rise, as transform on a scroll timeline, with a still, finished resting state.
- **Do** clear 4.5:1 for text and 24×24 for every target, in every state.

### Don't:
- **Don't** end a section on a straight edge or stack two sections without a band between them.
- **Don't** add a second accent hue, a gradient used as decoration, or pure white as a ground.
- **Don't** set a paragraph, a date or a phone number in the stitched face.
- **Don't** give a plate, card, photograph or calendar cell a shadow.
- **Don't** lay out a set of items as equal tiles of icon over heading over note; rule them into a list.
- **Don't** put a label or a number above a section heading; the heading carries its own weight.
- **Don't** set the bands moving again, or give sections a scroll entrance of their own.
- **Don't** animate a layout property. The header's padding is the one bounded exception.
- **Don't** print a photograph's name over or under it until it has been checked against the picture.
