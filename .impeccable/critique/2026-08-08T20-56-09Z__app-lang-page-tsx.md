---
target: pc website
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-08-08T20-56-09Z
slug: app-lang-page-tsx
---
> **Resolved, 18 August 2026.** Kept as a record, not as an open finding.
>
> The P0 was 45 WCAG AA text failures traced to one token, `--color-muted` at
> 3.18:1. It is `#5f747e` at 4.62:1 now, and every text token in
> `app/globals.css` carries its measured ratio beside it.
>
> The target file no longer exists either: `app/[lang]/page.tsx` flattened to
> `app/page.tsx` when Albanian and Italian were dropped.

Method: dual-agent (A: aea4aca18a76aeb03 · B: adb6bd42682b892e6)
Target: `app/[lang]/page.tsx` — desktop / PC viewport, 1440×900. Mode: Persuade.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Calendar renders 4 visual states (past, free, taken, changeover) against a 3-item legend; the "Free" swatch is a bordered circle but a real free day is a bare numeral with no border. No `today` marker. |
| 2 | Match System / Real World | 3 | Genuine holiday-let vernacular ("first line", checkout-exclusive ranges), but "Changeover day" is a swatch that is never defined. |
| 3 | User Control and Freedom | 3 | Lightbox is exemplary (Escape, focus trap, focus restore). All five `wa.me` links are `target="_blank"` with no indication the click leaves for another app. |
| 4 | Consistency and Standards | 2 | One action, three faces: filled pill + glyph + "WhatsApp" (header); bare outline pill with neither glyph nor the word (Availability); filled pill, no glyph (Contact). |
| 5 | Error Prevention | 2 | Prefill is byte-identical from all five entry points and contains no dates. The 4-night minimum sits ~1,900px below the calendar. |
| 6 | Recognition Rather Than Recall | 1 | Calendar → WhatsApp handoff is pure recall across an app switch. Slide 4 renders at `opacity: 0`, so "what have I seen" is also memory work. |
| 7 | Flexibility and Efficiency | 3 | Real accelerators exist (skip link, anchor nav, arrow keys, locale switcher). But gallery arrow-keys require first focusing an invisible 1425×500 `div[tabindex="0"]`. |
| 8 | Aesthetic and Minimalist | 3 | The coverflow spends the page's largest visual budget rendering four photos at 0.72 opacity and one at 0, to show one small. |
| 9 | Error Recovery | 2 | `MapEmbed`'s `setLoaded(true)` is one-way. With a tracker blocker on, the placeholder is destroyed, the iframe is blocked, and a permanent 420px void remains with no route back. |
| 10 | Help and Documentation | 3 | "Good to know" and the map note are real documentation, but nothing answers "what does it cost" or "how do I pay". |
| **Total** | | **24/40** | **Acceptable — significant improvements needed** |

Both H7 and H10 were scored rather than marked `n/a`: real accelerators and real explanatory content exist here, so marking them inapplicable would flatter the page.

## Design Specificity Verdict

**LLM assessment: authored in the copy, templated in the composition — and the templated half is the half that converts.**

The writing would break if another listing were pasted in. "The sea is the first thing you see when the curtain moves in the morning." "Fast enough to work a morning if you must." "I meet you at the apartment and hand them over in person." Observations, not benefit claims. "First line" is the Albanian/Italian beachfront idiom (*rreshti i parë* / *prima fila*), not a translation of "beachfront" — you only get that phrase from knowing this market.

The composition is the opposite. Hero → About → Gallery → Availability → Amenities → Getting here → FAQ → CTA is the default listing-template stack, unmodified. The six-card amenity grid could be lifted into any rental, hotel or SaaS page. The coverflow is 2010s Cover Flow and says nothing about a beach. The close is the hero photograph again at 50% opacity — the single most generic closing pattern available. And the thing that would be irreducibly *this* apartment — who owns it — is absent: "I" appears seven times and is never attached to a name, a face, a price or a review.

