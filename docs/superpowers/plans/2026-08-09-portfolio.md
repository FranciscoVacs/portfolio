# Portfolio de Francisco Vacs — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el portfolio personal bilingüe de Francisco Vacs con páginas Home, Work, FAV y CV, sin base de datos, y desplegarlo en Vercel.

**Architecture:** Aplicación Next.js 16 con App Router. Todo el contenido vive en archivos TypeScript bajo `src/content/`, validados con Zod al importarse, y se consume desde componentes que reciben datos por props y no conocen el contenido. La internacionalización usa next-intl con rutas `/en` y `/es`. No hay base de datos, API routes ni variables de entorno.

**Tech Stack:** Next.js 16.3, React 19.2, TypeScript 5, Tailwind CSS 4, next-intl 4, next-themes, Zod 4, Biome 2, Vitest 4, Playwright 1.6x, Vercel.

**Sobre shadcn/ui:** el spec lo lista en el stack, pero el diseño sobrio que se
aprobó no usa ninguna primitiva compleja: toda la interfaz son links, listas y
un botón. Instalarlo ahora sería peso muerto. En su lugar, los tokens de color
de la Task 7 usan **los nombres que shadcn/ui espera** (`--background`,
`--foreground`, `--muted-foreground`, `--border`), así que el día que haga falta
un componente real (un diálogo, un menú desplegable, un formulario) alcanza con
`npx shadcn@latest init` y `npx shadcn@latest add <componente>` y entra sin
tocar la paleta. Esta es una desviación consciente del spec, en favor de YAGNI.

## Global Constraints

- Node.js 20.9 o superior. TypeScript 5.1 o superior.
- Next.js 16: `params` y `searchParams` son Promesas y **siempre** se resuelven con `await`.
- Next.js 16: el archivo de middleware se llama `src/proxy.ts` y exporta una función `proxy`. No usar `middleware.ts`.
- Next.js 16: Turbopack es el bundler por defecto. No agregar `--turbopack` a los scripts.
- Next.js 16: no existe `next lint`. El linting se corre con Biome.
- Tailwind CSS 4: la configuración va dentro del CSS con `@theme`. No existe `tailwind.config.ts`.
- Locales soportados: exactamente `'en'` y `'es'`. Locale por defecto: `'en'`.
- Categorías de proyecto: exactamente `'personal' | 'contract' | 'client'`.
- Categorías de FAV: exactamente `'youtube' | 'blogs' | 'tools' | 'learning'`.
- Los períodos se escriben en formato `YYYY-MM`.
- El alias de importación es `@/*` y apunta a `src/*`.
- Tests unitarios en `src/**/*.test.ts` (Vitest). Tests end-to-end en `e2e/*.spec.ts` (Playwright). No mezclar.
- Todo link externo lleva `target="_blank"` y `rel="noopener noreferrer"`.
- No se crean API routes, ni archivos `.env`, ni dependencias de base de datos.
- Los commits se hacen en español, en imperativo, con prefijo convencional (`feat:`, `test:`, `chore:`, `docs:`).

---

### Task 1: Scaffold limpio y eliminación del template

Reemplaza el template de terceros por un proyecto Next.js 16 vacío, conservando el repositorio git ya inicializado, el spec y el CV.

**Files:**
- Delete: `src/`, `prisma/`, `tests/`, `public/`, `docker-compose.yml`, `.env.example`, `.eslintrc.json`, `components.json`, `next.config.mjs`, `package.json`, `package-lock.json`, `postcss.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `README.md`
- Create: todo el scaffold de `create-next-app`
- Move: `Vacs-Francisco-CV-eng.pdf` → `public/cv/francisco-vacs-cv-en.pdf`
- Preserve: `.git/`, `docs/`

**Interfaces:**
- Consumes: nada.
- Produces: proyecto Next.js 16 funcional con Tailwind 4, Biome y alias `@/*`; el PDF del CV en `public/cv/francisco-vacs-cv-en.pdf`.

- [ ] **Step 1: Poner a salvo lo que se conserva**

```bash
cd "C:/Users/Francisco/Workspace/portfolio"
mkdir -p ../portfolio-keep
mv docs ../portfolio-keep/docs
mv Vacs-Francisco-CV-eng.pdf ../portfolio-keep/
```

- [ ] **Step 2: Borrar todo el template menos el repositorio git**

```bash
cd "C:/Users/Francisco/Workspace/portfolio"
rm -rf src prisma tests public data
rm -f docker-compose.yml .env.example .eslintrc.json components.json \
      next.config.mjs package.json package-lock.json postcss.config.mjs \
      tailwind.config.ts tsconfig.json README.md .gitignore
ls -a
```

Esperado: solo queda `.`, `..` y `.git`.

- [ ] **Step 3: Verificar que el historial sigue intacto**

Run: `git log --oneline`
Esperado: aparece el commit `docs: diseño del portfolio personal`. Si no aparece, detenerse: se borró `.git` por error.

- [ ] **Step 4: Scaffoldear Next.js 16**

```bash
cd "C:/Users/Francisco/Workspace/portfolio"
npx --yes create-next-app@latest . \
  --typescript --tailwind --app --src-dir --biome \
  --import-alias "@/*" --use-npm --disable-git --yes
```

Notas: `--disable-git` evita que reinicialice el repo, que ya existe con el spec commiteado. `--biome` genera `biome.json` en vez de configuración de ESLint.

- [ ] **Step 5: Restaurar docs y CV**

```bash
cd "C:/Users/Francisco/Workspace/portfolio"
mv ../portfolio-keep/docs ./docs
mkdir -p public/cv
mv ../portfolio-keep/Vacs-Francisco-CV-eng.pdf public/cv/francisco-vacs-cv-en.pdf
rmdir ../portfolio-keep
ls public/cv docs/superpowers/specs
```

Esperado: `francisco-vacs-cv-en.pdf` y `2026-08-09-portfolio-design.md`.

- [ ] **Step 6: Ajustar los scripts de package.json**

Reemplazar el bloque `"scripts"` de `package.json` por:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit"
  },
```

- [ ] **Step 7: Verificar que el proyecto compila**

Run: `npm run build`
Esperado: build exitoso, sin errores. Se genera `.next/`.

- [ ] **Step 8: Verificar que el linter corre**

Run: `npm run lint`
Esperado: termina sin errores (puede reportar avisos de formato; corregirlos con `npm run lint:fix`).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold de Next.js 16 y baja del template de terceros"
```

---

### Task 2: Infraestructura de tests

Deja Vitest y Playwright configurados y verdes, para que todas las tareas siguientes puedan escribirse con tests primero.

**Files:**
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/lib/sanity.test.ts`
- Create: `e2e/smoke.spec.ts`
- Modify: `package.json` (scripts de test)
- Modify: `.gitignore`

**Interfaces:**
- Consumes: proyecto de la Task 1.
- Produces: comandos `npm test` (Vitest) y `npm run test:e2e` (Playwright), ambos en verde.

- [ ] **Step 1: Instalar dependencias de testing**

```bash
npm install -D vitest vite-tsconfig-paths @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Crear la configuración de Vitest**

`vitest.config.ts`:

```ts
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
});
```

- [ ] **Step 3: Crear la configuración de Playwright**

`playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 4: Escribir el test unitario que falla**

`src/lib/sanity.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { projectName } from './sanity';

describe('projectName', () => {
  it('devuelve el nombre del portfolio', () => {
    expect(projectName()).toBe('francisco-vacs-portfolio');
  });
});
```

- [ ] **Step 5: Agregar los scripts de test a package.json**

Agregar dentro de `"scripts"`:

```json
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
```

- [ ] **Step 6: Correr el test unitario y verificar que falla**

Run: `npm test`
Esperado: FALLA con un error de resolución del módulo `./sanity`.

- [ ] **Step 7: Escribir la implementación mínima**

`src/lib/sanity.ts`:

```ts
export function projectName(): string {
  return 'francisco-vacs-portfolio';
}
```

- [ ] **Step 8: Correr el test unitario y verificar que pasa**

Run: `npm test`
Esperado: 1 test pasa.

- [ ] **Step 9: Escribir el test end-to-end de humo**

`e2e/smoke.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('la aplicación responde en la raíz', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBeLessThan(400);
});
```

- [ ] **Step 10: Correr Playwright y verificar que pasa**

Run: `npm run test:e2e`
Esperado: 1 test pasa. Playwright levanta el servidor de desarrollo solo.

- [ ] **Step 11: Ignorar los artefactos de test en git**

Agregar al final de `.gitignore`:

```
# testing
/test-results
/playwright-report
/blob-report
/playwright/.cache
```

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "test: configurar Vitest y Playwright"
```

---

### Task 3: Esquemas y tipos de contenido

Define, con Zod, la forma de todo el contenido del sitio. Es la pieza que hace fallar el build cuando un dato está mal.

**Files:**
- Create: `src/content/schema.ts`
- Create: `src/content/schema.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - Tipos: `Locale`, `Localized<T>`, `ProjectCategory`, `FavCategory`, `Project`, `FavItem`, `ExperienceItem`, `EducationItem`, `Profile`
  - Constantes: `PROJECT_CATEGORIES`, `FAV_CATEGORIES`
  - Esquemas: `projectSchema`, `favItemSchema`, `experienceSchema`, `educationSchema`, `profileSchema`
  - Helper: `parseAll<T>(schema, items, label)` que valida un arreglo y lanza un error identificando el índice y el registro que falló.

- [ ] **Step 1: Escribir los tests que fallan**

`src/content/schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  favItemSchema,
  parseAll,
  projectSchema,
} from './schema';

const validProject = {
  slug: 'demo',
  title: 'Demo',
  category: 'personal' as const,
  featured: false,
  period: { start: '2024-01' },
  summary: { en: 'A demo', es: 'Una demo' },
  highlights: { en: ['One'], es: ['Uno'] },
  stack: ['TypeScript'],
  links: {},
};

describe('projectSchema', () => {
  it('acepta un proyecto válido', () => {
    expect(projectSchema.parse(validProject).slug).toBe('demo');
  });

  it('rechaza una categoría inexistente', () => {
    expect(() =>
      projectSchema.parse({ ...validProject, category: 'freelance' }),
    ).toThrow();
  });

  it('rechaza un período mal formado', () => {
    expect(() =>
      projectSchema.parse({ ...validProject, period: { start: '2024' } }),
    ).toThrow();
  });

  it('rechaza un resumen que no está en los dos idiomas', () => {
    expect(() =>
      projectSchema.parse({ ...validProject, summary: { en: 'Only English' } }),
    ).toThrow();
  });

  it('rechaza un link que no es una URL', () => {
    expect(() =>
      projectSchema.parse({ ...validProject, links: { live: 'no-soy-una-url' } }),
    ).toThrow();
  });
});

describe('favItemSchema', () => {
  it('exige la nota personal en los dos idiomas', () => {
    expect(() =>
      favItemSchema.parse({
        name: 'Algo',
        url: 'https://example.com',
        category: 'tools',
        note: { en: 'Useful' },
      }),
    ).toThrow();
  });
});

describe('parseAll', () => {
  it('identifica el registro que falla', () => {
    expect(() =>
      parseAll(projectSchema, [validProject, { ...validProject, slug: '' }], 'projects'),
    ).toThrow(/projects\[1\]/);
  });
});
```

- [ ] **Step 2: Correr los tests y verificar que fallan**

Run: `npm test`
Esperado: FALLA porque `./schema` no existe.

- [ ] **Step 3: Escribir el esquema**

`src/content/schema.ts`:

```ts
import { z } from 'zod';

export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export type Localized<T> = Record<Locale, T>;

export const PROJECT_CATEGORIES = ['personal', 'contract', 'client'] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const FAV_CATEGORIES = ['youtube', 'blogs', 'tools', 'learning'] as const;
export type FavCategory = (typeof FAV_CATEGORIES)[number];

const localizedString = z.object({
  en: z.string().min(1),
  es: z.string().min(1),
});

const localizedStringList = z.object({
  en: z.array(z.string().min(1)).min(1),
  es: z.array(z.string().min(1)).min(1),
});

/** Mes en formato YYYY-MM, por ejemplo 2026-05. */
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
  message: 'El período debe tener formato YYYY-MM',
});

