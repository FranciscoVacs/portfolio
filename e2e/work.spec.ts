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
    page.getByRole("link", { name: "Live demo" }).first(),
  ).toBeVisible();
});

test("cada tecnología del stack lleva su logo", async ({ page }) => {
  await page.goto("/en/work");
  // El badge de React Native es el <li> que contiene ese texto exacto; el
  // svg tiene que estar adentro y pintado con el color de marca, no heredar
  // el color del texto.
  const badge = page
    .getByRole("listitem")
    .filter({ hasText: /^React Native$/ })
    .first();
  await expect(badge.locator("svg")).toHaveAttribute("fill", /^#[0-9A-F]{6}$/i);
});

test("la miniatura queda al costado de la descripción", async ({ page }) => {
  await page.goto("/en/work");
  const card = page.getByRole("article").first();
  const image = await card.locator("img").boundingBox();
  const text = await card.locator("p").first().boundingBox();
  if (!image || !text) throw new Error("faltan la miniatura o la descripción");
  // Misma banda vertical y el texto arrancando después de la imagen: si
  // volviera a apilarse, el texto empezaría en el mismo borde izquierdo.
  expect(text.x).toBeGreaterThan(image.x + image.width);
  expect(Math.abs(text.y - image.y)).toBeLessThan(40);
});
