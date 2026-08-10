import { z } from "zod";
import { parseAll } from "./schema";

/**
 * Tecnologías que se muestran en el home. Cada una debe tener un logo en
 * TECH_ICONS (lo verifica content.test.ts); para agregar una nueva hay que
 * regenerar los íconos con scripts/gen-tech-icons.mjs.
 */
export const skills: string[] = parseAll(
  z.string().min(1),
  [
    "Angular",
    "React Native",
    "Expo",
    "Node.js",
    "TypeScript",
    "Tailwind CSS",
    "Python",
    "PostgreSQL",
    "MySQL",
    "Supabase",
    "Git",
    "GitHub",
  ],
  "skills",
);