const period = z.object({
  start: yearMonth,
  end: yearMonth.optional(),
});

export const projectSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  category: z.enum(PROJECT_CATEGORIES),
  featured: z.boolean(),
  period,
  summary: localizedString,
  highlights: localizedStringList,
  stack: z.array(z.string().min(1)).min(1),
  links: z.object({
    live: z.url().optional(),
    repo: z.url().optional(),
    store: z.url().optional(),
  }),
  image: z
    .object({
      src: z.string().startsWith('/'),
      alt: localizedString,
    })
    .optional(),
});

export const favItemSchema = z.object({
  name: z.string().min(1),
  url: z.url(),
  category: z.enum(FAV_CATEGORIES),
  note: localizedString,
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: localizedString,
  location: z.string().min(1),
  period,
  highlights: localizedStringList,
});

export const educationSchema = z.object({
  institution: z.string().min(1),
  degree: localizedString,
  location: z.string().min(1),
  period,
});

export const profileSchema = z.object({
  name: z.string().min(1),
  headline: localizedString,
  bio: localizedString,
  location: z.string().min(1),
  email: z.email(),
  github: z.url(),
  linkedin: z.url(),
  whatsapp: z.url().optional(),
  avatar: z.string().startsWith('/').optional(),
  cv: z.string().startsWith('/'),
});

export type Project = z.infer<typeof projectSchema>;
export type FavItem = z.infer<typeof favItemSchema>;
export type ExperienceItem = z.infer<typeof experienceSchema>;
export type EducationItem = z.infer<typeof educationSchema>;
export type Profile = z.infer<typeof profileSchema>;

/**
 * Valida un arreglo de contenido. Al fallar, el mensaje identifica el índice
 * exacto para que el error de build sea accionable.
 */
export function parseAll<T>(
  schema: z.ZodType<T>,
  items: unknown[],
  label: string,
): T[] {
  return items.map((item, index) => {
    const result = schema.safeParse(item);
    if (!result.success) {
      throw new Error(
        `Contenido inválido en ${label}[${index}]: ${JSON.stringify(
          z.treeifyError(result.error),
        )}`,
      );
    }
    return result.data;
  });
}
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npm test`
Esperado: todos los tests de `schema.test.ts` pasan.

Nota: si `z.url()` o `z.email()` no existen, la versión instalada de Zod es la 3 y no la 4. Verificar con `npm ls zod` y, si hace falta, `npm install zod@latest`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: definir los esquemas de contenido con Zod"
```

---

### Task 4: Contenido del sitio

Carga los datos reales: perfil, experiencia, educación, proyectos y recursos FAV. Todo validado contra los esquemas de la Task 3.

**Files:**
- Create: `src/content/profile.ts`
- Create: `src/content/experience.ts`
- Create: `src/content/education.ts`
- Create: `src/content/projects.ts`
- Create: `src/content/fav.ts`
- Create: `src/content/content.test.ts`

**Interfaces:**
- Consumes: `projectSchema`, `favItemSchema`, `experienceSchema`, `educationSchema`, `profileSchema`, `parseAll` de `@/content/schema`.
- Produces: `profile: Profile`, `experience: ExperienceItem[]`, `education: EducationItem[]`, `projects: Project[]`, `favItems: FavItem[]`.

- [ ] **Step 1: Escribir el test que falla**

`src/content/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { education } from './education';
import { experience } from './experience';
import { favItems } from './fav';
import { profile } from './profile';
import { projects } from './projects';

describe('contenido del sitio', () => {
  it('tiene un perfil cargado', () => {
    expect(profile.name).toBe('Francisco Vacs');
  });

  it('tiene experiencia y educación', () => {
    expect(experience.length).toBeGreaterThan(0);
    expect(education.length).toBeGreaterThan(0);
  });

  it('tiene al menos dos proyectos', () => {
    expect(projects.length).toBeGreaterThanOrEqual(2);
  });

  it('no repite slugs de proyecto', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('tiene al menos un proyecto destacado', () => {
    expect(projects.some((p) => p.featured)).toBe(true);
  });

  it('no repite URLs en FAV', () => {
    const urls = favItems.map((f) => f.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test`
Esperado: FALLA por módulos inexistentes.

- [ ] **Step 3: Crear el perfil**

`src/content/profile.ts`:

```ts
import { type Profile, profileSchema } from './schema';

export const profile: Profile = profileSchema.parse({
  name: 'Francisco Vacs',
  headline: {
    en: 'Full-stack developer · Systems Engineering student',
    es: 'Desarrollador full-stack · Estudiante de Ingeniería en Sistemas',
  },
  bio: {
    en: 'Final-year Systems Engineering student with a full-stack profile and experience in web and mobile development. I focus on building efficient, scalable solutions and I enjoy picking up new tools as I go.',
    es: 'Estudiante de último año de Ingeniería en Sistemas de Información, con perfil full-stack y experiencia en desarrollo web y mobile. Me enfoco en construir soluciones eficientes y escalables, y disfruto incorporar herramientas nuevas en el camino.',
  },
  location: 'Rosario, Argentina',
  email: 'franciscovacs@gmail.com',
  github: 'https://github.com/FranciscoVacs',
  linkedin: 'https://linkedin.com/in/francisco-vacs',
  cv: '/cv/francisco-vacs-cv-en.pdf',
});
```

Nota: `whatsapp` y `avatar` se agregan en la Task 13, cuando Francisco decida si publica el teléfono y provea la foto.

- [ ] **Step 4: Crear la experiencia**

`src/content/experience.ts`:

```ts
import { type ExperienceItem, experienceSchema, parseAll } from './schema';

export const experience: ExperienceItem[] = parseAll(
  experienceSchema,
  [
    {
      company: 'Cunumi',
      role: {
        en: 'Full Stack Developer — Freelance Contract',
        es: 'Desarrollador Full Stack — Contrato freelance',
      },
      location: 'Rosario, Argentina',
      period: { start: '2026-05' },
      highlights: {
        en: [
          'Built a Progressive Web App for pet management, business management and social networking.',
          'Designed and implemented a PostgreSQL database on Supabase.',
          'Migrated the backend infrastructure from Firebase to Supabase.',
          'Built a cross-platform mobile app with React Native to replace the PWA.',
        ],
        es: [
          'Desarrollé una Progressive Web App de gestión de mascotas, gestión de negocios y red social.',
          'Diseñé e implementé una base de datos PostgreSQL sobre Supabase.',
          'Migré la infraestructura de backend de Firebase a Supabase.',
          'Desarrollé una app mobile multiplataforma con React Native para reemplazar la PWA.',
        ],
      },
    },
    {
      company: 'Profitwell',
      role: {
        en: 'Python Developer',
        es: 'Desarrollador Python',
      },
      location: 'Rosario, Argentina',
      period: { start: '2021-08', end: '2021-11' },
      highlights: {
        en: [
          'Built automation tools integrating APIs and databases.',
          'Worked in an Agile environment using Scrum.',
          'Managed source code and version control with Git and GitHub.',
        ],
        es: [
          'Desarrollé herramientas de automatización integrando APIs y bases de datos.',
          'Trabajé en un entorno ágil con metodología Scrum.',
          'Gestioné el código fuente y el control de versiones con Git y GitHub.',
        ],
      },
    },
  ],
  'experience',
);
```

