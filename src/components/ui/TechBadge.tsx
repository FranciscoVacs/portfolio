import { TECH_ICONS } from "@/lib/tech-icons";

/**
 * Badge de tecnología con el logo oficial en color de marca.
 *
 * Una tecnología sin logo conocido (por ejemplo "REST API") sigue mostrando
 * su badge, solo que sin ícono: nunca se pierde información del stack.
 */
export function TechBadge({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md";
}) {
  const icon = TECH_ICONS[name];
  const md = size === "md";

  return (
    <span
      className={`inline-flex items-center rounded-md border border-border bg-paper font-mono text-primary transition-colors hover:border-soft ${
        md ? "gap-2 px-3 py-1.5 text-sm" : "gap-1.5 px-2 py-1 text-xs"
      }`}
    >
      {icon ? (
        <svg
          viewBox="0 0 24 24"
          width={md ? 16 : 13}
          height={md ? 16 : 13}
          fill={icon.hex}
          aria-hidden="true"
          className="shrink-0"
        >
          <path d={icon.path} />
        </svg>
      ) : null}
      {name}
    </span>
  );
}
