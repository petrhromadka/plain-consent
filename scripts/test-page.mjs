// The browser test page of the Plain Consent banner (CONTRIBUTING.md, section Browser test): a site of its own that embeds
// the snippet the generator makes, from another origin, under a strict Content-Security-Policy without
// 'unsafe-inline', with tagged probe scripts of every category and a stand-in for the Google tag.
//
//   node scripts/test-page.mjs <out-dir> <base-url> <release-dir>
//
// <release-dir> holds the release files that <base-url> (a directory URL ending in "/") serves, for example
// releases/v2.0.0 served at http://localhost:18787/; the page's
// integrity values are computed from them and the script says whether they equal the ones in versions.ts.
// The page writes nothing anywhere: every probe only records into window.__probe, read by the test.
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { normalizeConfig } from "../src/runtime.ts";
import { latestRelease } from "../src/versions.ts";
import { snippet } from "../src/generator.ts";

const sri = (text) => `sha384-${createHash("sha384").update(text).digest("base64")}`;
const sha256 = (text) => `'sha256-${createHash("sha256").update(text).digest("base64")}'`;

const [out, base, releaseDir] = process.argv.slice(2);
if (!out || !base || !releaseDir) {
  console.error("usage: node scripts/test-page.mjs <out-dir> <base-url> <release-dir>");
  process.exit(1);
}

const integrity = {};
for (const file of Object.keys(latestRelease.integrity)) integrity[file] = sri(await readFile(`${releaseDir}/${file}`));
const release = { ...latestRelease, integrity };
const same = Object.entries(integrity).every(([file, value]) => latestRelease.integrity[file] === value);
console.log(same ? "integrity: equal to versions.ts" : "integrity: DIFFERENT from versions.ts (trial build)");

const base_config = {
  accent: "#d4381e",
  categories: ["preferences", "analytics", "marketing"],
  privacyUrl: "/zasady/",
  consentMode: true,
  credit: false,
  revision: 1,
};
const { config } = normalizeConfig({
  ...base_config,
  texts: { title: "Test <b>není</b> HTML", description: 'Text s "uvozovkami" & <script>alert(1)</script> zůstane textem.' },
});

