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

test("solo quedan las dos categorías reales", async ({ page }) => {
  // "Clientes" se retiró: si vuelve a aparecer, es que quedó una traducción
  // suelta o un filtro sin limpiar.
  await page.goto("/en/work");
  const filters = page.getByRole("navigation", { name: "Filter by category" });
  await expect(filters.getByRole("link")).toHaveCount(3);
  await expect(filters.getByText("Client")).toHaveCount(0);
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
  if (!image) throw new Error("falta la miniatura");

  // La miniatura flota, así que la caja del párrafo ocupa todo el ancho y
  // solo las líneas se acortan: hay que medir la primera línea, no el <p>.
  const firstLineX = await card
    .locator("p")
    .first()
    .evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getClientRects()[0].x;
    });

  expect(firstLineX).toBeGreaterThan(image.x + image.width);
});

test("todas las miniaturas tienen la misma caja", async ({ page }) => {
  // Sin proporción fija, cada tarjeta mostraba la imagen con el alto de su
  // archivo original y el listado quedaba desparejo.
  await page.goto("/en/work");
  const images = page.getByRole("article").locator("img");
  const count = await images.count();
  expect(count).toBeGreaterThan(1);

  const boxes = [];
  for (let i = 0; i < count; i++) {
    const box = await images.nth(i).boundingBox();
    if (!box) throw new Error(`falta la miniatura ${i}`);
    boxes.push(`${Math.round(box.width)}x${Math.round(box.height)}`);
  }
  expect(new Set(boxes).size, boxes.join(" / ")).toBe(1);
});
