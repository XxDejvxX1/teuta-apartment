# CLAUDE.md

Direct-booking site for one beachfront apartment in Durrës. Next.js 16 App
Router, Tailwind v4, static export (`output: "export"`) served from a Cloudflare
Worker. English only since August 2026.

## Read these first

| File | For |
|---|---|
| `PRODUCT.md` | The facts. What is true, and what is deliberately still undecided. |
| `CONTRIBUTING.md` | The standards, and which are machine-enforced. |
| `DESIGN.md` | Tokens, the type scale, the named design rules. |
| `README.md` | Operator's manual: replacing photos, writing a guide, hosting. |
| `NEXT.md` | Decided-but-unbuilt work, and the house rules. |

## The one command

```bash
npm run check
```

Format, lint, `tsc --noEmit`, tests, tests under four timezones, build, five
audits. Run it before claiming anything works. `.githooks/pre-commit` runs the
fast half; CI runs all of it.

## Rules with teeth

Do not weaken these to make a check pass — the check is the point.

- **Never state an unconfirmed fact about the apartment.** The street address and
  cancellation policy are undecided. A placeholder does not sit quietly in a
  file; it ends up in the JSON-LD, where Google reads it as fact. Empty renders
  nothing — that pattern is already used throughout.
- **`to` is the exclusive checkout day.** Dates parse at 12:00 UTC, never local
  midnight. Both rules are one off-by-one from telling a guest a booked night is
  free.
- **Colours from tokens, type from the twelve-step scale.** No hex in
  `components/`, no `text-[17px]`, no inline `fontSize`.
- **Animate nothing that triggers layout.** `color` and `background-color` are
  fine; `width` and `height` are not.
- **The page must read with JavaScript disabled.**
- **Photographs, the manifest naming them, and the code reading them go in one
  commit.** Splitting them ships a manifest pointing at files that are not in
  the repository, and every image 404s on a fresh clone.

## Traps

- **`npm install` fails here** — the global npm cannot resolve against the
  installed Node. Use
  `node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" install`.
  `npx` is broken for the same reason; do not add tooling that depends on it.
- **Git commits: use `-F`,** not `-m`. PowerShell mangles the quoting.
- **Photo originals live in `assets/photos-src/`, not `public/`.** Anything in
  `public/` is published to the CDN.
- **`lib/photo-widths.generated.ts` and `lib/photo-meta.generated.ts` are
  generated** by `npm run photos`. Do not hand-edit them.
- **Declaring `openGraph` in a route replaces the parent object whole,** image
  included. That is how five pages shipped with no social image.
- **The CSP exists twice** — `public/_headers` ships, `next.config.ts` is dev
  only. Change one, change both; an audit checks it.
- **Verify against `out/`, not the source.** Every SEO defect this codebase had
  looked correct in the components.
