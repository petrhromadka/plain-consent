// Plain Consent: the code that runs on the site owner's page, around vanilla-cookieconsent (MIT, pinned in
// package.json, see src/versions.ts). scripts/build.mjs compiles this file into the published banner
// (releases/v<version>/plain-consent.js) and the generator imports the same functions, so a generator
// validates the inputs exactly as the banner will.
//
// Rules this file keeps, because it runs on other people's sites:
// - no network: it loads nothing, sends nothing and never passes the library a translation URL;
// - no eval, no `new Function`, no inline style attributes (colours go through CSSOM, which a strict
//   Content-Security-Policy allows), no globals besides the library's own `dataLayer` contract;
// - every text from the configuration is HTML-escaped and every link is checked before it reaches the library,
//   which renders texts as HTML;
// - fail closed: a missing or broken configuration falls back to the defaults, so a banner still asks
//   and nothing optional runs without consent.
//
// Only erasable TypeScript here (no enums, namespaces or parameter properties): the build only strips types.

export type OptionalCategory = "preferences" | "analytics" | "marketing";
export type Category = "necessary" | OptionalCategory;

// The element the snippet carries the configuration in, as JSON.
export const configElementId = "plain-consent-config";
// The library's default consent cookie, kept so its documentation stays true for site owners.
export const consentCookieName = "cc_cookie";
export const consentDays = 182;
export const creditUrl = "https://socionet.cz/nastroje/cookie-lista/";

export const optionalCategories: readonly OptionalCategory[] = ["preferences", "analytics", "marketing"];

export interface BannerTexts {
  title: string;
  description: string;
  acceptAll: string;
  rejectAll: string;
  settings: string;
  save: string;
  privacyLabel: string;
  preferencesTitle: string;
  preferencesDescription: string;
  necessaryTitle: string;
  necessaryDescription: string;
  preferencesCategoryTitle: string;
  preferencesCategoryDescription: string;
  analyticsTitle: string;
  analyticsDescription: string;
  marketingTitle: string;
  marketingDescription: string;
}

export type TextKey = keyof BannerTexts;

export interface BannerConfig {
  // Colour of the buttons and switches, #rrggbb.
  accent: string;
  // The optional categories the site uses, in display order; "necessary" is always there.
  categories: OptionalCategory[];
  texts: BannerTexts;
  // Link to the privacy or cookie policy: an http(s) URL or a path on the site, or "" for none.
  privacyUrl: string;
  // Google Consent Mode v2: default denied before any choice, updated on every choice.
  consentMode: boolean;
  // "Vytvořeno Socionet" in the banner's footer: off unless the owner switches it on.
  credit: boolean;
  // Raise it after adding a new service or purpose: the banner asks everyone again.
  revision: number;
}

export const defaultTexts: BannerTexts = {
  title: "Používáme cookies",
  description:
    "Nezbytné cookies potřebujeme, aby web fungoval. Ostatní použijeme, jen když s nimi souhlasíte. Svou volbu můžete kdykoli změnit.",
  acceptAll: "Přijmout vše",
  rejectAll: "Odmítnout vše",
  settings: "Nastavení",
  save: "Uložit výběr",
  privacyLabel: "Zásady ochrany osobních údajů",
  preferencesTitle: "Nastavení cookies",
  preferencesDescription:
    "Vyberte, které cookies smíme používat. Nezbytné jsou zapnuté vždy, bez nich web nefunguje. Souhlas můžete kdykoli změnit nebo odvolat.",
  necessaryTitle: "Nezbytné",
  necessaryDescription: "Zajišťují základní funkce webu a zapamatují si vaši volbu cookies. Nejdou vypnout.",
  preferencesCategoryTitle: "Funkční",
  preferencesCategoryDescription: "Pamatují si vaše nastavení, například jazyk nebo region.",
  analyticsTitle: "Analytické",
  analyticsDescription: "Měří návštěvnost a ukazují, jak lidé web používají, abychom ho mohli zlepšovat.",
  marketingTitle: "Marketingové",
  marketingDescription: "Měří a cílí reklamu, i na jiných webech a sociálních sítích.",
};

