import { Link } from "@/i18n/navigation";

/**
 * Subrayado de puntos.
 *
 * Se dibuja con un gradiente repetido en vez de un patrón SVG porque
 * `background-position: center` centra la serie de puntos respecto al ancho
 * del texto: con un patrón SVG los puntos arrancan pegados al borde izquierdo
 * y el último queda cortado a la mitad.
 */
export function DottedUnderline({
  onlyOnHover = false,
  forceVisible = false,
}: {
  onlyOnHover?: boolean;
  forceVisible?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        backgroundImage:
          "radial-gradient(circle at center, currentColor 0 1px, transparent 1.2px)",
        backgroundSize: "6px 3px",
        backgroundRepeat: "repeat-x",
        backgroundPosition: "center bottom",
      }}
      className={`pointer-events-none absolute inset-x-0 -bottom-[3px] h-[3px] text-soft transition-[color,opacity] duration-200 group-hover:text-brand${
        onlyOnHover
          ? forceVisible
            ? " opacity-100"
            : " opacity-0 group-hover:opacity-100"
          : ""
      }`}
    />
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
