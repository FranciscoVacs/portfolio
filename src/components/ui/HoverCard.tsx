"use client";

import { useRef, useState } from "react";

export function HoverCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  function onMouseMove(event: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  function shadow() {
    const rect = ref.current?.getBoundingClientRect();
    if (!hovered || !rect) {
      return "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)";
    }
    const offsetX = (pos.x - rect.width / 2) / (rect.width / 2);
    const offsetY = (pos.y - rect.height / 2) / (rect.height / 2);
    const intensity = Math.min(1, Math.hypot(offsetX, offsetY) * 0.8);
    return `${-offsetX * 6}px ${-offsetY * 6}px ${12 + intensity * 4}px rgb(0 0 0 / ${0.08 + intensity * 0.06})`;
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: el seguimiento del mouse es puramente decorativo (sombra y resplandor); el contenido interactivo real son los links dentro del contenido, alcanzables por teclado como siempre
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-xl border border-border bg-background p-6 transition-all duration-300"
      style={{ boxShadow: shadow() }}
    >
      {hovered ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px 600px ellipse at ${pos.x}px ${pos.y}px, rgb(148 181 252 / 0.15), rgb(147 197 253 / 0.12), transparent 60%)`,
            filter: "blur(1px)",
          }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
