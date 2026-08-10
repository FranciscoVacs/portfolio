import { expect, test } from "@playwright/test";

test("CV ofrece la descarga del PDF", async ({ page }) => {
  await page.goto("/en/cv");
  const download = page.getByRole("link", {
    name: "Download PDF",
    exact: true,
  });
  await expect(download).toHaveAttribute(
    "href",
    "/cv/francisco-vacs-cv-en.pdf",
  );
});

test("el PDF del CV se sirve correctamente", async ({ request }) => {
  const response = await request.get("/cv/francisco-vacs-cv-en.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("pdf");
});

test("CV traduce al español", async ({ page }) => {
  await page.goto("/es/cv");
  const download = page.getByRole("link", {
    name: "Descargar PDF",
    exact: true,
  });
  await expect(download).toBeVisible();
});
