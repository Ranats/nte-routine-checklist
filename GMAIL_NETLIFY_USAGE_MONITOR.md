# Gmail Netlify Usage Monitor

Use this plan when Netlify usage monitoring is handled through email notifications.

## Goal

Detect Netlify monthly usage alerts from email and publish a hosting-status banner only when needed.

The public app never receives Netlify or GitHub tokens. The automation reads email, classifies the alert, and triggers the existing GitHub Actions workflow `Set hosting status message`.

## Required Accounts and Access

- Netlify team billing email must receive usage emails.
- Gmail filter or label should isolate Netlify usage emails.
- GitHub repository must contain `.github/workflows/set-hosting-status.yml`.
- GitHub repository secrets must contain:

```text
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

If Codex triggers GitHub Actions through GitHub APIs or a GitHub connector, that connector/account also needs permission to run workflows on the repository.

## Gmail Filter

Create a Gmail filter for Netlify usage alerts.

Suggested filter terms:

```text
from:(@netlify.com) (usage OR credits OR "monthly limit" OR "billing cycle")
```

Suggested label:

```text
netlify-usage-alerts
```

Keep the filter narrow. Do not route unrelated deploy or marketing emails into this label.

## Classification Rules

Read only the latest unread message under `netlify-usage-alerts`.

Suggested classes:

- `usage_50`: 50% usage. No public banner.
- `usage_75`: 75% usage. Soft public banner.
- `usage_100`: 100% usage or paused. Strong public banner.
- `unknown`: cannot classify. Report for manual review.

Soft banner:

```text
Hosting usage is getting close to the monthly free limit. If the checklist becomes unavailable, it will resume next billing cycle; support links help keep it online.
```

Strong banner:

```text
Hosting reached the monthly free limit. The checklist may be unavailable until the next billing cycle unless hosting is upgraded; support links help keep it online.
```

Clear banner after reset:

```text

```

## GitHub Actions Trigger

Trigger workflow:

```text
Set hosting status message
```

Input:

```text
message=<classified banner text>
deploy=true
```

Rules:

- For `usage_50`, do not deploy.
- For `usage_75`, deploy only if the current banner is empty or different.
- For `usage_100`, deploy the strong banner.
- Mark the email as processed only after the workflow is successfully started or the decision is logged.

## Codex Automation Prompt Draft

Use this for a Codex App automation after Gmail/GitHub access is available:

```text
Check Gmail label `netlify-usage-alerts` for unread Netlify usage or credit-limit emails. Classify the newest relevant email as usage_50, usage_75, usage_100, or unknown. For usage_50, mark/report it without changing the app banner. For usage_75, trigger GitHub Actions workflow `Set hosting status message` with the soft hosting warning and deploy=true. For usage_100, trigger the same workflow with the strong hosting warning and deploy=true. Do not print tokens or sensitive email content. If Gmail or GitHub access is unavailable, report the blocker and the exact manual workflow input to use.
```

## Recommended Schedule

Run every 6 hours.

Reasoning:

- Usage emails are event-based, so frequent scraping is unnecessary.
- A 6-hour interval is responsive enough if traffic spikes.
- The workflow deploys only when a relevant unread alert is found.

## Failure Handling

- If Gmail login is unavailable: report manual login required.
- If GitHub workflow trigger fails: report the exact banner message and ask for manual workflow run.
- If an email cannot be classified: do not update the banner automatically.
- If multiple alerts are unread: process the highest severity first.
