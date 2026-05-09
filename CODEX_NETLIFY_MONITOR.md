# Codex Netlify Monitor Plan

Codex App automation can help monitor Netlify usage, but it should not be the only safety mechanism.

## Recommended Architecture

Use a three-layer setup:

1. Netlify native notifications
   - Keep Netlify email and in-app usage notifications enabled.
   - Netlify currently notifies at 50%, 75%, and 100% usage.

2. GitHub Actions message publisher
   - Use `.github/workflows/set-hosting-status.yml`.
   - It updates `VITE_HOSTING_STATUS_MESSAGE` and deploys the site.
   - This is the durable write path because tokens stay in GitHub Secrets.

3. Codex App scheduled observer
   - Use Codex App automation to periodically inspect Netlify Usage & billing.
   - If usage looks high, have Codex trigger or instruct the GitHub Actions workflow.
   - Treat browser inspection as best-effort because dashboard UI and login sessions can change.

## Why Browser-Based Usage Monitoring Is Risky

- Netlify dashboard sessions can expire.
- Login or 2FA can block unattended checks.
- UI labels and layout can change.
- Codex automation may not always inherit the same browser cookies as the current interactive browser.
- Scraping the dashboard is less stable than a documented API.

For these reasons, do not put Netlify tokens in the browser or public app. Keep tokens in GitHub Secrets or Netlify only.

## Automation Frequency

Start with once per day.

Suggested cadence:

- Daily while traffic is low.
- Twice daily after the site has public users.
- Every 6 hours only if usage is above 75%.

Do not deploy on every check. Deploy only when the visible hosting message changes.

## Suggested Thresholds

- 0% to 49% used: no in-app banner.
- 50% to 74% used: no banner; keep observing.
- 75% to 89% used: soft banner.
- 90%+ used: stronger banner.
- 100% or paused: clear availability notice.

Soft banner:

```text
Hosting usage is getting close to the monthly free limit. If the checklist becomes unavailable, it will resume next billing cycle; support links help keep it online.
```

Paused banner:

```text
Hosting reached the monthly free limit. The checklist may be unavailable until the next billing cycle unless hosting is upgraded; support links help keep it online.
```

## Codex Automation Prompt Draft

Use this when creating a Codex App automation:

```text
Check the Netlify Usage & billing page for the NTE Routine Checklist site. If the dashboard is accessible, report current usage percentage, relevant credit/bandwidth/request signals, and whether the in-app hosting status message should be hidden, soft-warning, or paused-warning. If usage is 75% or higher, update the repository by triggering the existing GitHub Actions workflow `Set hosting status message` or clearly report the exact message that should be deployed. Do not expose or print tokens. If login is required, report that manual login is needed and do not attempt to bypass authentication.
```

## Manual Fallback

If the automation cannot access Netlify:

1. Open Netlify `Usage & billing`.
2. Check current monthly credits.
3. Run GitHub Actions workflow `Set hosting status message`.
4. Use an empty message to hide the banner after the billing cycle resets.
