import { expect, test } from "@playwright/test";

test("la aplicación responde en la raíz", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBeLessThan(400);
});
