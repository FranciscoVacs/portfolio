"use client";

import { Link, usePathname } from "@/i18n/navigation";

export function ProfileHomeLink() {
  const scope = usePathname().match(/^\/perfil\/[^/]+/)?.[0];
  return (
    <Link
      href={scope || "/"}
      className="font-medium font-mono text-sm tracking-wide"
    >
      FV
    </Link>
  );
}
