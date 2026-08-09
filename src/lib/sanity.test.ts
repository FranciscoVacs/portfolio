import { describe, expect, it } from "vitest";
import { projectName } from "./sanity";

describe("projectName", () => {
  it("devuelve el nombre del portfolio", () => {
    expect(projectName()).toBe("francisco-vacs-portfolio");
  });
});
