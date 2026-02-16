import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import HistoryForecastPage from "../../src/pages/HistoryForecastPage";

vi.mock("../../src/components/SearchBar", () => ({
  default: ({ address, setAddress }) => (
    <input
      data-testid="location-input"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      placeholder="location"
    />
  ),
}));

vi.mock("../../src/components/SearchHistory", () => ({
  default: () => <div data-testid="search-history" />,
}));

describe("HistoryForecastPage (integration)", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();

    window.alert = vi.fn();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "ok" }),
    });
  });

  afterEach(() => cleanup());

  it("does NOT call API when required fields are missing", () => {
    render(<HistoryForecastPage />);

    fireEvent.click(screen.getByRole("button", { name: /submit query/i }));

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls POST /api/weather-query with correct JSON body when valid", async () => {
    render(<HistoryForecastPage />);

    fireEvent.change(screen.getByTestId("location-input"), {
      target: { value: "Minneapolis, MN, USA" },
    });

    const dateInputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[0], { target: { value: "2026-02-15" } });
    fireEvent.change(dateInputs[1], { target: { value: "2026-02-18" } });

    fireEvent.click(screen.getByRole("button", { name: /submit query/i }));

    // first fetch is POST /api/weather-query
    const [url, options] = global.fetch.mock.calls[0];

    expect(url).toMatch(/\/api\/weather-query$/);
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");

    expect(JSON.parse(options.body)).toEqual({
      location: "Minneapolis, MN, USA",
      start_date: "2026-02-15",
      end_date: "2026-02-18",
    });
  });
});
