"use client";

import { useEffect } from "react";

/**
 * Mounted once. Hides the [data-reveal] elements that are still off-screen,
 * then animates each one in as it approaches.
 *
 * The hiding happens here, in JS, rather than in the stylesheet. That ordering
 * is the whole point: if this component never runs — JS disabled, bundle
 * failed, old browser — nothing is ever hidden and the page is simply complete.
 * Anything already on screen at mount is marked shown straight away, so there
 * is no flash of content disappearing and re-animating.
 *
 * Keeping the observer here also means the sections stay server components;
 * they only need a `data-reveal` attribute, not a "use client" boundary each.
 */
export default function RevealController() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (elements.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return; // leave everything visible

    let observerReported = false;

    const observer = new IntersectionObserver(
      (entries) => {
        // IntersectionObserver always delivers an initial observation, so any
        // working implementation sets this within a frame of observe().
        observerReported = true;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
    );

    const viewportHeight = window.innerHeight;

    for (const element of elements) {
      const rect = element.getBoundingClientRect();
      const onScreen = rect.top < viewportHeight && rect.bottom > 0;

      if (onScreen) {
        // Already visible to the reader — do not hide it just to animate it.
        element.setAttribute("data-hidden", "");
        element.setAttribute("data-shown", "");
        continue;
      }

      element.setAttribute("data-hidden", "");
      observer.observe(element);
    }

    /**
     * Safety net for a broken observer only.
     *
     * This used to reveal *everything* unconditionally after 4s, which meant
     * anyone who lingered on the hero — exactly the visitor the hero is built
     * for — had every section marked shown while still off-screen and never saw
     * a single reveal. The timer now bows out when the observer is healthy, and
     * takes over with a passive scroll handler only when it genuinely isn't.
     */
    let removeScrollFallback: (() => void) | undefined;

    const fallback = window.setTimeout(() => {
      if (observerReported) return;

      const revealWhatIsVisible = () => {
        const height = window.innerHeight;
        for (const element of elements) {
          if (element.hasAttribute("data-shown")) continue;
          const rect = element.getBoundingClientRect();
          if (rect.top < height && rect.bottom > 0) {
            element.setAttribute("data-shown", "");
          }
        }
      };

      revealWhatIsVisible();
      window.addEventListener("scroll", revealWhatIsVisible, { passive: true });
      removeScrollFallback = () => window.removeEventListener("scroll", revealWhatIsVisible);
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      removeScrollFallback?.();
    };
  }, []);

  return null;
}
