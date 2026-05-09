# Monetization Plan

Recommended order:

1. Publish the static PWA on Netlify.
2. Attach a custom domain.
3. Enable Ko-fi and/or GitHub Sponsors links.
4. Apply for AdSense after the site has public content, policy pages, and normal traffic.
5. Add one passive AdSense slot only after approval.

## Support Links

Ko-fi is the easiest first support option because it can be a plain outbound link. GitHub Sponsors is a good fit if the repository is open source and the maintainer profile is approved for Sponsors.

Ko-fi and GitHub Sponsors are enabled by default with:

```text
https://ko-fi.com/ranats
https://github.com/sponsors/Ranats?frequency=recurring&sponsor=Ranats
```

Set these build-time variables on Netlify when you want to override either URL:

```text
VITE_KOFI_URL=https://ko-fi.com/ranats
VITE_GITHUB_SPONSORS_URL=https://github.com/sponsors/Ranats?frequency=recurring&sponsor=Ranats
```

If both support URLs are removed in code/config, the app hides the support panel.

## AdSense

Do not add AdSense code until:

- the app is on HTTPS,
- privacy and fan-content pages are public,
- the site has enough original utility to be reviewed,
- the ad position is separated from checklist controls,
- you have confirmed that no one is being asked to click ads.

The current UI reserves a passive sponsored area near the bottom. Use that area first. Do not put ads near checkboxes, reset buttons, tab switches, import/export buttons, or any other frequent tap target.

## Policy Notes

- Never click your own live ads.
- Do not ask users to click ads.
- Do not use pop-ups, interstitials, or rewarded ads for this utility.
- Do not load ad scripts until the privacy policy reflects the provider and consent requirements.
- If the app later becomes a packaged mobile app, use the proper mobile ads SDK instead of embedding website ad code in an app shell.

## Hosting Cost Notice

Do not show a permanent alarmist banner while usage is low. It makes the app feel fragile.

Use `VITE_HOSTING_STATUS_MESSAGE` only when Netlify usage is approaching the monthly limit or the site has already paused once. A suitable message is:

```text
Hosting usage is getting close to the monthly free limit. If the checklist becomes unavailable, it will resume next billing cycle; support links help keep it online.
```

The app cannot safely show live Netlify credit usage by itself because that would require a Netlify API token or backend. Keep live usage monitoring in the Netlify dashboard unless a separate secure status service is added later.

Use `.github/workflows/set-hosting-status.yml` to update the message after Netlify sends a usage notification. See `NETLIFY_USAGE_AUTOMATION.md`.