- [ ] **Step 5: Crear la educación**

`src/content/education.ts`:

```ts
import { type EducationItem, educationSchema, parseAll } from './schema';

export const education: EducationItem[] = parseAll(
  educationSchema,
  [
    {
      institution: 'Universidad Tecnológica Nacional',
      degree: {
        en: 'Information Systems Engineering — in progress (5th year)',
        es: 'Ingeniería en Sistemas de Información — en curso (5.º año)',
      },
      location: 'Rosario, Argentina',
      period: { start: '2022-03' },
    },
    {
      institution: 'Escuela Provincial de Cine y Televisión',
      degree: {
        en: 'Audiovisual Production Technician',
        es: 'Técnico en Producción Audiovisual',
      },
      location: 'Rosario, Argentina',
      period: { start: '2022-03', end: '2025-12' },
    },
    {
      institution: 'Instituto Politécnico Superior General San Martín',
      degree: {
        en: 'Computer Systems Technician',
        es: 'Técnico en Sistemas Informáticos',
      },
      location: 'Rosario, Argentina',
      period: { start: '2016-03', end: '2021-12' },
    },
  ],
  'education',
);
```

- [ ] **Step 6: Crear los proyectos**

`src/content/projects.ts`:

```ts
import { type Project, parseAll, projectSchema } from './schema';

export const projects: Project[] = parseAll(
  projectSchema,
  [
    {
      slug: 'cunumi',
      title: 'CUNUMI',
      category: 'contract',
      featured: true,
      period: { start: '2026-05' },
      summary: {
        en: 'Pet management, business management and social networking platform, shipped as a PWA and as a React Native app.',
        es: 'Plataforma de gestión de mascotas, gestión de negocios y red social, publicada como PWA y como app React Native.',
      },
      highlights: {
        en: [
          'Designed and implemented the PostgreSQL schema on Supabase.',
          'Migrated the whole backend from Firebase to Supabase.',
          'Replaced the PWA with a cross-platform React Native app built with Expo.',
        ],
        es: [
          'Diseñé e implementé el esquema PostgreSQL sobre Supabase.',
          'Migré todo el backend de Firebase a Supabase.',
          'Reemplacé la PWA por una app multiplataforma en React Native con Expo.',
        ],
      },
      stack: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'PostgreSQL'],
      links: {},
    },
    {
      slug: 'bohemia',
      title: 'Bohemia',
      category: 'personal',
      featured: true,
      period: { start: '2024-07', end: '2025-02' },
      summary: {
        en: 'Event management and ticketing platform with dynamic ticket generation, automated email delivery and payment gateway integration.',
        es: 'Plataforma de gestión de eventos y venta de entradas, con generación dinámica de tickets, envío automático de mails e integración con pasarela de pago.',
      },
      highlights: {
        en: [
          'Built the frontend with Angular and Tailwind CSS.',
          'Developed a REST API covering authentication, events and galleries, with data persistence.',
          'Implemented dynamic ticket generation, automated email delivery and payment gateway integration.',
        ],
        es: [
          'Construí el frontend con Angular y Tailwind CSS.',
          'Desarrollé una API REST para autenticación, eventos y galerías, con persistencia de datos.',
          'Implementé la generación dinámica de tickets, el envío automático de mails y la integración con la pasarela de pago.',
        ],
      },
      stack: ['Angular', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST API'],
      links: { repo: 'https://github.com/FranciscoVacs/Bohemia_FrontEnd' },
    },
  ],
  'projects',
);
```

Nota: los links `live` y las imágenes se agregan en la Task 13, cuando Francisco provea las URLs y las capturas.

- [ ] **Step 7: Crear los recursos FAV**

`src/content/fav.ts`:

```ts
import { type FavItem, favItemSchema, parseAll } from './schema';

export const favItems: FavItem[] = parseAll(
  favItemSchema,
  [
    {
      name: 'Fireship',
      url: 'https://www.youtube.com/@Fireship',
      category: 'youtube',
      note: {
        en: 'Short, dense videos that get you up to speed on a new tool in a few minutes.',
        es: 'Videos cortos y densos que te ponen al día con una herramienta nueva en pocos minutos.',
      },
    },
    {
      name: 'Theo — t3.gg',
      url: 'https://www.youtube.com/@t3dotgg',
      category: 'youtube',
      note: {
        en: 'Opinionated takes on the TypeScript and React ecosystem, useful for spotting where the tooling is heading.',
        es: 'Opiniones fuertes sobre el ecosistema TypeScript y React, útiles para ver hacia dónde va el tooling.',
      },
    },
    {
      name: 'Josh W. Comeau',
      url: 'https://www.joshwcomeau.com',
      category: 'blogs',
      note: {
        en: 'The clearest explanations of CSS layout and React internals I have found, with interactive examples.',
        es: 'Las explicaciones más claras de layout en CSS e internals de React que encontré, con ejemplos interactivos.',
      },
    },
    {
      name: 'MDN Web Docs',
      url: 'https://developer.mozilla.org',
      category: 'learning',
      note: {
        en: 'The reference I actually trust for anything about the web platform.',
        es: 'La referencia en la que realmente confío para cualquier cosa de la plataforma web.',
      },
    },
    {
      name: 'Drizzle ORM',
      url: 'https://orm.drizzle.team',
      category: 'tools',
      note: {
        en: 'The ORM I reach for in TypeScript projects: SQL-first, typed end to end, no hidden magic.',
        es: 'El ORM que uso en proyectos TypeScript: pensado desde SQL, tipado de punta a punta y sin magia escondida.',
      },
    },
    {
      name: 'Excalidraw',
      url: 'https://excalidraw.com',
      category: 'tools',
      note: {
        en: 'Fastest way to sketch an architecture before writing any code.',
        es: 'La forma más rápida de bocetar una arquitectura antes de escribir código.',
      },
    },
  ],
  'fav',
);
```

Nota para Francisco: estas seis entradas son un punto de partida real y editable. Reemplazá, sacá o sumá lo que quieras y reescribí las notas con tus palabras; el archivo es la única fuente de la página FAV.

- [ ] **Step 8: Correr los tests y verificar que pasan**

Run: `npm test`
Esperado: pasan los tests de `schema.test.ts` y `content.test.ts`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: cargar el contenido real del portfolio"
```

---

### Task 5: Filtrado y ordenamiento de proyectos

Aísla la lógica que la página Work necesita, para poder testearla sin renderizar nada.

**Files:**
- Create: `src/lib/projects.ts`
- Create: `src/lib/projects.test.ts`
- Delete: `src/lib/sanity.ts`, `src/lib/sanity.test.ts`

**Interfaces:**
- Consumes: `Project`, `ProjectCategory`, `PROJECT_CATEGORIES` de `@/content/schema`.
- Produces:
  - `type WorkFilter = 'all' | ProjectCategory`
  - `parseWorkFilter(value: string | undefined): WorkFilter`
  - `filterProjects(projects: Project[], filter: WorkFilter): Project[]`
  - `sortByRecency(projects: Project[]): Project[]`
  - `featuredProjects(projects: Project[]): Project[]`

- [ ] **Step 1: Escribir los tests que fallan**

`src/lib/projects.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { Project } from '@/content/schema';
import {
  featuredProjects,
  filterProjects,
  parseWorkFilter,
  sortByRecency,
} from './projects';

function make(overrides: Partial<Project>): Project {
  return {
    slug: 'x',
    title: 'X',
    category: 'personal',
    featured: false,
    period: { start: '2024-01' },
    summary: { en: 'a', es: 'a' },
    highlights: { en: ['a'], es: ['a'] },
    stack: ['TypeScript'],
    links: {},
    ...overrides,
  };
}

const personal = make({ slug: 'p', category: 'personal', period: { start: '2024-01' } });
const contract = make({
  slug: 'c',
  category: 'contract',
  featured: true,
  period: { start: '2026-05' },
});
const client = make({ slug: 'cl', category: 'client', period: { start: '2025-03' } });
const all = [personal, contract, client];

describe('parseWorkFilter', () => {
  it('devuelve "all" cuando no hay parámetro', () => {
    expect(parseWorkFilter(undefined)).toBe('all');
  });

  it('devuelve la categoría cuando es válida', () => {
    expect(parseWorkFilter('contract')).toBe('contract');
  });

  it('cae en "all" cuando la categoría no existe', () => {
    expect(parseWorkFilter('freelance')).toBe('all');
  });
});

describe('filterProjects', () => {
  it('devuelve todo con el filtro "all"', () => {
    expect(filterProjects(all, 'all')).toHaveLength(3);
  });

  it('filtra por categoría', () => {
    expect(filterProjects(all, 'contract')).toEqual([contract]);
  });

  it('devuelve lista vacía si ninguna coincide', () => {
    expect(filterProjects([personal], 'client')).toEqual([]);
  });

  it('no muta el arreglo original', () => {
    filterProjects(all, 'contract');
    expect(all).toHaveLength(3);
  });
});

