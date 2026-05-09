# NTE Routine Checklist

Unofficial daily and weekly checklist for Neverness to Everness.

## Purpose

- Track daily and weekly routines in separate tabs.
- Mark completed items with a check, dashed border, and dashed strikethrough.
- Treat old completions as unchecked after the configured daily or weekly reset.
- Auto-detect English, Japanese, or Simplified Chinese from browser language preferences, with manual switching.
- Run without login, account linking, cloud sync, analytics, or ad SDKs.
- Keep the app safe to distribute as a static PWA.

## Risk Controls

- Presets are editable templates, not official game data.
- The first screen says the tool is unofficial and fan-made.
- The app shows the template review date and source links.
- Server profiles use fixed server-time offsets by default:
  - Asia: UTC+8
  - America: UTC-5
  - Europe: UTC+1
- Users can switch to a custom IANA timezone when their server differs.
- Import files are normalized before being accepted.
- The service worker uses a network-first strategy and shows an update prompt when a new version is installed.

## Development

```powershell
npm install
npm run start -- --port 5174
```

Open:

```text
http://127.0.0.1:5174/
```

Validation:

```powershell
npm run typecheck
npm test
npm run build
```

## Distribution

```powershell
npm run build
```

Deploy the generated `dist/` directory to Netlify. PWA behavior requires `localhost` or HTTPS. See `DEPLOYMENT.md`.

## Monetization

The MVP does not include ads. It only reserves a passive sponsored area. Ko-fi and GitHub Sponsors links can be enabled with build-time environment variables. Before adding AdSense, AdMob, analytics, or any third-party SDK, update `PRIVACY.md`, add consent handling where required, and avoid ad placements that interfere with checkbox taps.

See `DEPLOYMENT.md`, `MONETIZATION.md`, and `RELEASE_CHECKLIST.md` before publishing.
For AdSense preparation, see `ADSENSE_READINESS.md`.

## Current Source Snapshot

- Mobalytics: daily reset every day, weekly reset every Monday, server reset at 5 AM local server time; updated May 8, 2026.
- GameWith: daily checklist and weekly checklist; last updated May 9, 2026.
- All Things How: weekly activities and Monday 5 AM server-time reset; published May 6, 2026.
