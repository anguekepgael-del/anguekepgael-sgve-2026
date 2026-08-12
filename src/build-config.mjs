export const assetVersion = "20260812-programme";

export const redirectRules = [
  "/sgve /sgve-2026/ 301",
  "/svge /sgve-2026/ 301",
  "/sgva /sgve-2026/ 301",
  "/svge-2026 /sgve-2026/ 301",
  "/sgva-2026 /sgve-2026/ 301",
  "/inscription /sgve-2026/#inscription 301",
  "/conseils /blog/ 301",
];

export const netlifyHeaders = [
  "/*",
  "  X-Content-Type-Options: nosniff",
  "  X-Frame-Options: DENY",
  "  Referrer-Policy: strict-origin-when-cross-origin",
  "",
  "/styles.css",
  "  Cache-Control: public, max-age=300, must-revalidate",
  "",
  "/script.js",
  "  Cache-Control: public, max-age=300, must-revalidate",
  "",
  "/*.html",
  "  Cache-Control: no-cache",
];

export const criticalRoutes = [
  "/",
  "/services/",
  "/sgve-2026/",
  "/contact/",
];

export const requiredDesignTokens = [
  "--color-brand",
  "--color-ink",
  "--color-white",
  "--container-max",
  "--section-y",
  "--radius-button",
  "--radius-card",
  "--shadow-md",
  "--font-main",
  "--focus-ring",
];