// Longest text the banner accepts per field; a longer one is cut at a word boundary.
export const textLimits: Record<TextKey, number> = {
  title: 80,
  description: 600,
  acceptAll: 40,
  rejectAll: 40,
  settings: 40,
  save: 40,
  privacyLabel: 80,
  preferencesTitle: 80,
  preferencesDescription: 600,
  necessaryTitle: 60,
  necessaryDescription: 300,
  preferencesCategoryTitle: 60,
  preferencesCategoryDescription: 300,
  analyticsTitle: 60,
  analyticsDescription: 300,
  marketingTitle: 60,
  marketingDescription: 300,
};

export const defaultConfig: BannerConfig = {
  accent: "#1f2937",
  categories: ["analytics", "marketing"],
  texts: defaultTexts,
  privacyUrl: "",
  consentMode: true,
  credit: false,
  revision: 0,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// One line of plain text: control characters and runs of white space become one space and the ends are trimmed.
export function flatText(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029\s]+/g, " ").trim();
}

// flatText, and a text over the limit is cut at the last space before it.
export function cleanText(value: string, limit: number): string {
  const flat = flatText(value);
  if (flat.length <= limit) return flat;
  const cut = flat.slice(0, limit);
  const space = cut.lastIndexOf(" ");
  return (space > limit / 2 ? cut.slice(0, space) : cut).trim();
}

export function isHexColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

