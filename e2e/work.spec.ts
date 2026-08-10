import { expect, test } from "@playwright/test";

test("Work lista todos los proyectos por defecto", async ({ page }) => {
  await page.goto("/en/work");
  await expect(page.getByRole("heading", { name: "CUNUMI" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bohemia" })).toBeVisible();
});

test("el filtro de contratos deja solo CUNUMI", async ({ page }) => {
  await page.goto("/en/work");
  await page.getByRole("link", { name: "Contract", exact: true }).click();
  await expect(page).toHaveURL("/en/work?type=contract");
  await expect(page.getByRole("heading", { name: "CUNUMI" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bohemia" })).toHaveCount(0);
});

test("el filtro de clientes muestra el mensaje de vacío", async ({ page }) => {
  await page.goto("/en/work?type=client");
  await expect(
    page.getByText("No projects in this category yet."),
  ).toBeVisible();
});

test("un filtro inválido cae en todos", async ({ page }) => {
  await page.goto("/en/work?type=freelance");
  await expect(page.getByRole("heading", { name: "CUNUMI" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bohemia" })).toBeVisible();
});

test("las tarjetas muestran el stack y los links", async ({ page }) => {
  await page.goto("/en/work");
  await expect(page.getByText("React Native", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Source code" }).first(),
  ).toBeVisible();
});
