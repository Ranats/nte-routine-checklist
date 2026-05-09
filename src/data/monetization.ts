export const MONETIZATION = {
  adsenseClientId: import.meta.env.VITE_ADSENSE_CLIENT_ID ?? "",
  kofiUrl: import.meta.env.VITE_KOFI_URL ?? "https://ko-fi.com/ranats",
  githubSponsorsUrl:
    import.meta.env.VITE_GITHUB_SPONSORS_URL ??
    "https://github.com/sponsors/Ranats?frequency=recurring&sponsor=Ranats",
  hostingStatusMessage: import.meta.env.VITE_HOSTING_STATUS_MESSAGE ?? "",
};

export function hasSupportLinks() {
  return Boolean(MONETIZATION.kofiUrl || MONETIZATION.githubSponsorsUrl);
}
