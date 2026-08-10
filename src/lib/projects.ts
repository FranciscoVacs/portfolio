import {
  PROJECT_CATEGORIES,
  type Project,
  type ProjectCategory,
} from "@/content/schema";

export type WorkFilter = "all" | ProjectCategory;

function isProjectCategory(value: string): value is ProjectCategory {
  return (PROJECT_CATEGORIES as readonly string[]).includes(value);
}

/** Un filtro desconocido cae en "all" en vez de mostrar una lista vacía. */
export function parseWorkFilter(value: string | undefined): WorkFilter {
  if (!value || value === "all") return "all";
  return isProjectCategory(value) ? value : "all";
}

export function filterProjects(
  projects: Project[],
  filter: WorkFilter,
): Project[] {
  if (filter === "all") return [...projects];
  return projects.filter((project) => project.category === filter);
}

export function sortByRecency(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => b.period.start.localeCompare(a.period.start));
}

export function featuredProjects(projects: Project[]): Project[] {
  return sortByRecency(projects.filter((project) => project.featured));
}
