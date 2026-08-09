"use client";

import { useEffect, useState } from "react";

import { WhatsAppIcon } from "@/components/icons";

/**
 * The header CTA scrolls away on phones, which is where most of this traffic
 * arrives. This keeps one tap to WhatsApp available the whole way down.
 */
export default function MobileCta({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.querySelector("[data-scroll-sentinel]");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
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