Copy ~8/10. Composition ~4/10.

**Deterministic scan.** CLI: exit 2, one finding — `broken-image` at `app/globals.css:239`, which is an `<img>` inside a CSS block comment. False positive; nothing else across `components` and `app`.

In-page detector: **38 anti-patterns / 40 findings** — 31 `low-contrast`, 2 `clipped-overflow-container` (`#hero`, `#gallery` — both intentional), 2 `ai-color-palette`, 1 `layout-transition` (`transition: padding` on the header), 1 `hero-eyebrow-chip`, 1 `em-dash-overuse` (57), 1 `cream-palette`, 1 `codex-grid-background`.

The detector independently corroborated the contrast numbers Assessment A reached by compositing real image pixels — same three ratios (3.2, 2.4, 3.5) against the same hex pairs. It also caught spacing discipline neither review would have found by eye: **16 distinct font sizes** and **29 distinct margin/padding values, 16 of which fall off a 4px grid**.

**Visual overlays: none available.** Injection succeeded fully (live-server on :8400, `detect.js` loaded, 77 `.impeccable-*` nodes constructed, console read, server stopped), but the Browser pane is hidden, so no human can see the overlay. Reporting the console signal instead.

## Overall Impression

The engineering is ahead of the design. Privacy-respecting click-to-load map, an inverted reveal system that hides nothing without JS, a dynamic-import lightbox with a real focus trap, a calendar whose date maths is tested across four timezones — these are the harder implementations, chosen deliberately.

What is missing is the commercial spine. The page shows a visitor exactly which nights are free, then hands them to WhatsApp with a message containing no dates. It asks a stranger to message someone about money and travel while withholding the price, the host's name, any review, and any payment terms. **The single biggest opportunity: connect the calendar to the message, and put a person behind the "I".**

## What's Working

1. **The hero scrim is measured, not decorative.** Two stacked gradients — a 180° vertical and a 100° left-to-right — put the darkening exactly where the text sits and leave the photograph bright on the right. Composited against real image pixels: H1 lines average 9.2 / 10.2 / 12.4:1; "Look inside" never drops below 12.9:1; header nav never below 14.1:1. Most photo heroes solve this with a flat black wash and lose the picture.

2. **Progressive disclosure is real and spent where it counts.** Map loads on click with the reason printed honestly on it. Lightbox ships nothing until opened. Five of six slides render. `RevealController` applies `data-hidden` in JS to off-screen elements only, so if the bundle never runs nothing was ever hidden. Each is the harder path, and each protects a real person.

3. **Structural hygiene is clean.** One `h1`, seven `h2`, zero skipped levels. Zero interactive elements without an accessible name across 41 controls. One `tabindex`, no positive values. Both tables have captions and `scope` on every `th`. Zero unclipped overflow at 1440 and 1920.

## Priority Issues

**[P0] The calendar and the CTA are not connected**
All five `wa.me` links carry a byte-identical prefill with no dates, month, night count or party size — including the CTA sitting directly beneath the calendar the visitor just read.
*Why it matters:* the single conversion goal is "visitor sends a message asking about dates". The page does all the work of showing which nights are free, then throws it away at the handoff. The visitor holds dates in working memory across an app switch and retypes them; every dropped detail is a manual round-trip for the owner and a chance to lose the booking.
*Fix:* make calendar cells selectable, interpolate into the prefill ("Is 12–16 August free — 4 nights, 2 adults?"), and move the minimum-stay rule into the calendar block. Minimum viable: interpolate the displayed month and the guest count from the tag pills.
*Suggested command:* `/impeccable shape`

