import { useTranslations } from "next-intl";
import type { Project } from "@/content/schema";
import { WorkCard } from "./WorkCard";

export function WorkGrid({ projects }: { projects: Project[] }) {
  const t = useTranslations("Work");

  if (projects.length === 0) {
    return <p className="mt-10 text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <div className="mt-10 flex flex-col gap-12">
      {projects.map((project) => (
        <WorkCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
