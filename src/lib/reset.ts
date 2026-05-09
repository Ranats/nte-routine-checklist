import type { ResetSettings, RoutineType, ServerRegion } from "../types";

const REGION_TIMEZONES: Record<Exclude<ServerRegion, "custom">, string> = {
  asia: "Etc/GMT-8",
  america: "Etc/GMT+5",
  europe: "Etc/GMT-1",
};

const FORMATTER_CACHE = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timezone: string) {
  const existing = FORMATTER_CACHE.get(timezone);
  if (existing) return existing;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  FORMATTER_CACHE.set(timezone, formatter);
  return formatter;
}

function zonedParts(date: Date, timezone: string) {
  const parts = getFormatter(timezone).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const year = Number(value("year"));
  const month = Number(value("month"));
  const day = Number(value("day"));
  const weekdayText = value("weekday");
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekdayText);
  return {
    year,
    month,
    day,
    weekday: weekday >= 0 ? weekday : 0,
    hour: Number(value("hour")),
    minute: Number(value("minute")),
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function parseResetTime(resetTime: string) {
  const [hourRaw, minuteRaw] = resetTime.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  return {
    hour: Number.isFinite(hour) ? Math.min(Math.max(hour, 0), 23) : 5,
    minute: Number.isFinite(minute) ? Math.min(Math.max(minute, 0), 59) : 0,
  };
}

function dateKeyFromUtcMs(utcMs: number, timezone: string) {
  const parts = zonedParts(new Date(utcMs), timezone);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

function weekKeyFromUtcMs(utcMs: number, settings: ResetSettings) {
  const timezone = resolveTimezone(settings);
  const reset = parseResetTime(settings.dailyResetTime);
  const shiftedMs = utcMs - (reset.hour * 60 + reset.minute) * 60 * 1000;
  const shifted = zonedParts(new Date(shiftedMs), timezone);
  const delta = (shifted.weekday - settings.weeklyResetDay + 7) % 7;
  const startMs = shiftedMs - delta * 24 * 60 * 60 * 1000;
  const startKey = dateKeyFromUtcMs(startMs, timezone);
  return `W:${startKey}`;
}

export function resolveTimezone(settings: ResetSettings) {
  if (settings.region === "custom") return normalizeTimezone(settings.timezone);
  return REGION_TIMEZONES[settings.region];
}

export function normalizeTimezone(timezone: string | undefined) {
  const fallback = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const candidate = timezone?.trim() || fallback;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: candidate }).format(new Date());
    return candidate;
  } catch {
    return fallback;
  }
}

export function getPeriodKey(type: RoutineType, date: Date, settings: ResetSettings) {
  const timezone = resolveTimezone(settings);
  const reset = parseResetTime(settings.dailyResetTime);
  const shiftedMs = date.getTime() - (reset.hour * 60 + reset.minute) * 60 * 1000;
  if (type === "daily") {
    return `D:${dateKeyFromUtcMs(shiftedMs, timezone)}`;
  }
  return weekKeyFromUtcMs(date.getTime(), settings);
}

export function isCompletedForCurrentPeriod(
  completedPeriodKey: string | undefined,
  type: RoutineType,
  date: Date,
  settings: ResetSettings,
) {
  return completedPeriodKey === getPeriodKey(type, date, settings);
}

export function nextResetAt(date: Date, type: RoutineType, settings: ResetSettings) {
  const timezone = resolveTimezone(settings);
  const reset = parseResetTime(settings.dailyResetTime);
  const parts = zonedParts(date, timezone);
  const afterTodayReset = parts.hour > reset.hour || (parts.hour === reset.hour && parts.minute >= reset.minute);
  const dayOffset =
    type === "daily" ? (afterTodayReset ? 1 : 0) : weeklyOffset(parts.weekday, settings.weeklyResetDay, afterTodayReset);
  return {
    dayOffset,
    label:
      type === "daily"
        ? `${dayOffset === 0 ? "Today" : "Tomorrow"} ${settings.dailyResetTime}`
        : `${weekdayLabel(settings.weeklyResetDay)} ${settings.dailyResetTime}`,
    timezone,
  };
}

function weeklyOffset(currentWeekday: number, weeklyResetDay: number, afterTodayReset: boolean) {
  const base = (weeklyResetDay - currentWeekday + 7) % 7;
  if (base === 0 && afterTodayReset) return 7;
  return base;
}

function weekdayLabel(day: number) {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day] ?? "Monday";
}