**[P1] One action, three faces — and the weakest sits at peak intent**
Header: filled white pill, glyph, the word "WhatsApp". Availability: bare outline pill reading "Ask about your dates" — no glyph, no "WhatsApp", no signal it opens another app. Contact: filled pill, no glyph. Separately the header pill is `bg-white` on `bg-sand/85` when scrolled: a **1.03:1** fill separation held up entirely by a drop shadow, and `MobileCta` is `md:hidden` so desktop has no persistent fallback.
*Why it matters:* the visitor never learns a shape that means "message the owner", and the CTA where intent peaks — right after confirming their dates are free — is styled as a tertiary link.
*Fix:* one primary treatment at all three points (filled, glyph, "WhatsApp" in the label). Give the header pill a non-white fill — `--color-accent` #1f6f6a is already defined at 5.6:1 on sand.
*Suggested command:* `/impeccable clarify`

**[P1] The coverflow costs more than it earns**
On a page whose product is a view, the gallery shows one photo at 620×413 with its bottom quarter under a caption gradient, four at 0.72 opacity in perspective, one at `opacity: 0` — and hangs 14 controls off it, including six **8×8px** dots at 18px pitch (WCAG 2.2 SC 2.5.8 failure on both size and spacing, confirmed: `padding: 0`, no pseudo-element expansion). Clicking the centre card opens a lightbox; clicking a side card advances the stack; they look identical. The amenity cards below get 435px each at full fidelity; the photographs get less.
*Fix:* a 3×2 grid at full opacity — six 3:2 photos fit the 1,352px content width cleanly. Keep the lightbox, drop the dots and arrows. If the coverflow stays, wrap each dot in a 24×24 target and differentiate the side-card affordance.
*Suggested command:* `/impeccable layout`

**[P2] Contrast fails on the two readouts that matter most**
45 text instances across 6 colour pairs fail WCAG AA. Root cause is one token: `--color-muted: #7a8f99` (`globals.css:18`) is **3.18:1** on sand and **2.43:1** over `--color-booked` #cfdedb. The 2.43:1 case is the numeral inside a *taken* night — 21 instances, the highest-stakes glyph on the page. Also: 14 calendar weekday headers, 6 amenity notes, both eyebrows, the gallery counter, and `#6f8189` on mist at 3.53:1. Out-of-month cells at `text-muted/40` composite to roughly 1.9:1.
*Fix:* route body-size text through `--color-body-mute` #5c6f79 (already defined, 4.9:1). Give the booked numeral #4a5c63 on #cfdedb (4.6:1). Add the missing fourth legend entry for past days.
*Suggested command:* `/impeccable colorize`

**[P2] The close is a faded copy of the open, with nobody behind it**
`#contact` reuses `heroPhoto` at `opacity-50` under a dark gradient — the final impression is the opening image at roughly 30% presence. Above it, no name, no face, no price, no review, no payment terms.
*Why it matters:* peak-end rule weights the last moment as heavily as the peak, and this is where the visitor decides whether to message a stranger abroad about money. The anonymity of "I" is the specific thing that stops people booking direct instead of through a platform.
*Fix:* close on a photograph they have not yet seen full-bleed (`beach.jpg` is already in the bundle). Put a first name and a face on the host. Add one concrete reassurance — a price range, how payment works, or a single guest sentence.
*Suggested command:* `/impeccable bolder`

## Persona Red Flags

**Jordan (confused first-timer)**
- "Changeover day" is a swatch with no explanation. A half-shaded 16 August — may they arrive that day? The page never says.
- Finds 17–20 September free, clicks a bare outline pill that says neither "WhatsApp" nor "opens elsewhere", lands in WhatsApp with a message containing no dates.
- **No price anywhere.** The message they send is "how much?", and the conversation restarts from zero.
- "Look inside" — the hero's only invitation — links to `#gallery`, jumping past `#apartment` entirely. The section the nav lists first is the one the hero teaches you to skip.
- Plans the 3-night gap between the 16th and 20th; the 4-night minimum is 1,900px below and they get refused.

