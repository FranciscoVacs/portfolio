import { expect, test } from "@playwright/test";

test("la raíz redirige a un locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|es)$/);
});

test("el locale inglés carga", async ({ page }) => {
  const response = await page.goto("/en");
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("el locale español carga", async ({ page }) => {
  const response = await page.goto("/es");
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("/de no sirve contenido y termina en 404", async ({ page }) => {
  const response = await page.goto("/de");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});

test("una ruta inexistente dentro de un locale valido devuelve 404", async ({
  page,
}) => {
  const response = await page.goto("/en/no-existe");
  expect(response?.status()).toBe(404);
});