describe('sortByRecency', () => {
  it('ordena del más reciente al más antiguo', () => {
    expect(sortByRecency(all).map((p) => p.slug)).toEqual(['c', 'cl', 'p']);
  });
});

describe('featuredProjects', () => {
  it('devuelve solo los destacados', () => {
    expect(featuredProjects(all).map((p) => p.slug)).toEqual(['c']);
  });
});
```

- [ ] **Step 2: Correr los tests y verificar que fallan**

Run: `npm test`
Esperado: FALLA porque `./projects` no existe.

- [ ] **Step 3: Escribir la implementación**

`src/lib/projects.ts`:

```ts
import {
  PROJECT_CATEGORIES,
  type Project,
  type ProjectCategory,
} from '@/content/schema';

export type WorkFilter = 'all' | ProjectCategory;

function isProjectCategory(value: string): value is ProjectCategory {
  return (PROJECT_CATEGORIES as readonly string[]).includes(value);
}

/** Un filtro desconocido cae en "all" en vez de mostrar una lista vacía. */
export function parseWorkFilter(value: string | undefined): WorkFilter {
  if (!value || value === 'all') return 'all';
  return isProjectCategory(value) ? value : 'all';
}

export function filterProjects(
  projects: Project[],
  filter: WorkFilter,
): Project[] {
  if (filter === 'all') return [...projects];
  return projects.filter((project) => project.category === filter);
}

export function sortByRecency(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => b.period.start.localeCompare(a.period.start));
}

export function featuredProjects(projects: Project[]): Project[] {
  return sortByRecency(projects.filter((project) => project.featured));
}
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npm test`
Esperado: todos los tests de `projects.test.ts` pasan.

- [ ] **Step 5: Borrar el andamio de la Task 2**

```bash
rm src/lib/sanity.ts src/lib/sanity.test.ts
npm test
```

Esperado: siguen pasando los tests de `schema`, `content` y `projects`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: agregar filtrado y ordenamiento de proyectos"
```

---

### Task 6: Internacionalización con next-intl

Deja funcionando las rutas `/en` y `/es`, con redirección desde la raíz y 404 para locales desconocidos.

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/i18n/request.ts`
- Create: `src/proxy.ts`
- Create: `messages/en.json`
- Create: `messages/es.json`
- Create: `next.config.ts` (reemplaza el generado por create-next-app)
- Move: `src/app/layout.tsx` → `src/app/[locale]/layout.tsx`
- Move: `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- Create: `e2e/i18n.spec.ts`
- Delete: `e2e/smoke.spec.ts`

**Interfaces:**
- Consumes: nada del código propio.
- Produces:
  - `routing` (locales `['en','es']`, defaultLocale `'en'`) desde `@/i18n/routing`
  - `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` desde `@/i18n/navigation`
  - Claves de traducción de interfaz en `messages/{en,es}.json`

- [ ] **Step 1: Instalar next-intl**

```bash
npm install next-intl
```

- [ ] **Step 2: Escribir el test end-to-end que falla**

`e2e/i18n.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('la raíz redirige a un locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/(en|es)$/);
});

test('el locale inglés carga', async ({ page }) => {
  const response = await page.goto('/en');
  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('el locale español carga', async ({ page }) => {
  const response = await page.goto('/es');
  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('un locale desconocido devuelve 404', async ({ page }) => {
  const response = await page.goto('/de');
  expect(response?.status()).toBe(404);
});
```

- [ ] **Step 3: Correr el test y verificar que falla**

```bash
rm e2e/smoke.spec.ts
npm run test:e2e
```

Esperado: FALLA. La raíz no redirige y `/en` da 404.

- [ ] **Step 4: Crear la configuración de ruteo**

`src/i18n/routing.ts`:

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
});
```

`src/i18n/navigation.ts`:

```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

- [ ] **Step 5: Crear la configuración de request**

`src/i18n/request.ts`:

```ts
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import * as rootParams from 'next/root-params';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 6: Crear el proxy**

`src/proxy.ts`:

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
```

En Next.js 16 este archivo reemplaza a `middleware.ts`. No crear `middleware.ts`.

- [ ] **Step 7: Crear los archivos de mensajes**

`messages/en.json`:

```json
{
  "Nav": {
    "home": "Home",
    "work": "Work",
    "fav": "FAV",
    "cv": "CV",
    "toggleTheme": "Toggle theme",
    "switchLanguage": "Switch language"
  },
  "Home": {
    "about": "About",
    "experience": "Experience",
    "education": "Education",
    "featuredWork": "Featured work",
    "seeAllWork": "See all work",
    "contact": "Get in touch",
    "present": "Present"
  },
  "Work": {
    "title": "Work",
    "subtitle": "Everything I have built, from contract work to personal projects.",
    "all": "All",
    "personal": "Personal",
    "contract": "Contract",
    "client": "Client",
    "empty": "No projects in this category yet.",
    "liveDemo": "Live demo",
    "sourceCode": "Source code",
    "store": "App store"
  },
  "Fav": {
    "title": "FAV",
    "subtitle": "Pages, channels and people I keep coming back to.",
    "youtube": "YouTube",
    "blogs": "Blogs",
    "tools": "Tools",
    "learning": "Learning"
  },
  "Cv": {
    "title": "CV",
    "subtitle": "My resume, in English.",
    "download": "Download PDF",
    "fallback": "Your browser cannot display the PDF inline."
  },
  "NotFound": {
    "title": "Page not found",
    "description": "That page does not exist.",
    "backHome": "Back to home"
  },
  "Metadata": {
    "title": "Francisco Vacs — Full-stack developer",
    "description": "Portfolio of Francisco Vacs, full-stack developer based in Rosario, Argentina."
  }
}
```

`messages/es.json`:

```json
{
  "Nav": {
    "home": "Inicio",
    "work": "Trabajos",
    "fav": "FAV",
    "cv": "CV",
    "toggleTheme": "Cambiar tema",
    "switchLanguage": "Cambiar idioma"
  },
  "Home": {
    "about": "Sobre mí",
    "experience": "Experiencia",
    "education": "Educación",
    "featuredWork": "Trabajos destacados",
    "seeAllWork": "Ver todos los trabajos",
    "contact": "Contacto",
    "present": "Actualidad"
  },
  "Work": {
    "title": "Trabajos",
    "subtitle": "Todo lo que construí, de contratos a proyectos personales.",
    "all": "Todos",
    "personal": "Personales",
    "contract": "Contratos",
    "client": "Clientes",
    "empty": "Todavía no hay proyectos en esta categoría.",
    "liveDemo": "Ver en vivo",
    "sourceCode": "Código fuente",
    "store": "Tienda de apps"
  },
  "Fav": {
    "title": "FAV",
    "subtitle": "Páginas, canales y gente a los que vuelvo siempre.",
    "youtube": "YouTube",
    "blogs": "Blogs",
    "tools": "Herramientas",
    "learning": "Aprendizaje"
  },
  "Cv": {
    "title": "CV",
    "subtitle": "Mi currículum, en inglés.",
    "download": "Descargar PDF",
    "fallback": "Tu navegador no puede mostrar el PDF embebido."
  },
  "NotFound": {
    "title": "Página no encontrada",
    "description": "Esa página no existe.",
    "backHome": "Volver al inicio"
  },
  "Metadata": {
    "title": "Francisco Vacs — Desarrollador full-stack",
    "description": "Portfolio de Francisco Vacs, desarrollador full-stack de Rosario, Argentina."
  }
}
```

- [ ] **Step 8: Conectar el plugin de next-intl**

Borrar el `next.config.ts` generado por create-next-app y crear `next.config.ts`:

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

Si create-next-app generó `next.config.mjs` en vez de `.ts`, borrarlo también: solo debe quedar `next.config.ts`.

- [ ] **Step 9: Mover las rutas bajo el segmento de locale**

```bash
cd "C:/Users/Francisco/Workspace/portfolio"
mkdir -p "src/app/[locale]"
mv src/app/page.tsx "src/app/[locale]/page.tsx"
mv src/app/layout.tsx "src/app/[locale]/layout.tsx"
ls src/app "src/app/[locale]"
```

Esperado: en `src/app/` quedan solo `globals.css`, `favicon.ico` y la carpeta `[locale]`.

- [ ] **Step 10: Reescribir el layout de locale**

`src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 11: Simplificar la home provisoria**

`src/app/[locale]/page.tsx`:

```tsx
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Metadata');
  return <h1>{t('title')}</h1>;
}
```

- [ ] **Step 12: Correr los tests end-to-end y verificar que pasan**

Run: `npm run test:e2e`
Esperado: los cuatro tests de `i18n.spec.ts` pasan.

- [ ] **Step 13: Verificar que el build sigue sano**

Run: `npm run build && npm test`
Esperado: build exitoso y tests unitarios en verde.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: configurar rutas bilingües con next-intl"
```

---

### Task 7: Layout, tema y navegación

Arma el marco visual: contenedor de una columna, modo claro/oscuro, barra de navegación, selector de idioma y pie de página.