// A link the banner may show: an absolute http(s) URL without credentials, or a path on the same site
// ("/..."). Anything else (javascript:, data:, protocol-relative //host, backslashes) gives "".
export function safeUrl(value: string): string {
  const text = value.trim();
  if (text === "" || text.length > 2000 || /[\s\\<>"'`]/.test(text)) return "";
  if (text.startsWith("/")) {
    if (text.startsWith("//")) return "";
    try {
      const base = "https://site.invalid";
      const url = new URL(text, base);
      const path = `${url.pathname}${url.search}${url.hash}`;
      return url.origin === base && !path.startsWith("//") ? path : "";
    } catch {
      return "";
    }
  }
  try {
    const url = new URL(text);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    if (url.username || url.password || !url.hostname.includes(".")) return "";
    return url.href;
  } catch {
    return "";
  }
}

// The configuration as the banner will use it, whatever came in: unknown keys are dropped, a wrong value
// falls back to its default, and each fallback is named in `problems` (Czech, shown by the generator and
// written to the browser console by the banner).
export function normalizeConfig(raw: unknown): { config: BannerConfig; problems: string[] } {
  const problems: string[] = [];
  if (!isRecord(raw)) {
    return { config: { ...defaultConfig, texts: { ...defaultTexts }, categories: [...defaultConfig.categories] }, problems: ["Nastavení chybí nebo není platný JSON, lišta použije výchozí."] };
  }
  const pick = <T>(key: string, ok: (v: unknown) => v is T, fallback: T, label: string): T => {
    const value = raw[key];
    if (value === undefined) return fallback;
    if (ok(value)) return value;
    problems.push(`${label}: neplatná hodnota, použije se výchozí.`);
    return fallback;
  };
  const isBool = (v: unknown): v is boolean => typeof v === "boolean";
  const isColor = (v: unknown): v is string => typeof v === "string" && isHexColor(v);
  const isRevision = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 9999;

  let categories = [...defaultConfig.categories];
  if (raw["categories"] !== undefined) {
    if (Array.isArray(raw["categories"])) {
      const wanted = raw["categories"].filter((c): c is OptionalCategory => typeof c === "string" && (optionalCategories as readonly string[]).includes(c));
      if (wanted.length !== raw["categories"].length) problems.push("Kategorie: neznámé kategorie byly vynechány.");
      categories = optionalCategories.filter((c) => wanted.includes(c));
    } else {
      problems.push("Kategorie: neplatná hodnota, použijí se výchozí.");
    }
  }

  const texts: BannerTexts = { ...defaultTexts };
  const rawTexts = raw["texts"];
  if (rawTexts !== undefined && !isRecord(rawTexts)) problems.push("Texty: neplatná hodnota, použijí se výchozí.");
  if (isRecord(rawTexts)) {
    for (const key of Object.keys(defaultTexts) as TextKey[]) {
      const value = rawTexts[key];
      if (value === undefined) continue;
      if (typeof value !== "string") {
        problems.push(`Text ${key}: není to text, použije se výchozí.`);
        continue;
      }
      const clean = cleanText(value, textLimits[key]);
      if (clean === "") continue;
      if (flatText(value).length > textLimits[key]) problems.push(`Text ${key}: je delší než ${textLimits[key]} znaků, byl zkrácen.`);
      texts[key] = clean;
    }
  }

  let privacyUrl = "";
  if (raw["privacyUrl"] !== undefined) {
    const value = raw["privacyUrl"];
    privacyUrl = typeof value === "string" ? safeUrl(value) : "";
    if (privacyUrl === "" && !(typeof value === "string" && value.trim() === "")) problems.push("Odkaz na zásady: není to adresa http(s) ani cesta začínající /, odkaz se nezobrazí.");
  }

  return {
    config: {
      accent: pick("accent", isColor, defaultConfig.accent, "Barva tlačítek").toLowerCase(),
      categories,
      texts,
      privacyUrl,
      consentMode: pick("consentMode", isBool, defaultConfig.consentMode, "Consent Mode"),
      credit: pick("credit", isBool, defaultConfig.credit, "Odkaz Socionet"),
      revision: pick("revision", isRevision, defaultConfig.revision, "Verze nastavení"),
    },
    problems,
  };
}

// ---- Colours ----

function channels(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance(hex: string): number {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

function mix(hex: string, toward: string, amount: number): string {
  const from = channels(hex);
  const to = channels(toward);
  return `#${from.map((c, i) => Math.round(c + ((to[i] ?? c) - c) * amount).toString(16).padStart(2, "0")).join("")}`;
}

// The library's background and text colour (vanilla-cookieconsent 3.1.0 CSS, light scheme).
export const bannerBackground = "#ffffff";
const bannerText = "#2c2f31";

// The CSS custom properties of the library that carry the owner's colour. Button text is black or white,
// whichever reads better on the accent (one of them always reaches 4.5:1); links take the accent only when
// it reads on the banner's background, otherwise the text colour.
export function themeVariables(config: Pick<BannerConfig, "accent">): Record<string, string> {
  const accent = config.accent;
  const onAccent = contrast(accent, "#000000") >= contrast(accent, "#ffffff") ? "#000000" : "#ffffff";
  const hover = mix(accent, onAccent === "#ffffff" ? "#000000" : "#ffffff", 0.18);
  return {
    "--cc-btn-primary-bg": accent,
    "--cc-btn-primary-color": onAccent,
    "--cc-btn-primary-border-color": accent,
    "--cc-btn-primary-hover-bg": hover,
    "--cc-btn-primary-hover-color": onAccent,
    "--cc-btn-primary-hover-border-color": hover,
    "--cc-toggle-on-bg": accent,
    "--cc-toggle-on-knob-bg": onAccent,
    "--cc-toggle-enabled-icon-color": accent,
    "--cc-link-color": contrast(accent, bannerBackground) >= 4.5 ? accent : bannerText,
  };
}

// ---- Google Consent Mode v2 ----

export type ConsentValue = "granted" | "denied";
export type ConsentState = Record<
  | "ad_storage"
  | "ad_user_data"
  | "ad_personalization"
  | "analytics_storage"
  | "functionality_storage"
  | "personalization_storage"
  | "security_storage",
  ConsentValue
>;

// Which Consent Mode types each accepted category grants. Everything not accepted stays denied;
// security_storage (fraud protection, authentication) counts as necessary.
export function consentState(accepted: readonly string[]): ConsentState {
  const has = (category: Category): ConsentValue => (accepted.includes(category) ? "granted" : "denied");
  return {
    ad_storage: has("marketing"),
    ad_user_data: has("marketing"),
    ad_personalization: has("marketing"),
    analytics_storage: has("analytics"),
    functionality_storage: has("preferences"),
    personalization_storage: has("preferences"),
    security_storage: "granted",
  };
}

// The categories of a still valid earlier choice, read from the library's cookie with the library's own rules
// (vanilla-cookieconsent 3.1.0 retrieveState: consent id, both timestamps, the categories array and, when the
// revision is used, the same revision). Read synchronously while the page head is parsed, so Consent Mode
// gets the right state before any Google tag runs. null = no valid choice.
export function storedCategories(cookieHeader: string, revision: number): string[] | null {
  const escaped = consentCookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const found = cookieHeader.match(new RegExp(`(?:^|;)\\s*${escaped}\\s*=\\s*([^;]+)`));
  if (!found || found[1] === undefined) return null;
  let value: unknown;
  try {
    value = JSON.parse(decodeURIComponent(found[1]));
  } catch {
    return null;
  }
  if (!isRecord(value)) return null;
  const { consentId, consentTimestamp, lastConsentTimestamp, categories } = value;
  if (typeof consentId !== "string" || consentId === "" || !consentTimestamp || !lastConsentTimestamp || !Array.isArray(categories)) return null;
  if (value["revision"] !== revision) return null;
  return categories.filter((c): c is string => typeof c === "string");
}

// ---- The library's configuration ----

// First-party cookies of common tools that the library deletes when their category is refused or withdrawn.
export const autoClearCookies: Record<OptionalCategory, RegExp[]> = {
  preferences: [],
  analytics: [/^_ga/, /^_gid$/, /^_gat/, /^_clck$/, /^_clsk$/, /^_hj/],
  marketing: [/^_fbp$/, /^_fbc$/, /^_gcl_/, /^_ttp$/, /^_uet/, /^_pin_unauth$/],
};

const categoryTexts: Record<OptionalCategory, [TextKey, TextKey]> = {
  preferences: ["preferencesCategoryTitle", "preferencesCategoryDescription"],
  analytics: ["analyticsTitle", "analyticsDescription"],
  marketing: ["marketingTitle", "marketingDescription"],
};

export interface Callbacks {
  onConsent: () => void;
  onChange: () => void;
}

// What the banner hands vanilla-cookieconsent. Fixed, not configurable, because the law asks for it
// (§ 89 odst. 3 zákona č. 127/2005 Sb., GDPR, ÚOOÚ guidance): opt-in, nothing optional enabled in advance,
// "Odmítnout vše" next to "Přijmout vše" in the first layer and styled the same, no cookie wall, scripts
// managed by category, refused categories' cookies deleted.
export function vendorConfig(config: BannerConfig, callbacks: Callbacks): Record<string, unknown> {
  const t = config.texts;
  const e = (key: TextKey) => escapeHtml(t[key]);
  const privacyLink = config.privacyUrl ? `<a href="${escapeHtml(config.privacyUrl)}">${e("privacyLabel")}</a>` : "";
  const credit = config.credit
    ? `<span class="plain-consent-credit">Vytvořeno <a href="${creditUrl}" target="_blank" rel="nofollow noopener">Socionet</a></span>`
    : "";
  const categories: Record<string, unknown> = { necessary: { enabled: true, readOnly: true } };
  for (const category of config.categories) {
    const cookies = autoClearCookies[category].map((name) => ({ name }));
    categories[category] = { enabled: false, readOnly: false, ...(cookies.length > 0 && { autoClear: { cookies } }) };
  }
  const sections: Record<string, unknown>[] = [
    { description: e("preferencesDescription") },
    { title: e("necessaryTitle"), description: e("necessaryDescription"), linkedCategory: "necessary" },
    ...config.categories.map((category) => {
      const [title, description] = categoryTexts[category];
      return { title: e(title), description: e(description), linkedCategory: category };
    }),
  ];
  if (privacyLink) sections.push({ description: privacyLink });
  return {
    mode: "opt-in",
    autoShow: true,
    revision: config.revision,
    manageScriptTags: true,
    autoClearCookies: true,
    hideFromBots: true,
    disablePageInteraction: false,
    lazyHtmlGeneration: true,
    cookie: { name: consentCookieName, expiresAfterDays: consentDays, sameSite: "Lax" },
    guiOptions: {
      consentModal: { layout: "box", position: "bottom left", equalWeightButtons: true, flipButtons: false },
      preferencesModal: { layout: "box", equalWeightButtons: true, flipButtons: false },
    },
    categories,
    language: {
      default: "cs",
      translations: {
        cs: {
          consentModal: {
            title: e("title"),
            description: e("description"),
            acceptAllBtn: e("acceptAll"),
            acceptNecessaryBtn: e("rejectAll"),
            showPreferencesBtn: e("settings"),
            footer: [privacyLink, credit].filter(Boolean).join(""),
          },
          preferencesModal: {
            title: e("preferencesTitle"),
            acceptAllBtn: e("acceptAll"),
            acceptNecessaryBtn: e("rejectAll"),
            savePreferencesBtn: e("save"),
            closeIconLabel: "Zavřít",
            sections,
          },
        },
      },
    },
    onConsent: callbacks.onConsent,
    onChange: callbacks.onChange,
  };
}

// ---- Start on the page ----

export interface VendorApi {
  run: (config: Record<string, unknown>) => unknown;
  showPreferences: () => void;
  getUserPreferences: () => { acceptedCategories: string[] };
}

const svgNs = "http://www.w3.org/2000/svg";

function settingsButton(doc: Document, label: string, open: () => void): HTMLButtonElement {
  const button = doc.createElement("button");
  button.type = "button";
  button.className = "plain-consent-settings";
  button.setAttribute("aria-label", label);
  button.title = label;
  const svg = doc.createElementNS(svgNs, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const shape = doc.createElementNS(svgNs, "path");
  // A cookie with a bite and three crumbs.
  shape.setAttribute(
    "d",
    "M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Zm-3.5 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-5 3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z",
  );
  svg.appendChild(shape);
  button.appendChild(svg);
  button.addEventListener("click", open);
  return button;
}

// Called once by the published file, synchronously while the page's head is parsed: the Consent Mode default
// lands in the dataLayer before any Google tag after the snippet; the banner itself waits for the DOM.
export function start(win: Window & { dataLayer?: unknown[]; console?: Console }, doc: Document, cc: VendorApi): void {
  const element = doc.getElementById(configElementId);
  let raw: unknown;
  try {
    raw = element ? JSON.parse(element.textContent ?? "") : undefined;
  } catch {
    raw = undefined;
  }
  const { config, problems } = normalizeConfig(raw);
  for (const problem of problems) win.console?.warn(`Plain Consent: ${problem}`);

  const dataLayer = (win.dataLayer = Array.isArray(win.dataLayer) ? win.dataLayer : []);
  // gtag.js reads Arguments objects from the dataLayer, not arrays (Google's own gtag() stub does the same).
  const gtag = function (..._args: unknown[]) {
    dataLayer.push(arguments);
  };
  let lastSent = "";
  const update = (accepted: readonly string[]) => {
    if (!config.consentMode) return;
    const state = consentState(accepted);
    const key = JSON.stringify(state);
    if (key === lastSent) return;
    lastSent = key;
    gtag("consent", "update", state);
  };
  if (config.consentMode) {
    const denied = consentState([]);
    lastSent = JSON.stringify(denied);
    gtag("consent", "default", { ...denied, wait_for_update: 500 });
    gtag("set", "ads_data_redaction", true);
    const stored = storedCategories(doc.cookie, config.revision);
    if (stored) update(stored);
  }

  const root = doc.documentElement;
  for (const [name, value] of Object.entries(themeVariables(config))) root.style.setProperty(name, value);

  // The library calls onConsent on the first choice and on every later page with a valid choice, so the round
  // settings button appears only once there is a choice to change (before it, the banner itself is open).
  let button: HTMLButtonElement | undefined;
  const sync = () => {
    update(cc.getUserPreferences().acceptedCategories);
    if (!button && doc.body) {
      button = settingsButton(doc, config.texts.preferencesTitle, () => cc.showPreferences());
      doc.body.appendChild(button);
    }
  };
  const go = () => {
    cc.run(vendorConfig(config, { onConsent: sync, onChange: sync }));
  };
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", go, { once: true });
  else go();
}
