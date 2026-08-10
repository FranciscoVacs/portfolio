import { expect, test } from "@playwright/test";

test("FAV agrupa por categoría", async ({ page }) => {
  await page.goto("/en/fav");
  await expect(page.getByRole("heading", { name: "YouTube" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tools" })).toBeVisible();
});

test("los links de FAV son externos y seguros", async ({ page }) => {
  await page.goto("/en/fav");
  const link = page.getByRole("link", { name: "Fireship" });
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);
});

test("FAV traduce los títulos de categoría", async ({ page }) => {
  await page.goto("/es/fav");
  await expect(
    page.getByRole("heading", { name: "Herramientas" }),
  ).toBeVisible();
});
