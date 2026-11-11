import assert from "node:assert/strict";
import { test } from "node:test";
import {
  configElementId,
  consentState,
  contrast,
  defaultConfig,
  defaultTexts,
  embedSize,
  escapeHtml,
  flatText,
  languages,
  normalizeConfig,
  offeredCategories,
  safeUrl,
  start,
  storedCategories,
  textLimits,
  themeVariables,
  translations,
  vendorConfig,
  type VendorApi,
} from "./runtime.ts";

const noop = { onConsent: () => {}, onChange: () => {} };
type Translation = { consentModal: Record<string, string>; preferencesModal: Record<string, unknown> & { sections: Record<string, string>[] } };
const translation = (cfg: Record<string, unknown>) => (cfg["language"] as { translations: { cs: Translation } }).translations.cs;

test("a missing or broken configuration falls back to the defaults and says so", () => {
  for (const raw of [undefined, null, "text", 42, []]) {
    const { config, problems } = normalizeConfig(raw);
    assert.deepEqual(config, defaultConfig);
    assert.equal(problems.length, 1);
  }
});

test("wrong values fall back one by one, unknown keys and categories are dropped", () => {
  const { config, problems } = normalizeConfig({
    layout: "bar",
    theme: "dark",
    settingsButton: false,
    accent: "red",
    categories: ["analytics", "tracking", "marketing", "analytics"],
    consentMode: "yes",
    credit: true,
    revision: -1,
    extra: "<script>",
  });
  assert.equal(config.accent, defaultConfig.accent);
  assert.deepEqual(config.categories, ["analytics", "marketing"]);
  assert.equal(config.consentMode, true);
  assert.equal(config.credit, true);
  assert.equal(config.revision, 0);
  assert.equal(problems.length, 4);
  for (const dropped of ["extra", "layout", "theme", "settingsButton"]) assert.ok(!(dropped in config), dropped);
});

test("the Socionet credit and the categories are off unless asked for", () => {
  const { config } = normalizeConfig({});
  assert.equal(config.credit, false);
  assert.deepEqual(normalizeConfig({ categories: [] }).config.categories, []);
});

test("colours must be #rrggbb and are lowercased", () => {
  assert.equal(normalizeConfig({ accent: "#ABCDEF" }).config.accent, "#abcdef");
  for (const bad of ["#abc", "abcdef", "#abcdeg", "#abcdef;background:url(x)", "rgb(0,0,0)", "var(--x)"]) {
    assert.equal(normalizeConfig({ accent: bad }).config.accent, defaultConfig.accent, bad);
  }
});

test("only http(s) URLs and same-site paths pass as the policy link", () => {
  assert.equal(safeUrl("https://example.cz/zasady"), "https://example.cz/zasady");
  assert.equal(safeUrl(" http://example.cz/a?b=1#c "), "http://example.cz/a?b=1#c");
  assert.equal(safeUrl("/ochrana-osobnich-udaju/"), "/ochrana-osobnich-udaju/");
  for (const bad of [
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "data:text/html,x",
    "//evil.example/",
    "/..//evil.example/x",
    "/.//evil.example",
    "/%2e%2e//evil.example",
    "/a/../..//evil.example",
    "/\\evil.example",
    "https://user:pw@example.cz/",
    'https://example.cz/" onmouseover="x',
    "https://localhost/",
    "ftp://example.cz/",
    "zasady.html",
  ]) {
    assert.equal(safeUrl(bad), "", bad);
  }
  assert.equal(normalizeConfig({ privacyUrl: "javascript:alert(1)" }).config.privacyUrl, "");
  assert.equal(normalizeConfig({ privacyUrl: "javascript:alert(1)" }).problems.length, 1);
  assert.equal(normalizeConfig({ privacyUrl: "" }).problems.length, 0);
});

