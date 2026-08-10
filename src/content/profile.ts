import { type Profile, profileSchema } from "./schema";

export const profile: Profile = profileSchema.parse({
  name: "Francisco Vacs",
  headline: {
    en: "Full-stack developer · Information Systems Engineering student",
    es: "Desarrollador full-stack · Estudiante de Ingeniería en Sistemas de Información",
  },
  bio: {
    en: "Final-year Information Systems Engineering student with a full-stack profile and experience in web and mobile development. I focus on building efficient, scalable solutions and I enjoy picking up new tools as I go.",
    es: "Estudiante de último año de Ingeniería en Sistemas de Información, con perfil full-stack y experiencia en desarrollo web y mobile. Me enfoco en construir soluciones eficientes y escalables, y disfruto incorporar herramientas nuevas en el camino.",
  },
  location: "Rosario, Argentina",
  email: "franciscovacs@gmail.com",
  github: "https://github.com/FranciscoVacs",
  linkedin: "https://linkedin.com/in/francisco-vacs",
  avatar: "/avatar.png",
  cv: "/cv/francisco-vacs-cv-en.pdf",
});
