// Builds one release of the Plain Consent banner into releases/v<version>/ (see README.md, section Versions).
//
//   node scripts/build.mjs <version>                write a NEW release and print its SRI hashes
//   node scripts/build.mjs <version> --out <dir>    trial build elsewhere, for testing before release
//
// A published release is never rebuilt or overwritten: sites embed it with a Subresource Integrity hash, so a
// changed byte would break every one of them. The command refuses an existing version directory; a change is
// always a new version, added to src/versions.ts with the hashes this prints.
//
// The release is three files: plain-consent.js (the pinned vanilla-cookieconsent UMD build, verbatim, wrapped so
// it neither reads nor sets a global, followed by src/runtime.ts compiled by the pinned
// TypeScript), plain-consent.css (the library's CSS, verbatim, then src/theme.css) and
// LICENSE.txt. The library files are checked against the SHA-256 recorded in versions.ts before use.
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { ownLicense, vendor } from "../src/versions.ts";

const site = fileURLToPath(new URL("..", import.meta.url));
const at = (path) => `${site}${path}`;

export const sha256 = (text) => createHash("sha256").update(text).digest("hex");
export const sri = (text) => `sha384-${createHash("sha384").update(text).digest("base64")}`;

// The library's file from node_modules, refused unless it is byte for byte the pinned one.
async function vendorFile(name, expected) {
  const text = await readFile(at(`node_modules/${vendor.name}/dist/${name}`), "utf8");
  if (sha256(text) !== expected) throw new Error(`${vendor.name} dist/${name} does not match the SHA-256 in versions.ts; run npm ci`);
  return text;
}

// runtime.ts as plain JavaScript inside the release's function scope: types stripped by TypeScript, `export`
// dropped (nothing leaves the scope). Any import or remaining export is an error, as it could not run there.
export async function compileRuntime() {
  const source = await readFile(at("src/runtime.ts"), "utf8");
  const { outputText, diagnostics } = ts.transpileModule(source, {
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, removeComments: false, verbatimModuleSyntax: false },
  });
  if (diagnostics?.length) throw new Error(`runtime.ts: ${diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("; ")}`);
  const body = outputText.replace(/^export (?=(?:async )?function |const |let |class )/gm, "").trim();
  if (/^\s*(?:import|export)\b/m.test(body)) throw new Error("runtime.ts: an import or export survived compilation");
  return body;
}

const licenseText = async () => {
  const vendorLicense = (await readFile(at(`node_modules/${vendor.name}/LICENSE`), "utf8")).trim();
  return `${ownLicense.trim()}\n\n---\n\nIncludes ${vendor.name} ${vendor.version} (${vendor.repository}):\n\n${vendorLicense}\n`;
};

const comment = (text) => `/*!\n${text.trim().split("\n").map((line) => ` * ${line}`.trimEnd()).join("\n")}\n */\n`;

export async function buildRelease(version) {
  const license = await licenseText();
  const header = comment(`Plain Consent ${version}, https://github.com/petrhromadka/plain-consent\n\n${license}`);
  const umd = await vendorFile("cookieconsent.umd.js", vendor.umdSha256);
  const vendorCss = await vendorFile("cookieconsent.css", vendor.cssSha256);
  const theme = await readFile(at("src/theme.css"), "utf8");
  const runtime = await compileRuntime();
  // `module` and `exports` make the UMD build take its CommonJS branch, so it defines no global and ignores an
  // AMD loader of the host page.
  const js = `${header}(function () {
"use strict";
var module = { exports: {} };
var exports = module.exports;
${umd.trim()}
var CookieConsent = module.exports;
${runtime}
start(window, document, CookieConsent);
})();
`;
  const css = `${header}${vendorCss.trim()}\n${theme.trim()}\n`;
  return { "plain-consent.js": js, "plain-consent.css": css, "LICENSE.txt": license };
}

async function main() {
  const [version, flag, out] = process.argv.slice(2);
  if (!version || !/^\d+\.\d+\.\d+$/.test(version) || (flag !== undefined && (flag !== "--out" || !out))) {
    throw new Error("usage: node scripts/build.mjs <major.minor.patch> [--out <directory outside releases/ for a trial build>]");
  }
  const dir = out ? `${out.replace(/\/+$/, "")}/` : at(`releases/v${version}/`);
  if (!out && existsSync(dir)) throw new Error(`releases/v${version}/ exists: a published release is never rebuilt. Use a new version.`);
  const files = await buildRelease(version);
  await mkdir(dir, { recursive: true });
  for (const [name, text] of Object.entries(files)) await writeFile(`${dir}${name}`, text);
  console.log(`Plain Consent ${version} written to ${dir}. ${out ? "Trial build, not a release." : "Add to releases in src/versions.ts:"}`);
  console.log(JSON.stringify({ version, js: sri(files["plain-consent.js"]), css: sri(files["plain-consent.css"]), license: sri(files["LICENSE.txt"]) }, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
