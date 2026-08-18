/**
 * The whole server.
 *
 * It used to negotiate a language on `/` and redirect to `/en`, `/sq` or `/it`.
 * Albanian and Italian were dropped in August 2026 and the pages moved to the
 * root, so there is no longer a decision to make per request — `/` is a static
 * file like everything else.
 *
 * What is left is the move itself. The site was live and indexed under `/en/*`,
 * so those URLs 301 to their new home rather than 404ing: `/en` to `/`,
 * `/en/guide/day-trips` to `/guide/day-trips`. 301 rather than 307 on purpose —
 * this is permanent, and a permanent redirect is what passes ranking to the new
 * URL and gets the old one dropped from the index.
 *
 * `run_worker_first` in wrangler.jsonc narrows this to `/en/*`, so the Worker
 * is not woken for anything else. Once Google has re-crawled, essentially
 * nothing reaches it at all and the whole file can go.
 */
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const LEGACY_PREFIX = "/en";

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    const isLegacy = pathname === LEGACY_PREFIX || pathname.startsWith(`${LEGACY_PREFIX}/`);
    if (!isLegacy) return env.ASSETS.fetch(request);

    // `/en` and `/en/` both become `/`; `/en/guide` becomes `/guide`.
    url.pathname = pathname.slice(LEGACY_PREFIX.length) || "/";

    // Rebuilding from the URL keeps any query string and hash the visitor had.
    return new Response(null, {
      status: 301,
      headers: {
        Location: url.toString(),
        /*
          Safe to cache hard: unlike the language negotiation this replaces, the
          answer is the same for every visitor and will not change again.
        */
        "Cache-Control": "public, max-age=86400",
      },
    });
  },
};

export default worker;
