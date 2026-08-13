import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Dev-only allowance so impeccable live mode can load its picker from the
 * helper server on port 8400. Guarded by NODE_ENV, so it exists only while
 * `next dev` is running.
 */
const __impeccableLiveDev =
  process.env.NODE_ENV === "development" ? " http://localhost:8400" : "";

/**
 * Content-Security-Policy — DEVELOPMENT ONLY.
 *
 * `headers()` does not run under `output: "export"`; there is no server left to
 * run it. The production policy therefore lives in `public/_headers`, which
 * Cloudflare applies to every static response, and that file is the one to edit.
 * This copy exists so `next dev` still runs under a realistic policy — otherwise
 * a CSP violation would only ever surface in production.
 *
 * The two must be kept in step. The dev copy is deliberately the looser of the
 * two: it adds 'unsafe-eval' and ws: for hot reload, and drops
 * upgrade-insecure-requests because dev is served over http.
 */
const devCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval'${__impeccableLiveDev}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ws: wss:${__impeccableLiveDev}`,
  "frame-src https://www.google.com",
].join("; ");

const nextConfig: NextConfig = {
  /*
    Static export.

    The OpenNext adapter was tried first and does not work here: its build
    completes but copies none of the prerendered HTML into the bundle, so every
    locale route 404s. Reproduced identically on Windows and on Cloudflare's own
    Linux builders, so it is the adapter, not the machine.

    Export suits this site better in any case. Three pages of fixed content, no
    per-request rendering, nothing to revalidate — there was never work for a
    server to do. The one thing that did need a request was the language
    negotiation on `/`, and that is now a few lines in worker/index.ts.
  */
  output: "export",

  // Do not advertise the framework and version to anyone probing the site.
  poweredByHeader: false,

  images: {
    /*
      Resizing happens once, at build time, in `npm run photos` — there is no
      optimiser on the serving path, because a static export on Workers cannot
      load sharp. `lib/image-loader.ts` then points each request at the
      pre-generated width.

      This replaces `unoptimized: true`, which shipped no srcset at all and so
      sent a 375px phone the same 1536px file a desktop got.
    */
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",

    /*
      Must match the widths the script emits, or Next builds a srcset of URLs
      the loader has to round away from. See WIDTHS in scripts/optimize-photos.mjs.
    */
    deviceSizes: [480, 768, 1200, 1536],
    imageSizes: [256],
  },

  /*
    Dev only. Next warns that `headers()` cannot work with `output: "export"`,
    which is correct for the build — but it still applies while `next dev` is
    running, which is exactly where it is wanted. Production headers are in
    `public/_headers`.
  */
  ...(isDev
    ? {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [{ key: "Content-Security-Policy", value: devCsp }],
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
