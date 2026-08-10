import { useId } from "react";
import { Link } from "@/i18n/navigation";

export function DottedUnderline({
  onlyOnHover = false,
  forceVisible = false,
}: {
  onlyOnHover?: boolean;
  forceVisible?: boolean;
}) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="none"
      style={{ height: 4 }}
      className={`pointer-events-none absolute -bottom-[3px] left-0 w-full text-foreground transition-[color,opacity] duration-200 group-hover:text-brand${
        onlyOnHover
          ? forceVisible
            ? " opacity-100"
            : " opacity-0 group-hover:opacity-100"
          : ""
      }`}
    >
      <title>‌</title>
      <defs>
        <pattern id={id} width="6" height="4" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="2" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Link de contenido: soporta href externo o interno (mailto, http, archivos). */
export function DottedLink({
  href,
  external = false,
  className = "",
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group text-primary transition-colors hover:text-brand ${className}`.trim()}
    >
      <span className="relative inline-block">
        {children}
        <DottedUnderline />
      </span>
    </a>
  );
}

/** Link de contenido que conserva el locale, usando el `Link` de next-intl. */
export function DottedLocaleLink({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group text-primary transition-colors hover:text-brand ${className}`.trim()}
    >
      <span className="relative inline-block">
        {children}
        <DottedUnderline />
      </span>
    </Link>
  );
}
