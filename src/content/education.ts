import { type EducationItem, educationSchema, parseAll } from "./schema";

export const education: EducationItem[] = parseAll(
  educationSchema,
  [
    {
      institution: "Universidad Tecnológica Nacional",
      degree: {
        en: "Information Systems Engineering - in progress (5th year)",
        es: "Ingeniería en Sistemas de Información - en curso (5.º año)",
      },
      location: "Rosario, Argentina",
      period: { start: "2022-03" },
      url: "https://www.frro.utn.edu.ar/",
      logo: { src: "/education/utn.png", width: 920, height: 1081 },
    },
    {
      institution: "Escuela Provincial de Cine y Televisión",
      degree: {
        en: "Audiovisual Production Technician",
        es: "Técnico en Realización Audiovisual",
      },
      location: "Rosario, Argentina",
      period: { start: "2022-03", end: "2025-12" },
      url: "https://epctv.edu.ar/",
      logo: { src: "/education/epctv.png", width: 1191, height: 582 },
    },
    {
      institution: "Instituto Politécnico Superior General San Martín",
      degree: {
        en: "Computer Systems Technician",
        es: "Técnico en Informática Profesional y Personal",
      },
      location: "Rosario, Argentina",
      period: { start: "2016-03", end: "2021-12" },
      url: "https://www.ips.edu.ar/",
      logo: { src: "/education/ips.png", width: 1000, height: 1000 },
    },
  ],
  "education",
);