test("texts become one plain line within their limit, an empty text keeps the default", () => {
  const { config, problems } = normalizeConfig({
    texts: { title: "  Ahoj\n\tsvěte\u2028 ", acceptAll: "", description: "slovo ".repeat(200), unknown: "x", save: 5 },
  });
  assert.equal(config.texts.title, "Ahoj světe");
  assert.equal(config.texts.acceptAll, defaultTexts.acceptAll);
  assert.ok(config.texts.description.length <= 600);
  assert.ok(config.texts.description.endsWith("slovo"));
  assert.equal(config.texts.save, defaultTexts.save);
  assert.equal(problems.length, 2);
});

test("every text reaches the library HTML-escaped, links are built only from checked URLs", () => {
  const evil = `<img src=x onerror=alert(1)>"'&`;
  const { config } = normalizeConfig({
    categories: ["analytics"],
    privacyUrl: "/zasady/?a=1&b=2",
    texts: Object.fromEntries(Object.keys(defaultTexts).map((key) => [key, evil])),
  });
  const cfg = vendorConfig(config, noop);
  const t = translation(cfg);
  const escaped = escapeHtml(evil);
  assert.equal(escaped, "&lt;img src=x onerror=alert(1)&gt;&quot;&#39;&amp;");
  assert.equal(t.consentModal["title"], escaped);
  assert.equal(t.consentModal["description"], escaped);
  assert.equal(t.consentModal["acceptAllBtn"], escaped);
  assert.equal(t.consentModal["footer"], `<a href="/zasady/?a=1&amp;b=2">${escaped}</a>`);
  const all = JSON.stringify(t);
  assert.ok(!all.includes("<img"), "no raw markup from the configuration");
  assert.ok(!/<(?!a href="\/zasady\/|\/a>)/.test(all.replace(/\\"/g, '"')), "the only tag is the checked policy link");
});

test("the library gets opt-in, equal buttons, nothing pre-ticked and no cookie wall", () => {
  const { config } = normalizeConfig({ categories: ["preferences", "analytics", "marketing"], layout: "bar" });
  const cfg = vendorConfig(config, noop) as Record<string, any>;
  assert.equal(cfg["mode"], "opt-in");
  assert.equal(cfg["disablePageInteraction"], false);
  assert.equal(cfg["manageScriptTags"], true);
  assert.equal(cfg["autoClearCookies"], true);
  assert.equal(cfg["guiOptions"].consentModal.equalWeightButtons, true);
  assert.equal(cfg["guiOptions"].preferencesModal.equalWeightButtons, true);
  assert.equal(cfg["guiOptions"].consentModal.layout, "box", "a layout key in the snippet changes nothing");
  assert.equal(cfg["guiOptions"].consentModal.position, "bottom left");
  assert.deepEqual(cfg["categories"].necessary, { enabled: true, readOnly: true });
  for (const category of ["preferences", "analytics", "marketing"]) {
    assert.equal(cfg["categories"][category].enabled, false, category);
    assert.equal(cfg["categories"][category].readOnly, false, category);
  }
  const t = translation(cfg);
  // "Odmítnout vše" sits in the first layer next to "Přijmout vše".
  assert.equal(t.consentModal["acceptNecessaryBtn"], defaultTexts.rejectAll);
  assert.equal(t.consentModal["acceptAllBtn"], defaultTexts.acceptAll);
  assert.deepEqual(
    t.preferencesModal.sections.map((s) => s["linkedCategory"]).filter(Boolean),
    ["necessary", "preferences", "analytics", "marketing"],
  );
  // No translation URL, so the library never fetches anything.
  assert.equal(typeof (cfg["language"] as { translations: { cs: unknown } }).translations.cs, "object");
});

test("the credit is a nofollow brand link only when switched on", () => {
  const off = translation(vendorConfig(normalizeConfig({}).config, noop)).consentModal["footer"];
  assert.ok(!off?.includes("Socionet"));
  const on = translation(vendorConfig(normalizeConfig({ credit: true }).config, noop)).consentModal["footer"];
  assert.match(on ?? "", /Vytvořeno <a href="https:\/\/socionet\.cz\/nastroje\/cookie-lista\/" target="_blank" rel="nofollow noopener">Socionet<\/a>/);
});

