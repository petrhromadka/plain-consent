// Plain Consent: the code that runs on the site owner's page, around vanilla-cookieconsent (MIT, pinned in
// package.json, see src/versions.ts). scripts/build.mjs compiles this file into the published banner
// (releases/v<version>/plain-consent.js) and the generator imports the same functions, so a generator
// validates the inputs exactly as the banner will.
//
// Rules this file keeps, because it runs on other people's sites:
// - no network: it loads nothing, sends nothing and never passes the library a translation URL;
// - no eval, no `new Function`, no inline style attributes (colours and sizes go through CSSOM, which a strict
//   Content-Security-Policy allows), no globals besides the library's own `dataLayer` contract; the only thing
//   it tells the page is the `plain-consent:update` event on the document;
// - every text from the configuration is HTML-escaped and every link is checked before it reaches the library,
//   which renders texts as HTML; the placeholders of blocked embeds are built with textContent, never markup;
// - an embed (iframe) is tagged with data-category and data-src and loads nothing until its category is accepted;
// - fail closed: a missing or broken configuration falls back to the defaults, so a banner still asks
//   and nothing optional runs without consent.
//
// Only erasable TypeScript here (no enums, namespaces or parameter properties): the build only strips types.

export type OptionalCategory = "preferences" | "analytics" | "marketing";
export type LanguageCode = "cs" | "sk" | "en" | "de" | "pl";
export type LanguageSetting = "auto" | LanguageCode;
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
  // The placeholder that stands in for an iframe until its category is accepted; "{category}" becomes the
  // category's title.
  embedMessage: string;
  embedButton: string;
  // Shown in the settings instead of the marketing switch when the browser sends Global Privacy Control.
  gpcNotice: string;
  // Label of the close icon of the settings.
  close: string;
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
  // The language of the built-in texts: one of the supported codes, or "auto" to follow <html lang>.
  language: LanguageSetting;
  // Global Privacy Control: when the browser sends it, marketing is not offered and never granted.
  respectGpc: boolean;
  // The texts the owner changed, by key. `texts` is the language's texts with these on top.
  textOverrides: Partial<BannerTexts>;
}

export const languages: readonly LanguageCode[] = ["cs", "sk", "en", "de", "pl"];

