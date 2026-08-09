import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The carousel behind both the photo gallery and the reviews.
 *
 * Layout is decided by CSS (scroll-snap row below 768px, coverflow above), so
 * this hook only tracks which item is centred and hands back the geometry each
 * item needs. Nothing here reads the viewport width for layout, which is what
 * broke the original gallery on resize.
 */
export function useDeck(count: number) {
  const [active, setActive] = useState(0);
  const [coverflow, setCoverflow] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  /** Mirrors `coverflow` for the observer, which can fire mid state update. */
  const coverflowRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      coverflowRef.current = query.matches;
      setCoverflow(query.matches);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Follow the user's finger on the mobile scroll row.
  //
  // Only while that row is the actual layout. The coverflow track is
  // `overflow: visible` with items translated hundreds of pixels either side,
  // so its scrollWidth exceeds its clientWidth there too — testing that instead
  // of the breakpoint once let this observer drive `active` on desktop and land
  // the deck on an arbitrary item at load.
  useEffect(() => {
    if (coverflow) return;

    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (coverflowRef.current) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { root: track, threshold: 0.6 },
    );

    track.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [coverflow]);

  const show = useCallback(
    (index: number) => {
      const next = ((index % count) + count) % count;
      setActive(next);

      // In coverflow the cards move by transform; scrollIntoView would scroll
      // the page instead, since the track itself never scrolls.
      if (coverflow) return;

      trackRef.current
        ?.querySelector<HTMLElement>(`[data-index="${next}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    },
    [count, coverflow],
  );

  /**
   * Arrow keys are handled on the deck itself rather than on window, so they
   * do not steal arrow-key scrolling from the rest of the page.
   */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(active - 1);
    }
  };

  const geometry = (index: number) => {
    let delta = index - active;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    const distance = Math.abs(delta);
    return { delta, distance, visible: distance <= 2.5, isActive: delta === 0 };
  };

  return { active, coverflow, trackRef, show, onKeyDown, geometry };
}

export type DeckGeometry = ReturnType<ReturnType<typeof useDeck>["geometry"]>;

/**
 * Custom properties the CSS reads to place one item.
 *
 * `rotate` and `dim` are the knobs that separate the two decks. Photographs
 * can take a 26° turn and a drop to 0.72 opacity; body text cannot — rotated
 * paragraphs are unreadable, and dimming #3a4c56 to 0.72 over sand lands at
 * 4.05:1, under the 4.5:1 floor the rest of the page now meets.
 */
export function deckItemStyle(
  { delta, distance, visible, isActive }: DeckGeometry,
  { rotate = 26, dim = 0.72 }: { rotate?: number; dim?: number } = {},
): React.CSSProperties {
  const turn = isActive ? 0 : delta > 0 ? -rotate : rotate;

  return {
    ["--d" as string]: delta,
    ["--abs" as string]: distance,
    ["--rot" as string]: `${turn}deg`,
    ["--scale" as string]: isActive ? 1 : 0.94,
    ["--op" as string]: visible ? (isActive ? 1 : dim) : 0,
    ["--z" as string]: 100 - distance * 10,
    ["--pe" as string]: visible ? "auto" : "none",
    ["--shadow-y" as string]: isActive ? "40px" : "18px",
    ["--shadow-blur" as string]: isActive ? "90px" : "44px",
    ["--shadow-a" as string]: isActive ? 0.28 : 0.16,
  };
}
