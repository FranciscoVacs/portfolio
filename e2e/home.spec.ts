import { expect, test } from "@playwright/test";

test("la home muestra el nombre y el titular", async ({ page }) => {
  await page.goto("/en");
  await expect(
    page.getByRole("heading", { level: 1, name: "Francisco Vacs" }),
  ).toBeVisible();
});

test("la home lista experiencia y educación", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Education" })).toBeVisible();
  // exact: true distingue la empresa "Cunumi" del proyecto "CUNUMI",
  // que también aparece en la home dentro de los destacados.
  await expect(
    page.getByRole("heading", { name: "Cunumi", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Universidad Tecnológica Nacional" }),
  ).toBeVisible();
});

test("la home muestra los destacados y enlaza a Work", async ({ page }) => {
  await page.goto("/en");
  await expect(
    page.getByRole("heading", { name: "Featured work" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "See all work" }).click();
  await expect(page).toHaveURL("/en/work");
});

test("la home traduce al español", async ({ page }) => {
  await page.goto("/es");
  await expect(
    page.getByRole("heading", { name: "Experiencia" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sobre mí" })).toBeVisible();
});