// Inline probe of the analytics category: the library re-creates it as an inline script, so the page's policy
// allows exactly this text by its hash, as a site owner would.
const inlineProbe = "window.__probe.inlineAnalytics = Date.now();";
const csp =
  [
    "default-src 'none'",
    `script-src 'self' ${base} ${sha256(inlineProbe)}`,
    `style-src 'self' ${base}`,
    "img-src 'self'",
    "frame-src 'self'",
    "connect-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join("; ");

// Embedded content of every category, an address that is not allowed, a category the configuration does not
// know and a button that adds one more embed after the banner has started. The addresses are in data-src only.
const embeds = `<section id="embeds">
<iframe id="embed-marketing" data-category="marketing" data-src="/embed-content.html?c=marketing" data-title="Video (marketing)" width="560" height="315"></iframe>
<iframe id="embed-preferences" data-category="preferences" data-src="/embed-content.html?c=preferences" data-title="Mapa (funkční)" width="600" height="400"></iframe>
<iframe id="embed-analytics" data-category="analytics" data-src="/embed-content.html?c=analytics"></iframe>
<iframe id="embed-bad" data-category="marketing" data-src="javascript:alert(1)"></iframe>
<iframe id="embed-unknown" data-category="tracking" data-src="/embed-content.html?c=tracking"></iframe>
</section>
<p><button type="button" id="add-embed">Přidat embed</button></p>
<script src="/add-embed.js"></script>`;

const page = (title, code, { lang = "cs", head = "" } = {}) => `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<title>${title}</title>
<script src="/probe-setup.js"></script>
${head}
${code}
<script src="/gtag-probe.js"></script>
<script type="text/plain" data-category="analytics" data-src="/probe-analytics.js"></script>
<script type="text/plain" data-category="analytics">${inlineProbe}</script>
<script type="text/plain" data-category="marketing" data-src="/probe-marketing.js"></script>
<script type="text/plain" data-category="preferences" data-src="/probe-preferences.js"></script>
<link rel="stylesheet" href="/page.css">
</head>
<body>
<main>
<h1>${title}</h1>
<p>Testovací stránka banneru Plain Consent. Volitelné skripty se smějí spustit až po souhlasu.</p>
<p><a href="/zasady/">Zásady</a></p>
${embeds}
</main>
<footer><button type="button" data-cc="show-preferencesModal">Nastavení cookies</button></footer>
</body>
</html>
`;

const good = snippet(config, release, base);
const bad = good.replace(integrity[`${latestRelease.name}.js`], sri("tampered"));
await mkdir(out, { recursive: true });
await writeFile(`${out}/index.html`, page("Plain Consent: test", good));
await writeFile(`${out}/sri-mismatch.html`, page("Plain Consent: špatný hash", bad));
// Languages: a fixed one, and "auto" on a page whose <html lang> is German.
const variant = (extra) => snippet(normalizeConfig({ ...base_config, ...extra }).config, release, base);
await writeFile(`${out}/en.html`, page("Plain Consent: English", variant({ language: "en" }), { lang: "en" }));
await writeFile(`${out}/auto-de.html`, page("Plain Consent: Deutsch (auto)", variant({ language: "auto" }), { lang: "de" }));
await writeFile(`${out}/auto-fr.html`, page("Plain Consent: français (auto)", variant({ language: "auto" }), { lang: "fr" }));
// Global Privacy Control: a browser that sends it (Chrome does not yet, so the page sets what Firefox, Brave and
// DuckDuckGo set), and the same page with the owner's respectGpc switched off.
await writeFile(`${out}/gpc-setup.js`, "Object.defineProperty(Navigator.prototype, 'globalPrivacyControl', { get: function () { return true; } });\n");
const gpcHead = '<script src="/gpc-setup.js"></script>';
await writeFile(`${out}/gpc.html`, page("Plain Consent: GPC", variant({}), { head: gpcHead }));
await writeFile(`${out}/gpc-off.html`, page("Plain Consent: GPC ignored", variant({ respectGpc: false }), { head: gpcHead }));
await writeFile(`${out}/embed-content.html`, '<!doctype html>\n<meta charset="utf-8">\n<title>Embed</title>\n<script src="/embed-content.js"></script>\n<body style="font:16px system-ui;margin:1rem;background:#e8f1ff"><p>Obsah třetí strany (testovací embed)</p></body>\n');
await writeFile(`${out}/embed-content.js`, "parent.__probe.embeds = (parent.__probe.embeds || []).concat(location.search);\n");
await writeFile(
  `${out}/add-embed.js`,
  "document.getElementById('add-embed').addEventListener('click', function () { var f = document.createElement('iframe'); f.id = 'embed-late'; f.setAttribute('data-category', 'marketing'); f.setAttribute('data-src', '/embed-content.html?c=late'); f.setAttribute('data-title', 'Pozdě přidaný embed'); f.setAttribute('width', '560'); f.setAttribute('height', '200'); document.getElementById('embeds').appendChild(f); });\n",
);
// The page's own code listens to the banner's event, as a site owner would to load something after a choice.
await writeFile(
  `${out}/probe-setup.js`,
  "window.__probe = { requests: [], events: [] };\ndocument.addEventListener('plain-consent:update', function (event) { window.__probe.events.push(event.detail.categories); });\n",
);
// The stand-in for gtag.js records what the dataLayer held when the first Google tag would have read it.
await writeFile(`${out}/gtag-probe.js`, "window.__probe.dataLayerAtTag = (window.dataLayer || []).map(function (entry) { return Array.prototype.slice.call(entry); });\n");
for (const category of ["analytics", "marketing", "preferences"]) {
  const cookie = { analytics: "_ga", marketing: "_fbp", preferences: "lang" }[category];
  await writeFile(`${out}/probe-${category}.js`, `window.__probe.${category} = Date.now(); document.cookie = "${cookie}=probe; path=/";\n`);
}
// An empty icon, so the browser's favicon request is not a 404 in the console.
await writeFile(`${out}/favicon.ico`, "");
await writeFile(`${out}/page.css`, "body { font: 16px/1.5 system-ui, sans-serif; margin: 2rem; } iframe { max-width: 100%; } footer { margin-top: 40rem; }\n");
console.log(`test page written to ${out}`);
