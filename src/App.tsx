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
import { MONETIZATION, hasSupportLinks } from "./data/monetization";
import { PRESET_ITEMS } from "./data/presets";
import { getPeriodKey, isCompletedForCurrentPeriod, nextResetAt, resolveTimezone } from "./lib/reset";
import { exportAppData, loadAppData, normalizeAppData, saveAppData } from "./lib/storage";
import type { AppData, ChecklistItem, ItemDraft, RoutineType, ServerRegion } from "./types";
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
  const importRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    saveAppData(data);
  }, [data]);

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
        .sort((left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title, "en")),
    [activeType, data.items],
  );

  const inactiveItems = useMemo(
    () => data.items.filter((item) => !item.enabled).sort((left, right) => left.title.localeCompare(right.title, "en")),
    [data.items],
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
          category: draft.category.trim() || "Custom",
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
      window.alert("Import failed. Please select an exported NTE checklist JSON file.");
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
          <p className="hero-copy">Track Neverness to Everness daily and weekly routines with local-only storage.</p>
        </div>
        <div className="status-panel" aria-label="Progress">
          <ProgressRing label="Daily" done={stats.daily.done} total={stats.daily.total} />
          <ProgressRing label="Weekly" done={stats.weekly.done} total={stats.weekly.total} />
        </div>
      </header>

      {updateReady ? (
        <section className="notice update-notice">
          <strong>Update ready.</strong>
          <button className="icon-button text-button" onClick={() => window.location.reload()}>
            <RefreshCw aria-hidden="true" size={18} />
            Reload
          </button>
        </section>
      ) : null}

      <section className="notice">
        <strong>Unofficial tool.</strong>
        <span>
          These items are editable templates. If the in-game list differs, hide, add, or rename items to match your
          account.
        </span>
      </section>

      <section className="risk-panel" aria-label="Risk controls">
        <div className="risk-heading">
          <ShieldAlert aria-hidden="true" size={19} />
          <div>
            <h2>Freshness and reset assumptions</h2>
            <p>{CONTENT_REVIEW.resetSummary}</p>
          </div>
        </div>
        <div className="risk-grid">
          <div>
            <span className="meta-label">Template reviewed</span>
            <strong>{CONTENT_REVIEW.reviewedAt}</strong>
          </div>
          <div>
            <span className="meta-label">App version</span>
            <strong>{CONTENT_REVIEW.appVersion}</strong>
          </div>
          <div>
            <span className="meta-label">Safety posture</span>
            <strong>Local-only / no ad SDK</strong>
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

      <nav className="tabs" aria-label="Checklist switcher">
        <button className={activeType === "daily" ? "active" : ""} onClick={() => setActiveType("daily")}>
          Daily
          <span>{stats.daily.remaining}</span>
        </button>
        <button className={activeType === "weekly" ? "active" : ""} onClick={() => setActiveType("weekly")}>
          Weekly
          <span>{stats.weekly.remaining}</span>
        </button>
      </nav>

      <section className="toolbar" aria-label="Reset information">
        <div>
          <p className="meta-label">Next reset</p>
          <strong>
            {activeReset.label} / {activeReset.timezone}
          </strong>
        </div>
        <button className="icon-button text-button" onClick={clearCurrentPeriod} title="Uncheck visible items">
          <RotateCcw aria-hidden="true" size={18} />
          Reset visible
        </button>
      </section>

      <section className="checklist" aria-label={`${activeType} checklist`}>
        {visibleItems.map((item) => {
          const completed = isCompletedForCurrentPeriod(data.completions[item.id], item.type, now, data.settings);
          return (
            <article className={`task ${completed ? "completed" : ""}`} key={item.id}>
              <button
                className="check-button"
                aria-pressed={completed}
                aria-label={`Mark ${item.title} as ${completed ? "incomplete" : "complete"}`}
                onClick={() => toggleCompletion(item)}
              >
                {completed ? <Check aria-hidden="true" size={20} /> : null}
              </button>
              <div className="task-copy">
                <div className="task-head">
                  <span className="category">{item.category}</span>
                  <h2>{item.title}</h2>
                </div>
                {item.description ? <p>{item.description}</p> : null}
              </div>
              <div className="task-actions">
                <button className="icon-button" onClick={() => disableItem(item.id)} title="Hide">
                  <EyeOff aria-hidden="true" size={18} />
                </button>
                {item.source === "custom" ? (
                  <button className="icon-button danger" onClick={() => deleteCustomItem(item.id)} title="Delete">
                    <Trash2 aria-hidden="true" size={18} />
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>

      <section className="workbench" aria-label="Management">
        <form className="panel add-form" onSubmit={addItem}>
          <div className="panel-heading">
            <Plus aria-hidden="true" size={19} />
            <h2>Add item</h2>
          </div>
          <label>
            <span>Title</span>
            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          </label>
          <label>
            <span>Note</span>
            <textarea
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              rows={3}
            />
          </label>
          <div className="form-grid">
            <label>
              <span>Cycle</span>
              <select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as RoutineType })}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            <label>
              <span>Category</span>
              <input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} />
            </label>
          </div>
          <button className="primary-button" type="submit">
            <Plus aria-hidden="true" size={18} />
            Add item
          </button>
        </form>

        <section className="panel settings-panel">
          <div className="panel-heading">
            <Settings aria-hidden="true" size={19} />
            <h2>Reset settings</h2>
          </div>
          <div className="form-grid">
            <label>
              <span>Server profile</span>
              <select value={data.settings.region} onChange={(event) => updateRegion(event.target.value as ServerRegion)}>
                <option value="asia">Asia server UTC+8</option>
                <option value="america">America server UTC-5</option>
                <option value="europe">Europe server UTC+1</option>
                <option value="custom">Custom timezone</option>
              </select>
            </label>
            <label>
              <span>Daily reset</span>
              <input
                type="time"
                value={data.settings.dailyResetTime}
                onChange={(event) => updateSetting("dailyResetTime", event.target.value)}
              />
            </label>
            <label>
              <span>Weekly day</span>
              <select
                value={data.settings.weeklyResetDay}
                onChange={(event) => updateSetting("weeklyResetDay", Number(event.target.value))}
              >
                <option value={1}>Monday</option>
                <option value={0}>Sunday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
            </label>
            <label>
              <span>Timezone</span>
              <input
                value={data.settings.timezone}
                disabled={data.settings.region !== "custom"}
                onChange={(event) => updateSetting("timezone", event.target.value)}
              />
            </label>
          </div>
          <p className="fine-print">Current period is calculated with {resolveTimezone(data.settings)}.</p>
          <div className="button-row">
            <button className="icon-button text-button" onClick={restorePresets}>
              <Archive aria-hidden="true" size={18} />
              Restore presets
            </button>
            <button className="icon-button text-button" onClick={downloadBackup}>
              <Download aria-hidden="true" size={18} />
              Export
            </button>
            <button className="icon-button text-button" onClick={() => importRef.current?.click()}>
              <Upload aria-hidden="true" size={18} />
              Import
            </button>
            <input ref={importRef} hidden type="file" accept="application/json" onChange={importBackup} />
          </div>
        </section>
      </section>

      {inactiveItems.length > 0 ? (
        <section className="panel disabled-panel">
          <h2>Hidden items</h2>
          <div className="disabled-list">
            {inactiveItems.map((item) => (
              <button key={item.id} onClick={() => enableItem(item.id)}>
                {item.title}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <aside className="ad-slot" aria-label="Future ad slot">
        <span>Sponsored area reserved</span>
      </aside>

      {hasSupportLinks() ? (
        <section className="support-panel" aria-label="Support links">
          <div>
            <h2>Support this project</h2>
            <p>Optional support helps keep the checklist maintained after NTE updates.</p>
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
        <section className="hosting-status" aria-label="Hosting status">
          {MONETIZATION.hostingStatusMessage}
        </section>
      ) : null}

      <footer className="site-footer">
        <span>No third-party scripts are loaded in this MVP.</span>
        <a href="/privacy.html">Privacy</a>
        <a href="/fan-content.html">Fan content notice</a>
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

export default App;
