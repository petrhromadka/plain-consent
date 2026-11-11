import assert from "node:assert/strict";
import { test } from "node:test";
import { configElementId, defaultTexts, normalizeConfig, translations } from "./runtime.ts";
import { latestRelease, releaseFileName, releases, releaseUrl } from "./versions.ts";
import { categoryTitleKeys, configForSnippet, cspEntries, embedTaggingExamples, footerLink, generate, jsonForHtml, snippet, taggingExamples } from "./generator.ts";

const configBlock = (html: string) => {
  const match = html.match(new RegExp(`<script type="application/json" id="${configElementId}">\\n([\\s\\S]*?)\\n</script>`));
  assert.ok(match?.[1], "the snippet has its configuration block");
  return match[1];
};

test("every file in the snippet carries its SRI hash and crossorigin=anonymous", () => {
  const html = snippet(normalizeConfig({}).config);
  const css = releaseUrl(latestRelease, "css");
  const js = releaseUrl(latestRelease, "js");
  assert.ok(html.includes(`<link rel="stylesheet" href="${css}" integrity="${latestRelease.integrity[releaseFileName(latestRelease, "css")]}" crossorigin="anonymous">`));
  assert.ok(html.includes(`<script src="${js}" integrity="${latestRelease.integrity[releaseFileName(latestRelease, "js")]}" crossorigin="anonymous"></script>`));
  assert.equal(html.match(/<script\b/g)?.length, 2);
  // The configuration comes before the banner script, which reads it while it runs.
  assert.ok(html.indexOf(configElementId) < html.indexOf(releaseFileName(latestRelease, "js")));
});

test("a release without a committed host is snippeted from a root-relative path, a hosted one from its host", () => {
  const config = normalizeConfig({}).config;
  const [first] = releases;
  assert.ok(first);
  assert.equal(first.hostedAt, "https://socionet.cz/cdn/cookie/v1.0.0/");
  assert.ok(snippet(config, first).includes(`src="https://socionet.cz/cdn/cookie/v1.0.0/cookie-lista.js" integrity="${first.integrity["cookie-lista.js"]}"`));
  const selfHosted = { ...latestRelease, hostedAt: null };
  assert.ok(snippet(config, selfHosted).includes(`src="/${selfHosted.name}/v${selfHosted.version}/${selfHosted.name}.js"`));
  assert.ok(snippet(config, selfHosted, "https://example.cz/assets/").includes(`src="https://example.cz/assets/${selfHosted.name}.js"`));
});

test("hostile text cannot leave the configuration block", () => {
  const evil = `</script><script>alert(1)</script><!-- & \u2028 \u2029`;
  const { snippet: html } = generate({ texts: { title: evil, description: "a</SCRIPT>b" }, privacyUrl: "/a?b=<x>" });
  const block = configBlock(html);
  assert.ok(!/[<>&\u2028\u2029]/.test(block), "no <, >, & or line separators inside the block");
  assert.equal(html.match(/<\/script>/gi)?.length, 2, "only the two real closing tags");
  const parsed = JSON.parse(block);
  assert.equal(parsed.texts.title, normalizeConfig({ texts: { title: evil } }).config.texts.title);
  // The policy path with <x> is not a valid link, so it is dropped rather than carried.
  assert.equal(parsed.privacyUrl, "");
});

test("the configuration in the snippet reads back to the same banner", () => {
  const raw = {
    accent: "#0a7c4a",
    categories: ["marketing", "analytics"],
    privacyUrl: "https://example.cz/zasady/",
    consentMode: false,
    credit: true,
    revision: 3,
    texts: { title: "Cookies na našem webu", acceptAll: defaultTexts.acceptAll },
  };
  const { config, snippet: html } = generate(raw);
  assert.deepEqual(normalizeConfig(JSON.parse(configBlock(html))).config, config);
  // Order is the banner's, defaults are left out.
  assert.deepEqual(config.categories, ["analytics", "marketing"]);
  assert.deepEqual(configForSnippet(config)["texts"], { title: "Cookies na našem webu" });
});

test("inputs the banner would refuse are reported and replaced, never passed through", () => {
  const { config, problems, snippet: html } = generate({ accent: "red;}body{display:none", privacyUrl: "javascript:alert(1)", layout: "x" });
  assert.equal(problems.length, 2);
  assert.ok(!html.includes("javascript:"));
  assert.ok(!html.includes("display:none"));
  assert.equal(config.privacyUrl, "");
});

test("jsonForHtml escapes what HTML would read and stays valid JSON", () => {
  const value = { a: "</script>&<!--\u2028" };
  const json = jsonForHtml(value);
  assert.ok(!/[<>&]/.test(json));
  assert.deepEqual(JSON.parse(json), value);
});