test("Consent Mode: each category grants only its own types", () => {
  assert.deepEqual(consentState([]), {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
  });
  const analytics = consentState(["necessary", "analytics"]);
  assert.equal(analytics.analytics_storage, "granted");
  assert.equal(analytics.ad_storage, "denied");
  assert.equal(analytics.ad_user_data, "denied");
  const marketing = consentState(["marketing"]);
  assert.equal(marketing.ad_storage, "granted");
  assert.equal(marketing.ad_user_data, "granted");
  assert.equal(marketing.ad_personalization, "granted");
  assert.equal(marketing.analytics_storage, "denied");
  assert.equal(consentState(["preferences"]).functionality_storage, "granted");
});

const cookieOf = (value: Record<string, unknown>) => `other=1; cc_cookie=${encodeURIComponent(JSON.stringify(value))}; x=y`;
const valid = { consentId: "a-b-c", consentTimestamp: "2026-11-01T00:00:00Z", lastConsentTimestamp: "2026-11-01T00:00:00Z", categories: ["necessary", "analytics"], revision: 0 };

test("a stored choice counts only when the library would accept it", () => {
  assert.deepEqual(storedCategories(cookieOf(valid), 0), ["necessary", "analytics"]);
  assert.equal(storedCategories("", 0), null);
  assert.equal(storedCategories("cc_cookie=%7Bbroken", 0), null);
  assert.equal(storedCategories(cookieOf({ ...valid, revision: 1 }), 0), null);
  assert.deepEqual(storedCategories(cookieOf({ ...valid, revision: 2 }), 2), ["necessary", "analytics"]);
  for (const missing of ["consentId", "consentTimestamp", "lastConsentTimestamp", "categories"]) {
    const rest: Record<string, unknown> = { ...valid };
    delete rest[missing];
    assert.equal(storedCategories(cookieOf(rest), 0), null, missing);
  }
  assert.equal(storedCategories(`xcc_cookie=${encodeURIComponent(JSON.stringify(valid))}`, 0), null);
});

test("button text always reads on the accent, links take the accent only when it reads", () => {
  for (const accent of ["#000000", "#ffffff", "#ffd400", "#d4381e", "#777777", "#1f2937"]) {
    const vars = themeVariables({ accent });
    assert.ok(contrast(accent, vars["--cc-btn-primary-color"] ?? "") >= 4.5, accent);
    assert.ok(contrast(vars["--cc-link-color"] ?? "", "#ffffff") >= 4.5, `link ${accent}`);
  }
});

// A minimal stand-in for the page the published file runs on.
function fakePage(json: string | null, cookie = "", readyState = "loading", options: { lang?: string; gpc?: boolean } = {}) {
  const props = new Map<string, string>();
  const classes = new Set<string>();
  const listeners: Record<string, (event?: unknown) => void> = {};
  const appended: unknown[] = [];
  const events: { type: string; detail: unknown }[] = [];
  const doc = {
    readyState,
    cookie,
    getElementById: (id: string) => (id === configElementId && json !== null ? { textContent: json } : null),
    documentElement: { lang: options.lang ?? "", style: { setProperty: (n: string, v: string) => props.set(n, v) }, classList: { add: (c: string) => classes.add(c) } },
    addEventListener: (type: string, fn: () => void) => (listeners[type] = fn),
    dispatchEvent: (event: { type: string; detail: unknown }) => events.push(event),
    querySelectorAll: () => [],
    body: { appendChild: (el: unknown) => appended.push(el) },
    createElement: () => ({ setAttribute() {}, appendChild() {}, addEventListener() {} }),
    createElementNS: () => ({ setAttribute() {}, appendChild() {} }),
  };
  const warnings: string[] = [];
  const win = {
    console: { warn: (m: string) => warnings.push(m) },
    navigator: { globalPrivacyControl: options.gpc },
    CustomEvent: class {
      type: string;
      detail: unknown;
      constructor(type: string, init: { detail: unknown }) {
        this.type = type;
        this.detail = init.detail;
      }
    },
  } as unknown as Parameters<typeof start>[0];
  const runs: Record<string, unknown>[] = [];
  let accepted: string[] = [];
  const cc: VendorApi = {
    run: (c) => runs.push(c),
    showPreferences: () => {},
    getUserPreferences: () => ({ acceptedCategories: accepted }),
    acceptCategory: (c) => (accepted = c),
    hide: () => {},
  };
  start(win, doc as unknown as Document, cc);
  const layer = () => (win.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>));
  return { win, layer, props, classes, listeners, runs, appended, warnings, events, accept: (c: string[]) => (accepted = c) };
}

