# NTE Routine Checklist

[![Live site](https://img.shields.io/badge/live-nte--routine--checklist.netlify.app-2dd4bf)](https://nte-routine-checklist.netlify.app/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-support-ff5e5b?logo=kofi&logoColor=white)](https://ko-fi.com/ranats)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsors-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/Ranats?frequency=recurring&sponsor=Ranats)

Unofficial local-first daily and weekly checklist for Neverness to Everness.

https://nte-routine-checklist.netlify.app/

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

See [PRIVACY.md](PRIVACY.md), [FAN_CONTENT.md](FAN_CONTENT.md), and [SECURITY.md](SECURITY.md).

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

## Distribution

The Netlify site is the canonical app URL. Additional listings should point users back to the Netlify app so checklist data stays in one browser origin.

- Search indexing checklist: [docs/distribution/SEARCH_INDEXING.md](docs/distribution/SEARCH_INDEXING.md)
- itch.io listing draft: [docs/distribution/ITCH_IO_LISTING.md](docs/distribution/ITCH_IO_LISTING.md)
- Social and video copy: [docs/distribution/SOCIAL_AND_VIDEO.md](docs/distribution/SOCIAL_AND_VIDEO.md)
- GitHub topics: [docs/distribution/GITHUB_TOPICS.md](docs/distribution/GITHUB_TOPICS.md)

## Monetization

Support links are enabled by default:

- Ko-fi: https://ko-fi.com/ranats
- GitHub Sponsors: https://github.com/sponsors/Ranats?frequency=recurring&sponsor=Ranats

AdSense site verification uses the public publisher ID in `index.html`. Display ad placement remains controlled by `VITE_ADSENSE_SLOT_ID`, so the app can keep ads limited to the reserved sponsored area after review. See [MONETIZATION.md](MONETIZATION.md).

## Source Snapshot

- Mobalytics: daily and weekly checklist source; updated May 8, 2026.
- GameWith: daily and weekly checklist source; last updated May 9, 2026.
- All Things How: weekly activity source; published May 6, 2026.

These sources are used only as editable template references.
