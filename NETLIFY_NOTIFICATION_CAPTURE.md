# Netlify Usage Notification Capture

Netlify's documented automatic usage alerts are email and in-app notifications at 50%, 75%, and 100% of monthly credit usage. Netlify also documents Slack usage notifications for Pro plan teams.

## Practical Options

### Option A: Free plan, email-first

Use Netlify's billing email notifications as the source of truth.

Recommended flow:

1. Set the team billing email to an address you can monitor reliably.
2. Keep Netlify usage notification emails enabled.
3. When a 75% or 100% notification arrives, run GitHub Actions workflow `Set hosting status message`.
4. Hide the message after the monthly reset.

This is the lowest-risk option because it uses Netlify's built-in alerts and does not require scraping or private API assumptions.

### Option B: Pro plan, Slack-first

If the project moves to Netlify Pro, enable the Netlify App for Slack and subscribe to team usage notifications.

Recommended flow:

1. Connect Netlify App for Slack.
2. Subscribe to team usage notifications.
3. Route messages to a private operations channel.
4. Trigger the GitHub Actions workflow manually or through a Slack automation after reviewing the alert.

### Option C: Email automation

If you want more automation without relying on Netlify dashboard scraping, route billing emails to an automation inbox.

Possible implementations:

- Gmail filter labels Netlify usage emails.
- Codex/Gmail connector or another mail automation reads only that label.
- The automation classifies 50%, 75%, or 100%.
- It triggers or recommends the existing GitHub Actions workflow.

This avoids browser scraping, but it still depends on email text staying recognizable.

Recommended implementation for this project:

- Gmail label: `netlify-usage-alerts`
- Codex App automation checks that label every 6 hours.
- 50% alerts are logged only.
- 75% alerts publish the soft hosting banner through GitHub Actions.
- 100% or paused alerts publish the strong hosting banner through GitHub Actions.

See `GMAIL_NETLIFY_USAGE_MONITOR.md`.

## Not Recommended Initially

- Browser scraping Netlify Usage & billing on a schedule.
- Putting a Netlify API token into the public app.
- Deploying automatically on every monitor run.
- Showing a permanent hosting-limit warning.

## Suggested Warning Policy

- 50%: no public banner.
- 75%: soft public banner if traffic is still climbing.
- 90% or 100%: stronger public banner.
- Billing reset: clear the banner.

## Existing Publisher

Use `.github/workflows/set-hosting-status.yml` to publish or clear the public message.
