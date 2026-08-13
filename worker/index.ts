import { LOCALE_COOKIE, isLocale, matchAcceptLanguage } from "../lib/i18n";

/**
 * The whole server.
 *
 * Everything on this site is a static file except one decision: which language
 * someone landing on `/` should get. That used to be Next middleware, then a
 * server-rendered route; both needed a Next runtime on the edge, and the adapter
 * that provides one does not work (see next.config.ts). So the site is exported
 * as static files and this is the only code that runs per request.
 *
 * `run_worker_first` in wrangler.jsonc limits that to `/` alone. Every other
 * request is served straight from Cloudflare's asset store without waking this
 * up, which is both faster and free — static asset requests are not billed as
 * Worker requests.
 */
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

/** Reads one cookie without pulling in a parser. */
function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;

  for (const pair of header.split(";")) {
    const index = pair.indexOf("=");
    if (index === -1) continue;
    if (pair.slice(0, index).trim() !== name) continue;

    try {
      return decodeURIComponent(pair.slice(index + 1).trim());
    } catch {
      // A malformed cookie is not worth a 500; fall through to the header.
      return null;
    }
  }

  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== "/") return env.ASSETS.fetch(request);

    // An explicit choice from the language switcher always wins over the browser.
    const chosen = readCookie(request.headers.get("cookie"), LOCALE_COOKIE);
    const locale =
      chosen && isLocale(chosen)
        ? chosen
        : matchAcceptLanguage(request.headers.get("accept-language"));

    return new Response(null, {
      status: 307,
      headers: {
        Location: `/${locale}`,
        /*
          The answer differs per visitor, so it must never be cached as one
          language for everyone — by Cloudflare, by a corporate proxy, or by the
          browser. `Vary` states what it depends on; `no-store` is the belt to
          that braces, because a redirect this cheap gains nothing from caching.
        */
        Vary: "Accept-Language, Cookie",
        "Cache-Control": "no-store",
      },
    });
  },
};