// The built-in texts of every language. Czech is the default (and the only language before 2.1.0); each text
// stays within textLimits, which src/runtime.test.ts checks for all languages.
export const translations: Record<LanguageCode, BannerTexts> = {
  cs: {
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
    embedMessage: "Tento obsah poskytuje třetí strana. Zobrazí se po souhlasu s cookies: {category}.",
    embedButton: "Povolit a zobrazit",
    gpcNotice: "Váš prohlížeč odesílá signál Global Privacy Control, proto marketingové cookies nenabízíme a nepoužíváme.",
    close: "Zavřít",
  },
  sk: {
    title: "Používame cookies",
    description:
      "Nevyhnutné cookies potrebujeme, aby web fungoval. Ostatné použijeme, len keď s nimi súhlasíte. Svoju voľbu môžete kedykoľvek zmeniť.",
    acceptAll: "Prijať všetko",
    rejectAll: "Odmietnuť všetko",
    settings: "Nastavenia",
    save: "Uložiť výber",
    privacyLabel: "Zásady ochrany osobných údajov",
    preferencesTitle: "Nastavenia cookies",
    preferencesDescription:
      "Vyberte, ktoré cookies môžeme používať. Nevyhnutné sú zapnuté vždy, bez nich web nefunguje. Súhlas môžete kedykoľvek zmeniť alebo odvolať.",
    necessaryTitle: "Nevyhnutné",
    necessaryDescription: "Zabezpečujú základné funkcie webu a zapamätajú si vašu voľbu cookies. Nedajú sa vypnúť.",
    preferencesCategoryTitle: "Funkčné",
    preferencesCategoryDescription: "Pamätajú si vaše nastavenia, napríklad jazyk alebo región.",
    analyticsTitle: "Analytické",
    analyticsDescription: "Merajú návštevnosť a ukazujú, ako ľudia web používajú, aby sme ho mohli zlepšovať.",
    marketingTitle: "Marketingové",
    marketingDescription: "Merajú a cielia reklamu, aj na iných weboch a sociálnych sieťach.",
    embedMessage: "Tento obsah poskytuje tretia strana. Zobrazí sa po súhlase s cookies: {category}.",
    embedButton: "Povoliť a zobraziť",
    gpcNotice: "Váš prehliadač odosiela signál Global Privacy Control, preto marketingové cookies neponúkame ani nepoužívame.",
    close: "Zavrieť",
  },
  en: {
    title: "We use cookies",
    description:
      "Necessary cookies keep our site working. We only use other cookies with your consent. You can change your choice anytime.",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    settings: "Customize",
    save: "Save choices",
    privacyLabel: "Privacy Policy",
    preferencesTitle: "Cookie settings",
    preferencesDescription:
      "Choose which cookies you allow. Essential cookies cannot be turned off. You can change or revoke consent anytime.",
    necessaryTitle: "Essential",
    necessaryDescription: "Required for core functionality and saving your consent choices. Always active.",
    preferencesCategoryTitle: "Preferences",
    preferencesCategoryDescription: "Remember settings such as preferred language and region.",
    analyticsTitle: "Analytics",
    analyticsDescription: "Help us understand site usage and visitor interactions to improve performance.",
    marketingTitle: "Marketing",
    marketingDescription: "Used for relevant advertising and marketing campaigns across websites.",
    embedMessage: "This content is provided by a third party. It is shown after you consent to cookies: {category}.",
    embedButton: "Allow and show",
    gpcNotice: "Your browser sends the Global Privacy Control signal, so we do not offer or use marketing cookies.",
    close: "Close",
  },
  de: {
    title: "Wir verwenden Cookies",
    description:
      "Notwendige Cookies brauchen wir, damit die Website funktioniert. Andere Cookies setzen wir nur mit Ihrer Einwilligung ein. Sie können Ihre Wahl jederzeit ändern.",
    acceptAll: "Alle akzeptieren",
    rejectAll: "Alle ablehnen",
    settings: "Einstellungen",
    save: "Auswahl speichern",
    privacyLabel: "Datenschutzerklärung",
    preferencesTitle: "Cookie-Einstellungen",
    preferencesDescription:
      "Wählen Sie, welche Cookies wir verwenden dürfen. Notwendige Cookies sind immer aktiv, ohne sie funktioniert die Website nicht. Ihre Einwilligung können Sie jederzeit ändern oder widerrufen.",
    necessaryTitle: "Notwendig",
    necessaryDescription: "Sie sorgen für die Grundfunktionen der Website und speichern Ihre Cookie-Auswahl. Sie lassen sich nicht abschalten.",
    preferencesCategoryTitle: "Funktional",
    preferencesCategoryDescription: "Merken sich Ihre Einstellungen, zum Beispiel Sprache oder Region.",
    analyticsTitle: "Analyse",
    analyticsDescription: "Messen die Besucherzahlen und zeigen, wie die Website genutzt wird, damit wir sie verbessern können.",
    marketingTitle: "Marketing",
    marketingDescription: "Messen und steuern Werbung, auch auf anderen Websites und in sozialen Netzwerken.",
    embedMessage: "Dieser Inhalt stammt von einem Drittanbieter. Er wird nach Ihrer Einwilligung in Cookies angezeigt: {category}.",
    embedButton: "Zulassen und anzeigen",
    gpcNotice: "Ihr Browser sendet das Signal Global Privacy Control, deshalb bieten wir keine Marketing-Cookies an und setzen sie nicht ein.",
    close: "Schließen",
  },
  pl: {
    title: "Używamy plików cookies",
    description:
      "Niezbędne pliki cookies są potrzebne, aby strona działała. Pozostałych użyjemy tylko za Twoją zgodą. Swój wybór możesz w każdej chwili zmienić.",
    acceptAll: "Zaakceptuj wszystkie",
    rejectAll: "Odrzuć wszystkie",
    settings: "Ustawienia",
    save: "Zapisz wybór",
    privacyLabel: "Polityka prywatności",
    preferencesTitle: "Ustawienia cookies",
    preferencesDescription:
      "Wybierz, których plików cookies możemy używać. Niezbędne są zawsze włączone, bez nich strona nie działa. Zgodę możesz w każdej chwili zmienić lub wycofać.",
    necessaryTitle: "Niezbędne",
    necessaryDescription: "Zapewniają podstawowe funkcje strony i zapamiętują Twój wybór dotyczący cookies. Nie można ich wyłączyć.",
    preferencesCategoryTitle: "Funkcjonalne",
    preferencesCategoryDescription: "Zapamiętują Twoje ustawienia, na przykład język lub region.",
    analyticsTitle: "Analityczne",
    analyticsDescription: "Mierzą ruch i pokazują, jak ludzie korzystają ze strony, abyśmy mogli ją ulepszać.",
    marketingTitle: "Marketingowe",
    marketingDescription: "Mierzą i kierują reklamy, także na innych stronach i w mediach społecznościowych.",
    embedMessage: "Ta treść pochodzi od podmiotu trzeciego. Wyświetli się po zgodzie na cookies: {category}.",
    embedButton: "Zezwól i pokaż",
    gpcNotice: "Twoja przeglądarka wysyła sygnał Global Privacy Control, dlatego nie oferujemy ani nie używamy marketingowych cookies.",
    close: "Zamknij",
  },
};

