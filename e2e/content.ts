import raw from "../src/content/generated/cv.json";
import { catalogSchema } from "../src/lib/cv-bridge";

const catalog = catalogSchema.parse(raw);
export const connected = catalog.profiles.find(
  (p) => p.id === catalog.defaultProfile,
);
export const currentEn = connected?.locales.en;
