# NTE Routine Checklist

[![Live site](https://img.shields.io/badge/live-nte--routine--checklist.netlify.app-2dd4bf)](https://nte-routine-checklist.netlify.app/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Unofficial local-first daily and weekly checklist for Neverness to Everness.

https://nte-routine-checklist.netlify.app/

## What this repository is

This is the public source for the static checklist app published on Netlify. It is meant to be understandable as an OSS project first:

- the app source lives in `src/`,
- public policy pages live in `public/`,
- deployment configuration is in `netlify.toml`,
- setup, validation, and contribution notes are kept in the root docs.

This repository intentionally excludes non-runtime operational notes and generated campaign media.

## Features

- Daily and weekly routine tabs.
- Completed items show a check mark, dashed border, and dashed strikethrough.
- Completed state resets by configurable daily and weekly reset settings.
- Browser-language detection for English, Japanese, and Simplified Chinese, with manual switching.
- Editable preset items plus custom items.
- Hide, restore, export, and import checklist data.
- Local browser storage only. No login, account linking, cloud sync, or analytics.
- Installable static PWA on HTTPS-supported hosts.

## Public Safety Boundaries

- This is an unofficial fan-made helper, not an official game product.
- Presets are editable templates, not official game data.
- The app shows source links and the template review date.
- The in-game task list and timers should be treated as correct if they differ from this app.
- Checklist data remains in the user's browser `localStorage`.
- The production site may load the Google AdSense script for site review or ads, but the app itself does not send checklist data to a backend.

See [PRIVACY.md](PRIVACY.md), [FAN_CONTENT.md](FAN_CONTENT.md), [SECURITY.md](SECURITY.md), and [SUPPORT.md](SUPPORT.md).

## Development

```powershell
npm install
npm run start -- --port 5174
```

Open `http://127.0.0.1:5174/`.

## Validation

```powershell
npm run typecheck
npm test
npm run build
```

## Deployment

This app is built as a static Vite site.

```powershell
npm run build
```

Deploy the generated `dist/` directory to any static host. The current public deployment uses Netlify with:

- build command: `npm run build`
- publish directory: `dist`

PWA features require `localhost` or HTTPS. See [DEPLOYMENT.md](DEPLOYMENT.md) for operational notes.

## Support

The app is free to use. Optional support links are documented in [SUPPORT.md](SUPPORT.md):

- Ko-fi: https://ko-fi.com/ranats
- GitHub Sponsors: https://github.com/sponsors/Ranats?frequency=recurring&sponsor=Ranats

The public page may load the AdSense review script. Display ad placement remains controlled by `VITE_ADSENSE_SLOT_ID`, so ads can stay limited to the reserved sponsored area after review.

## Source Snapshot

- Mobalytics: daily and weekly checklist source; updated May 8, 2026.
- GameWith: daily and weekly checklist source; last updated May 9, 2026.
- All Things How: weekly activity source; published May 6, 2026.

These sources are used only as editable template references.
