import { describe, expect, it } from "vitest";
import { PRESET_ITEMS } from "../data/presets";
import { normalizeAppData } from "./storage";

describe("storage normalization", () => {
  it("repairs malformed imports enough to render safely", () => {
    const data = normalizeAppData({
      items: [{ id: "x", title: "Custom", type: "weekly" }],
      settings: { region: "custom", timezone: "Bad/Zone", dailyResetTime: "05:00", weeklyResetDay: 1 },
      completions: { x: "W:2026-05-11", bad: 123 },
    });

    const imported = data.items.find((item) => item.id === "x");
    expect(imported?.type).toBe("weekly");
    expect(data.completions).toEqual({ x: "W:2026-05-11" });
    expect(data.settings.timezone).toBeTruthy();
  });

  it("merges updated presets while preserving hidden state and custom items", () => {
    const data = normalizeAppData({
      items: [
        {
          ...PRESET_ITEMS[0],
          title: "Old stale title",
          description: "Old stale description",
          enabled: false,
        },
        {
          id: "custom-test",
          title: "My route",
          description: "Personal note",
          type: "daily",
          category: "Custom",
          source: "custom",
          enabled: true,
        },
      ],
      settings: { region: "asia", timezone: "Etc/GMT-8", dailyResetTime: "05:00", weeklyResetDay: 1 },
      completions: {},
    });

    const migratedPreset = data.items.find((item) => item.id === PRESET_ITEMS[0].id);
    expect(migratedPreset?.title).toBe(PRESET_ITEMS[0].title);
    expect(migratedPreset?.description).toBe(PRESET_ITEMS[0].description);
    expect(migratedPreset?.enabled).toBe(false);
    expect(data.items.some((item) => item.id === "custom-test")).toBe(true);
  });
});
