import { expect, test } from "@playwright/test";

test("una ruta inexistente muestra el 404 traducido", async ({ page }) => {
  const response = await page.goto("/en/no-existe");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});

test("el 404 en español está traducido", async ({ page }) => {
  await page.goto("/es/no-existe");
  await expect(
    page.getByRole("heading", { name: "Página no encontrada" }),
  ).toBeVisible();
});

test("cada locale declara su alternativa", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator('link[hreflang="es"]')).toHaveCount(1);
  await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
});

test("el sitemap lista las ocho rutas de ambos locales", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body.match(/<loc>/g)).toHaveLength(8);
  for (const path of [
    "/en",
    "/es",
    "/en/work",
    "/es/work",
    "/en/fav",
    "/es/fav",
    "/en/cv",
    "/es/cv",
  ]) {
    expect(body).toContain(`<loc>http://localhost:3000${path}</loc>`);
  }
});

test("cada pagina declara su propio canonical", async ({ page }) => {
  await page.goto("/en/work");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/en\/work$/,
  );
  await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
    "href",
    /\/es\/work$/,
  );
});
