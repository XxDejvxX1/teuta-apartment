"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { site } from "@/content/site";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";

type NavCopy = {
  apartment: string;
  gallery: string;
  availability: string;
  gettingHere: string;
  whatsapp: string;
  guides: string;
  openMenu: string;
  closeMenu: string;
  skipToContent: string;
};

export default function Header({
  nav,
  whatsappHref,
  solid = false,
  showGuides = true,
}: {
  nav: NavCopy;
  whatsappHref: string;
  /** Pin the solid appearance — for pages with no hero behind the header. */
  solid?: boolean;
  /** Hidden when this language has no articles yet, so the link is never a dead end. */
  showGuides?: boolean;
}) {
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /*
    A guide page has no hero photograph for the header to sit over, so there is
    nothing to be transparent against — white links on sand are invisible.
    `solid` pins it to the scrolled appearance from the first paint.
  */
  const solidHeader = solid || pastHero;

  /*
    Bare hashes on the homepage, so the browser smooth-scrolls rather than
    navigating. On a guide page the same links have to carry the path home, or
    they point at sections that are not on the page.
  */
  const base = solid ? "/" : "";

  /*
    Four links is the budget, not a preference: the desktop bar has to fit the
    wordmark, the links, the language switcher and the WhatsApp pill above
    1024px, and a fifth pushes it past that. "What to do" takes the slot that
    was "Getting here" — the map section is low-intent and still one scroll
    away, where the articles are the reason someone who has never heard of us
    is on the site at all.
  */
  const links = [
    { href: `${base}#apartment`, label: nav.apartment },
    { href: `${base}#gallery`, label: nav.gallery },
    { href: `${base}#availability`, label: nav.availability },
    ...(showGuides ? [{ href: "/guide", label: nav.guides }] : []),
  ];

  // Watch a sentinel at the top of the hero rather than listening to scroll.
  // No scroll handler means no layout reads on the main thread while scrolling.
  useEffect(() => {
    if (solid) return; // pinned already; nothing to observe
    const sentinel = document.querySelector("[data-scroll-sentinel]");
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [solid]);

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

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        {nav.skipToContent}
      </a>

      {/*
        A floating pill rather than a bar welded to the top edge. It is a pill
        in both states, so only its colours cross-fade on scroll — no width,
        radius or position animates. See .header-pill in globals.css.
      */}
      <header
        data-on-dark={!solidHeader ? "" : undefined}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5"
      >
        <div
          className={[
            "header-bar header-pill mx-auto flex max-w-[1280px] items-center justify-between gap-6 rounded-full px-5 transition-[padding,color,background-color,border-color] duration-500 md:px-7",
            solidHeader ? "is-solid py-2.5 text-ink" : "py-3.5 text-white",
          ].join(" ")}
          style={{ transitionTimingFunction: "var(--ease-soft)" }}
        >
          <Link
            href="/"
            className="t-display text-[22px] tracking-[0.02em] md:text-[25px]"
            style={{ textShadow: solidHeader ? "none" : "0 1px 14px rgba(8,20,28,0.5)" }}
          >
            {site.name}
          </Link>

          <nav className="hidden items-center gap-8 text-[15px] font-normal tracking-[0.02em] nav:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{ textShadow: solidHeader ? "none" : "0 1px 14px rgba(8,20,28,0.5)" }}
              >
                {link.label}
              </a>
            ))}

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
                solidHeader ? "bg-accent text-white" : "bg-white text-deep",
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
            className="-mr-1 flex h-11 w-11 items-center justify-center nav:hidden"
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
        className="fixed inset-0 z-40 flex flex-col bg-sand/70 px-5 pb-10 pt-24 backdrop-blur-2xl backdrop-saturate-150 nav:hidden"
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
