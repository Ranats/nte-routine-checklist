# Deployment Plan

Recommended public host: Netlify with a custom domain.

## Why Netlify

- The app is a static Vite PWA, so Netlify can serve it without a backend.
- Netlify provides HTTPS for generated URLs and custom domains.
- `netlify.toml` keeps the build command, publish directory, cache headers, and basic security headers in the repository.
- A custom domain is the cleaner path for AdSense review than a temporary preview URL.

## Setup

1. Push this repository to GitHub.
2. Create a Netlify site from the GitHub repository.
3. Use these build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy once on the generated `.netlify.app` URL.
5. Add a custom domain in Netlify.
6. Verify HTTPS is active.
7. Open the site on mobile and desktop.

## Environment Variables

Optional support links:

```text
VITE_KOFI_URL=https://ko-fi.com/ranats
VITE_GITHUB_SPONSORS_URL=https://github.com/sponsors/Ranats?frequency=recurring&sponsor=Ranats
```

AdSense should stay empty until the site is approved:

```text
VITE_ADSENSE_CLIENT_ID=ca-pub-2527726607213346
VITE_ADSENSE_SLOT_ID=1234567890
```

Optional hosting status message:

```text
VITE_HOSTING_STATUS_MESSAGE=Hosting is currently healthy. If this page pauses because the free Netlify limit is reached, support links help keep it online.
```

Leave it empty for the normal release.

## Netlify Free Limit Notes

As of the current Netlify pricing page, the Free plan has a 300 credit monthly limit. Netlify meters production deploys, bandwidth, compute, and web requests with credits. For this static app, the important meters are:

- production deploy: 15 credits each,
- bandwidth: 20 credits per GB,
- web requests: 2 credits per 10,000 requests.

If a project reaches the monthly credit limit, Netlify says it enters a paused state until the next billing cycle. Netlify also says it sends email and in-app notifications at 50%, 75%, and 100% usage. Keep auto recharge disabled unless you intentionally want paid overage behavior.

Practical guidance for this app:

- keep deploys batched instead of publishing every small text change,
- avoid large images and videos,
- keep the app static with no Netlify Functions,
- check Netlify `Usage & billing` after launch,
- enable `VITE_HOSTING_STATUS_MESSAGE` only when you need to warn users.
- use `.github/workflows/set-hosting-status.yml` to update the warning from GitHub Actions.

Required GitHub repository secrets for the workflow:

```text
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

See `NETLIFY_USAGE_AUTOMATION.md`.
For a Codex App scheduled browser observer, see `CODEX_NETLIFY_MONITOR.md`.
For email/Slack notification capture, see `NETLIFY_NOTIFICATION_CAPTURE.md`.
For the recommended Gmail-based monitor, see `GMAIL_NETLIFY_USAGE_MONITOR.md`.

## Post-deploy Checks

```powershell
npm run typecheck
npm test
npm run build
```

Then verify on the deployed URL:

- daily item toggle persists after reload,
- weekly item toggle persists after reload,
- reset settings save,
- custom item add/hide/restore works,
- export/import works,
- `/privacy.html` loads,
- `/fan-content.html` loads,
- install prompt/PWA behavior works on HTTPS,
- no console errors,
- no third-party scripts are loaded before monetization is explicitly enabled.
