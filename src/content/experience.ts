import { type ExperienceItem, experienceSchema, parseAll } from "./schema";

export const experience: ExperienceItem[] = parseAll(
  experienceSchema,
  [
    {
      company: "CUNUMI",
      role: {
        en: "Full Stack Developer — Freelance Contract",
        es: "Desarrollador Full Stack — Contrato freelance",
      },
      location: "Rosario, Argentina",
      period: { start: "2026-05" },
      highlights: {
        en: [
          "Built a Progressive Web App for pet management, business management and social networking.",
          "Designed and implemented a PostgreSQL database on Supabase.",
          "Migrated the backend infrastructure from Firebase to Supabase.",
          "Built a cross-platform mobile app with React Native to replace the PWA.",
        ],
        es: [
          "Desarrollé una Progressive Web App de gestión de mascotas, gestión de negocios y red social.",
          "Diseñé e implementé una base de datos PostgreSQL sobre Supabase.",
          "Migré la infraestructura de backend de Firebase a Supabase.",
          "Desarrollé una app mobile multiplataforma con React Native para reemplazar la PWA.",
        ],
      },
    },
    {
      company: "Profitwell",
      role: {
        en: "Python Developer",
        es: "Desarrollador Python",
      },
      location: "Rosario, Argentina",
      period: { start: "2021-08", end: "2021-11" },
      highlights: {
        en: [
          "Built automation tools integrating APIs and databases.",
          "Worked in an Agile environment using Scrum.",
          "Managed source code and version control with Git and GitHub.",
        ],
        es: [
          "Desarrollé herramientas de automatización integrando APIs y bases de datos.",
          "Trabajé en un entorno ágil con metodología Scrum.",
          "Gestioné el código fuente y el control de versiones con Git y GitHub.",
        ],
      },
    },
  ],
  "experience",
);