**Files:**
- Create: `src/components/layout/ThemeProvider.tsx`
- Create: `src/components/layout/ThemeToggle.tsx`
- Create: `src/components/layout/LocaleSwitch.tsx`
- Create: `src/components/layout/Nav.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/Container.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `e2e/layout.spec.ts`

**Interfaces:**
- Consumes: `Link`, `usePathname` de `@/i18n/navigation`; `routing` de `@/i18n/routing`; `profile` de `@/content/profile`.
- Produces: `<Container>`, `<Nav />`, `<Footer />`, `<ThemeProvider>`, `<ThemeToggle />`, `<LocaleSwitch />`.

- [ ] **Step 1: Instalar next-themes**

```bash
npm install next-themes
```

- [ ] **Step 2: Escribir el test end-to-end que falla**

`e2e/layout.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('la navegación muestra los cuatro destinos', async ({ page }) => {
  await page.goto('/en');
  const nav = page.getByRole('navigation').first();
  await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Work' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'FAV' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'CV' })).toBeVisible();
});

test('el selector de idioma conserva la ruta', async ({ page }) => {
  await page.goto('/en/work');
  await page.getByRole('link', { name: 'ES' }).click();
  await expect(page).toHaveURL('/es/work');
});

test('el toggle de tema cambia el tema y persiste', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
});
```

- [ ] **Step 3: Correr el test y verificar que falla**

Run: `npm run test:e2e`
Esperado: FALLAN los tres tests de `layout.spec.ts`. `/en/work` todavía no existe, y no hay navegación ni toggle.

- [ ] **Step 4: Definir el tema en el CSS**

Los nombres de los tokens (`--background`, `--foreground`, `--muted-foreground`,
`--border`) son los que usa shadcn/ui, para que sus componentes se puedan sumar
más adelante sin rehacer la paleta.

Reemplazar el contenido de `src/app/globals.css` por:

```css
@import 'tailwindcss';

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: var(--font-sans), ui-sans-serif, system-ui, sans-serif;

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-accent: var(--accent);
}

:root {
  --background: #fdfdfc;
  --foreground: #1a1a19;
  --muted-foreground: #6b6b68;
  --border: #e4e4e1;
  --accent: #1a1a19;
}

.dark {
  --background: #0f0f0e;
  --foreground: #ededeb;
  --muted-foreground: #9a9a96;
  --border: #2a2a28;
  --accent: #ededeb;
}

