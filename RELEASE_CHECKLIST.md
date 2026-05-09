# Release Risk Checklist

Use this before publishing a public build.

## Content Freshness

- Re-check NTE in-game reset timer for the target server.
- Re-check daily and weekly task names after each game patch.
- Update `src/data/presets.ts` and `src/data/contentMeta.ts` together.
- Keep user-edited custom items compatible by preserving stable preset item IDs.

Current external review snapshot:

- Mobalytics daily/weekly checklist: updated May 8, 2026
- GameWith daily checklist: last updated May 9, 2026
- All Things How weekly guide: published May 6, 2026

## Fan Content

- Do not use official logos, screenshots, character art, or game icons unless a license allows it.
- Keep "unofficial fan-made tracker" visible in the first screen.
- Do not describe the app as official, authorized, partnered, or endorsed.

## Ads

- Start with one passive banner slot only.
- Do not place ads between a checkbox and its task text.
- Do not use rewarded ads that imply game rewards.
- Keep privacy pages aligned with the active AdSense site-review script and any future ad slots.
- Add consent handling for cookies/tracking where required.
- Confirm the app footer accurately describes third-party scripts before shipping.

## PWA

- Verify first load, reload, offline fallback, and update behavior on HTTPS or localhost.
- Increment `CACHE_NAME` in `public/sw.js` when changing app-shell caching behavior.
- If update staleness appears in production, unregister the old service worker or show an update prompt.

## Local Gate

```powershell
npm install
npm run typecheck
npm test
npm run build
npm run preview -- --port 4173
```

Open `http://127.0.0.1:4173/` and smoke test:

- toggle a daily item,
- toggle a weekly item,
- add a custom item,
- hide and restore an item,
- export and import backup JSON,
- open `/privacy.html`,
- open `/fan-content.html`.
