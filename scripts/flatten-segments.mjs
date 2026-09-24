/**
 * Puts the router's prefetch files where the browser looks for them.
 *
 * The export writes one small `.txt` file per route segment, and the client
 * router fetches it before a link is clicked: `/guide/__next.guide.__PAGE__.txt`.
 * Next builds that name by replacing `/` with `.` in the segment path — but on
 * Windows the path arrives with `\`, which survives the replace and is then read
 * as a folder. The file lands at `guide/__next.guide/__PAGE__.txt`, every
 * prefetch of a nested page 404s, and a click falls back to a full page load.
 *
 * Built on Linux (Cloudflare's builders, CI) the names are already flat and
 * there is nothing here to do. Built on Windows, this moves each file up to the
 * name the client asks for. Runs as part of `npm run build`; safe to run twice.
 */
import { readdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");

/** Every file under `dir`, as paths relative to it. */
async function filesUnder(dir, prefix = "") {
  const found = [];
  for (const entry of await readdir(path.join(dir, prefix), { withFileTypes: true })) {
    const rel = path.join(prefix, entry.name);
    if (entry.isDirectory()) found.push(...(await filesUnder(dir, rel)));
    else found.push(rel);
  }
  return found;
}

async function walk(dir) {
  let moved = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);

    if (entry.name.startsWith("__next.")) {
      // `__next.guide/$d$slug/__PAGE__.txt` becomes `__next.guide.$d$slug.__PAGE__.txt`.
      for (const rel of await filesUnder(full)) {
        const flat = `${entry.name}.${rel.split(path.sep).join(".")}`;
        await rename(path.join(full, rel), path.join(dir, flat));
        moved += 1;
      }
      await rm(full, { recursive: true });
    } else {
      moved += await walk(full);
    }
  }
  return moved;
}

if (!(await stat(OUT).catch(() => null))) {
  console.error(`No ${OUT} — run \`next build\` first.`);
  process.exit(1);
}

const moved = await walk(OUT);
if (moved > 0) console.log(`prefetch segments: moved ${moved} file(s) to their flat names`);