body {
  background: var(--background);
  color: var(--foreground);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 5: Crear el proveedor de tema**

`src/components/layout/ThemeProvider.tsx`:

```tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 6: Crear el toggle de tema**

`src/components/layout/ThemeToggle.tsx`:

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const t = useTranslations('Nav');
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      aria-label={t('toggleTheme')}
      className="rounded-md border border-border px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {mounted && resolvedTheme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
```

El estado `mounted` evita el desajuste de hidratación: en el servidor no se conoce el tema resuelto.

- [ ] **Step 7: Crear el selector de idioma**

`src/components/layout/LocaleSwitch.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LocaleSwitch() {
  const pathname = usePathname();
  const active = useLocale();

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          className={
            locale === active
              ? 'font-medium text-foreground'
              : 'text-muted-foreground transition-colors hover:text-foreground'
          }
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
```

`usePathname` de `@/i18n/navigation` devuelve la ruta sin el prefijo de locale, así que pasarla junto con `locale` produce el equivalente en el otro idioma y conserva la página actual.

- [ ] **Step 8: Crear el contenedor**

`src/components/layout/Container.tsx`:

```tsx
export function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl px-6">{children}</div>;
}
```

- [ ] **Step 9: Crear la navegación**

`src/components/layout/Nav.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from './Container';
import { LocaleSwitch } from './LocaleSwitch';
import { ThemeToggle } from './ThemeToggle';

export function Nav() {
  const t = useTranslations('Nav');

  const links = [
    { href: '/', label: t('home') },
    { href: '/work', label: t('work') },
    { href: '/fav', label: t('fav') },
    { href: '/cv', label: t('cv') },
  ] as const;

  return (
    <header className="border-border border-b">
      <Container>
        <nav className="flex items-center justify-between gap-4 py-4">
          <ul className="flex items-center gap-5 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <LocaleSwitch />
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  );
}
```

- [ ] **Step 10: Crear el pie de página**

`src/components/layout/Footer.tsx`:

```tsx
import { profile } from '@/content/profile';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="mt-20 border-border border-t py-8">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground text-sm">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <div className="flex gap-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="transition-colors hover:text-foreground"
            >
              Email
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 11: Enchufar todo en el layout**

Reemplazar el cuerpo del `return` en `src/app/[locale]/layout.tsx` por:

```tsx
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider>
          <ThemeProvider>
            <div className="flex min-h-screen flex-col">
              <Nav />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
```

Y agregar los imports:

```tsx
import { Footer } from '@/components/layout/Footer';
import { Nav } from '@/components/layout/Nav';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
```

- [ ] **Step 12: Crear las rutas vacías que la navegación necesita**

`src/app/[locale]/work/page.tsx`:

```tsx
export default function WorkPage() {
  return null;
}
```

`src/app/[locale]/fav/page.tsx`:

```tsx
export default function FavPage() {
  return null;
}
```

`src/app/[locale]/cv/page.tsx`:

```tsx
export default function CvPage() {
  return null;
}
```

Estas tres se completan en las Tasks 9, 10 y 11.

- [ ] **Step 13: Correr los tests end-to-end y verificar que pasan**

Run: `npm run test:e2e`
Esperado: pasan `i18n.spec.ts` y `layout.spec.ts`.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: agregar layout, tema claro/oscuro y navegación"
```

---

### Task 8: Página de inicio

Arma la home: presentación, biografía, línea de tiempo de experiencia y educación, trabajos destacados y contacto.

**Files:**
- Create: `src/components/home/Hero.tsx`
- Create: `src/components/home/About.tsx`
- Create: `src/components/home/Timeline.tsx`
- Create: `src/components/home/FeaturedWork.tsx`
- Create: `src/components/home/Contact.tsx`
- Create: `src/components/ui/Section.tsx`
- Create: `src/lib/format.ts`
- Create: `src/lib/format.test.ts`
- Modify: `src/app/[locale]/page.tsx`
- Create: `e2e/home.spec.ts`

**Interfaces:**
- Consumes: `profile`, `experience`, `education`, `projects`, `featuredProjects`, `Localized`, `Locale`.
- Produces:
  - `formatPeriod(period, presentLabel, locale)` desde `@/lib/format`
  - `<Section title>` desde `@/components/ui/Section`
  - Los cinco componentes de home.

- [ ] **Step 1: Escribir el test unitario del formateo que falla**

`src/lib/format.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatPeriod } from './format';

describe('formatPeriod', () => {
  it('formatea un período cerrado en inglés', () => {
    expect(
      formatPeriod({ start: '2021-08', end: '2021-11' }, 'Present', 'en'),
    ).toBe('Aug 2021 — Nov 2021');
  });

  it('usa la etiqueta de actualidad cuando no hay fin', () => {
    expect(formatPeriod({ start: '2026-05' }, 'Present', 'en')).toBe(
      'May 2026 — Present',
    );
  });

  it('formatea en español', () => {
    expect(formatPeriod({ start: '2022-03' }, 'Actualidad', 'es')).toBe(
      'mar 2022 — Actualidad',
    );
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test`
Esperado: FALLA porque `./format` no existe.

- [ ] **Step 3: Escribir el formateo**

`src/lib/format.ts`:

```ts
import type { Locale } from '@/content/schema';

type Period = { start: string; end?: string };

function formatMonth(yearMonth: string, locale: Locale): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  const formatted = new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  return formatted.replace('.', '');
}

export function formatPeriod(
  period: Period,
  presentLabel: string,
  locale: Locale,
): string {
  const start = formatMonth(period.start, locale);
  const end = period.end ? formatMonth(period.end, locale) : presentLabel;
  return `${start} — ${end}`;
}
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npm test`
Esperado: los tres tests de `format.test.ts` pasan. Si el separador de `Intl` difiere (por ejemplo `"mar. 2022"`), ajustar el `replace` hasta que el test pase; no cambiar el test.

- [ ] **Step 5: Escribir el test end-to-end que falla**

`e2e/home.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('la home muestra el nombre y el titular', async ({ page }) => {
  await page.goto('/en');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Francisco Vacs' }),
  ).toBeVisible();
});

test('la home lista experiencia y educación', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible();
  // exact: true distingue la empresa "Cunumi" del proyecto "CUNUMI",
  // que también aparece en la home dentro de los destacados.
  await expect(
    page.getByRole('heading', { name: 'Cunumi', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Universidad Tecnológica Nacional' }),
  ).toBeVisible();
});

test('la home muestra los destacados y enlaza a Work', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { name: 'Featured work' })).toBeVisible();
  await page.getByRole('link', { name: 'See all work' }).click();
  await expect(page).toHaveURL('/en/work');
});

test('la home traduce al español', async ({ page }) => {
  await page.goto('/es');
  await expect(page.getByRole('heading', { name: 'Experiencia' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sobre mí' })).toBeVisible();
});
```

- [ ] **Step 6: Correr el test y verificar que falla**

Run: `npm run test:e2e`
Esperado: FALLAN los cuatro tests de `home.spec.ts`.

- [ ] **Step 7: Crear el componente de sección**

`src/components/ui/Section.tsx`:

```tsx
export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="mb-5 font-medium text-foreground text-lg">{title}</h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 8: Crear el hero**

`src/components/home/Hero.tsx`:

```tsx
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { profile } from '@/content/profile';
import type { Locale } from '@/content/schema';

export function Hero() {
  const locale = useLocale() as Locale;

  return (
    <div className="flex flex-col gap-5 pt-14 sm:flex-row sm:items-center">
      {profile.avatar ? (
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={96}
          height={96}
          className="h-24 w-24 rounded-full object-cover"
          priority
        />
      ) : null}
      <div>
        <h1 className="font-semibold text-2xl text-foreground tracking-tight">
          {profile.name}
        </h1>
        <p className="mt-1 text-muted-foreground">{profile.headline[locale]}</p>
        <p className="mt-1 text-muted-foreground text-sm">{profile.location}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Crear la biografía**

`src/components/home/About.tsx`:

```tsx
import { useLocale, useTranslations } from 'next-intl';
import { Section } from '@/components/ui/Section';
import { profile } from '@/content/profile';
import type { Locale } from '@/content/schema';

export function About() {
  const t = useTranslations('Home');
  const locale = useLocale() as Locale;

  return (
    <Section title={t('about')}>
      <p className="text-muted-foreground leading-relaxed">{profile.bio[locale]}</p>
    </Section>
  );
}
```

- [ ] **Step 10: Crear la línea de tiempo**

`src/components/home/Timeline.tsx`:

```tsx
import { useLocale, useTranslations } from 'next-intl';
import { Section } from '@/components/ui/Section';
import { education } from '@/content/education';
import { experience } from '@/content/experience';
import type { Locale } from '@/content/schema';
import { formatPeriod } from '@/lib/format';

export function Timeline() {
  const t = useTranslations('Home');
  const locale = useLocale() as Locale;
  const present = t('present');

  return (
    <>
      <Section title={t('experience')}>
        <ul className="flex flex-col gap-7">
          {experience.map((item) => (
            <li key={`${item.company}-${item.period.start}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-medium text-foreground">{item.company}</h3>
                <span className="text-muted-foreground text-sm">
                  {formatPeriod(item.period, present, locale)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{item.role[locale]}</p>
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-muted-foreground text-sm">
                {item.highlights[locale].map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('education')}>
        <ul className="flex flex-col gap-5">
          {education.map((item) => (
            <li key={`${item.institution}-${item.period.start}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-medium text-foreground">
                  {item.institution}
                </h3>
                <span className="text-muted-foreground text-sm">
                  {formatPeriod(item.period, present, locale)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{item.degree[locale]}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
```

- [ ] **Step 11: Crear los trabajos destacados**

`src/components/home/FeaturedWork.tsx`:

```tsx
import { useLocale, useTranslations } from 'next-intl';
import { Section } from '@/components/ui/Section';
import { projects } from '@/content/projects';
import type { Locale } from '@/content/schema';
import { Link } from '@/i18n/navigation';
import { formatPeriod } from '@/lib/format';
import { featuredProjects } from '@/lib/projects';

export function FeaturedWork() {
  const t = useTranslations('Home');
  const locale = useLocale() as Locale;
  const featured = featuredProjects(projects);

  return (
    <Section title={t('featuredWork')}>
      <ul className="flex flex-col gap-6">
        {featured.map((project) => (
          <li key={project.slug}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium text-foreground">{project.title}</h3>
              <span className="text-muted-foreground text-sm">
                {formatPeriod(project.period, t('present'), locale)}
              </span>
            </div>
            <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
              {project.summary[locale]}
            </p>
          </li>
        ))}
      </ul>
      <Link
        href="/work"
        className="mt-6 inline-block text-foreground text-sm underline underline-offset-4"
      >
        {t('seeAllWork')}
      </Link>
    </Section>
  );
}
```

- [ ] **Step 12: Crear el bloque de contacto**

`src/components/home/Contact.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Section } from '@/components/ui/Section';
import { profile } from '@/content/profile';

export function Contact() {
  const t = useTranslations('Home');

  const links = [
    { href: `mailto:${profile.email}`, label: profile.email, external: false },
    { href: profile.linkedin, label: 'LinkedIn', external: true },
    { href: profile.github, label: 'GitHub', external: true },
    ...(profile.whatsapp
      ? [{ href: profile.whatsapp, label: 'WhatsApp', external: true }]
      : []),
  ];

  return (
    <Section title={t('contact')}>
      <ul className="flex flex-wrap gap-5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              {...(link.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="text-foreground underline underline-offset-4"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

- [ ] **Step 13: Componer la home**

`src/app/[locale]/page.tsx`:

```tsx
import { Container } from '@/components/layout/Container';
import { About } from '@/components/home/About';
import { Contact } from '@/components/home/Contact';
import { FeaturedWork } from '@/components/home/FeaturedWork';
import { Hero } from '@/components/home/Hero';
import { Timeline } from '@/components/home/Timeline';

export default function HomePage() {
  return (
    <Container>
      <Hero />
      <About />
      <Timeline />
      <FeaturedWork />
      <Contact />
    </Container>
  );
}
```

- [ ] **Step 14: Correr los tests y verificar que pasan**

Run: `npm run test:e2e && npm test`
Esperado: `home.spec.ts` en verde y unitarios sin regresiones.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "feat: construir la página de inicio"
```

---

### Task 9: Página Work con filtros

Lista todos los proyectos con las subcategorías All, Personales, Contratos y Clientes, filtrando por parámetro de URL.

**Files:**
- Create: `src/components/work/WorkFilters.tsx`
- Create: `src/components/work/WorkCard.tsx`
- Create: `src/components/work/WorkGrid.tsx`
- Modify: `src/app/[locale]/work/page.tsx`
- Create: `e2e/work.spec.ts`

**Interfaces:**
- Consumes: `projects`, `parseWorkFilter`, `filterProjects`, `sortByRecency`, `formatPeriod`, `Link`.
- Produces: `<WorkFilters active>`, `<WorkCard project>`, `<WorkGrid projects>`.

- [ ] **Step 1: Escribir el test end-to-end que falla**

`e2e/work.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('Work lista todos los proyectos por defecto', async ({ page }) => {
  await page.goto('/en/work');
  await expect(page.getByRole('heading', { name: 'CUNUMI' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bohemia' })).toBeVisible();
});

test('el filtro de contratos deja solo CUNUMI', async ({ page }) => {
  await page.goto('/en/work');
  await page.getByRole('link', { name: 'Contract', exact: true }).click();
  await expect(page).toHaveURL('/en/work?type=contract');
  await expect(page.getByRole('heading', { name: 'CUNUMI' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bohemia' })).toHaveCount(0);
});

test('el filtro de clientes muestra el mensaje de vacío', async ({ page }) => {
  await page.goto('/en/work?type=client');
  await expect(page.getByText('No projects in this category yet.')).toBeVisible();
});

test('un filtro inválido cae en todos', async ({ page }) => {
  await page.goto('/en/work?type=freelance');
  await expect(page.getByRole('heading', { name: 'CUNUMI' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bohemia' })).toBeVisible();
});

test('las tarjetas muestran el stack y los links', async ({ page }) => {
  await page.goto('/en/work');
  await expect(page.getByText('React Native')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Source code' }).first(),
  ).toBeVisible();
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm run test:e2e`
Esperado: FALLAN los cinco tests de `work.spec.ts`.

- [ ] **Step 3: Crear los filtros**

`src/components/work/WorkFilters.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { WorkFilter } from '@/lib/projects';

const FILTERS: WorkFilter[] = ['all', 'personal', 'contract', 'client'];

export function WorkFilters({ active }: { active: WorkFilter }) {
  const t = useTranslations('Work');

  return (
    <nav aria-label={t('title')} className="mt-8 flex flex-wrap gap-4 text-sm">
      {FILTERS.map((filter) => (
        <Link
          key={filter}
          href={filter === 'all' ? '/work' : { pathname: '/work', query: { type: filter } }}
          className={
            filter === active
              ? 'font-medium text-foreground underline underline-offset-4'
              : 'text-muted-foreground transition-colors hover:text-foreground'
          }
        >
          {t(filter)}
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Crear la tarjeta de proyecto**

`src/components/work/WorkCard.tsx`:

```tsx
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import type { Locale, Project } from '@/content/schema';
import { formatPeriod } from '@/lib/format';

export function WorkCard({ project }: { project: Project }) {
  const t = useTranslations('Work');
  const tHome = useTranslations('Home');
  const locale = useLocale() as Locale;

  const links = [
    project.links.live ? { href: project.links.live, label: t('liveDemo') } : null,
    project.links.repo ? { href: project.links.repo, label: t('sourceCode') } : null,
    project.links.store ? { href: project.links.store, label: t('store') } : null,
  ].filter((link) => link !== null);

  return (
    <article className="border-border border-t pt-8">
      {project.image ? (
        <Image
          src={project.image.src}
          alt={project.image.alt[locale]}
          width={1200}
          height={675}
          className="mb-5 aspect-video w-full rounded-lg border border-border object-cover"
        />
      ) : null}

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-medium text-foreground">{project.title}</h2>
        <span className="text-muted-foreground text-sm">
          {formatPeriod(project.period, tHome('present'), locale)}
        </span>
      </div>

      <p className="mt-2 text-muted-foreground leading-relaxed">{project.summary[locale]}</p>

      <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-muted-foreground text-sm">
        {project.highlights[locale].map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border px-2.5 py-0.5 text-muted-foreground text-xs"
          >
            {tech}
          </li>
        ))}
      </ul>

      {links.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 5: Crear la grilla**

`src/components/work/WorkGrid.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import type { Project } from '@/content/schema';
import { WorkCard } from './WorkCard';

export function WorkGrid({ projects }: { projects: Project[] }) {
  const t = useTranslations('Work');

  if (projects.length === 0) {
    return <p className="mt-10 text-muted-foreground">{t('empty')}</p>;
  }

  return (
    <div className="mt-10 flex flex-col gap-12">
      {projects.map((project) => (
        <WorkCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Componer la página**

`src/app/[locale]/work/page.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/layout/Container';
import { WorkFilters } from '@/components/work/WorkFilters';
import { WorkGrid } from '@/components/work/WorkGrid';
import { projects } from '@/content/projects';
import { filterProjects, parseWorkFilter, sortByRecency } from '@/lib/projects';

export default async function WorkPage({
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const t = await getTranslations('Work');

  const filter = parseWorkFilter(type);
  const visible = sortByRecency(filterProjects(projects, filter));

  return (
    <Container>
      <div className="pt-14">
        <h1 className="font-semibold text-2xl text-foreground tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
      </div>
      <WorkFilters active={filter} />
      <WorkGrid projects={visible} />
    </Container>
  );
}
```

`searchParams` es una Promesa en Next.js 16, por eso el `await`.

- [ ] **Step 7: Correr los tests y verificar que pasan**

Run: `npm run test:e2e`
Esperado: los cinco tests de `work.spec.ts` pasan, sin romper los anteriores.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: construir la página Work con filtros por categoría"
```

---

### Task 10: Página FAV

Muestra los recursos recomendados agrupados por categoría.

**Files:**
- Create: `src/components/fav/FavGroup.tsx`
- Create: `src/lib/fav.ts`
- Create: `src/lib/fav.test.ts`
- Modify: `src/app/[locale]/fav/page.tsx`
- Create: `e2e/fav.spec.ts`

**Interfaces:**
- Consumes: `favItems`, `FAV_CATEGORIES`, `FavItem`, `FavCategory`.
- Produces:
  - `groupByCategory(items: FavItem[]): Array<{ category: FavCategory; items: FavItem[] }>` desde `@/lib/fav`
  - `<FavGroup category items>`

- [ ] **Step 1: Escribir el test unitario que falla**

`src/lib/fav.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { FavItem } from '@/content/schema';
import { groupByCategory } from './fav';

const items: FavItem[] = [
  {
    name: 'A',
    url: 'https://a.com',
    category: 'tools',
    note: { en: 'a', es: 'a' },
  },
  {
    name: 'B',
    url: 'https://b.com',
    category: 'youtube',
    note: { en: 'b', es: 'b' },
  },
  {
    name: 'C',
    url: 'https://c.com',
    category: 'tools',
    note: { en: 'c', es: 'c' },
  },
];

describe('groupByCategory', () => {
  it('agrupa respetando el orden de FAV_CATEGORIES', () => {
    expect(groupByCategory(items).map((g) => g.category)).toEqual([
      'youtube',
      'tools',
    ]);
  });

  it('omite las categorías sin elementos', () => {
    expect(groupByCategory(items)).toHaveLength(2);
  });

  it('mantiene juntos los elementos de una categoría', () => {
    const tools = groupByCategory(items).find((g) => g.category === 'tools');
    expect(tools?.items.map((i) => i.name)).toEqual(['A', 'C']);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test`
Esperado: FALLA porque `./fav` no existe.

- [ ] **Step 3: Escribir el agrupamiento**

`src/lib/fav.ts`:

```ts
import {
  FAV_CATEGORIES,
  type FavCategory,
  type FavItem,
} from '@/content/schema';

export type FavGroupData = { category: FavCategory; items: FavItem[] };

export function groupByCategory(items: FavItem[]): FavGroupData[] {
  return FAV_CATEGORIES.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);
}
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npm test`
Esperado: los tres tests de `fav.test.ts` pasan.

- [ ] **Step 5: Escribir el test end-to-end que falla**

`e2e/fav.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('FAV agrupa por categoría', async ({ page }) => {
  await page.goto('/en/fav');
  await expect(page.getByRole('heading', { name: 'YouTube' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tools' })).toBeVisible();
});

test('los links de FAV son externos y seguros', async ({ page }) => {
  await page.goto('/en/fav');
  const link = page.getByRole('link', { name: 'Fireship' });
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
});

test('FAV traduce los títulos de categoría', async ({ page }) => {
  await page.goto('/es/fav');
  await expect(page.getByRole('heading', { name: 'Herramientas' })).toBeVisible();
});
```

- [ ] **Step 6: Correr el test y verificar que falla**

Run: `npm run test:e2e`
Esperado: FALLAN los tres tests de `fav.spec.ts`.

- [ ] **Step 7: Crear el grupo de recursos**

`src/components/fav/FavGroup.tsx`:

```tsx
import { useLocale, useTranslations } from 'next-intl';
import type { FavCategory, FavItem, Locale } from '@/content/schema';

export function FavGroup({
  category,
  items,
}: {
  category: FavCategory;
  items: FavItem[];
}) {
  const t = useTranslations('Fav');
  const locale = useLocale() as Locale;

  return (
    <section className="mt-12">
      <h2 className="mb-4 font-medium text-foreground text-lg">{t(category)}</h2>
      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              {item.name}
            </a>
            <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
              {item.note[locale]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 8: Componer la página**

`src/app/[locale]/fav/page.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { FavGroup } from '@/components/fav/FavGroup';
import { Container } from '@/components/layout/Container';
import { favItems } from '@/content/fav';
import { groupByCategory } from '@/lib/fav';

export default function FavPage() {
  const t = useTranslations('Fav');
  const groups = groupByCategory(favItems);

  return (
    <Container>
      <div className="pt-14">
        <h1 className="font-semibold text-2xl text-foreground tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
      </div>
      {groups.map((group) => (
        <FavGroup
          key={group.category}
          category={group.category}
          items={group.items}
        />
      ))}
    </Container>
  );
}
```

- [ ] **Step 9: Correr los tests y verificar que pasan**

Run: `npm run test:e2e && npm test`
Esperado: todo en verde.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: construir la página FAV con recursos agrupados"
```

---

### Task 11: Página CV

Embebe el PDF del CV con opción de descarga y alternativa para navegadores que no lo muestran.

**Files:**
- Modify: `src/app/[locale]/cv/page.tsx`
- Create: `e2e/cv.spec.ts`

**Interfaces:**
- Consumes: `profile.cv`.
- Produces: la ruta `/[locale]/cv`.

- [ ] **Step 1: Escribir el test end-to-end que falla**

`e2e/cv.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('CV ofrece la descarga del PDF', async ({ page }) => {
  await page.goto('/en/cv');
  const download = page.getByRole('link', { name: 'Download PDF' });
  await expect(download).toHaveAttribute(
    'href',
    '/cv/francisco-vacs-cv-en.pdf',
  );
});

test('el PDF del CV se sirve correctamente', async ({ request }) => {
  const response = await request.get('/cv/francisco-vacs-cv-en.pdf');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('pdf');
});

test('CV traduce al español', async ({ page }) => {
  await page.goto('/es/cv');
  await expect(page.getByRole('link', { name: 'Descargar PDF' })).toBeVisible();
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm run test:e2e`
Esperado: FALLAN los tests de `cv.spec.ts` que dependen de la página.

- [ ] **Step 3: Componer la página**

`src/app/[locale]/cv/page.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { profile } from '@/content/profile';

export default function CvPage() {
  const t = useTranslations('Cv');

  return (
    <Container>
      <div className="pt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-semibold text-2xl text-foreground tracking-tight">
            {t('title')}
          </h1>
          <a
            href={profile.cv}
            download
            className="text-foreground text-sm underline underline-offset-4"
          >
            {t('download')}
          </a>
        </div>
        <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
      </div>

      <object
        data={profile.cv}
        type="application/pdf"
        className="mt-10 h-[80vh] w-full rounded-lg border border-border"
        aria-label={t('title')}
      >
        <p className="p-6 text-muted-foreground">
          {t('fallback')}{' '}
          <a
            href={profile.cv}
            download
            className="text-foreground underline underline-offset-4"
          >
            {t('download')}
          </a>
        </p>
      </object>
    </Container>
  );
}
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npm run test:e2e`
Esperado: los tres tests de `cv.spec.ts` pasan.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: construir la página CV con el PDF embebido"
```

---

### Task 12: Página 404, metadatos y sitemap

Cierra los detalles que hacen que el sitio se indexe bien y no falle en rutas inexistentes.

**Files:**
- Create: `src/app/[locale]/not-found.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/lib/site.ts`
- Modify: `src/app/[locale]/layout.tsx` (alternates de idioma)
- Create: `e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `routing`, `profile`.
- Produces: `SITE_URL` desde `@/lib/site`; rutas `/sitemap.xml` y `/robots.txt`.

- [ ] **Step 1: Escribir el test end-to-end que falla**

`e2e/seo.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('una ruta inexistente muestra el 404 traducido', async ({ page }) => {
  const response = await page.goto('/en/no-existe');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('el 404 en español está traducido', async ({ page }) => {
  await page.goto('/es/no-existe');
  await expect(
    page.getByRole('heading', { name: 'Página no encontrada' }),
  ).toBeVisible();
});

test('cada locale declara su alternativa', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('link[hreflang="es"]')).toHaveCount(1);
  await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
});

test('el sitemap lista las rutas de ambos locales', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const body = await response.text();
  for (const path of ['/en', '/es', '/en/work', '/es/work', '/en/fav', '/en/cv']) {
    expect(body).toContain(path);
  }
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm run test:e2e`
Esperado: FALLAN los cuatro tests de `seo.spec.ts`.

- [ ] **Step 3: Definir la URL del sitio**

`src/lib/site.ts`:

```ts
/**
 * URL pública del sitio. Vercel expone el dominio de producción en
 * VERCEL_PROJECT_PRODUCTION_URL; en desarrollo se usa localhost.
 */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const SITE_PATHS = ['', '/work', '/fav', '/cv'] as const;
```

- [ ] **Step 4: Crear el 404 con locale**

`src/app/[locale]/not-found.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { Link } from '@/i18n/navigation';

export default function LocaleNotFound() {
  const t = useTranslations('NotFound');

  return (
    <Container>
      <div className="py-24">
        <h1 className="font-semibold text-2xl text-foreground tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-2 text-muted-foreground">{t('description')}</p>
        <Link
          href="/"
          className="mt-6 inline-block text-foreground text-sm underline underline-offset-4"
        >
          {t('backHome')}
        </Link>
      </div>
    </Container>
  );
}
```

- [ ] **Step 5: Crear el 404 raíz**

`src/app/not-found.tsx`:

```tsx
export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <main style={{ textAlign: 'center' }}>
          <h1>Page not found</h1>
          <p>
            <a href="/en">Back to home</a>
          </p>
        </main>
      </body>
    </html>
  );
}
```

Este archivo cubre las rutas que no matchean ningún locale, donde no hay contexto de traducción disponible. Por eso lleva su propio `<html>` y estilos en línea.

- [ ] **Step 6: Agregar los alternates de idioma**

En `src/app/[locale]/layout.tsx`, reemplazar `generateMetadata` por:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('Metadata');

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        es: '/es',
      },
    },
  };
}
```

Y agregar el import:

```tsx
import { SITE_URL } from '@/lib/site';
```

- [ ] **Step 7: Crear el sitemap**

`src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_PATHS, SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    SITE_PATHS.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((other) => [other, `${SITE_URL}/${other}${path}`]),
        ),
      },
    })),
  );
}
```

- [ ] **Step 8: Crear robots.txt**

`src/app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 9: Correr los tests y verificar que pasan**

