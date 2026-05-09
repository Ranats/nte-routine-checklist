import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  Archive,
  Check,
  Download,
  ExternalLink,
  EyeOff,
  Plus,
  RefreshCw,
  RotateCcw,
  Settings,
  ShieldAlert,
  Trash2,
  Upload,
} from "lucide-react";
import { CONTENT_REVIEW } from "./data/contentMeta";
import { MONETIZATION, hasAdSenseConfig, hasSupportLinks } from "./data/monetization";
import { PRESET_ITEMS } from "./data/presets";
import {
  LANGUAGES,
  detectLanguage,
  getDisplayItem,
  isLanguage,
  languageHref,
  messages,
  resetLabel,
} from "./i18n";
import { getPeriodKey, isCompletedForCurrentPeriod, nextResetAt, resolveTimezone } from "./lib/reset";
import { exportAppData, loadAppData, normalizeAppData, saveAppData } from "./lib/storage";
import type { AppData, ChecklistItem, ItemDraft, Language, RoutineType, ServerRegion } from "./types";
import "./styles.css";

const EMPTY_DRAFT: ItemDraft = {
  title: "",
  description: "",
  type: "daily",
  category: "Custom",
};

function App() {
  const [data, setData] = useState<AppData>(() => loadAppData());
  const [activeType, setActiveType] = useState<RoutineType>("daily");
  const [draft, setDraft] = useState<ItemDraft>(EMPTY_DRAFT);
  const [now, setNow] = useState(() => new Date());
  const [updateReady, setUpdateReady] = useState(false);
  const [language, setLanguage] = useState<Language>(() => detectLanguage());
  const importRef = useRef<HTMLInputElement | null>(null);
  const t = messages[language];
  const adSenseEnabled = hasAdSenseConfig();

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  useEffect(() => {
    localStorage.setItem("nte-routine-checklist:language", language);
    const languageMeta = LANGUAGES.find((item) => item.code === language);
    document.documentElement.lang = languageMeta?.htmlLang ?? "en";
  }, [language]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          worker?.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateReady(true);
            }
          });
        });
      })
      .catch(() => undefined);
  }, []);

  const visibleItems = useMemo(
    () =>
      data.items
        .filter((item) => item.enabled && item.type === activeType)
        .sort(
          (left, right) =>
            left.sortOrder - right.sortOrder ||
            getDisplayItem(left, language).title.localeCompare(getDisplayItem(right, language).title, language),
        ),
    [activeType, data.items, language],
  );

  const inactiveItems = useMemo(
    () =>
      data.items
        .filter((item) => !item.enabled)
        .sort((left, right) =>
          getDisplayItem(left, language).title.localeCompare(getDisplayItem(right, language).title, language),
        ),
    [data.items, language],
  );

  const stats = useMemo(() => {
    const enabled = data.items.filter((item) => item.enabled);
    const byType = (type: RoutineType) => {
      const scoped = enabled.filter((item) => item.type === type);
      const done = scoped.filter((item) =>
        isCompletedForCurrentPeriod(data.completions[item.id], item.type, now, data.settings),
      ).length;
      return { total: scoped.length, done, remaining: scoped.length - done };
    };
    return {
      daily: byType("daily"),
      weekly: byType("weekly"),
    };
  }, [data, now]);

  const activeReset = nextResetAt(now, activeType, data.settings);

  function updateData(updater: (current: AppData) => AppData) {
    setData((current) => updater({ ...current, updatedAt: new Date().toISOString() }));
  }

  function toggleCompletion(item: ChecklistItem) {
    updateData((current) => {
      const completions = { ...current.completions };
      const currentKey = getPeriodKey(item.type, now, current.settings);
      if (completions[item.id] === currentKey) {
        delete completions[item.id];
      } else {
        completions[item.id] = currentKey;
      }
      return { ...current, completions };
    });
  }

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.title.trim();
    if (!title) return;
    const createdAt = new Date().toISOString();
    updateData((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: `custom-${crypto.randomUUID()}`,
          title,
          description: draft.description.trim(),
          type: draft.type,
          category: draft.category.trim() || t.custom,
          sortOrder: current.items.length * 10 + 1000,
          enabled: true,
          source: "custom",
          createdAt,
          updatedAt: createdAt,
        },
      ],
    }));
    setDraft({ ...EMPTY_DRAFT, type: activeType });
  }

  function disableItem(itemId: string) {
    updateData((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, enabled: false, updatedAt: new Date().toISOString() } : item,
      ),
    }));
  }

  function enableItem(itemId: string) {
    updateData((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, enabled: true, updatedAt: new Date().toISOString() } : item,
      ),
    }));
  }

  function deleteCustomItem(itemId: string) {
    updateData((current) => {
      const completions = { ...current.completions };
      delete completions[itemId];
      return {
        ...current,
        items: current.items.filter((item) => item.id !== itemId || item.source !== "custom"),
        completions,
      };
    });
  }

  function clearCurrentPeriod() {
    updateData((current) => {
      const visibleIds = new Set(visibleItems.map((item) => item.id));
      const completions = { ...current.completions };
      current.items
        .filter((item) => item.type === activeType && visibleIds.has(item.id))
        .forEach((item) => {
          delete completions[item.id];
        });
      return { ...current, completions };
    });
  }

  function restorePresets() {
    updateData((current) => {
      const customItems = current.items.filter((item) => item.source === "custom");
      return {
        ...current,
        items: [...PRESET_ITEMS, ...customItems],
      };
    });
  }

  function updateRegion(region: ServerRegion) {
    updateData((current) => ({
      ...current,
      settings: {
        ...current.settings,
        region,
      },
    }));
  }

  function updateSetting<K extends keyof AppData["settings"]>(key: K, value: AppData["settings"][K]) {
    updateData((current) => ({
      ...current,
      settings: {
        ...current.settings,
        [key]: value,
      },
    }));
  }

  function downloadBackup() {
    const blob = new Blob([exportAppData(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `nte-checklist-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = normalizeAppData(JSON.parse(text));
      if (parsed.items.length === 0) throw new Error("invalid backup");
      setData(parsed);
    } catch {
      window.alert(t.importFailed);
    } finally {
      event.target.value = "";
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Unofficial fan-made tracker</p>
          <h1>NTE Routine Checklist</h1>
          <p className="hero-copy">{t.heroCopy}</p>
        </div>
        <div className="header-tools">
          <label className="language-select">
            <span>{t.language}</span>
            <select
              value={language}
              onChange={(event) => {
                const next = event.target.value;
                if (isLanguage(next)) setLanguage(next);
              }}
            >
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="status-panel" aria-label={t.progress}>
          <ProgressRing label="Daily" done={stats.daily.done} total={stats.daily.total} />
          <ProgressRing label="Weekly" done={stats.weekly.done} total={stats.weekly.total} />
        </div>
      </header>

      {updateReady ? (
        <section className="notice update-notice">
          <strong>{t.updateReady}</strong>
          <button className="icon-button text-button" onClick={() => window.location.reload()}>
            <RefreshCw aria-hidden="true" size={18} />
            {t.reload}
          </button>
        </section>
      ) : null}

      <section className="notice">
        <strong>{t.unofficialStrong}</strong>
        <span>{t.unofficialBody}</span>
      </section>

      <section className="risk-panel" aria-label="Risk controls">
        <div className="risk-heading">
          <ShieldAlert aria-hidden="true" size={19} />
          <div>
            <h2>{t.freshnessTitle}</h2>
            <p>{t.resetSummary}</p>
          </div>
        </div>
        <div className="risk-grid">
          <div>
            <span className="meta-label">{t.templateReviewed}</span>
            <strong>{CONTENT_REVIEW.reviewedAt}</strong>
          </div>
          <div>
            <span className="meta-label">{t.appVersion}</span>
            <strong>{CONTENT_REVIEW.appVersion}</strong>
          </div>
          <div>
            <span className="meta-label">{t.safetyPosture}</span>
            <strong>{adSenseEnabled ? t.safetyValueWithAds : t.safetyValue}</strong>
          </div>
        </div>
        <div className="source-list">
          {CONTENT_REVIEW.sources.map((source) => (
            <a href={source.url} key={source.url} target="_blank" rel="noreferrer" title={source.note}>
              <ExternalLink aria-hidden="true" size={15} />
              <span>{source.label}</span>
            </a>
          ))}
        </div>
      </section>

      <nav className="tabs" aria-label={t.checklistSwitcher}>
        <button className={activeType === "daily" ? "active" : ""} onClick={() => setActiveType("daily")}>
          Daily
          <span>{stats.daily.remaining}</span>
        </button>
        <button className={activeType === "weekly" ? "active" : ""} onClick={() => setActiveType("weekly")}>
          Weekly
          <span>{stats.weekly.remaining}</span>
        </button>
      </nav>

      <section className="toolbar" aria-label={t.resetInfo}>
        <div>
          <p className="meta-label">{t.nextReset}</p>
          <strong>
            {resetLabel(language, activeType, activeReset.dayOffset, data.settings.weeklyResetDay, data.settings.dailyResetTime)} /{" "}
            {activeReset.timezone}
          </strong>
        </div>
        <button className="icon-button text-button" onClick={clearCurrentPeriod} title={t.uncheckVisible}>
          <RotateCcw aria-hidden="true" size={18} />
          {t.resetVisible}
        </button>
      </section>

      <section className="checklist" aria-label={`${activeType} checklist`}>
        {visibleItems.map((item) => {
          const completed = isCompletedForCurrentPeriod(data.completions[item.id], item.type, now, data.settings);
          const displayItem = getDisplayItem(item, language);
          return (
            <article className={`task ${completed ? "completed" : ""}`} key={item.id}>
              <button
                className="check-button"
                aria-pressed={completed}
                aria-label={t.markAs(displayItem.title, completed ? t.incomplete : t.complete)}
                onClick={() => toggleCompletion(item)}
              >
                {completed ? <Check aria-hidden="true" size={20} /> : null}
              </button>
              <div className="task-copy">
                <div className="task-head">
                  <span className="category">{displayItem.category}</span>
                  <h2>{displayItem.title}</h2>
                </div>
                {displayItem.description ? <p>{displayItem.description}</p> : null}
              </div>
              <div className="task-actions">
                <button className="icon-button" onClick={() => disableItem(item.id)} title={t.hide}>
                  <EyeOff aria-hidden="true" size={18} />
                </button>
                {item.source === "custom" ? (
                  <button className="icon-button danger" onClick={() => deleteCustomItem(item.id)} title={t.delete}>
                    <Trash2 aria-hidden="true" size={18} />
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>

      <section className="workbench" aria-label={t.management}>
        <form className="panel add-form" onSubmit={addItem}>
          <div className="panel-heading">
            <Plus aria-hidden="true" size={19} />
            <h2>{t.addItem}</h2>
          </div>
          <label>
            <span>{t.title}</span>
            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          </label>
          <label>
            <span>{t.note}</span>
            <textarea
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              rows={3}
            />
          </label>
          <div className="form-grid">
            <label>
              <span>{t.cycle}</span>
              <select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as RoutineType })}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            <label>
              <span>{t.category}</span>
              <input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} />
            </label>
          </div>
          <button className="primary-button" type="submit">
            <Plus aria-hidden="true" size={18} />
            {t.addItem}
          </button>
        </form>

        <section className="panel settings-panel">
          <div className="panel-heading">
            <Settings aria-hidden="true" size={19} />
            <h2>{t.resetSettings}</h2>
          </div>
          <div className="form-grid">
            <label>
              <span>{t.serverProfile}</span>
              <select value={data.settings.region} onChange={(event) => updateRegion(event.target.value as ServerRegion)}>
                <option value="asia">{t.asiaServer}</option>
                <option value="america">{t.americaServer}</option>
                <option value="europe">{t.europeServer}</option>
                <option value="custom">{t.customTimezone}</option>
              </select>
            </label>
            <label>
              <span>{t.dailyReset}</span>
              <input
                type="time"
                value={data.settings.dailyResetTime}
                onChange={(event) => updateSetting("dailyResetTime", event.target.value)}
              />
            </label>
            <label>
              <span>{t.weeklyDay}</span>
              <select
                value={data.settings.weeklyResetDay}
                onChange={(event) => updateSetting("weeklyResetDay", Number(event.target.value))}
              >
                <option value={1}>{t.weekdays[1]}</option>
                <option value={0}>{t.weekdays[0]}</option>
                <option value={2}>{t.weekdays[2]}</option>
                <option value={3}>{t.weekdays[3]}</option>
                <option value={4}>{t.weekdays[4]}</option>
                <option value={5}>{t.weekdays[5]}</option>
                <option value={6}>{t.weekdays[6]}</option>
              </select>
            </label>
            <label>
              <span>{t.timezone}</span>
              <input
                value={data.settings.timezone}
                disabled={data.settings.region !== "custom"}
                onChange={(event) => updateSetting("timezone", event.target.value)}
              />
            </label>
          </div>
          <p className="fine-print">{t.currentPeriod(resolveTimezone(data.settings))}</p>
          <div className="button-row">
            <button className="icon-button text-button" onClick={restorePresets}>
              <Archive aria-hidden="true" size={18} />
              {t.restorePresets}
            </button>
            <button className="icon-button text-button" onClick={downloadBackup}>
              <Download aria-hidden="true" size={18} />
              {t.export}
            </button>
            <button className="icon-button text-button" onClick={() => importRef.current?.click()}>
              <Upload aria-hidden="true" size={18} />
              {t.import}
            </button>
            <input ref={importRef} hidden type="file" accept="application/json" onChange={importBackup} />
          </div>
        </section>
      </section>

      {inactiveItems.length > 0 ? (
        <section className="panel disabled-panel">
          <h2>{t.hiddenItems}</h2>
          <div className="disabled-list">
            {inactiveItems.map((item) => {
              const displayItem = getDisplayItem(item, language);
              return (
                <button key={item.id} onClick={() => enableItem(item.id)}>
                  {displayItem.title}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <AdSlot language={language} enabled={adSenseEnabled} />

      {hasSupportLinks() ? (
        <section className="support-panel" aria-label={t.supportLabel}>
          <div>
            <h2>{t.supportTitle}</h2>
            <p>{t.supportBody}</p>
          </div>
          <div className="support-actions">
            {MONETIZATION.kofiUrl ? (
              <a href={MONETIZATION.kofiUrl} target="_blank" rel="noreferrer">
                Ko-fi
              </a>
            ) : null}
            {MONETIZATION.githubSponsorsUrl ? (
              <a href={MONETIZATION.githubSponsorsUrl} target="_blank" rel="noreferrer">
                GitHub Sponsors
              </a>
            ) : null}
          </div>
        </section>
      ) : null}

      {MONETIZATION.hostingStatusMessage ? (
        <section className="hosting-status" aria-label={t.hostingStatus}>
          {MONETIZATION.hostingStatusMessage}
        </section>
      ) : null}

      <footer className="site-footer">
        <span>{t.footerNoThirdParty}</span>
        <a href={languageHref(language, "privacy")}>{t.privacy}</a>
        <a href={languageHref(language, "fan-content")}>{t.fanContent}</a>
      </footer>
    </main>
  );
}

type ProgressRingProps = {
  label: string;
  done: number;
  total: number;
};

function ProgressRing({ label, done, total }: ProgressRingProps) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="progress-ring" style={{ "--progress": `${percent}%` } as CSSProperties}>
      <span>{percent}%</span>
      <small>
        {label} {done}/{total}
      </small>
    </div>
  );
}

type AdSlotProps = {
  language: Language;
  enabled: boolean;
};

function AdSlot({ language, enabled }: AdSlotProps) {
  const t = messages[language];

  useEffect(() => {
    if (!enabled) return;
    const scriptId = "adsbygoogle-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        MONETIZATION.adsenseClientId,
      )}`;
      document.head.appendChild(script);
    }

    const ads = window as Window & { adsbygoogle?: unknown[] };
    ads.adsbygoogle = ads.adsbygoogle || [];
    window.setTimeout(() => {
      try {
        ads.adsbygoogle?.push({});
      } catch {
        // AdSense can throw before approval, with ad blockers, or on localhost.
      }
    }, 0);
  }, [enabled]);

  if (!enabled) {
    return (
      <aside className="ad-slot" aria-label={t.adSlotLabel}>
        <span>{t.adSlotText}</span>
      </aside>
    );
  }

  return (
    <aside className="ad-slot ad-slot-live" aria-label={t.adSlotLabel}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={MONETIZATION.adsenseClientId}
        data-ad-slot={MONETIZATION.adsenseSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

export default App;
