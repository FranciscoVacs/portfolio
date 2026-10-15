import { useLocale } from "next-intl";
import { DottedLocaleLink } from "@/components/ui/DottedLink";
import { cvCatalog } from "@/lib/cv-bridge";

export function ProfilePicker({ active }: { active: string }) {
  const locale = useLocale();
  return (
    <nav
      aria-label={
        locale === "es" ? "Perfil profesional" : "Professional profile"
      }
      className="flex flex-wrap gap-x-5 gap-y-3 pt-8 font-mono text-xs"
    >
      {cvCatalog.profiles.map((p) => (
        <DottedLocaleLink
          key={p.id}
          href={`/perfil/${p.id}`}
          className={p.id === active ? "font-semibold" : ""}
        >
          {p.name}
        </DottedLocaleLink>
      ))}
    </nav>
  );
}