Run: `npm run test:e2e`
Esperado: los cuatro tests de `seo.spec.ts` pasan.

- [ ] **Step 10: Verificar el build completo**

Run: `npm run build && npm run typecheck && npm run lint && npm test`
Esperado: los cuatro comandos terminan sin errores.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: agregar 404 traducido, metadatos alternos y sitemap"
```

---

### Task 13: Material pendiente de Francisco

Completa el contenido que depende de archivos y decisiones suyas. Cada punto es independiente: se puede hacer uno y desplegar.

**Files:**
- Modify: `src/content/profile.ts`
- Modify: `src/content/projects.ts`
- Modify: `src/content/fav.ts`
- Add: `public/avatar.jpg`, `public/work/cunumi.png`, `public/work/bohemia.png`

**Interfaces:**
- Consumes: los esquemas de la Task 3.
- Produces: contenido completo. Si algún dato queda mal formado, el build falla con el índice del registro.

- [ ] **Step 1: Agregar la foto de perfil**

Copiar la imagen a `public/avatar.jpg` (cuadrada, al menos 400×400 px) y agregar a `profile`:

```ts
  avatar: '/avatar.jpg',
```

- [ ] **Step 2: Decidir sobre WhatsApp**

Si Francisco quiere publicar el contacto por WhatsApp, agregar a `profile`:

```ts
  whatsapp: 'https://wa.me/5493412242333',
