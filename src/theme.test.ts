import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { latestRelease, releaseFileName } from "./versions.ts";

// The released stylesheet is the library's CSS followed by src/theme.css, minified at the top and readable below.
const css = readFileSync(
  fileURLToPath(new URL(`../releases/v${latestRelease.version}/${releaseFileName(latestRelease, "css")}`, import.meta.url)),
  "utf8",
).replace(/\/\*[\s\S]*?\*\//g, "");

const PX_PER_REM = 16;

// The pieces of a rule list this test needs: "selector { declarations }", no nesting.
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector = "", body = ""]) => ({
  selector: selector.trim(),
  declarations: Object.fromEntries(
    body
      .split(";")
      .map((d) => d.split(/:(.*)/s))
      .filter(([name, value]) => name?.trim() && value?.trim())
      .map(([name, value]) => [name!.trim(), value!.trim()]),
  ),
}));

// A radius in pixels, with --cc-btn-border-radius set by the site and --cc-pm-section-border-radius not set:
// var(--cc-btn-border-radius), var(--cc-pm-section-border-radius, <fallback>), min(a, b), px and rem only.
function radiusPx(value: string, btnRadius: string): number {
  let text = value.replace(/var\(\s*--cc-btn-border-radius\s*\)/g, btnRadius);
  // An unset variable with a fallback is its fallback.
  text = text.replace(/var\(\s*--cc-pm-section-border-radius\s*,\s*((?:[^()]|\([^()]*\))*)\)/g, "$1");
  const min = (s: string): number => {
    const m = /^min\(\s*([^,]+?)\s*,\s*([^,]+?)\s*\)$/.exec(s.trim());
    if (m) return Math.min(min(m[1]!), min(m[2]!));
    const n = /^(-?[\d.]+)(px|rem)?$/.exec(s.trim());
    assert.ok(n, `cannot evaluate "${s}" (from "${value}")`);
    return Number(n[1]) * (n[2] === "rem" ? PX_PER_REM : 1);
  };
  return min(text);
}

// What an expanded category's three boxes get for each corner, from the rules that name .is-expanded.
const expanded = (suffix: string, property: string) =>
  rules.filter((r) => r.selector.endsWith(suffix) && r.selector.includes(".is-expanded") && property in r.declarations);

const corners = [
  { box: "the category", suffix: ".pm__section--toggle.is-expanded", properties: ["border-radius"] },
  { box: "the title row", suffix: ".pm__section-title", properties: ["border-top-left-radius", "border-top-right-radius"] },
  { box: "the description", suffix: ".pm__section-desc-wrapper", properties: ["border-bottom-left-radius", "border-bottom-right-radius"] },
];

test("with a pill-shaped --cc-btn-border-radius an expanded category has corners of at most 1.4rem", () => {
  for (const { box, suffix, properties } of corners) {
    for (const property of properties) {
      const [rule] = expanded(suffix, property).slice(-1);
      assert.ok(rule, `${box}: no rule of an expanded category sets ${property}`);
      assert.ok(
        radiusPx(rule.declarations[property]!, "9999px") <= 1.4 * PX_PER_REM,
        `${box}: ${property} of an expanded category follows the pill radius`,
      );
    }
  }
});

test("the expanded category keeps the site's button radius when it is small, and a site can set its own radius", () => {
  for (const { box, suffix, properties } of corners) {
    for (const property of properties) {
      const [rule] = expanded(suffix, property).slice(-1);
      assert.equal(radiusPx(rule!.declarations[property]!, ".4rem"), 0.4 * PX_PER_REM, `${box}: ${property}`);
      assert.match(rule!.declarations[property]!, /^var\(--cc-pm-section-border-radius,/, `${box}: ${property} is configurable`);
    }
  }
});

test("the category description has room around its text", () => {
  const rule = rules.filter((r) => r.selector.endsWith(".pm__section--toggle .pm__section-desc")).slice(-1)[0];
  assert.equal(rule?.declarations.padding, "1em 1.2em 1.1em");
});
