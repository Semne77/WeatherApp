import { describe, it, expect } from "vitest";
import { buildWeatherQueryRequest } from "../../src/lib/api";

describe("buildWeatherQueryRequest (unit)", () => {
  it("builds correct URL + payload keys", () => {
    const { url, options } = buildWeatherQueryRequest({
      baseUrl: "http://localhost:5001",
      location: "New York, NY, USA",
      start_date: "2026-02-04",
      end_date: "2026-02-07",
    });

    expect(url).toBe("http://localhost:5001/api/weather-query");
    expect(options.method).toBe("POST");

    expect(JSON.parse(options.body)).toEqual({
      location: "New York, NY, USA",
      start_date: "2026-02-04",
      end_date: "2026-02-07",
    });
  });
});
