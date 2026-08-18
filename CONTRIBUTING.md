# Working on this site

This is a direct-booking site for one apartment. There is no staging
environment and no QA pass: what reaches `main` reaches guests. Everything below
exists so a change can be made confidently and quickly, not so that making one
is ceremonial.

**Every rule here is either enforced by something, or explicitly marked
*review-only*.** Nothing in between. A rule nobody checks is a rule that quietly
stops being true, which is exactly what happened to "zero hard-coded hexes in
`components/`" — true for months, guarded by nothing.

---

## The one command

```bash
npm run check
```

Format, lint, types, unit tests, the same tests under four timezones, a
production build, then five audits. It is what CI runs on every push and what
you should run before pushing. The rest of this document explains what each
stage does and why it exists.

The fast half — format, lint, types, tests — also runs before each commit.
Enable it once per clone:

```bash
git config core.hooksPath .githooks
```

Not husky or lint-staged. Both shell out to `npx`, and `npx` is broken on at
least one machine this is developed on, so the hook would fail for reasons
having nothing to do with your commit. A hook that cries wolf is one everybody
passes `--no-verify` to. `.githooks/pre-commit` is a plain shell script.

### If `npm install` fails

The global npm on the main development machine cannot resolve against the
installed Node and fails with `ERR_REQUIRE_ESM`. Node's bundled copy works:

```bash
node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" install
```

Every other script is unaffected. CI runs Node 22 and has no such problem, which
is part of why CI is the honest answer to "does this build from clean".

---

## How code is written

**TypeScript is strict, and there is no `any`.** There are zero in the codebase
and `no-explicit-any` is an error. Keeping it that way is cheaper than getting
it back.

**Server components by default.** Reach for `"use client"` only when a hook or
an event handler demands it. Nine of twenty-four components are client
components and every one is genuinely interactive. `components/GuideFilters.tsx`
is the pattern to imitate: a category filter built from a radio group and CSS
`:has()` that ships no JavaScript at all.

**Props are typed inline on the destructured parameter.** That is the convention
throughout; a named `type` alias is for shapes used more than once.

**Type copy by its real keys, not `Record<string, ...>`.** A loose record accepts
any key, so a season renamed in one file and not the other falls through to
rendering a raw key at a guest. `Record<SeasonKey, ...>` makes it a build error.
*Enforced by `npm run typecheck`.*

**Colours come from tokens. No hex in `components/`.**
*Enforced by `scripts/audit/design.mjs`.*

**Type comes from the scale.** Twelve steps, defined as `@theme` tokens in
`app/globals.css` and documented in `DESIGN.md`. Write `text-body-lg`, never
`text-[17px]`, and never an inline `fontSize` where no audit can see it.
*Enforced by `scripts/audit/design.mjs`.*

**Animate nothing that triggers layout** — not `width`, `height`, `top`, `left`,
`margin`, `padding` or `all`. This is a deny-list, not "transform and opacity
only": `color`, `border-color` and `background-color` are fine and are used
deliberately, including in the reduced-motion block, where movement is removed
but feedback is not. *Enforced by `scripts/audit/design.mjs`.*

**Comment the non-obvious decision, not the obvious line.** This codebase is
unusually well commented and it is worth preserving. The CSP without nonces, the
click-to-load map, the build-time image widths and the exclusive `to` all carry
their reasoning in the file. Someone will want to change one of them in a year.

---

## Content rules

**Never state a fact about the apartment that nobody has confirmed.** This is
the most important rule here and the only one with a real cost attached.

`PRODUCT.md` lists what is undecided: the cancellation policy and the street
address. Until an owner decides, nothing may assert it. A placeholder is not a
neutral stand-in. `content/site.ts` carried a street name behind a `TODO`, and
that string went into the `PostalAddress` in the JSON-LD on every page, where
Google reads it as a statement of where this apartment is.

The pattern to follow is already here: **empty renders nothing.** `Rates`
returns `null` until a real price exists. `HostAndReviews` returns `null` when
there is nobody to name. The FAQ drops the payment row while its body is blank.
*Partly enforced: `scripts/audit/seo.mjs` fails on an empty `streetAddress`
reaching the markup. The general rule is review-only.*

**Copy lives in `content/copy.json`.** You should not need to touch a component
to change wording. Every key must be read by something: `meta.ogAlt` sat there
describing the social card while the card built its own alt text and read
nothing. *Enforced by `content/copy.test.ts`.*

**Guides.** One Markdown file per article at `content/guides/<slug>.md`.
`category` must be `history`, `sea`, `food` or `trips` — anything else fails the
build, deliberately, so nobody creates a fifth category with one article in it.
Reading time is computed, never authored, so it cannot drift. `cover` names a
photograph without its extension. *Enforced by `lib/guides.test.ts`.*

**Photographs.** Originals as JPEG in `assets/photos-src/`, then `npm run
photos`. That writes every width into `public/photos/` and records dimensions
and a blur placeholder in `lib/photo-meta.generated.ts`. Commit the original and
what the script produced together. Nothing but `.webp` belongs in
`public/photos/` — anything there is published to the CDN.
*Enforced by `scripts/audit/assets.mjs`.*

