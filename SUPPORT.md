# Support

NTE Routine Checklist is free, MIT-licensed, and local-first. Users do not need an account, payment, or game-account connection to use the checklist.

Optional maintainer support links are:

- Ko-fi: https://ko-fi.com/ranats
- GitHub Sponsors: https://github.com/sponsors/Ranats?frequency=recurring&sponsor=Ranats

The public app may show these links in a passive support panel. They must not block checklist use or sit between frequent controls such as checkboxes, reset buttons, import/export buttons, or tab switches.

## Ads

The production page may load the public AdSense review script. A display ad slot is only rendered when the deployment sets:

```text
VITE_ADSENSE_CLIENT_ID=ca-pub-...
VITE_ADSENSE_SLOT_ID=1234567890
```

Do not ask users to click ads. Keep ads away from checklist controls, and keep the privacy pages aligned with any third-party scripts used by the production deployment.

## Hosting Status

`VITE_HOSTING_STATUS_MESSAGE` is available for rare operational notices, such as a public host approaching usage limits. Leave it empty during normal operation so the app does not look fragile.
