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
5. Add a custom domain if needed.
6. Verify HTTPS is active.
7. Open the site on mobile and desktop.

## Environment Variables

Optional support links:

```text
VITE_KOFI_URL=https://ko-fi.com/ranats
VITE_GITHUB_SPONSORS_URL=https://github.com/sponsors/Ranats?frequency=recurring&sponsor=Ranats
```

Display ads should stay empty until the site is approved:

```text
VITE_ADSENSE_SLOT_ID=1234567890
```

Optional hosting status message:

```text
VITE_HOSTING_STATUS_MESSAGE=Hosting is currently healthy. If this page pauses because the free Netlify limit is reached, support links help keep it online.
```

Leave it empty for the normal release.

## Netlify Free Limit Notes

Check Netlify's current pricing and usage documentation before relying on any specific free-plan limit. For this static app, the important meters are usually production deploys, bandwidth, and web requests.

If a project reaches the monthly usage limit, hosting may pause until the next billing cycle or until billing is upgraded. Keep auto recharge disabled unless you intentionally want paid overage behavior.

Practical guidance for this app:

- keep deploys batched instead of publishing every small text change,
- avoid large images and videos,
- keep the app static with no Netlify Functions,
- check Netlify `Usage & billing` after launch,
- enable `VITE_HOSTING_STATUS_MESSAGE` only when you need to warn users,
- keep private usage-monitoring workflows outside the public repository.

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
- privacy/fan-content pages match the scripts currently loaded by the production site.