---

## How a change is validated

`npm run check`, in order. Each stage exists because something got through
without it.

| Stage | What it catches |
|---|---|
| `format:check` | Prettier on code. Not on Markdown: the docs are hand-wrapped and `DESIGN.md`'s frontmatter is a contract mirrored in `.impeccable/design.json`. |
| `lint` | `eslint-config-next` plus `typescript-eslint`. Raw `<img>`, missing keys, hook violations, unused variables, `any`. Unused code is an error, not a warning. |
| `typecheck` | `tsc --noEmit`. This was never wired to a script, so type errors surfaced only if someone happened to run a build. |
| `test` | Pure logic and content integrity. See below. |
| `test:tz` | The same suite under UTC, Europe/Tirane, UTC+14 and UTC-11. |
| `build` | The real static export, plus the social card re-encode. |
| `audit` | Five project-specific checks no general-purpose tool knows about. |

### The audits

**assets** — every file the widths manifest resolves to is on disk, every file
in `public/photos/` is produced by an entry, every key has an original to
regenerate from. This is the check that would have caught a manifest naming four
guide covers whose files were untracked: a fresh clone would have 404'd all of
them, and nothing would have failed loudly enough to notice.

**seo** — reads the built HTML, not the source that made it. One `<title>`, one
`<h1>`, canonical, description, four `og:` and four `twitter:` tags, JSON-LD
that parses, `FAQPage` only where the FAQ renders, sitemap and routes agreeing
in both directions. Every SEO defect found in this codebase was invisible in the
components and obvious in the output.

**design** — the rules in the section above.

**headers** — the CSP exists twice: `public/_headers` ships, `next.config.ts` is
for dev. Dev must be a superset, because a source allowed in production and not
in dev breaks only after deploy.

**budget** — build size against ceilings in `scripts/audit/budget.json`, printed
as a table every run so a trend is visible before a ceiling is hit.

---

## How it is tested

**Test pure logic and content integrity. Do not test rendering.** This is a
mostly-static marketing site; a snapshot of a component's markup would fail on
every design change and catch nothing that matters.

What must have a test:

- **Date arithmetic.** The calendar is the part most likely to be wrong in a way
  nobody sees. `to` is the exclusive checkout day, and dates parse at 12:00 UTC
  rather than local midnight. Both rules are one off-by-one away from telling a
  guest that a booked night is free.
- **Pricing.** Season bands, boundaries, stays crossing a band, unpriced nights.
- **Content integrity.** Frontmatter validates, covers resolve to real files,
  copy keys are read by something.
- **The Worker.** Forty lines that redirect. The tests cover the prefix trap
  (`/energy` must not match `/en`), query retention, and 301 rather than 302.

**Everything runs under four timezones.** `npm run test:tz` re-runs the suite
under UTC, Europe/Tirane, UTC+14 and UTC-11 and fails if any zone disagrees. It
is a script rather than `TZ=x vitest` because that syntax does not work in
PowerShell.

A test may live anywhere as `*.test.ts`. `vitest.config.ts` used to name three
directories explicitly, so a test written beside a component was collected by
nothing and passed by never running.

---

## Accessibility and design

The bar is **WCAG 2.2 AA**, from `PRODUCT.md`. Most of it is review-only. These
are the things to check by hand, because no audit here checks them:

- **Contrast at least 4.5:1** for text. Every colour token in `app/globals.css`
  carries its measured ratio in a comment beside it. Keep that up if you add one.
- **Targets at least 24x24.**
- **A complete keyboard path.** Tab through the calendar, then open the
  lightbox: it traps focus, closes on Escape, and restores focus to whatever
  opened it.
- **Full readability with JavaScript disabled.** Scroll reveals are hidden by JS
  at runtime, never by the stylesheet, so a visitor without JS sees everything
  rather than a blank page.
- **Reduced motion means less movement, not less feedback.**

Semantics deserve the care they have had: one `<h1>` per page, a real `<table>`
with a `<caption>` for the calendar, and `<dl>` for term-and-value lists — in
that order, `<dt>` before `<dd>`, which the rate card got wrong and which left
the price announced as an answer to nothing.

---

## Before pushing

1. `npm run check` is green.
2. Anything a guest can see that you changed, you have looked at in a browser.
3. New facts about the apartment came from an owner, not from you.
4. Photographs, the manifest naming them and the code reading them are in **one
   commit**. Splitting them publishes a manifest pointing at files that are not
   in the repository.
5. The commit message says why. The diff already says what.

---

## One thing that is safe today and will not always be

`app/guide/[slug]/page.tsx` renders `marked` output through
`dangerouslySetInnerHTML`, unsanitized. `marked` v18 has no sanitizer, so raw
HTML in a Markdown file passes straight through to the page.

That is fine while `content/guides/*.md` is repository source written by people
who can already commit — they could put the same HTML in a component and nobody
would be worse off. It stops being fine the moment articles arrive from anywhere
else: a CMS, an outside pull request, a non-developer editor. **If that changes,
this needs a sanitizer before it needs anything else.**
