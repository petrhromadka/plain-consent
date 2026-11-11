// Plain Consent generator: from the owner's choices to the snippet they paste into their site. The banner's own
// rules (validation, escaping, defaults) live in src/runtime.ts, so the generator and the
// published banner can never disagree about what a valid configuration is.
import {
  configElementId,
  defaultTexts,
  normalizeConfig,
  type BannerConfig,
  type BannerTexts,
  type TextKey,
  type OptionalCategory,
} from "./runtime.ts";
import { latestRelease, releaseFileName, releaseUrl, type Release, type ReleaseKind } from "./versions.ts";

export interface GeneratorResult {
  config: BannerConfig;
  problems: string[];
  refusedTitles: TextKey[];
  snippet: string;
  footerLink: string;
  csp: string;
}

// Only the fields that differ from the banner's defaults go into the snippet, so it stays short and a later
// release's better default text reaches a site that never changed it.
export function configForSnippet(config: BannerConfig): Record<string, unknown> {
  // Only the texts the owner changed from the chosen language's own texts.
  const texts: Partial<BannerTexts> = {};
  for (const key of Object.keys(defaultTexts) as (keyof BannerTexts)[]) {
    const changed = config.textOverrides[key];
    if (changed !== undefined) texts[key] = changed;
  }
  return {
    accent: config.accent,
    categories: config.categories,
    privacyUrl: config.privacyUrl,
    consentMode: config.consentMode,
    credit: config.credit,
    revision: config.revision,
    language: config.language,
    respectGpc: config.respectGpc,
    ...(Object.keys(texts).length > 0 && { texts }),
  };
}

// JSON that is safe inside <script type="application/json">: no "<" (so no "</script>" or "<!--"), no "&" or
// ">" and no line separators that older parsers treat as line ends. JSON.parse reads the escapes back.
export function jsonForHtml(value: unknown): string {
  return JSON.stringify(value, null, 2)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

const escapeAttribute = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// The snippet for the <head>, before any script it controls and before the Google tag. `base` is the directory
// URL (ending in "/") the site owner serves the files from; without it the release's own host is used, or a
// root-relative path for a release that is meant to be self-hosted.
export function snippet(config: BannerConfig, release: Release = latestRelease, base?: string): string {
  const url = (kind: ReleaseKind) => (base ? `${base}${releaseFileName(release, kind)}` : releaseUrl(release, kind));
  const css = releaseFileName(release, "css");
  const js = releaseFileName(release, "js");
  return [
    `<!-- Plain Consent ${release.version}. Vložte do <head> před ostatní skripty. -->`,
    `<link rel="stylesheet" href="${escapeAttribute(url("css"))}" integrity="${release.integrity[css]}" crossorigin="anonymous">`,
    `<script type="application/json" id="${configElementId}">`,
    jsonForHtml(configForSnippet(config)),
    `</script>`,
    `<script src="${escapeAttribute(url("js"))}" integrity="${release.integrity[js]}" crossorigin="anonymous"></script>`,
  ].join("\n");
}

// A link for the site's footer that reopens the settings (withdrawal must stay as easy as consent).
export function footerLink(config: BannerConfig): string {
  const label = config.texts.preferencesTitle.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<button type="button" data-cc="show-preferencesModal">${label}</button>`;
}

// The Content-Security-Policy entries the snippet needs on the owner's site: the exact file URLs when the files
// come from another host, 'self' when they are served from the site's own origin. The JSON block is not a
// script and needs no entry; the banner sets no inline styles, so 'unsafe-inline' is not needed for it.
export function cspEntries(release: Release = latestRelease, base?: string): string {
  const source = (kind: ReleaseKind) => {
    const dir = base ?? release.hostedAt;
    return dir ? `${dir}${releaseFileName(release, kind)}` : "'self'";
  };
  return [`script-src ${source("js")}`, `style-src ${source("css")}`].join("\n");
}

const examples: Record<OptionalCategory, { label: string; code: string }> = {
  analytics: {
    label: "Google Analytics 4 (místo G-XXXXXXX vaše ID)",
    code: `<script type="text/plain" data-category="analytics" data-src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script type="text/plain" data-category="analytics">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>`,
  },
  marketing: {
    label: "Meta Pixel nebo jiný reklamní kód",
    code: `<script type="text/plain" data-category="marketing">
  /* sem vložte kód pixelu beze změny */
</script>`,
  },
  preferences: {
    label: "Funkční skript (například chat nebo výběr jazyka)",
    code: `<script type="text/plain" data-category="preferences" data-src="https://example.com/widget.js"></script>`,
  },
};

// Embedded content (iframes) waits for consent like a script does: the address goes in data-src, never in src.
const embedExamples: Partial<Record<OptionalCategory, { label: string; code: string }>> = {
  marketing: {
    label: "Video z YouTube (místo VIDEO_ID ID videa)",
    code: `<iframe data-category="marketing" data-src="https://www.youtube-nocookie.com/embed/VIDEO_ID" data-title="Název videa" width="560" height="315" allowfullscreen></iframe>`,
  },
  preferences: {
    label: "Mapa (například OpenStreetMap)",
    code: `<iframe data-category="preferences" data-src="https://www.openstreetmap.org/export/embed.html?bbox=14.40,50.07,14.45,50.10" data-title="Mapa" width="600" height="400"></iframe>`,
  },
};

export function embedTaggingExamples(config: BannerConfig): { category: OptionalCategory; label: string; code: string }[] {
  return config.categories.flatMap((category) => {
    const example = embedExamples[category];
    return example ? [{ category, ...example }] : [];
  });
}

export function taggingExamples(config: BannerConfig): { category: OptionalCategory; label: string; code: string }[] {
  return config.categories.map((category) => ({ category, ...examples[category] }));
}

// The library renders a category title as HTML and also reads it back as the text of the switch's hidden label,
// so a character the banner has to escape would reach a screen reader as code ("&amp;"). The generator refuses
// these characters in the four category titles; the banner still escapes every text as a backstop.
export const categoryTitleKeys: readonly TextKey[] = ["necessaryTitle", "preferencesCategoryTitle", "analyticsTitle", "marketingTitle"];
export const refusedTitleChars = /[&<>"']/;
export const refusedTitleHint = "Název kategorie nesmí obsahovat znaky & < > \" ani apostrof, čtečka obrazovky by je přečetla jako kód.";

// Everything the page shows for one state of the form.
export function generate(raw: unknown, release: Release = latestRelease): GeneratorResult {
  const refusedTitles: TextKey[] = [];
  let accepted = raw;
  const rawTexts = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>)["texts"] : undefined;
  if (typeof rawTexts === "object" && rawTexts !== null && !Array.isArray(rawTexts)) {
    const texts: Record<string, unknown> = { ...rawTexts };
    for (const key of categoryTitleKeys) {
      const value = texts[key];
      if (typeof value === "string" && refusedTitleChars.test(value)) {
        refusedTitles.push(key);
        delete texts[key];
      }
    }
    if (refusedTitles.length > 0) accepted = { ...(raw as Record<string, unknown>), texts };
  }
  const { config, problems } = normalizeConfig(accepted);
  if (refusedTitles.length > 0) problems.push(`Názvy kategorií: ${refusedTitleHint} Použije se výchozí název.`);
  return { config, problems, refusedTitles, snippet: snippet(config, release), footerLink: footerLink(config), csp: cspEntries(release) };
}
