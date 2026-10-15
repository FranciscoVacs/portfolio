import raw from "../src/content/generated/cv.json";
import { catalogSchema, portfolioBundle } from "../src/lib/cv-bridge";

const catalog = catalogSchema.parse(raw);
export const connected = catalog.profiles.find(
  (p) => p.id === catalog.defaultProfile,
);
export const currentEn = connected?.locales.en;

export const currentProjects = portfolioBundle(currentEn || null).projects;
export const profileCount = catalog.profiles.length;
