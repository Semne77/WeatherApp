import { describe, it, expect } from "vitest";
import { validateWeatherForm } from "../../src/lib/validation";

describe("validateWeatherForm (unit)", () => {
  it("returns error for missing location", () => {
    expect(
      validateWeatherForm({ location: "", startDate: "2026-02-01", endDate: "2026-02-02" })
    ).toBe("location is required");
  });

  it("returns error for end date before start date", () => {
    expect(
      validateWeatherForm({ location: "NYC", startDate: "2026-02-05", endDate: "2026-02-01" })
    ).toBe("end_date must be >= start_date");
  });

  it("returns null when valid", () => {
    expect(
      validateWeatherForm({ location: "NYC", startDate: "2026-02-01", endDate: "2026-02-05" })
    ).toBe(null);
  });
});
