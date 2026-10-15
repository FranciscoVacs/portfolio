import { expect, test } from "@playwright/test";
import { connected } from "./content";

test("los enlaces históricos y estables descargan el PDF vigente", async ({
  request,
}) => {
  if (!connected) return;
  for (const [format, url] of [
    ["es", connected.locales.es.pdf.classic],
    ["en", connected.locales.en?.pdf.classic],
    ["europass", connected.locales.en?.pdf.europass],
  ]) {
    if (!url) continue;
    const current = await request.get(url),
      stable = await request.get(`/api/cv/${format}?profile=${connected.id}`);
    expect(stable.status()).toBe(200);
    expect(await stable.body()).toEqual(await current.body());
    if (format !== "europass") {
      const legacy = await request.get(`/cv/francisco-vacs-cv-${format}.pdf`);
      expect(legacy.url()).toContain("/cv/gestion/");
      expect(await legacy.body()).toEqual(await current.body());
    }
  }
  expect((await request.get("/api/cv/es?profile=no-existe")).status()).toBe(
    404,
  );
  expect((await request.get("/api/cv/desconocido")).status()).toBe(404);
});

test("el perfil conserva su ruta al navegar, cambiar idioma y descargar", async ({
  page,
  request,
}) => {
  test.skip(!connected, "Sin perfil conectado en este checkout");
  if (!connected) return;
  await page.goto(`/es/perfil/${connected.id}`);
  await expect(
    page.getByRole("heading", { level: 1, name: connected.locales.es.name }),
  ).toBeVisible();
  await page.getByRole("link", { name: "CV", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/es/perfil/${connected.id}/cv$`));
  await expect(page.locator("object")).toHaveAttribute(
    "data",
    connected.locales.es.pdf.classic,
  );
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/en/perfil/${connected.id}/cv$`));
  if (connected.locales.en) {
    const europass = connected.locales.en.pdf.europass;
    if (!europass)
      throw new Error("Falta el PDF Europass del perfil traducido");
    const link = page.getByRole("link", { name: "Download Europass PDF" });
    await expect(link).toHaveAttribute("href", europass);
    const response = await request.get(europass);
    expect(response.status()).toBe(200);
    expect((await response.body()).subarray(0, 4).toString()).toBe("%PDF");
  } else
    await expect(
      page.getByRole("heading", { name: "Translation pending" }),
    ).toBeVisible();
});