test("the Consent Mode default is in the dataLayer before the page goes on, as Arguments", () => {
  const page = fakePage(JSON.stringify({ consentMode: true }));
  const entries = page.win.dataLayer ?? [];
  assert.equal(Object.prototype.toString.call(entries[0]), "[object Arguments]");
  assert.deepEqual(page.layer(), [
    ["consent", "default", { ...consentState([]), wait_for_update: 500 }],
    ["set", "ads_data_redaction", true],
  ]);
  // The banner waits for the DOM.
  assert.equal(page.runs.length, 0);
  page.listeners["DOMContentLoaded"]?.();
  assert.equal(page.runs.length, 1);
});

test("an earlier choice updates Consent Mode at once, and every later choice again", () => {
  const page = fakePage(JSON.stringify({ revision: 0 }), cookieOf(valid), "complete");
  assert.deepEqual(page.layer()[2], ["consent", "update", consentState(["necessary", "analytics"])]);
  const callbacks = page.runs[0] as { onChange: () => void; onConsent: () => void };
  page.accept(["necessary", "analytics"]);
  callbacks.onConsent();
  assert.equal(page.layer().length, 3, "the same state is not sent twice");
  page.accept(["necessary"]);
  callbacks.onChange();
  assert.deepEqual(page.layer()[3], ["consent", "update", consentState(["necessary"])]);
  assert.equal(page.appended.length, 1, "the settings button appears once there is a choice");
});

test("the settings button cannot be switched off: an old settingsButton key is ignored and the button appears with the choice", () => {
  const page = fakePage(JSON.stringify({ settingsButton: false }), cookieOf(valid), "complete");
  assert.equal(page.appended.length, 0, "no choice yet seen by the library, no button");
  (page.runs[0] as { onConsent: () => void }).onConsent();
  assert.equal(page.appended.length, 1);
});

test("without Consent Mode nothing is written to the dataLayer; colours still apply and a dark theme key changes nothing", () => {
  const page = fakePage(JSON.stringify({ consentMode: false, theme: "dark", accent: "#ffd400" }), cookieOf(valid), "complete");
  assert.deepEqual(page.layer(), []);
  assert.equal(page.props.get("--cc-btn-primary-bg"), "#ffd400");
  assert.equal(page.props.get("--cc-btn-primary-color"), "#000000");
  assert.ok(!page.classes.has("cc--darkmode"));
});

test("a broken snippet still asks with the defaults and warns in the console", () => {
  const page = fakePage("{not json", "", "complete");
  assert.equal(page.runs.length, 1);
  assert.equal(page.warnings.length, 1);
  assert.equal(page.layer()[0]?.[1], "default");
});

