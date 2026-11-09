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

const { config } = normalizeConfig({
  accent: "#d4381e",
  categories: ["preferences", "analytics", "marketing"],
  privacyUrl: "/zasady/",
  consentMode: true,
  credit: true,
  revision: 1,
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
    "connect-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join("; ");

const page = (title, code) => `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<title>${title}</title>
<script src="/probe-setup.js"></script>
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
await writeFile(`${out}/probe-setup.js`, "window.__probe = { requests: [] };\n");
// The stand-in for gtag.js records what the dataLayer held when the first Google tag would have read it.
await writeFile(`${out}/gtag-probe.js`, "window.__probe.dataLayerAtTag = (window.dataLayer || []).map(function (entry) { return Array.prototype.slice.call(entry); });\n");
for (const category of ["analytics", "marketing", "preferences"]) {
  const cookie = { analytics: "_ga", marketing: "_fbp", preferences: "lang" }[category];
  await writeFile(`${out}/probe-${category}.js`, `window.__probe.${category} = Date.now(); document.cookie = "${cookie}=probe; path=/";\n`);
}
// An empty icon, so the browser's favicon request is not a 404 in the console.
await writeFile(`${out}/favicon.ico`, "");
await writeFile(`${out}/page.css`, "body { font: 16px/1.5 system-ui, sans-serif; margin: 2rem; } footer { margin-top: 40rem; }\n");
console.log(`test page written to ${out}`);