test("the footer link reopens the settings, with its label as text", () => {
  const { config } = normalizeConfig({ texts: { preferencesTitle: "Cookies <b>&</b>" } });
  assert.equal(footerLink(config), '<button type="button" data-cc="show-preferencesModal">Cookies &lt;b>&amp;&lt;/b></button>');
});

test("the CSP entries name the exact release files and need no unsafe-inline", () => {
  const [first] = releases;
  assert.ok(first);
  const csp = cspEntries(first);
  assert.equal(csp, `script-src ${releaseUrl(first, "js")}\nstyle-src ${releaseUrl(first, "css")}`);
  assert.ok(!csp.includes("unsafe"));
  assert.equal(cspEntries({ ...first, hostedAt: null }), "script-src 'self'\nstyle-src 'self'");
  assert.equal(cspEntries(first, "https://example.cz/assets/"), `script-src https://example.cz/assets/${releaseFileName(first, "js")}\nstyle-src https://example.cz/assets/${releaseFileName(first, "css")}`);
});

test("tagging examples follow the chosen categories and keep scripts asleep", () => {
  const { config } = normalizeConfig({ categories: ["analytics", "marketing"] });
  const examples = taggingExamples(config);
  assert.deepEqual(examples.map((e) => e.category), ["analytics", "marketing"]);
  for (const example of examples) {
    for (const tag of example.code.match(/<script\b[^>]*>/g) ?? []) {
      assert.match(tag, /type="text\/plain"/);
      assert.match(tag, new RegExp(`data-category="${example.category}"`));
    }
  }
});

test("a category title with a character a screen reader would read as code is refused, the default stays", () => {
  for (const key of categoryTitleKeys) {
    for (const bad of ["Reklama & měření", "A < B", "A > B", 'Naše "cookies"', "Dnes děláme web, ne l'amour"]) {
      const result = generate({ texts: { [key]: bad } });
      assert.deepEqual(result.refusedTitles, [key], `${key} ${bad}`);
      assert.equal(result.config.texts[key], defaultTexts[key]);
      assert.equal(JSON.parse(configBlock(result.snippet)).texts, undefined, "the refused title is not in the snippet");
      assert.equal(result.problems.length, 1);
      assert.match(result.problems[0] ?? "", /Názvy kategorií/);
    }
  }
});

test("a clean category title passes, and other texts may keep these characters", () => {
  const result = generate({ texts: { analyticsTitle: "Statistiky návštěvnosti", description: 'Text s "uvozovkami" & apostrofem\'.' } });
  assert.deepEqual(result.refusedTitles, []);
  assert.deepEqual(result.problems, []);
  assert.equal(result.config.texts.analyticsTitle, "Statistiky návštěvnosti");
  assert.equal(JSON.parse(configBlock(result.snippet)).texts.analyticsTitle, "Statistiky návštěvnosti");
  assert.equal(result.config.texts.description.includes("&"), true);
});

test("several refused titles are all reported once and the clean ones are kept", () => {
  const result = generate({ texts: { analyticsTitle: "A&B", marketingTitle: "Reklama", necessaryTitle: "Nutné's" } });
  assert.deepEqual(result.refusedTitles.sort(), ["analyticsTitle", "necessaryTitle"]);
  assert.equal(result.config.texts.marketingTitle, "Reklama");
  assert.equal(result.problems.filter((p) => p.startsWith("Názvy kategorií")).length, 1);
});

test("the snippet carries the language and the Global Privacy Control choice, texts only as changes from that language", () => {
  const { config, snippet: html } = generate({ language: "de", respectGpc: false, texts: { acceptAll: "Alles klar", rejectAll: translations.de.rejectAll } });
  const parsed = JSON.parse(configBlock(html));
  assert.equal(parsed.language, "de");
  assert.equal(parsed.respectGpc, false);
  assert.deepEqual(parsed.texts, { acceptAll: "Alles klar" });
  assert.deepEqual(normalizeConfig(parsed).config, config);
});

test("embed examples keep the address in data-src, never in src, and name their category", () => {
  const { config } = normalizeConfig({ categories: ["preferences", "analytics", "marketing"] });
  const examples = embedTaggingExamples(config);
  assert.deepEqual(examples.map((e) => e.category), ["preferences", "marketing"]);
  for (const example of examples) {
    assert.match(example.code, new RegExp(`data-category="${example.category}"`));
    assert.match(example.code, /data-src="https:\/\//);
    assert.ok(!/\ssrc=/.test(example.code), "no src that would load before consent");
  }
});
