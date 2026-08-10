import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { TechBadge } from "@/components/ui/TechBadge";
import { skills } from "@/content/skills";

export function Skills() {
  const t = useTranslations("Home");

  return (
    <Section title={t("skills")}>
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li key={skill}>
            <TechBadge name={skill} size="md" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
