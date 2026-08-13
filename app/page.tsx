import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { LOCALE_COOKIE, isLocale, matchAcceptLanguage } from "@/lib/i18n";

/**
 * Sends `/` to the right language.
 *
 * This used to be `proxy.ts`. Next 16 runs proxy/middleware on the Node.js
 * runtime and offers no edge option — "Proxy does not support Edge runtime" —
 * while Cloudflare Workers cannot host the Node runtime, so the OpenNext build
 * refuses outright. The negotiation itself was never the problem, only where it
 * ran, so it moved into a route that Workers can serve.
 *
 * One behavioural difference, deliberate. The old matcher caught every path, so
 * `/anything` became `/en/anything`. This catches only `/`; unknown paths now
 * 404. That is the better answer anyway — the site is one page per language
 * with hash anchors, so there was never an `/anything` worth redirecting, and a
 * 404 is a truer signal to a crawler than a redirect into a page that does not
 * mention what was asked for.
 *
 * Reading a header makes this route dynamic, which is the point: the answer
 * differs per visitor and must not be cached as one language for everyone.
 */
export default async function RootPage() {
  // An explicit choice from the language switcher always wins over the browser.
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (fromCookie && isLocale(fromCookie)) redirect(`/${fromCookie}`);

  const accept = (await headers()).get("accept-language");
  redirect(`/${matchAcceptLanguage(accept)}`);
}
