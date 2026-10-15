import { z } from "zod";
import { education as originalEducation } from "@/content/education";
import { experience as originalExperience } from "@/content/experience";
import catalogJson from "@/content/generated/cv.json";
import { profile as originalProfile } from "@/content/profile";
import { projects as originalProjects } from "@/content/projects";
import type {
  EducationItem,
  ExperienceItem,
  Locale,
  Profile,
  Project,
} from "@/content/schema";
import { skills as originalSkills } from "@/content/skills";

// gestion-cv-public-v1: public snapshot only; no access to the administration server.
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const record = z.object({
  id: z.string(),
  organization: z.string(),
  role: z.string(),
  location: z.string(),
  start: month,
  end: month.nullable(),
  description: z.string(),
  skills: z.array(z.string()),
});
const pdfPath = z.string().regex(/^\/cv\/gestion\/[a-zA-Z0-9-]+\.pdf$/);
const content = z.object({
  name: z.string(),
  email: z.email(),
  links: z.array(z.object({ label: z.string(), url: z.url() })),
  summary: z.string(),
  experience: z.array(record),
  projects: z.array(record),
  education: z.array(record),
  courses: z.array(record),
  skills: z.object({
    technical: z.array(z.string()),
    tools: z.array(z.string()),
    additional: z.array(z.string()),
  }),
  languages: z.array(z.object({ name: z.string(), level: z.string() })),
  pdf: z.object({ classic: pdfPath, europass: pdfPath.optional() }),
});
export const catalogSchema = z.object({
  schema: z.literal("gestion-cv-public-v1"),
  defaultProfile: z.string().nullable(),
  profiles: z.array(
    z.object({
      id: z.string().regex(/^[a-zA-Z0-9-]+$/),
      name: z.string(),
      digest: z.string(),
      translation: z.enum(["ready", "stale", "missing"]),
      locales: z.object({ es: content, en: content.nullable() }),
    }),
  ),
});
export const cvCatalog = catalogSchema.parse(catalogJson);
type Catalog = z.infer<typeof catalogSchema>;
export type CvContent = z.infer<typeof content>;
export type PortfolioBundle = {
  profile: Profile;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: Project[];
  skills: string[];
  extra: CvContent | null;
};

// Only graphical assets are kept here. Descriptions, dates and skills come from the CV.
const educationAssets: Record<string, EducationItem | undefined> = {
  utn: originalEducation[0],
  epctv: originalEducation[1],
  politecnico: originalEducation[2],
};
const projectAssets: Record<string, Project | undefined> = {
  "plataforma-entradas": originalProjects.find((p) => p.slug === "bohemia"),
};
const localized = (value: string) => ({ es: value, en: value });
const period = (r: z.infer<typeof record>) => ({
  start: r.start,
  ...(r.end ? { end: r.end } : {}),
});

export function resolveCv(
  locale: Locale,
  id?: string,
  catalog: Catalog = cvCatalog,
) {
  const entry = catalog.profiles.find(
    (p) => p.id === (id || catalog.defaultProfile),
  );
  return { entry, content: entry?.locales[locale] || null };
}

export function portfolioBundle(data: CvContent | null): PortfolioBundle {
  if (!data)
    return {
      profile: originalProfile,
      experience: originalExperience,
      education: originalEducation,
      projects: originalProjects,
      skills: originalSkills,
      extra: null,
    };
  const findLink = (host: string) =>
    data.links.find(
      (l) => new URL(l.url).hostname.replace(/^www\./, "") === host,
    )?.url || "";
  return {
    profile: {
      name: data.name,
      email: data.email,
      github: findLink("github.com"),
      linkedin: findLink("linkedin.com"),
      avatar: originalProfile.avatar,
      location:
        data.experience[0]?.location || data.education[0]?.location || "",
      headline: localized(""),
      bio: localized(data.summary),
      cv: localized(data.pdf.classic),
    },
    experience: data.experience.map((r) => ({
      company: r.organization,
      role: localized(r.role),
      location: r.location,
      period: period(r),
      story: localized(r.description),
    })),
    education: data.education.map((r) => ({
      institution: r.organization,
      degree: localized(r.role),
      location: r.location,
      period: period(r),
      url: educationAssets[r.id]?.url,
      logo: educationAssets[r.id]?.logo,
    })),
    projects: data.projects.map((r) => ({
      slug: r.id,
      title: r.organization,
      category: "personal",
      featured: true,
      period: period(r),
      summary: localized(r.role),
      story: localized(r.description),
      stack: r.skills,
      links: projectAssets[r.id]?.links || {},
      image: projectAssets[r.id]?.image,
    })),
    skills: [...new Set(Object.values(data.skills).flat())],
    extra: data,
  };
}
