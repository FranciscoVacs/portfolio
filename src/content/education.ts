import { type EducationItem, educationSchema, parseAll } from "./schema";

export const education: EducationItem[] = parseAll(
  educationSchema,
  [
    {
      institution: "Universidad Tecnológica Nacional",
      degree: {
        en: "Information Systems Engineering — in progress (5th year)",
        es: "Ingeniería en Sistemas de Información — en curso (5.º año)",
      },
      location: "Rosario, Argentina",
      period: { start: "2022-03" },
    },
    {
      institution: "Escuela Provincial de Cine y Televisión",
      degree: {
        en: "Audiovisual Production Technician",
        es: "Técnico en Producción Audiovisual",
      },
      location: "Rosario, Argentina",
      period: { start: "2022-03", end: "2025-12" },
    },
    {
      institution: "Instituto Politécnico Superior General San Martín",
      degree: {
        en: "Computer Systems Technician",
        es: "Técnico en Sistemas Informáticos",
      },
      location: "Rosario, Argentina",
      period: { start: "2016-03", end: "2021-12" },
    },
  ],
  "education",
);