```

Si prefiere no publicar el teléfono, omitir el campo: el bloque de contacto ya está escrito para no mostrar el link cuando no existe.

- [ ] **Step 3: Agregar las URLs de demo**

En `src/content/projects.ts`, completar el objeto `links` de cada proyecto con
las URLs reales que provea Francisco. La forma del campo es:

```ts
      links: {
        live: '<URL de la demo en vivo>',
        repo: '<URL del repositorio>',
        store: '<URL en App Store o Google Play>',
      },
```

Las tres claves son opcionales: se incluye solo la que exista. Bohemia ya tiene
cargado su `repo`; le falta `live`. CUNUMI no tiene ninguna cargada todavía.

No inventar URLs. Si Francisco no provee la de un proyecto, dejar el campo
afuera: las tarjetas ya están escritas para no mostrar links inexistentes.

- [ ] **Step 4: Agregar las capturas de los proyectos**

Copiar las imágenes a `public/work/cunumi.png` y `public/work/bohemia.png` (proporción 16:9, ancho recomendado 1200 px) y agregar a cada proyecto:

```ts
      image: {
        src: '/work/cunumi.png',
        alt: {
          en: 'CUNUMI app showing the pet profile screen',
          es: 'App CUNUMI mostrando la pantalla de perfil de mascota',
        },
      },
```

- [ ] **Step 5: Personalizar la lista FAV**

Editar `src/content/fav.ts`: sacar lo que no corresponda, agregar los canales, blogs y herramientas que Francisco realmente sigue, y reescribir cada `note` con sus palabras. Mantener las categorías dentro de `'youtube' | 'blogs' | 'tools' | 'learning'`.

- [ ] **Step 6: Verificar que el contenido es válido**

Run: `npm test && npm run build`
Esperado: pasa. Si falla, el mensaje indica el archivo y el índice del registro problemático.

- [ ] **Step 7: Verificar visualmente**

Run: `npm run dev`
Abrir `http://localhost:3000/es` y recorrer las cuatro páginas en ambos idiomas y en ambos temas.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: completar contenido con imágenes, links y FAV personalizado"
```

---

### Task 14: Publicación en Vercel

Deja el sitio en línea con despliegue automático.

**Files:**
- Create: `README.md`
- Modify: `.gitignore` (si hiciera falta)

**Interfaces:**
- Consumes: el proyecto completo.
- Produces: repositorio en GitHub y sitio publicado en un subdominio de Vercel.

- [ ] **Step 1: Escribir el README**

`README.md`:

```markdown
# Portfolio — Francisco Vacs

Portfolio personal bilingüe (inglés / español). Sitio estático, sin base de datos.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, next-intl,
next-themes, Zod, Biome, Vitest y Playwright. Desplegado en Vercel.

## Desarrollo

```bash
npm install
npm run dev
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en http://localhost:3000 |
| `npm run build` | Build de producción |
| `npm run lint` | Linting con Biome |
| `npm run typecheck` | Chequeo de tipos |
| `npm test` | Tests unitarios (Vitest) |
| `npm run test:e2e` | Tests end-to-end (Playwright) |

## Cómo actualizar el contenido

Todo el contenido vive en `src/content/` y se valida con Zod al importarse.
Si un dato está mal, el build falla indicando el archivo y el índice.

| Archivo | Contenido |
|---|---|
| `profile.ts` | Nombre, bio, links de contacto, CV |
| `experience.ts` | Experiencia laboral |
| `education.ts` | Formación |
| `projects.ts` | Proyectos de la página Work |
| `fav.ts` | Recursos de la página FAV |

Los textos de interfaz (botones, títulos de sección) están en `messages/en.json`
y `messages/es.json`.
```

- [ ] **Step 2: Verificar el estado completo antes de publicar**

Run: `npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e`
Esperado: los cinco comandos terminan sin errores. No continuar si alguno falla.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: agregar README del proyecto"
```

- [ ] **Step 4: Crear el repositorio en GitHub y publicar**

Este paso lo corre Francisco, porque necesita su sesión autenticada:

```bash
gh repo create portfolio --public --source . --remote origin --push
```

Si el repositorio `FranciscoVacs/portfolio` ya existe y tiene contenido viejo,
decidir antes si se reemplaza o se usa otro nombre. No forzar el push sobre un
repositorio con contenido sin confirmarlo primero.

- [ ] **Step 5: Conectar Vercel**

En https://vercel.com/new, importar el repositorio. Vercel detecta Next.js solo.
No hay variables de entorno que configurar.

- [ ] **Step 6: Verificar el sitio publicado**

Abrir la URL de producción y comprobar, en ese orden:

1. `/` redirige a `/en` o `/es`.
2. Las cuatro páginas cargan en ambos idiomas.
3. El selector de idioma conserva la página.
4. El toggle de tema funciona y persiste.
5. El PDF del CV se abre y se descarga.
6. Los links externos de FAV y de los proyectos abren en pestaña nueva.
7. `/sitemap.xml` y `/robots.txt` responden.

- [ ] **Step 7: Verificar el despliegue automático**

Hacer un cambio menor de contenido en una rama, abrir un pull request y
comprobar que Vercel genera una URL de preview. Mergear y comprobar que
producción se actualiza sola.

---

## Notas para quien ejecute el plan

- El repositorio ya está inicializado y tiene un commit con el spec. La Task 1
  **no** debe reinicializarlo ni borrar `.git`.
- Si un test end-to-end falla por timeout la primera vez, suele ser el arranque
  de Turbopack. Correrlo de nuevo antes de investigar.
- Los tests son la especificación ejecutable: si una implementación no pasa el
  test, se corrige la implementación, no el test. La única excepción declarada
  es el formato de `Intl.DateTimeFormat` en la Task 8, Step 4.
- Ninguna tarea necesita variables de entorno ni servicios externos. Si aparece
  la necesidad de un `.env`, algo se desvió del diseño.
