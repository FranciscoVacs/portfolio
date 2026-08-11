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

test("cada idioma sirve su propio PDF", async ({ page }) => {
  // Sin esto, traducir la página pero dejar el mismo archivo pasaría
  // desapercibido: el botón cambia de texto y el PDF sigue siendo el inglés.
  await page.goto("/es/cv");
  await expect(
    page.getByRole("link", { name: "Descargar PDF", exact: true }),
  ).toHaveAttribute("href", "/cv/francisco-vacs-cv-es.pdf");
});

test("los dos PDFs se sirven correctamente", async ({ request }) => {
  for (const file of ["francisco-vacs-cv-en", "francisco-vacs-cv-es"]) {
    const response = await request.get(`/cv/${file}.pdf`);
    expect(response.status(), file).toBe(200);
    expect(response.headers()["content-type"], file).toContain("pdf");
  }
});

test("CV traduce al español", async ({ page }) => {
  await page.goto("/es/cv");
  const download = page.getByRole("link", {
    name: "Descargar PDF",
    exact: true,
  });
  await expect(download).toBeVisible();
});
