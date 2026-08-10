# Rediseño según la referencia real + migración a pnpm — Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

**Goal:** Adoptar el diseño de **https://saivamshi.aethoscompany.in/** (la referencia correcta) y migrar el gestor de paquetes a pnpm.

**Contexto:** el 2026-08-10 Francisco aclaró que el repositorio que había pasado antes (`urstruelysv/portfolio`, desplegado en vercel.app) **no era el que quería copiar**. La referencia real es otro sitio, con un diseño completamente distinto. Además pidió: usar su repositorio `portfolio` de GitHub, pnpm en vez de npm, y cuatro cosas concretas del diseño que hoy no están.

## Lo que se midió en la referencia real

Inspeccionada en vivo con el navegador. Valores exactos, no aproximaciones.

### Tokens

```
--brand:      #2d5ba4
--primary:    #111                                  (texto principal)
--foreground: #666                                  (texto secundario)
--muted:      color-mix(in oklab, #111 6%, #fff)
--border:     color-mix(in oklab, #111 12%, #fff)
```
Fondo `#fff`. Sin modo oscuro.

### Tipografía

- Cuerpo: **Inter**, `14px`, `line-height: 24px`, color `#111`.
- **Los párrafos van justificados** (`text-align: justify`). Es la característica más visible del diseño.
- `h1`: `24px`, `font-weight: 700`.
- Navegación y etiquetas: **fuente monoespaciada** (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`), tamaño `text-xs`, `tracking-wide`, en mayúsculas.
- Contenedor: `max-w-2xl` (más angosto que el `max-w-3xl` actual).

### Navegación

```html
<header class="relative pt-0.5">
  <div class="mx-auto max-w-2xl px-4">
    <nav class="flex h-14 items-center justify-between">
      <a class="font-mono text-sm font-medium tracking-wide" href="/">SV</a>
      <div class="flex items-center gap-5">
        <a class="group font-mono text-xs tracking-wide transition-colors text-neutral-400 hover:text-brand" href="/projects">
          <span class="relative inline-block">WORK<!-- svg punteado, opacity-0 group-hover:opacity-100 --></span>
        </a>
        …
      </div>
    </nav>
  </div>
</header>
```

No es sticky. Los links van en mayúsculas, monoespaciados, en gris (`neutral-400`), y al pasar el mouse aparece el subrayado punteado y el color pasa a `--brand`.

### Subrayado punteado

Es un SVG con un patrón de círculos, no un `border` ni un `text-decoration`:

```html
<span class="relative inline-block">
  Aethos Labs
  <svg class="pointer-events-none absolute left-0 w-full text-neutral-400 -bottom-[3px]
              transition-[color,opacity] duration-200 group-hover:text-brand"
       style="height:4px" aria-hidden="true" preserveAspectRatio="none">
    <defs>
      <pattern id="dots" width="6" height="4" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="2" r="1" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
</span>
```

En links **de contenido** los puntos están siempre visibles. En links **de navegación** aparecen al hover (`opacity-0 group-hover:opacity-100`).

### Revelado con desenfoque al scrollear

Es CSS puro más una clase que se agrega por JavaScript. Las reglas exactas:

```css
.page-reveal { filter: blur(8px); opacity: 0; }
.page-revealed { filter: blur(0); opacity: 1; transition: filter .6s ease-out, opacity .6s ease-out; }

.reveal-content > :not(.reveal-content) {
  filter: blur(8px); opacity: 0;
  transition: filter .6s ease-out, opacity .6s ease-out;
}
.reveal-content > .revealed { filter: blur(0); opacity: 1; }

.page-reveal.reveal-settled,
.reveal-content > .reveal-settled { filter: none; transition: none; }
```

El detalle importante es `.reveal-settled`: una vez terminada la transición se quita el `filter` por completo. Un `filter` permanente crea un contexto de apilamiento y cuesta rendimiento, así que se limpia.

Y el respaldo, que la referencia también tiene:

```css
@media (prefers-reduced-motion: reduce) {
  .page-reveal, .reveal-content > * { filter: none; opacity: 1; transition: none; }
}
```

Más un `!important` equivalente para el caso sin JavaScript, de modo que el contenido nunca quede invisible si el script no corre. **Eso no es opcional: sin ese respaldo, un fallo de JavaScript deja la página en blanco.**

## Global Constraints

- **No hay modo oscuro.** Ni toggle, ni clase `.dark`, ni variantes `dark:`.
- **pnpm es el gestor de paquetes.** No debe quedar `package-lock.json`.
- Tailwind CSS 4: configuración en el CSS con `@theme`. No existe `tailwind.config.ts`.
- Next.js 16: `params` y `searchParams` son Promesas.
- Se conserva todo lo funcional: rutas, contenido, i18n, metadatos canónicos por página, sitemap, filtros de Work.
- **El prerenderizado estático de `/en`, `/es`, `/en/fav`, `/es/fav`, `/en/cv`, `/es/cv` debe conservarse.**
- Ningún test de comportamiento puede romperse sin justificación escrita.
- Alias `@/*` → `src/*`. Commits en español con prefijo convencional.
- Biome formatea con comillas dobles: escribir y luego `pnpm lint:fix`.

---

### Task 1: Migrar de npm a pnpm

**Files:** `package.json`, borrar `package-lock.json`, crear `pnpm-lock.yaml`, `README.md`, `playwright.config.ts`, `.gitignore`

- [ ] **Step 1: Migrar el lockfile**

```bash
npm i -g pnpm   # si no está instalado
rm -rf node_modules package-lock.json
pnpm import 2>/dev/null || true
pnpm install
```

- [ ] **Step 2: Declarar el gestor**

En `package.json`, agregar `"packageManager": "pnpm@<versión instalada>"`. Obtener la versión con `pnpm --version`.

- [ ] **Step 3: Actualizar los comandos internos**

En `playwright.config.ts`, el `webServer.command` dice `npm run build && npm run start`. Cambiarlo a `pnpm build && pnpm start`.

- [ ] **Step 4: Actualizar el README**

Reemplazar todas las apariciones de `npm run` y `npm install` por sus equivalentes de pnpm.

- [ ] **Step 5: Verificar**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e`
Esperado: los cinco en verde, mismos números que antes (33 unitarios, 29 end-to-end).

- [ ] **Step 6: Commit**

```bash
git add -A ':!.superpowers'
git commit -m "chore: migrar el gestor de paquetes a pnpm"
```

---

### Task 2: Tokens, tipografía y navegación

**Files:** `src/app/globals.css`, `src/components/layout/Nav.tsx`, `src/components/layout/NavLink.tsx`, `src/components/layout/Container.tsx`, `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Reescribir los tokens**

En `src/app/globals.css`, reemplazar el bloque de tokens por los medidos en la referencia:

```css
@theme inline {
  --font-sans: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  --color-background: var(--background);
  --color-primary: var(--primary);
  --color-foreground: var(--foreground);
  --color-brand: var(--brand);
  --color-muted: var(--muted);
  --color-border: var(--border);
}

:root {
  --background: #fff;
  --primary: #111;
  --foreground: #666;
  --brand: #2d5ba4;
  --muted: color-mix(in oklab, #111 6%, #fff);
  --border: color-mix(in oklab, #111 12%, #fff);
}

body {
  background: var(--background);
  color: var(--primary);
  font-size: 14px;
  line-height: 24px;
  -webkit-font-smoothing: antialiased;
}
```

**Nota sobre el cambio de nombres:** la referencia usa `--primary` para el texto principal y `--foreground` para el secundario, al revés de la convención de shadcn que veníamos usando (`--foreground` principal, `--muted-foreground` secundario). Como el objetivo es copiar esta referencia, se adoptan **sus** nombres. Hay que reemplazar en todos los componentes: `text-foreground` → `text-primary`, `text-muted-foreground` → `text-foreground`. Es un reemplazo mecánico pero hay que hacerlo completo: si queda una clase vieja, el color no existe y el texto hereda, quedando invisible o mal.

- [ ] **Step 2: Justificar los párrafos**

Agregar a `globals.css` la regla que da su carácter al diseño:

```css
p {
  text-align: justify;
  text-wrap: pretty;
}
```

- [ ] **Step 3: Angostar el contenedor**

En `src/components/layout/Container.tsx`, pasar de `max-w-3xl` a `max-w-2xl` y el padding a `px-4`.

- [ ] **Step 4: Rehacer la navegación**

`Nav.tsx`: header no sticky, `pt-0.5`, contenedor `mx-auto max-w-2xl px-4`, `nav` con `flex h-14 items-center justify-between`. A la izquierda las iniciales **FV** con `font-mono text-sm font-medium tracking-wide` enlazando a la home. A la derecha los destinos con `gap-5`.

`NavLink.tsx` (ya existe, es cliente): cada link con `group font-mono text-xs tracking-wide transition-colors`, en `text-foreground` (el gris) y `hover:text-brand`. **Conservar el `aria-current="page"` del link activo**, y darle al activo `text-primary` para distinguirlo. El subrayado punteado del componente de la Task 3 va adentro, con `opacity-0 group-hover:opacity-100` más visible siempre cuando el link está activo.

Los textos de los destinos van en **mayúsculas**: usar `uppercase` en CSS, no cambiar las traducciones.

- [ ] **Step 5: Verificar**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e`

Si algún test end-to-end falla por el cambio de mayúsculas en la navegación, **ajustar el test para que busque el nombre accesible real**, y documentarlo. `uppercase` es CSS: el texto accesible sigue siendo el original, así que no debería romperse.

- [ ] **Step 6: Commit**

```bash
git add -A ':!.superpowers'
git commit -m "feat: adoptar los tokens, la tipografia y la navegacion de la referencia"
```

---

### Task 3: Subrayado punteado

**Files:** crear `src/components/ui/DottedLink.tsx`, modificar `Contact.tsx`, `FavGroup.tsx`, `WorkCard.tsx`, `Footer.tsx`, `cv/page.tsx`, `FeaturedWork.tsx`, `NavLink.tsx`

- [ ] **Step 1: Crear el componente**

`src/components/ui/DottedLink.tsx`. Sirve para links internos y externos, y para el caso de navegación donde los puntos aparecen sólo al hover.

```tsx
import { useId } from "react";

export function DottedUnderline({ onlyOnHover = false }: { onlyOnHover?: boolean }) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="none"
      style={{ height: 4 }}
      className={`pointer-events-none absolute -bottom-[3px] left-0 w-full text-foreground transition-[color,opacity] duration-200 group-hover:text-brand${
        onlyOnHover ? " opacity-0 group-hover:opacity-100" : ""
      }`}
    >
      <title>‌</title>
      <defs>
        <pattern id={id} width="6" height="4" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="2" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
```

`useId` es obligatorio: si el `id` del patrón se repite entre instancias, todos los SVG de la página apuntan al mismo patrón y el navegador puede resolverlo mal. Biome puede exigir un `<title>` en el SVG; con `aria-hidden` el título no se anuncia.

Y el link que lo usa:

```tsx
export function DottedLink({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group text-primary transition-colors hover:text-brand"
    >
      <span className="relative inline-block">
        {children}
        <DottedUnderline />
      </span>
    </a>
  );
}
```

- [ ] **Step 2: Reemplazar los subrayados actuales**

Hoy los links usan `underline underline-offset-4`. Reemplazar por `DottedLink` en: `Contact.tsx` (email, LinkedIn, GitHub), `FavGroup.tsx` (los recursos), `WorkCard.tsx` (ver en vivo, código fuente), `Footer.tsx`, `cv/page.tsx` (descargar), `FeaturedWork.tsx` (ver todos los trabajos).

**Cuidado con dos tests:** `e2e/fav.spec.ts` verifica que el link de FAV tenga `target="_blank"` y `rel` con `noopener`; `e2e/cv.spec.ts` verifica `getByRole("link", { name: "Download PDF", exact: true })` y el atributo `href`. El `DottedLink` debe conservar esos atributos y **no** agregar texto dentro del nombre accesible. El `<title>` del SVG es un carácter invisible justamente por eso: si ponés texto real ahí, el nombre accesible cambia y el test cae.

- [ ] **Step 3: Verificar**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e`

- [ ] **Step 4: Commit**

```bash
git add -A ':!.superpowers'
git commit -m "feat: reemplazar los subrayados por el punteado de la referencia"
```

---

### Task 4: Revelado con desenfoque al scrollear

**Files:** `src/app/globals.css`, crear `src/components/ui/RevealContent.tsx`, modificar `src/app/[locale]/page.tsx`, borrar `src/components/ui/FadeIn.tsx`, desinstalar `framer-motion`

- [ ] **Step 1: Agregar las reglas CSS**

A `src/app/globals.css`, tal cual la referencia:

```css
.reveal-content > :not(.reveal-content) {
  filter: blur(8px);
  opacity: 0;
  transition: filter 0.6s ease-out, opacity 0.6s ease-out;
}
.reveal-content > .revealed {
  filter: blur(0);
  opacity: 1;
}
.reveal-content > .reveal-settled {
  filter: none;
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal-content > * {
    filter: none;
    opacity: 1;
    transition: none;
  }
}
```

- [ ] **Step 2: El respaldo sin JavaScript, que es obligatorio**

Si el script no corre, el contenido queda con `opacity: 0` para siempre: la página se ve vacía. Agregar en el `<head>` del layout una regla que sólo se anula cuando el JavaScript arranca. La forma más simple: que el CSS de arriba se aplique únicamente cuando la raíz tiene una clase que agrega el propio script.

En `src/app/[locale]/layout.tsx`, dentro del `<head>`:

```tsx
<script
  // biome-ignore lint/security/noDangerouslySetInnerHtml: habilita el revelado sólo si hay JS
  dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }}
/>
```

Y en el CSS, prefijar los selectores del Step 1 con `.js`:
`.js .reveal-content > :not(.reveal-content) { … }`

Así, sin JavaScript nunca se aplica el `opacity: 0` y el contenido se ve normal.

- [ ] **Step 3: Crear el observador**

`src/components/ui/RevealContent.tsx`, cliente. Observa a sus hijos directos y les agrega `revealed` al entrar en el viewport; al terminar la transición les agrega `reveal-settled` para quitar el `filter`.

```tsx
"use client";

import { useEffect, useRef } from "react";

export function RevealContent({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(root.children) as HTMLElement[];

    if (reduced) {
      for (const el of items) el.classList.add("revealed", "reveal-settled");
      return;
    }

    const settle = (event: TransitionEvent) => {
      const el = event.currentTarget as HTMLElement;
      if (event.propertyName === "filter") el.classList.add("reveal-settled");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("revealed");
          el.addEventListener("transitionend", settle, { once: true });
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    for (const el of items) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="reveal-content">
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Aplicarlo y quitar framer-motion**

En `src/app/[locale]/page.tsx`, reemplazar los `<FadeIn>` por un único `<RevealContent>` que envuelve los cinco bloques. Después:

```bash
git rm src/components/ui/FadeIn.tsx
pnpm remove framer-motion
```

- [ ] **Step 5: Verificar, con atención al prerenderizado**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e`

`RevealContent` es cliente pero recibe `children` de servidor, así que el prerenderizado se conserva. **Verificar la tabla de rutas del build**: las seis rutas siguen estáticas.

**Y verificar que los tests end-to-end no se vuelvan inestables:** los elementos arrancan con `opacity: 0`, y Playwright considera invisible un elemento con opacidad cero. Correr la suite **dos veces** y reportar ambas. Si algún test falla porque el contenido no llegó a revelarse, **reportarlo con la evidencia**; no bajar workers ni agregar esperas artificiales.

- [ ] **Step 6: Commit**

```bash
git add -A ':!.superpowers'
git commit -m "feat: revelar el contenido con desenfoque al scrollear"
```

---

## Riesgo principal, declarado

El revelado arranca con `opacity: 0`. Eso interactúa con dos cosas:

1. **Los tests end-to-end**, que verifican visibilidad. El `rootMargin` y el `threshold` bajos hacen que el contenido en viewport se revele de inmediato, pero es la fuente más probable de inestabilidad de todo este plan.
2. **Los buscadores.** El contenido está en el HTML servido, así que se indexa igual; el `opacity` es sólo presentación. No hay riesgo de SEO.

Si el Step 5 de la Task 4 muestra inestabilidad, la salida correcta **no** es debilitar los tests: es revisar el umbral del observador o revelar sin esperar al viewport en el primer bloque.
