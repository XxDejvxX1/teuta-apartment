"use client";

import { useEffect, useState } from "react";

import { WhatsAppIcon } from "@/components/icons";

/**
 * The header CTA scrolls away on phones, which is where most of this traffic
 * arrives. This keeps one tap to WhatsApp available the whole way down.
 */
export default function MobileCta({ label, href }: { label: string; href: string }) {
  const [pastHero, setPastHero] = useState(false);
  const [atClosingCta, setAtClosingCta] = useState(false);

  /*
    Two conditions, not one. The bar appears once the header's own CTA has
    scrolled away, and stands down again at the closing section — which has a
    WhatsApp button of its own and a footer this bar was sitting on top of.
  */
  const visible = pastHero && !atClosingCta;

  useEffect(() => {
    const sentinel = document.querySelector("[data-scroll-sentinel]");

    /*
      The sentinel lives in the hero, so it exists on the homepage only. A guide
      page has no hero to clear — without this fallback the button simply never
      appeared there, on the pages most likely to be someone's first arrival
      from a search result.
    */
    if (!sentinel) {
      const onScroll = () => setPastHero(window.scrollY > 400);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closing = document.querySelector("[data-final-cta]");
    if (!closing) return;

    /*
      -40% pulls the bottom of the observation area up, so the bar does not
      vanish the instant the section's top edge appears — it waits until the
      section has risen far enough that its own button is close to being on
      screen. Hiding on first pixel left a stretch with no WhatsApp button at all.
    */
    const observer = new IntersectionObserver(([entry]) => setAtClosingCta(entry.isIntersecting), {
      rootMargin: "0px 0px -40% 0px",
      threshold: 0,
    });
    observer.observe(closing);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-4 transition-transform duration-500 md:hidden"
      style={{
        transform: visible ? "none" : "translateY(140%)",
        transitionTimingFunction: "var(--ease-soft)",
        paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
      aria-hidden={!visible}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener"
        tabIndex={visible ? undefined : -1}
        className="pointer-events-auto flex items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-4 text-[16px] text-white shadow-[0_10px_30px_rgba(8,20,28,0.35)]"
      >
        <WhatsAppIcon size={18} />
        {label}
      </a>
    </div>
  );
}
