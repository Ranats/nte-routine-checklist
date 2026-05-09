import { DEFAULT_SETTINGS, PRESET_ITEMS } from "../data/presets";
import { normalizeTimezone } from "./reset";
import type { AppData, ChecklistItem, ResetSettings, ServerRegion } from "../types";

const STORAGE_KEY = "nte-routine-checklist:v1";

export function createDefaultData(): AppData {
  return {
    version: 1,
    items: PRESET_ITEMS,
    completions: {},
    settings: DEFAULT_SETTINGS,
    updatedAt: new Date().toISOString(),
  };
}

export function loadAppData(): AppData {
  if (typeof localStorage === "undefined") return createDefaultData();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createDefaultData();
  try {
    return normalizeAppData(JSON.parse(raw));
  } catch {
    return createDefaultData();
  }
}

export function normalizeAppData(input: unknown): AppData {
  const defaults = createDefaultData();
  if (!input || typeof input !== "object") return defaults;
  const raw = input as Partial<AppData>;
  const settings = normalizeSettings(raw.settings);
  return {
    version: 1,
    items: normalizeItems(raw.items),
    completions:
      raw.completions && typeof raw.completions === "object" && !Array.isArray(raw.completions)
        ? Object.fromEntries(
            Object.entries(raw.completions).filter(
              ([itemId, periodKey]) => typeof itemId === "string" && typeof periodKey === "string",
            ),
          )
        : {},
    settings,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
  };
}

function normalizeSettings(settings: Partial<ResetSettings> | undefined): ResetSettings {
  const region: ServerRegion = isServerRegion(settings?.region) ? settings.region : DEFAULT_SETTINGS.region;
  const dailyResetTime =
    typeof settings?.dailyResetTime === "string" && /^\d{2}:\d{2}$/.test(settings.dailyResetTime)
      ? settings.dailyResetTime
      : DEFAULT_SETTINGS.dailyResetTime;
  const weeklyResetDay =
    typeof settings?.weeklyResetDay === "number" && settings.weeklyResetDay >= 0 && settings.weeklyResetDay <= 6
      ? settings.weeklyResetDay
      : DEFAULT_SETTINGS.weeklyResetDay;
  return {
    region,
    dailyResetTime,
    weeklyResetDay,
    timezone: normalizeTimezone(settings?.timezone),
  };
}

function isServerRegion(value: unknown): value is ServerRegion {
  return value === "asia" || value === "america" || value === "europe" || value === "custom";
}

function normalizeItems(items: unknown): ChecklistItem[] {
  if (!Array.isArray(items)) return PRESET_ITEMS;
  const storedItems = items
    .map((item, index): ChecklistItem | null => normalizeStoredItem(item, index))
    .filter((item): item is ChecklistItem => item !== null);

  const storedById = new Map(storedItems.map((item) => [item.id, item]));
  const presetItems = PRESET_ITEMS.map((preset) => {
    const stored = storedById.get(preset.id);
    if (!stored || stored.source === "custom") return preset;
    return {
      ...preset,
      enabled: stored.enabled,
      sortOrder: typeof stored.sortOrder === "number" ? stored.sortOrder : preset.sortOrder,
    };
  });

  const customItems = storedItems.filter(
    (item) => item.source === "custom" || !PRESET_ITEMS.some((preset) => preset.id === item.id),
  );
  return [...presetItems, ...customItems];
}

function normalizeStoredItem(item: unknown, index: number): ChecklistItem | null {
  if (!item || typeof item !== "object") return null;
  const raw = item as Partial<ChecklistItem>;
  if (typeof raw.id !== "string" || typeof raw.title !== "string" || !raw.title.trim()) return null;
  return {
    id: raw.id,
    title: raw.title.trim(),
    description: typeof raw.description === "string" ? raw.description : "",
    type: raw.type === "weekly" ? "weekly" : "daily",
    category: typeof raw.category === "string" && raw.category.trim() ? raw.category.trim() : "Uncategorized",
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : index * 10,
    enabled: typeof raw.enabled === "boolean" ? raw.enabled : true,
    source: raw.source === "custom" ? "custom" : "preset",
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString(),
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
  };
}

export function saveAppData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
}

export function exportAppData(data: AppData) {
  return JSON.stringify({ ...data, exportedAt: new Date().toISOString() }, null, 2);
}
