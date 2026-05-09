import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "../data/presets";
import { getPeriodKey, isCompletedForCurrentPeriod, normalizeTimezone } from "./reset";

describe("reset period keys", () => {
  it("keeps daily completion before the 05:00 reset", () => {
    const beforeReset = new Date("2026-05-10T20:59:00.000Z");
    const afterReset = new Date("2026-05-10T21:00:00.000Z");

    expect(getPeriodKey("daily", beforeReset, DEFAULT_SETTINGS)).toBe("D:2026-05-10");
    expect(getPeriodKey("daily", afterReset, DEFAULT_SETTINGS)).toBe("D:2026-05-11");
  });

  it("rolls weekly completion at Monday 05:00 in the configured timezone", () => {
    const beforeWeeklyReset = new Date("2026-05-10T20:59:00.000Z");
    const afterWeeklyReset = new Date("2026-05-10T21:00:00.000Z");

    expect(getPeriodKey("weekly", beforeWeeklyReset, DEFAULT_SETTINGS)).toBe("W:2026-05-04");
    expect(getPeriodKey("weekly", afterWeeklyReset, DEFAULT_SETTINGS)).toBe("W:2026-05-11");
  });

  it("uses fixed server-time offsets for America and Europe profiles", () => {
    expect(
      getPeriodKey("daily", new Date("2026-05-10T09:59:00.000Z"), {
        ...DEFAULT_SETTINGS,
        region: "america",
      }),
    ).toBe("D:2026-05-09");
    expect(
      getPeriodKey("daily", new Date("2026-05-10T10:00:00.000Z"), {
        ...DEFAULT_SETTINGS,
        region: "america",
      }),
    ).toBe("D:2026-05-10");
    expect(
      getPeriodKey("daily", new Date("2026-05-10T03:59:00.000Z"), {
        ...DEFAULT_SETTINGS,
        region: "europe",
      }),
    ).toBe("D:2026-05-09");
    expect(
      getPeriodKey("daily", new Date("2026-05-10T04:00:00.000Z"), {
        ...DEFAULT_SETTINGS,
        region: "europe",
      }),
    ).toBe("D:2026-05-10");
  });

  it("treats stale completion keys as unchecked", () => {
    const afterReset = new Date("2026-05-10T21:00:00.000Z");

    expect(isCompletedForCurrentPeriod("D:2026-05-10", "daily", afterReset, DEFAULT_SETTINGS)).toBe(false);
    expect(isCompletedForCurrentPeriod("D:2026-05-11", "daily", afterReset, DEFAULT_SETTINGS)).toBe(true);
  });

  it("falls back when a custom timezone is invalid", () => {
    expect(normalizeTimezone("Not/A_Timezone")).toBeTruthy();
  });
});
