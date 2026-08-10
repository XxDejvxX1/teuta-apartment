"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import type { StaticImageData } from "next/image";
import { ArrowIcon, CloseIcon } from "@/components/icons";

export type LightboxSlide = {
  image: StaticImageData;
  title: string;
  alt: string;
};

/**
 * Loaded through next/dynamic on first open, so none of this ships in the
 * initial bundle.
 */
export default function Lightbox({
  slides,
  index,
  labels,
  onClose,
  onPrev,
  onNext,
}: {
  slides: LightboxSlide[];
  index: number;
  labels: { close: string; previous: string; next: string };
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const slide = slides[index];

  /*
    Mount and unmount only. This used to live in the keydown effect below,
    which depends on the three handlers — and Gallery passes fresh arrow
    functions on every render, so the effect tore down and re-ran on each
    arrow press. Each re-run recaptured `opener` from `document.activeElement`,
    which by then was this dialog's own Close button. Closing therefore
    restored focus to a node that had just been unmounted and it fell through
    to <body>, losing the keyboard user's place in the gallery.
  */
  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        onNext();
        return;
      }
      if (event.key === "ArrowLeft") {
        onPrev();
        return;
      }
      if (event.key !== "Tab") return;

      // Keep focus inside the dialog while it is open.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={slide.title}
      className="fixed inset-0 z-[100] flex flex-col bg-deep/95 backdrop-blur-sm"
    >
      {/* No printed title here either. `aria-label` on the dialog still carries
          the photo's name for assistive tech. */}
      <div className="flex items-center justify-end gap-4 px-5 py-4 text-white md:px-8">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-deep"
        >
          <span className="sr-only">{labels.close}</span>
          <CloseIcon size={20} />
        </button>
      </div>

      {/*
        `min-h-0` is load-bearing: a flex item defaults to `min-height: auto`,
        so without it this box refuses to shrink below the image's intrinsic
        height and the whole dialog grows past the viewport on a large screen.

        The image is then capped at its own natural size rather than stretched
        to fill. `h-full w-full` blew a 1024px photo up to the full width of a
        wide monitor, which is both oversized and soft.
      */}
      <div className="flex min-h-0 flex-1 items-center justify-center px-5 pb-4 md:px-8">
        <Image
          key={slide.image.src}
          src={slide.image}
          alt={slide.alt}
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, 90vw"
          className="h-auto max-h-full w-auto max-w-full rounded-2xl object-contain"
        />
      </div>

      <div className="flex items-center justify-center gap-6 px-5 pb-8 text-white md:pb-10">
        <button
          type="button"
          onClick={onPrev}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 transition-colors duration-300 hover:bg-white hover:text-deep"
        >
          <span className="sr-only">{labels.previous}</span>
          <ArrowIcon direction="left" size={20} />
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 transition-colors duration-300 hover:bg-white hover:text-deep"
        >
          <span className="sr-only">{labels.next}</span>
          <ArrowIcon direction="right" size={20} />
        </button>
      </div>
    </div>
  );
}
