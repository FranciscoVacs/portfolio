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
import { siteSchema } from "./portfolio-settings";

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
  site: siteSchema.nullable().optional(),
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
      siteTranslation: z.enum(["ready", "stale", "missing"]).optional(),
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
  const site = data.site;
  const recordSetting = (kind: string, id: string) =>
    site?.records.find((r) => r.key === `${kind}:${id}`);
  const managed = site?.projects
    .map((p) => {
      const [kind, id] = p.source.split(":");
      const r = (kind === "experience" ? data.experience : data.projects).find(
        (r) => r.id === id,
      );
      if (!p.visible || (p.source && !r)) return null;
      return {
        slug: p.id,
        title: p.title || r?.organization || "",
        category: p.category,
        featured: p.featured,
        period: {
          start: p.start || r?.start || "",
          ...(p.end || r?.end ? { end: p.end || r?.end || undefined } : {}),
        },
        summary: localized(p.summary || r?.role || ""),
        story: localized(p.story || r?.description || ""),
        stack: p.stack.length ? p.stack : r?.skills || [],
        links: {
          live: p.links.live || undefined,
          repo: p.links.repo || undefined,
          store: p.links.store || undefined,
        },
        image: p.image.src
          ? {
              ...p.image,
              alt: localized(p.image.alt || p.title || r?.organization || ""),
            }
          : undefined,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
  const linkedProjects = data.projects.filter(
    (r) => !site?.projects.some((p) => p.source === `projects:${r.id}`),
  );
  return {
    profile: {
      name: data.name,
      email: data.email,
      github: findLink("github.com"),
      linkedin: findLink("linkedin.com"),
      avatar: site ? site.avatar || undefined : originalProfile.avatar,
      location: site?.location || "",
      headline: localized(site?.headline || ""),
      bio: localized(site?.bio || data.summary),
      whatsapp: site?.whatsapp || undefined,
      links: site?.links,
      cv: localized(data.pdf.classic),
    },
    experience: data.experience
      .filter((r) => recordSetting("experience", r.id)?.visible !== false)
      .map((r) => ({
        company: r.organization,
        role: localized(r.role),
        location: r.location,
        period: period(r),
        story: localized(
          recordSetting("experience", r.id)?.description || r.description,
        ),
      })),
    education: data.education
      .filter((r) => recordSetting("education", r.id)?.visible !== false)
      .map((r) => ({
        institution: r.organization,
        degree: localized(r.role),
        location: r.location,
        period: period(r),
        url:
          recordSetting("education", r.id)?.url ||
          (site ? undefined : educationAssets[r.id]?.url),
        logo: recordSetting("education", r.id)?.logo.src
          ? recordSetting("education", r.id)?.logo
          : site
            ? undefined
            : educationAssets[r.id]?.logo,
        story: localized(
          recordSetting("education", r.id)?.description || r.description,
        ),
      })),
    projects: [
      ...(managed || []),
      ...linkedProjects.map(
        (r): Project => ({
          slug: r.id,
          title: r.organization,
          category: "personal",
          featured: !site,
          period: period(r),
          summary: localized(r.role),
          story: localized(r.description),
          stack: r.skills,
          links: projectAssets[r.id]?.links || {},
          image: projectAssets[r.id]?.image,
        }),
      ),
    ],
    skills: [...new Set(Object.values(data.skills).flat())],
    extra: {
      ...data,
      courses: data.courses
        .filter((r) => recordSetting("courses", r.id)?.visible !== false)
        .map((r) => ({
          ...r,
          description:
            recordSetting("courses", r.id)?.description || r.description,
        })),
    },
  };
}
