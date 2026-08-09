import { NextResponse, type NextRequest } from "next/server";
import {
  LOCALES,
  LOCALE_COOKIE,
  isLocale,
  matchAcceptLanguage,
  type Locale,
} from "@/lib/i18n";

// Next 16 renamed the `middleware` file convention to `proxy`. Same request/response API.

function pickLocale(request: NextRequest): Locale {
  // An explicit choice from the language switcher always wins over the browser header.
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (fromCookie && isLocale(fromCookie)) return fromCookie;

  return matchAcceptLanguage(request.headers.get("accept-language"));
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, the API routes and anything with a file extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