// The Czech texts: the default, and the only ones before 2.1.0.
export const defaultTexts: BannerTexts = translations.cs;

// "auto" follows <html lang>: a supported language is used, any other page gets English rather than Czech.
export function resolveLanguage(setting: LanguageSetting, htmlLang: string): LanguageCode {
  if (setting !== "auto") return setting;
  const primary = htmlLang.trim().toLowerCase().split(/[-_]/)[0] ?? "";
  return (languages as readonly string[]).includes(primary) ? (primary as LanguageCode) : "en";
}

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
  embedMessage: 240,
  embedButton: 40,
  gpcNotice: 300,
  close: 40,
};

export const defaultConfig: BannerConfig = {
  accent: "#1f2937",
  categories: ["analytics", "marketing"],
  texts: defaultTexts,
  privacyUrl: "",
  consentMode: true,
  credit: false,
  revision: 0,
  language: "cs",
  respectGpc: true,
  textOverrides: {},
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
// written to the browser console by the banner). `htmlLang` is the page's <html lang>, read only when the
// language is "auto".
export function normalizeConfig(raw: unknown, htmlLang = ""): { config: BannerConfig; problems: string[] } {
  const problems: string[] = [];
  if (!isRecord(raw)) {
    return {
      config: { ...defaultConfig, texts: { ...defaultTexts }, categories: [...defaultConfig.categories], textOverrides: {} },
      problems: ["Nastavení chybí nebo není platný JSON, lišta použije výchozí."],
    };
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

  const isLanguage = (v: unknown): v is LanguageSetting => typeof v === "string" && (v === "auto" || (languages as readonly string[]).includes(v));
  const language = pick("language", isLanguage, defaultConfig.language, "Jazyk");
  const baseTexts = translations[resolveLanguage(language, htmlLang)];
  const texts: BannerTexts = { ...baseTexts };
  const textOverrides: Partial<BannerTexts> = {};
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
      if (clean !== baseTexts[key]) textOverrides[key] = clean;
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
      language,
      respectGpc: pick("respectGpc", isBool, defaultConfig.respectGpc, "Global Privacy Control"),
      textOverrides,
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

// What the browser tells the banner besides the configuration.
export interface Environment {
  // The browser sends Global Privacy Control (navigator.globalPrivacyControl).
  gpc: boolean;
  // The language the texts were resolved to (the code the library gets); from the configuration when left out.
  lang?: LanguageCode;
}

// The categories the banner offers: the configured ones, minus marketing when the owner honours Global Privacy
// Control and the browser sends it (GPC is an opt-out of sale and sharing of data for advertising). A category
// that is not offered can never be accepted, so its scripts and embeds stay blocked and Consent Mode keeps its
// types denied.
export function offeredCategories(config: Pick<BannerConfig, "categories" | "respectGpc">, env: Environment): OptionalCategory[] {
  return config.categories.filter((category) => !(category === "marketing" && config.respectGpc && env.gpc));
}

// What the banner hands vanilla-cookieconsent. Fixed, not configurable, because the law asks for it
// (§ 89 odst. 3 zákona č. 127/2005 Sb., GDPR, ÚOOÚ guidance): opt-in, nothing optional enabled in advance,
// "Odmítnout vše" next to "Přijmout vše" in the first layer and styled the same, no cookie wall, scripts
// managed by category, refused categories' cookies deleted.
export function vendorConfig(config: BannerConfig, callbacks: Callbacks, env: Environment = { gpc: false }): Record<string, unknown> {
  const t = config.texts;
  const e = (key: TextKey) => escapeHtml(t[key]);
  const privacyLink = config.privacyUrl ? `<a href="${escapeHtml(config.privacyUrl)}">${e("privacyLabel")}</a>` : "";
  const credit = config.credit
    ? `<span class="plain-consent-credit">Vytvořeno <a href="${creditUrl}" target="_blank" rel="nofollow noopener">Socionet</a></span>`
    : "";
  const offered = offeredCategories(config, env);
  const categories: Record<string, unknown> = { necessary: { enabled: true, readOnly: true } };
  for (const category of offered) {
    const cookies = autoClearCookies[category].map((name) => ({ name }));
    categories[category] = { enabled: false, readOnly: false, ...(cookies.length > 0 && { autoClear: { cookies } }) };
  }
  const sections: Record<string, unknown>[] = [
    { description: e("preferencesDescription") },
    { title: e("necessaryTitle"), description: e("necessaryDescription"), linkedCategory: "necessary" },
    ...offered.map((category) => {
      const [title, description] = categoryTexts[category];
      return { title: e(title), description: e(description), linkedCategory: category };
    }),
  ];
  // A category withheld because of Global Privacy Control is explained instead of silently missing.
  if (config.categories.some((category) => !offered.includes(category))) {
    sections.push({ title: e("marketingTitle"), description: e("gpcNotice") });
  }
  if (privacyLink) sections.push({ description: privacyLink });
  const lang = env.lang ?? resolveLanguage(config.language, "");
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
      default: lang,
      translations: {
        [lang]: {
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
            closeIconLabel: e("close"),
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
  acceptCategory: (categories: string[]) => void;
  hide: () => void;
}

// ---- Embeds ----

// An iframe that loads content from another site is tagged like a script and given its address in data-src,
// never in src (a src would load before any consent):
//   <iframe data-category="marketing" data-src="https://www.youtube-nocookie.com/embed/ID" data-title="Video" width="560" height="315"></iframe>
// Until the category is accepted the iframe stays empty and hidden and a placeholder with the reason and an
// "allow" button stands in its place. Withdrawing consent unloads the iframe and brings the placeholder back.
export const embedSelector = "iframe[data-category][data-src]";
const embedBlockedClass = "plain-consent-blocked";

// The size a placeholder takes from the iframe's width and height attributes (plain pixel numbers), so the page
// does not jump when the content loads; null for anything else (percentages, missing).
export function embedSize(width: string | null, height: string | null): { width: number; height: number } | null {
  const number = (value: string | null) => (value !== null && /^\d{1,4}$/.test(value.trim()) ? Number(value) : 0);
  const [w, h] = [number(width), number(height)];
  return w > 0 && h > 0 ? { width: w, height: h } : null;
}

export interface EmbedHost {
  texts: BannerTexts;
  // The categories that can be accepted, and the configured ones withheld by Global Privacy Control.
  offered: readonly OptionalCategory[];
  withheld: readonly OptionalCategory[];
  allow: (category: OptionalCategory) => void;
  openSettings: () => void;
  warn: (message: string) => void;
}

export interface Embeds {
  // Finds and manages the tagged iframes in `root` (the document, or a subtree that was added).
  scan: (root: ParentNode) => void;
  // The categories accepted now: loads the iframes whose category is accepted and blocks the others.
  refresh: (accepted: readonly string[]) => void;
}

export function createEmbeds(doc: Document, host: EmbedHost): Embeds {
  const frames = new Map<HTMLIFrameElement, { placeholder: HTMLElement | null; loaded: boolean }>();
  let accepted: readonly string[] = [];

  const placeholderFor = (frame: HTMLIFrameElement, category: OptionalCategory, withheld: boolean): HTMLElement => {
    const box = doc.createElement("div");
    box.className = "plain-consent-embed";
    box.setAttribute("role", "group");
    const title = frame.getAttribute("data-title");
    const label = cleanText(title ?? "", 80);
    if (label) {
      box.setAttribute("aria-label", label);
      const heading = doc.createElement("strong");
      heading.className = "plain-consent-embed-title";
      heading.textContent = label;
      box.appendChild(heading);
    }
    const message = doc.createElement("p");
    message.textContent = withheld ? host.texts.gpcNotice : host.texts.embedMessage.replace("{category}", host.texts[categoryTexts[category][0]]);
    box.appendChild(message);
    if (!withheld) {
      const actions = doc.createElement("div");
      actions.className = "plain-consent-embed-actions";
      const allow = doc.createElement("button");
      allow.type = "button";
      allow.className = "plain-consent-embed-allow";
      allow.textContent = host.texts.embedButton;
      allow.addEventListener("click", () => {
        host.allow(category);
        // The button is gone; keyboard focus goes to the content it asked for, not to the top of the page.
        if (frame.isConnected && !frame.hidden) frame.focus();
      });
      const settings = doc.createElement("button");
      settings.type = "button";
      settings.className = "plain-consent-embed-settings";
      settings.textContent = host.texts.settings;
      settings.addEventListener("click", host.openSettings);
      actions.append(allow, settings);
      box.appendChild(actions);
    }
    const size = embedSize(frame.getAttribute("width"), frame.getAttribute("height"));
    if (size) {
      // CSSOM, not a style attribute: allowed under a Content-Security-Policy without 'unsafe-inline'.
      box.style.setProperty("aspect-ratio", `${size.width} / ${size.height}`);
      box.style.setProperty("max-width", `${size.width}px`);
      // On a narrow screen the ratio would leave less room than the text and buttons need: grow with them.
      box.style.setProperty("min-height", "auto");
    }
    return box;
  };

  const block = (frame: HTMLIFrameElement, state: { placeholder: HTMLElement | null; loaded: boolean }, category: string) => {
    if (state.loaded || frame.getAttribute("src")) frame.setAttribute("src", "about:blank");
    state.loaded = false;
    frame.classList.add(embedBlockedClass);
    frame.setAttribute("hidden", "");
    const offered = (host.offered as readonly string[]).includes(category);
    const withheld = (host.withheld as readonly string[]).includes(category);
    // No placeholder for an embed that could never load (no valid address): an "allow" button would do nothing.
    if (!state.placeholder && (offered || withheld) && safeUrl(frame.getAttribute("data-src") ?? "") !== "") {
      state.placeholder = placeholderFor(frame, category as OptionalCategory, withheld);
      frame.parentNode?.insertBefore(state.placeholder, frame);
    }
  };

  const load = (frame: HTMLIFrameElement, state: { placeholder: HTMLElement | null; loaded: boolean }) => {
    const src = safeUrl(frame.getAttribute("data-src") ?? "");
    if (src === "") return;
    if (state.placeholder) {
      state.placeholder.remove();
      state.placeholder = null;
    }
    if (!frame.hasAttribute("title")) {
      const title = cleanText(frame.getAttribute("data-title") ?? "", 80);
      if (title) frame.setAttribute("title", title);
    }
    frame.classList.remove(embedBlockedClass);
    frame.removeAttribute("hidden");
    frame.setAttribute("src", src);
    state.loaded = true;
  };

  const apply = (frame: HTMLIFrameElement, state: { placeholder: HTMLElement | null; loaded: boolean }) => {
    const category = frame.getAttribute("data-category") ?? "";
    if (accepted.includes(category) && (host.offered as readonly string[]).includes(category) && safeUrl(frame.getAttribute("data-src") ?? "") !== "") {
      if (!state.loaded) load(frame, state);
    } else {
      block(frame, state, category);
    }
  };

  return {
    scan(root) {
      const found = Array.from(root.querySelectorAll<HTMLIFrameElement>(embedSelector));
      if ("matches" in root && (root as Element).matches(embedSelector)) found.unshift(root as HTMLIFrameElement);
      for (const frame of found) {
        if (frames.has(frame)) continue;
        const category = frame.getAttribute("data-category") ?? "";
        if (![...host.offered, ...host.withheld].includes(category as OptionalCategory)) {
          host.warn(`an embed has data-category="${category}", which is not one of the categories in the configuration, so it stays blocked.`);
        }
        if (safeUrl(frame.getAttribute("data-src") ?? "") === "") {
          host.warn("data-src of an embed is not an http(s) address or a path starting with /, the embed stays blocked.");
        }
        // A src would have loaded the content before any consent; it is replaced and reported.
        if (frame.hasAttribute("src") && frame.getAttribute("src") !== "about:blank") {
          host.warn("an embed has a src attribute and may load before consent: use data-src only.");
        }
        const state = { placeholder: null as HTMLElement | null, loaded: false };
        frames.set(frame, state);
        apply(frame, state);
      }
    },
    refresh(next) {
      accepted = next;
      for (const [frame, state] of frames) {
        if (!frame.isConnected) {
          state.placeholder?.remove();
          frames.delete(frame);
          continue;
        }
        apply(frame, state);
      }
    },
  };
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
export function start(
  win: Window & Partial<Pick<typeof globalThis, "CustomEvent" | "MutationObserver">> & { dataLayer?: unknown[]; console?: Console },
  doc: Document,
  cc: VendorApi,
): void {
  const element = doc.getElementById(configElementId);
  let raw: unknown;
  try {
    raw = element ? JSON.parse(element.textContent ?? "") : undefined;
  } catch {
    raw = undefined;
  }
  const htmlLang = doc.documentElement.lang ?? "";
  const { config, problems } = normalizeConfig(raw, htmlLang);
  for (const problem of problems) win.console?.warn(`Plain Consent: ${problem}`);
  const gpc = (win.navigator as (Navigator & { globalPrivacyControl?: boolean }) | undefined)?.globalPrivacyControl === true;
  const env: Environment = { gpc, lang: resolveLanguage(config.language, htmlLang) };
  const offered = offeredCategories(config, env);
  const withheld = config.categories.filter((category) => !offered.includes(category));
  // What counts as accepted: only a category the banner offers, whatever an older choice in the cookie says.
  const effective = (accepted: readonly string[]) => accepted.filter((category) => category === "necessary" || (offered as readonly string[]).includes(category));

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
    if (stored) update(effective(stored));
  }

  const root = doc.documentElement;
  for (const [name, value] of Object.entries(themeVariables(config))) root.style.setProperty(name, value);

  const warn = (message: string) => win.console?.warn(`Plain Consent: ${message}`);
  const embeds = createEmbeds(doc, {
    texts: config.texts,
    offered,
    withheld,
    // An explicit choice, recorded like any other: the banner has nothing left to ask, the settings button stays.
    allow: (category) => {
      cc.acceptCategory([...new Set([...cc.getUserPreferences().acceptedCategories, category])]);
      cc.hide();
    },
    openSettings: () => cc.showPreferences(),
    warn,
  });
  // The library calls onConsent on the first choice and on every later page with a valid choice, so the round
  // settings button appears only once there is a choice to change (before it, the banner itself is open).
  let button: HTMLButtonElement | undefined;
  let lastEvent = "";
  const sync = () => {
    const accepted = effective(cc.getUserPreferences().acceptedCategories);
    update(accepted);
    embeds.refresh(accepted);
    if (!button && doc.body) {
      button = settingsButton(doc, config.texts.preferencesTitle, () => cc.showPreferences());
      doc.body.appendChild(button);
    }
    // The page's own code can listen: document.addEventListener("plain-consent:update", (e) => e.detail.categories).
    const key = JSON.stringify(accepted);
    if (key !== lastEvent && typeof win.CustomEvent === "function") {
      lastEvent = key;
      doc.dispatchEvent(new win.CustomEvent("plain-consent:update", { detail: { categories: accepted } }));
    }
  };
  const go = () => {
    // Embeds are blocked before the banner is even built, and also the ones the page adds later.
    const stored = storedCategories(doc.cookie, config.revision);
    embeds.refresh(stored ? effective(stored) : []);
    embeds.scan(doc);
    if (typeof win.MutationObserver === "function") {
      new win.MutationObserver((records: MutationRecord[]) => {
        for (const record of records) for (const node of Array.from(record.addedNodes)) if (node.nodeType === 1) embeds.scan(node as Element);
      }).observe(root, { childList: true, subtree: true });
    }
    cc.run(vendorConfig(config, { onConsent: sync, onChange: sync }, env));
  };
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", go, { once: true });
  else go();
}
