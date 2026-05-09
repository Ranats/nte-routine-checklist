import { describe, expect, it, vi } from "vitest";
import { detectLanguage } from "./i18n";

function mockNavigatorLanguages(languages: string[], language = languages[0] ?? "en-US") {
  vi.stubGlobal("navigator", {
    language,
    languages,
  });
}

describe("language detection", () => {
  it("uses the saved language first", () => {
    localStorage.setItem("nte-routine-checklist:language", "ja");
    mockNavigatorLanguages(["en-US"]);

    expect(detectLanguage()).toBe("ja");
  });

  it("uses the first supported browser preference", () => {
    localStorage.clear();
    mockNavigatorLanguages(["fr-FR", "zh-CN", "en-US"]);

    expect(detectLanguage()).toBe("zh");
  });

  it("supports Japanese and falls back to English", () => {
    localStorage.clear();
    mockNavigatorLanguages(["ja-JP"]);

    expect(detectLanguage()).toBe("ja");

    localStorage.clear();
    mockNavigatorLanguages(["fr-FR", "de-DE"]);

    expect(detectLanguage()).toBe("en");
  });
});
