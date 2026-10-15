import { expect, test } from "@playwright/test";
import { connected } from "./content";

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
