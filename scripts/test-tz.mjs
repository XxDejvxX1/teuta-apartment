/**
 * Runs the test suite under several host timezones.
 *
 * The calendar's worst failure mode is a silent off-by-one: parse a date in
 * content/availability.ts as local midnight and every night shifts a day for
 * anyone east of UTC — including Albania. That bug passes cleanly on a UTC CI
 * box and only shows up for real guests, so the guard has to be an explicit
 * sweep.
 *
 * Set as an npm script rather than `TZ=x vitest` because that syntax does not
 * work in PowerShell, which is where this project is developed.
 */

import { spawnSync } from "node:child_process";

const ZONES = [
  "UTC",
  "Europe/Tirane", // where the apartment is: UTC+1/+2
  "Pacific/Kiritimati", // UTC+14, the extreme east
  "Pacific/Midway", // UTC-11, the extreme west
];

let failed = false;

for (const timeZone of ZONES) {
  process.stdout.write(`\n─── TZ=${timeZone} ${"─".repeat(Math.max(0, 40 - timeZone.length))}\n`);

  const result = spawnSync("npx", ["vitest", "run", "--reporter=dot"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, TZ: timeZone },
  });

  if (result.status !== 0) failed = true;
}

if (failed) {
  console.error("\nFAILED — date handling is not timezone independent.");
  process.exit(1);
}

console.log("\nAll timezones agree.");
