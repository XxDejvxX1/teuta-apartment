/**
 * Runs every audit module in this directory and fails the build if any of them
 * finds something.
 *
 * These exist because the standards this project actually cares about are not
 * the ones a general-purpose linter knows: that every photograph the manifest
 * names is really on disk, that a guide page carries a social image, that the
 * two copies of the CSP have not drifted apart. DESIGN.md and NEXT.md have
 * described those rules in prose for months; this is the part that checks them.
 *
 * A module exports `name` and `run()`. `run()` returns an array of strings, one
 * per problem, and an empty array means it passed. Modules that need the built
 * site set `needsBuild = true` and are skipped with a warning when out/ is
 * absent, so `npm run audit` is still useful on its own.
 */
import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const hasBuild = existsSync(path.join(root, "out"));

const files = (await readdir(here)).filter((f) => f.endsWith(".mjs") && f !== "index.mjs").sort();

let failed = 0;
let skipped = 0;

for (const file of files) {
  const mod = await import(pathToFileURL(path.join(here, file)).href);
  const name = mod.name ?? file.replace(/\.mjs$/, "");

  if (mod.needsBuild && !hasBuild) {
    console.log(`- ${name}: skipped (no out/ — run \`npm run build\` first)`);
    skipped++;
    continue;
  }

  const problems = await mod.run({ root });
  if (problems.length === 0) {
    console.log(`✓ ${name}`);
  } else {
    failed += problems.length;
    console.log(`✗ ${name} — ${problems.length} problem${problems.length === 1 ? "" : "s"}`);
    for (const p of problems) console.log(`    ${p}`);
  }
}

if (files.length === 0) console.log("no audit modules found");
if (skipped > 0) console.log(`\n${skipped} audit(s) skipped because out/ is missing.`);

if (failed > 0) {
  console.error(`\n${failed} problem(s) found.`);
  process.exit(1);
}
console.log("\nAudits clean.");
