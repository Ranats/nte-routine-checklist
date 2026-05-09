export type RoutineType = "daily" | "weekly";

export type ServerRegion = "asia" | "america" | "europe" | "custom";

export type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  type: RoutineType;
  category: string;
  sortOrder: number;
  enabled: boolean;
  source: "preset" | "custom";
  createdAt: string;
  updatedAt: string;
};

export type CompletionMap = Record<string, string>;

export type ResetSettings = {
  region: ServerRegion;
  timezone: string;
  dailyResetTime: string;
  weeklyResetDay: number;
};

export type AppData = {
  version: number;
  items: ChecklistItem[];
  completions: CompletionMap;
  settings: ResetSettings;
  updatedAt: string;
};

export type ItemDraft = {
  title: string;
  description: string;
  type: RoutineType;
  category: string;
};