test("every language has every text within its limit, and Czech stays the default", () => {
  assert.deepEqual([...languages].sort(), Object.keys(translations).sort());
  for (const code of languages) {
    for (const key of Object.keys(textLimits) as (keyof typeof textLimits)[]) {
      const text = translations[code][key];
      assert.ok(text.length > 0 && text.length <= textLimits[key], `${code} ${key}`);
      assert.equal(text, flatText(text), `${code} ${key} is one clean line`);
    }
    assert.ok(translations[code].embedMessage.includes("{category}"), `${code} embedMessage names the category`);
    for (const key of ["necessaryTitle", "preferencesCategoryTitle", "analyticsTitle", "marketingTitle"] as const) {
      assert.ok(!/[&<>"']/.test(translations[code][key]), `${code} ${key} has no character a screen reader would read as code`);
    }
  }
  assert.equal(normalizeConfig({}).config.language, "cs");
  assert.deepEqual(normalizeConfig({}).config.texts, defaultTexts);
});

test("language: a fixed code picks the texts, auto follows <html lang> and falls back to English, owner texts win", () => {
  assert.equal(normalizeConfig({ language: "de" }).config.texts.acceptAll, translations.de.acceptAll);
  assert.equal(normalizeConfig({ language: "auto" }, "sk-SK").config.texts.acceptAll, translations.sk.acceptAll);
  assert.equal(normalizeConfig({ language: "auto" }, "PL").config.texts.acceptAll, translations.pl.acceptAll);
  assert.equal(normalizeConfig({ language: "auto" }, "fr").config.texts.acceptAll, translations.en.acceptAll);
  assert.equal(normalizeConfig({ language: "auto" }, "").config.texts.acceptAll, translations.en.acceptAll);
  const custom = normalizeConfig({ language: "en", texts: { title: "Hello", acceptAll: translations.en.acceptAll } });
  assert.equal(custom.config.texts.title, "Hello");
  assert.deepEqual(custom.config.textOverrides, { title: "Hello" });
  const wrong = normalizeConfig({ language: "fr" });
  assert.equal(wrong.config.language, "cs");
  assert.equal(wrong.problems.length, 1);
  const cfg = vendorConfig(normalizeConfig({ language: "en" }).config, noop);
  assert.equal((cfg["language"] as { default: string }).default, "en");
  assert.equal((cfg["language"] as { translations: Record<string, Translation> }).translations["en"]?.consentModal["acceptAllBtn"], translations.en.acceptAll);
});

test("Global Privacy Control: marketing is not offered, never granted and explained; the owner can switch it off", () => {
  const config = normalizeConfig({ categories: ["preferences", "analytics", "marketing"] }).config;
  assert.deepEqual(offeredCategories(config, { gpc: false }), ["preferences", "analytics", "marketing"]);
  assert.deepEqual(offeredCategories(config, { gpc: true }), ["preferences", "analytics"]);
  assert.deepEqual(offeredCategories({ ...config, respectGpc: false }, { gpc: true }), ["preferences", "analytics", "marketing"]);
  const cfg = vendorConfig(config, noop, { gpc: true }) as Record<string, any>;
  assert.ok(!("marketing" in cfg["categories"]), "the library does not know marketing, so its scripts never run");
  const sections = translation(cfg).preferencesModal.sections;
  assert.deepEqual(sections.map((s) => s["linkedCategory"]).filter(Boolean), ["necessary", "preferences", "analytics"]);
  assert.ok(sections.some((s) => s["description"] === defaultTexts.gpcNotice));

  // An earlier choice that granted marketing is not honoured while the browser sends the signal.
  const earlier = cookieOf({ ...valid, categories: ["necessary", "analytics", "marketing"] });
  const page = fakePage(JSON.stringify({ categories: ["analytics", "marketing"] }), earlier, "complete", { gpc: true });
  assert.deepEqual(page.layer()[2], ["consent", "update", consentState(["necessary", "analytics"])]);
  const off = fakePage(JSON.stringify({ categories: ["analytics", "marketing"], respectGpc: false }), earlier, "complete", { gpc: true });
  assert.equal((off.layer()[2]?.[2] as Record<string, string>)["ad_storage"], "granted");
});

test("the page is told about every change of the accepted categories, once", () => {
  const page = fakePage(JSON.stringify({}), "", "complete");
  const callbacks = page.runs[0] as { onConsent: () => void; onChange: () => void };
  page.accept(["necessary", "analytics"]);
  callbacks.onConsent();
  callbacks.onChange();
  page.accept(["necessary"]);
  callbacks.onChange();
  assert.deepEqual(page.events.map((e) => [e.type, e.detail]), [
    ["plain-consent:update", { categories: ["necessary", "analytics"] }],
    ["plain-consent:update", { categories: ["necessary"] }],
  ]);
});

test("an embed takes its placeholder size from plain pixel attributes only", () => {
  assert.deepEqual(embedSize("560", "315"), { width: 560, height: 315 });
  for (const [w, h] of [["100%", "315"], ["560", null], [null, null], ["0", "10"], ["-5", "10"], ["12345", "10"], ["5e2", "10"]] as const) {
    assert.equal(embedSize(w, h), null, `${w} ${h}`);
  }
});
