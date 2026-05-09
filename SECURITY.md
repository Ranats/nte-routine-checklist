# Security Policy

## Scope

NTE Routine Checklist is a static, local-first web app. Checklist state, settings, hidden items, and custom items are stored in the user's browser `localStorage`.

The production site may load Google AdSense for site review or ads. The app does not provide a backend API and does not intentionally send checklist data to a server.

## Reporting

Please report security issues through GitHub Issues:

https://github.com/Ranats/nte-routine-checklist/issues

Do not include private credentials, tokens, or personally sensitive data in public reports.

## Supported Version

The deployed Netlify site and the default branch of this repository are the supported surfaces.

## Hardening Notes

- No user-provided HTML is rendered with `dangerouslySetInnerHTML`.
- Imported backup JSON is normalized before it is stored.
- Service worker caching is limited to same-origin GET requests.
- Netlify deploy tokens, usage-monitoring credentials, and other operator secrets must stay outside the public app and public repository.
