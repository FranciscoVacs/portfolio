"use client";

import { useEffect, useRef } from "react";

export function RevealContent({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const items = Array.from(root.children) as HTMLElement[];

    if (reduced) {
      for (const el of items) el.classList.add("revealed", "reveal-settled");
      return;
    }

    const settle = (event: TransitionEvent) => {
      const el = event.currentTarget as HTMLElement;
      if (event.propertyName === "filter") el.classList.add("reveal-settled");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("revealed");
          el.addEventListener("transitionend", settle, { once: true });
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    for (const el of items) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="reveal-content">
      {children}
    </div>
  );
}
