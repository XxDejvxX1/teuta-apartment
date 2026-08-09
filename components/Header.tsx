"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { LOCALES, LOCALE_COOKIE, LOCALE_SHORT, type Locale } from "@/lib/i18n";
import { site } from "@/content/site";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";

type NavCopy = {
  apartment: string;
  gallery: string;
  availability: string;
  gettingHere: string;
  whatsapp: string;
  openMenu: string;
  closeMenu: string;
  language: string;
  skipToContent: string;
};

export default function Header({
  lang,
  nav,
  whatsappHref,
}: {
  lang: Locale;
  nav: NavCopy;
  whatsappHref: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const links = [
    { href: "#apartment", label: nav.apartment },
    { href: "#gallery", label: nav.gallery },
    { href: "#availability", label: nav.availability },
    { href: "#getting-here", label: nav.gettingHere },
  ];

  // Watch a sentinel at the top of the hero rather than listening to scroll.
  // No scroll handler means no layout reads on the main thread while scrolling.
  useEffect(() => {
    const sentinel = document.querySelector("[data-scroll-sentinel]");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Lock the page behind the mobile sheet, and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const chooseLocale = (locale: Locale) => {
    // Remember the choice so the proxy stops guessing from Accept-Language.
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        {nav.skipToContent}
      </a>

      <header
        data-on-dark={!scrolled ? "" : undefined}
        className={[
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled
            ? "bg-sand/85 shadow-[0_1px_0_rgba(18,36,46,0.08)] backdrop-blur-md"
            : "bg-transparent",
        ].join(" ")}
        style={{ transitionTimingFunction: "var(--ease-soft)" }}
      >
        <div
          className={[
            "header-bar mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 transition-[padding,color] duration-500 md:px-11",
            scrolled ? "py-3.5 text-ink" : "py-5 text-white md:py-7",
          ].join(" ")}
          style={{ transitionTimingFunction: "var(--ease-soft)" }}
        >
          <Link
            href={`/${lang}`}
            className="t-display text-[22px] tracking-[0.02em] md:text-[25px]"
            style={{ textShadow: scrolled ? "none" : "0 1px 14px rgba(8,20,28,0.5)" }}
          >
            {site.name}
          </Link>

          <nav className="hidden items-center gap-8 text-[15px] font-normal tracking-[0.02em] md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{ textShadow: scrolled ? "none" : "0 1px 14px rgba(8,20,28,0.5)" }}
              >
                {link.label}
              </a>
            ))}

            <LocaleSwitcher lang={lang} label={nav.language} onChoose={chooseLocale} />

            {/*
              White over the hero, accent once the header goes solid. A white
              pill on the scrolled sand header was a 1.03:1 fill separation held
              up by nothing but its drop shadow — the page's only persistent CTA
              dissolved the moment anyone started reading.
            */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener"
              className={[
                "btn-light inline-flex items-center gap-2.5 rounded-[10px] px-5 py-2.5 text-[15px] tracking-[0.01em] shadow-(--shadow-pill)",
                scrolled ? "bg-accent text-white" : "bg-white text-deep",
              ].join(" ")}
            >
              <WhatsAppIcon />
              {nav.whatsapp}
            </a>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          >
            <span className="sr-only">{menuOpen ? nav.closeMenu : nav.openMenu}</span>
            {menuOpen ? (
              <ArrowIcon direction="left" size={22} />
            ) : (
              <span aria-hidden className="relative block h-4 w-6">
                <span className="absolute left-0 top-[2px] block h-px w-6 bg-current" />
                <span className="absolute left-0 top-[7px] block h-px w-6 bg-current" />
                <span className="absolute left-0 top-[12px] block h-px w-6 bg-current" />
              </span>
            )}
          </button>
        </div>
      </header>

      {/*
        See-through sheet: the photograph behind stays legible through a heavy
        blur, so the menu reads as a layer over the place rather than a slab
        covering it. Tapping anywhere off the links closes it, as does the back
        arrow in the header and Escape.
      */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
        className="fixed inset-0 z-40 flex flex-col bg-sand/70 px-5 pb-10 pt-24 backdrop-blur-2xl backdrop-saturate-150 md:hidden"
      >
        <nav className="flex flex-col" onClick={(event) => event.stopPropagation()}>
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="t-display border-b border-ink/10 py-5 text-[30px] text-ink"
              style={{
                // Links arrive in sequence behind the sheet.
                animation: menuOpen
                  ? `hero-fade 480ms var(--ease-soft) both ${80 + index * 55}ms`
                  : undefined,
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div
          className="mt-8 flex items-center gap-4 text-ink"
          onClick={(event) => event.stopPropagation()}
        >
          <LocaleSwitcher lang={lang} label={nav.language} onChoose={chooseLocale} />
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener"
          onClick={(event) => event.stopPropagation()}
          className="btn-light mt-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-4 text-[16px] text-white"
        >
          <WhatsAppIcon />
          {nav.whatsapp}
        </a>
      </div>
    </>
  );
}

function LocaleSwitcher({
  lang,
  label,
  onChoose,
}: {
  lang: Locale;
  label: string;
  onChoose: (locale: Locale) => void;
}) {
  return (
    <div className="flex items-center text-[13px] tracking-[0.08em]">
      <span className="sr-only">{label}</span>
      {LOCALES.map((locale, index) => (
        <span key={locale} className="flex items-center">
          {index > 0 && (
            <span aria-hidden className="opacity-40">
              ·
            </span>
          )}
          {/* Each was a bare 19x20 word sitting 4px from its neighbour — under
              the target minimum on both size and spacing. */}
          <Link
            href={`/${locale}`}
            hrefLang={locale}
            onClick={() => onChoose(locale)}
            aria-current={locale === lang ? "true" : undefined}
            className={[
              "flex min-h-6 items-center px-2 py-1",
              locale === lang ? "font-medium" : "opacity-65 hover:opacity-100",
            ].join(" ")}
          >
            {LOCALE_SHORT[locale]}
          </Link>
        </span>
      ))}
    </div>
  );
}
