import { expect, test } from "@playwright/test";

test("la navegación muestra los cuatro destinos", async ({ page }) => {
  await page.goto("/en");
  const nav = page.getByRole("navigation").first();
  await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Work" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "FAV" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "CV" })).toBeVisible();
});

test("el selector de idioma conserva la ruta", async ({ page }) => {
  await page.goto("/en/work");
  await page.getByRole("link", { name: "ES" }).click();
  await expect(page).toHaveURL("/es/work");
});

test("el toggle de tema cambia el tema y persiste", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
