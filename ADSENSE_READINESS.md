# AdSense Readiness

Public URL:

```text
https://nte-routine-checklist.netlify.app/
```

## Current Status

- Static PWA deployed on Netlify.
- Privacy page is public.
- Fan content notice is public.
- Ko-fi and GitHub Sponsors links are public.
- AdSense script is not loaded unless both deployment variables are set:
  - `VITE_ADSENSE_CLIENT_ID`
  - `VITE_ADSENSE_SLOT_ID`
- Site review script is present in `index.html`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2527726607213346" crossorigin="anonymous"></script>
```

## Before Applying

- Check the deployed home page on desktop and mobile.
- Confirm `/privacy.html` loads.
- Confirm `/fan-content.html` loads.
- Confirm the page clearly says it is unofficial.
- Confirm there are no official logos, screenshots, character art, or game icons.
- Confirm the app has real utility without ads.
- Add a short public-facing contact path if AdSense review requires it.

## After Approval

Set these Netlify environment variables:

```text
VITE_ADSENSE_CLIENT_ID=ca-pub-2527726607213346
VITE_ADSENSE_SLOT_ID=1234567890
```

Then trigger a production deploy.

## Ad Placement Rule

Use only the existing bottom sponsored area first. Do not place ads near:

- checkboxes,
- reset buttons,
- tab switches,
- import/export buttons,
- language selector,
- support links.

## Current Live QA

Last checked:

```text
2026-05-10
```

Verified:

- home page title is `NTE Routine Checklist`,
- home page renders checklist content,
- Ko-fi and GitHub Sponsors links render,
- Japanese and Chinese UI language switching works,
- Japanese privacy page loads,
- fan content notice page loads,
- AdSense script is absent while environment variables are empty.
