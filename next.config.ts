import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Dev-only allowance so impeccable live mode can load its picker from the
 * helper server on port 8400.
 *
 * Guarded by NODE_ENV, so this entry never appears in a production build — the
 * shipped policy is byte-identical with or without this line. Delete it and
 * live mode simply stops working; nothing else changes.
 */
const __impeccableLiveDev =
  process.env.NODE_ENV === "development" ? " http://localhost:8400" : "";

/**
 * Content-Security-Policy.
 *
 * Deliberately NOT nonce-based. A per-request nonce would force every page to
 * render dynamically, and this site is prerendered — that is a real cost for a
 * page with no user input, no forms, no database and no session to steal.
 *
 * What this policy still buys, which is most of the value:
 *   - an injected `<script src="evil.com">` is blocked, because scripts may
 *     only come from this origin;
 *   - the page cannot be framed, so it cannot be used for clickjacking;
 *   - `<base>` injection and form hijacking to another origin are blocked;
 *   - plugins are off, and connections are limited to this origin.
 *
 * `'unsafe-inline'` is present for scripts because Next emits three inline
 * bootstrap scripts, and for styles because the page uses inline style
 * attributes throughout (the deck passes its geometry as custom properties).
 * Neither is reachable by an attacker while there is no user input on the page.
 *
 * If a form, a comment box, or anything else user-supplied is ever added,
 * upgrade this to nonces via proxy.ts and accept the dynamic rendering.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  // 'unsafe-eval' is required by the dev server's hot reload only.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${__impeccableLiveDev}`,
  "style-src 'self' 'unsafe-inline'",
  // data: and blob: cover next/image's blur-up placeholders.
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // ws: is the dev server's hot-reload socket.
  `connect-src 'self'${isDev ? " ws: wss:" : ""}${__impeccableLiveDev}`,
  // The only third party on the page, and it only loads once clicked.
  "frame-src https://www.google.com",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  // Do not advertise the framework and version to anyone probing the site.
  poweredByHeader: false,

  images: {
    /*
      Optimisation is off because it has nowhere to run. Next's optimiser needs
      sharp, a native binary, and the site is deployed to Cloudflare Workers,
      which cannot load one. The alternative the adapter offers is the paid
      Cloudflare Images binding.

      Neither is needed: `npm run photos` re-encodes the photographs to WebP at
      build time and the components import those directly, which took the set
      from 2.6 MB to 760 KB. The work is done before the bytes ever leave the
      repository, so the edge has nothing to add.

      `unoptimized` changes only how the URL is generated — width, height and
      the blur placeholder still come from the static imports, so there is no
      layout shift and no visual change.
    */
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Legacy companion to frame-ancestors, for older browsers.
          { key: "X-Frame-Options", value: "DENY" },
          // This site asks for none of these; say so explicitly.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          // Deliberately no `preload`: that is a hard-to-reverse commitment.
          ...(isDev
            ? []
            : [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]),
        ],
      },
    ];
  },
};

export default nextConfig;
