import { useTranslations } from "next-intl";
import { RevealContent } from "@/components/ui/RevealContent";
import type { Project } from "@/content/schema";
import { WorkCard } from "./WorkCard";

export function WorkGrid({ projects }: { projects: Project[] }) {
  const t = useTranslations("Work");

  if (projects.length === 0) {
    return <p className="mt-10 text-foreground">{t("empty")}</p>;
  }

  return (
    <RevealContent className="mt-10 flex flex-col gap-6">
      {projects.map((project) => (
        <WorkCard key={project.slug} project={project} />
      ))}
    </RevealContent>
  );
}
