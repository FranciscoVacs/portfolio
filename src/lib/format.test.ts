import { describe, expect, it } from "vitest";
import { formatPeriod } from "./format";

describe("formatPeriod", () => {
  it("formatea un período cerrado en inglés", () => {
    expect(
      formatPeriod({ start: "2021-08", end: "2021-11" }, "Present", "en"),
    ).toBe("Aug 2021 — Nov 2021");
  });

  it("usa la etiqueta de actualidad cuando no hay fin", () => {
    expect(formatPeriod({ start: "2026-05" }, "Present", "en")).toBe(
      "May 2026 — Present",
    );
  });

  it("formatea en español", () => {
    expect(formatPeriod({ start: "2022-03" }, "Actualidad", "es")).toBe(
      "mar 2022 — Actualidad",
    );
  });
});
