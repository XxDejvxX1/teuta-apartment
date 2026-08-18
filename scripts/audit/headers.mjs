/**
 * The CSP exists twice and nothing kept the copies in step.
 *
 * public/_headers is the one that ships — `headers()` cannot run under
 * `output: "export"`, so the dev copy in next.config.ts exists only so that
 * `next dev` runs under a realistic policy and a violation surfaces before
 * production rather than after. Both files carry a comment saying "change one,
 * change both", which is exactly the kind of instruction that holds until the
 * day someone is in a hurry.
 *
 * Dev is deliberately the looser of the two: it adds 'unsafe-eval' and ws: for
 * hot reload and drops upgrade-insecure-requests, because dev is http. So the
 * rule is not equality — it is that every directive in production exists in dev
 * with at least the same sources allowed. A source permitted in production and
 * forbidden in dev is the dangerous direction: it breaks only once deployed.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

export const name = "headers";

/** Directives that exist in production and have no meaning over plain http. */
const DEV_EXEMPT = new Set(["upgrade-insecure-requests"]);

/** Required on the global rule, independent of the CSP. */
const REQUIRED = [
  "X-Content-Type-Options",
  "Referrer-Policy",
  "X-Frame-Options",
  "Permissions-Policy",
  "Strict-Transport-Security",
];

function parseCsp(value) {
  const map = new Map();
  for (const part of value.split(";")) {
    const [directive, ...sources] = part.trim().split(/\s+/).filter(Boolean);
    if (directive) map.set(directive, new Set(sources));
  }
  return map;
}

export async function run({ root }) {
  const problems = [];

  const headersFile = await readFile(path.join(root, "public", "_headers"), "utf8");
  const configFile = await readFile(path.join(root, "next.config.ts"), "utf8");

  const prodLine = headersFile.match(/^\s*Content-Security-Policy:\s*(.+)$/m);
  if (!prodLine) return ["public/_headers has no Content-Security-Policy"];
  const prod = parseCsp(prodLine[1]);

  // The dev policy is an array of quoted strings; template holes are dev-only
  // additions, so dropping them can only make the dev set look smaller.
  const devBlock = configFile.match(/const devCsp = \[([\s\S]*?)\]\.join/);
  if (!devBlock) return ["next.config.ts has no devCsp array"];
  const dev = parseCsp([...devBlock[1].matchAll(/["`]([^"`]+)["`]/g)].map((m) => m[1]).join("; "));

  for (const [directive, prodSources] of prod) {
    if (DEV_EXEMPT.has(directive)) continue;
    if (!dev.has(directive)) {
      problems.push(`CSP: _headers has "${directive}" but next.config.ts devCsp does not`);
      continue;
    }
    for (const source of prodSources) {
      if (!dev.get(directive).has(source)) {
        problems.push(
          `CSP: "${directive} ${source}" ships in production but is not allowed in dev — ` +
            `it would break only after deploy`,
        );
      }
    }
  }

  for (const directive of dev.keys()) {
    if (!prod.has(directive)) {
      problems.push(`CSP: next.config.ts allows "${directive}" but _headers does not declare it`);
    }
  }

  // Prefix match on trimmed lines, skipping comments. These names contain
  // hyphens and the test is a simple startsWith, so a pattern buys nothing.
  const declared = headersFile
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  for (const header of REQUIRED) {
    if (!declared.some((line) => line.startsWith(header + ":"))) {
      problems.push(`public/_headers is missing ${header}`);
    }
  }

  return problems;
}
