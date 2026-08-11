import { describe, expect, it } from "vitest";
import { formatPeriod } from "./format";

describe("formatPeriod", () => {
  it("escribe los meses completos, sin abreviar", () => {
    expect(
      formatPeriod({ start: "2021-08", end: "2021-11" }, "Present", "en"),
    ).toBe("August 2021 - November 2021");
  });

  it("usa la etiqueta de actualidad cuando no hay fin", () => {
    expect(formatPeriod({ start: "2026-05" }, "Present", "en")).toBe(
      "May 2026 - Present",
    );
  });

  it("formatea en español con la preposición que pide el idioma", () => {
    // "marzo de 2022", no "marzo 2022": es lo que devuelve Intl en español y
    // es la forma correcta; el inglés no lleva preposición.
    expect(formatPeriod({ start: "2022-03" }, "Actualidad", "es")).toBe(
      "marzo de 2022 - Actualidad",
    );
  });

  it("separa con guion medio y no con raya", () => {
    const period = formatPeriod(
      { start: "2024-07", end: "2025-02" },
      "-",
      "es",
    );
    expect(period).toContain(" - ");
    expect(period).not.toContain("—");
  });
});
