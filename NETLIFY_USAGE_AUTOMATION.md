# Netlify Usage Automation

Short answer: yes, GitHub Actions can update the app message. Fully automatic credit monitoring depends on whether Netlify exposes a stable credit-usage API endpoint for the account.

## Current Safe Workflow

This repository includes `.github/workflows/set-hosting-status.yml`.

It updates `VITE_HOSTING_STATUS_MESSAGE` on Netlify and optionally runs a production deploy. Use it when Netlify sends a 50%, 75%, or 100% usage notification.

Required GitHub repository secrets:

```text
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

How to use:

1. Open GitHub Actions.
2. Run `Set hosting status message`.
3. Enter a message, for example:

```text
Hosting usage is getting close to the monthly free limit. If the checklist becomes unavailable, it will resume next billing cycle; support links help keep it online.
```

4. Keep `deploy=true` if you want the message to appear immediately.

To hide the message, run the workflow again with an empty message and `deploy=true`.

## Why Not Put Netlify Usage Tokens in the Browser

The public app must not call the Netlify API directly. A Netlify token could control site configuration and deployments. It must stay in GitHub Secrets or Netlify only.

## Fully Automatic Option

If Netlify exposes a stable endpoint for remaining credits, a scheduled workflow can:

1. run every 6 or 12 hours,
2. call the Netlify API using `NETLIFY_AUTH_TOKEN`,
3. compare remaining credits against thresholds,
4. set `VITE_HOSTING_STATUS_MESSAGE`,
5. deploy only when the message changes.

Use conservative thresholds:

- under 50% used: no banner,
- 50% to 74% used: dashboard-only monitoring,
- 75% to 89% used: soft in-app warning,
- 90%+ used: stronger warning with support links.

Do not deploy on every scheduled run. A production deploy costs credits, so only deploy when the displayed message changes.

## Codex App Browser Option

Codex App automation can inspect the Netlify dashboard through a browser-like flow, but it should be treated as best-effort. It may fail when the Netlify session expires, when 2FA is required, or when the dashboard UI changes.

Recommended pattern:

1. Codex automation checks Netlify Usage & billing on a schedule.
2. It classifies usage into no banner, soft warning, or paused warning.
3. It updates the public site only through the GitHub Actions workflow, not through browser-side tokens.
4. If login is required, it reports that manual login is needed.

See `CODEX_NETLIFY_MONITOR.md` for the prompt and thresholds.

## Notification Capture Option

Prefer notification capture over dashboard scraping when possible.

Netlify documents email and in-app usage updates at 50%, 75%, and 100% of monthly credit allotment. Netlify also documents Slack usage notifications for Pro plan teams.

For the Free plan, the practical path is:

1. use Netlify's billing email as the source of truth,
2. route usage emails to a monitored mailbox or label,
3. trigger `Set hosting status message` when the 75% or 100% alert arrives.

See `NETLIFY_NOTIFICATION_CAPTURE.md`.

## Netlify Credit Notes

Netlify's current credit-based pricing page lists the Free plan as a 300 credit monthly limit. It also says projects are paused when monthly usage limits are reached, and that Netlify sends email and in-app notifications at 50%, 75%, and 100%.

For this static app, the main credit meters are production deploys, bandwidth, and web requests. Avoid large assets and frequent production deploys.