**Riley (stress tester)**
- Tabs into the gallery: **15 stops for 6 photos**. One stop — the "Living room" button at index 3 — sits at `opacity: 0`, `pointer-events: none`, partly off-screen. **Focus lands on something invisible.**
- Clicks "Show map" with a tracker blocker on — exactly the audience click-to-load exists for. `setLoaded(true)` has no inverse: permanent 420px void, no route back.
- Zooms to 200%: cards are `min(620px, 74vw)` but coverflow offsets are hard-coded 380px / −260px, so the stack collapses toward overlap.
- Reloads with the lightbox open: no URL state. No deep-linkable image on a page whose product is images.
- ArrowRight with page focus does nothing — correct, and deliberately fixed. Credit where due.

**Casey (distracted, desktop trust/perf)**
- The only always-visible desktop CTA is a white pill at 1.03:1 against its own header background.
- The trust check — "is this real, or scraped from someone else's listing?" — has nothing to land on.
- Hero decodes at 768px into a 1425px box: **1.86× upscale at 1× DPR, 3.71× at 2×**. The `-top-[12%] h-[124%]` parallax wrapper contributes ~18% of that softening for an effect disabled under `prefers-reduced-motion` anyway.
- `RevealController`'s 4,000ms fallback marks **every** `[data-reveal]` shown regardless of scroll position. A visitor who lingers five seconds on the hero — precisely the one the hero is built for — never sees a single scroll reveal.

## Minor Observations

- Gallery slide 1 ships owner-facing copy to guests: **"The view that sells the place"**.
- Three sizes for peer `h2`s at 1440 (51.8 / 46.1 / 40.3px) with no semantic distinction — and the gallery, the most persuasive section, gets the smallest.
- `.t-hero` stops growing at a 783px viewport. At 1920 the H1 is 26.3% of width with 1,234px of dead photo beside it, while `#contact h2` keeps growing — so the hero's dominance over the closing heading *narrows* as screens get bigger.
- Section budget: `#getting-here` is 1,246px (18.9%), larger than the hero (900px) and nearly double `#apartment` (646px). Airport logistics is the biggest thing on the page.
- Both month labels carry `aria-live="polite"` — changing month announces twice.
- `.card-lift` gives six non-interactive `<li>`s a hover lift, promising six actions that do not exist.
- The `h-1 w-14` grabber bar atop `#apartment` is a mobile bottom-sheet handle on a desktop where nothing drags.
- `hero-window.jpg` appears three times, `balcony.jpg` twice — six unique images across nine placements.
- Apartment → Gallery → Availability is 1,847px of unbroken #faf8f4 separated by a single hairline.
- 16 distinct font sizes; 29 distinct spacing values, 16 off a 4px grid.

## False Positives (discarded)

- CLI `broken-image` at `globals.css:239` — `<img>` inside a CSS comment.
- Two `text-occlusion` hits on detector re-run — it scanned its own overlay labels.
- White gallery captions at 1.06:1 — white text over photographs; the backdrop is unsampleable from computed styles.
- Skip link "never expands on focus" — an artifact of `document.hasFocus() === false` in the hidden pane; the CSS rule exists and out-specifies `.sr-only`.
- `h1.textContent` reading "lineof" — `textContent` artifact only; `innerText` and the accessibility tree separate the three block spans correctly.

## Questions to Consider

1. If you deleted the coverflow and dropped six photographs into a 3×2 grid, what would the page lose besides the word "premium"?
2. The one fact a visitor cannot get anywhere is the price. Is that strategy or an unmade decision? Right now the silence reads as evasion — the most expensive thing a stranger's rental page can read as.
3. Seven "I"s and no name. What actually breaks if the host's first name and one photograph go on the Contact section?
4. The calendar knows which nights are free. WhatsApp accepts a prefilled message. Why is there a human retyping dates in between?
5. Which is the second-best photograph you own, and why is it not the last thing on the page instead of a 50%-opacity repeat of the first?
6. "Getting here" is the biggest section. Who arrives at a beach apartment's website wanting to read about airport transfers before deciding they want the apartment?
7. Was the desktop hero ever composed, or inherited from the phone and never looked at again?
