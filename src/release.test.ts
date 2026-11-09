import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { buildRelease } from "../scripts/build.mjs";
import { latestRelease, releaseFileName, releases, vendor } from "./versions.ts";

const site = fileURLToPath(new URL("../", import.meta.url));
const read = (path: string) => readFileSync(`${site}${path}`);
const sri = (body: Buffer | string) => `sha384-${createHash("sha384").update(body).digest("base64")}`;

test("every published release still matches its integrity hashes", () => {
  for (const release of releases) {
    for (const [file, expected] of Object.entries(release.integrity)) {
      assert.equal(sri(read(`releases/v${release.version}/${file}`)), expected, `${release.version} ${file}`);
    }
  }
});

test("releases/ holds exactly the listed releases, each with its three files", () => {
  const dirs = readdirSync(`${site}releases`).sort();
  assert.deepEqual(dirs, releases.map((r) => `v${r.version}`).sort());
  for (const release of releases) {
    const expected = [releaseFileName(release, "license"), releaseFileName(release, "css"), releaseFileName(release, "js")].sort();
    assert.deepEqual(readdirSync(`${site}releases/v${release.version}`).sort(), expected);
    assert.deepEqual(Object.keys(release.integrity).sort(), expected);
  }
});

test("the newest release is exactly what the current source builds", async () => {
  // A change to runtime.ts, theme.css or the library is a new release, never an edit of a published one.
  const built = await buildRelease(latestRelease.version);
  for (const [file, text] of Object.entries(built)) {
    assert.equal(sri(text), latestRelease.integrity[file], `${file}: the source changed; build a new version`);
  }
});

test("the release carries both licences and the pinned library verbatim", () => {
  const js = read(`releases/v${latestRelease.version}/${releaseFileName(latestRelease, "js")}`).toString("utf8");
  const css = read(`releases/v${latestRelease.version}/${releaseFileName(latestRelease, "css")}`).toString("utf8");
  for (const text of [js, css]) {
    assert.ok(text.includes("Copyright (c) 2020-2025 Orest Bida"));
    assert.ok(text.includes("Copyright (c) 2026 Petr Hromádka"));
    assert.ok(text.includes("Permission is hereby granted, free of charge"));
  }
  const umd = read(`node_modules/${vendor.name}/dist/cookieconsent.umd.js`).toString("utf8").trim();
  assert.equal(createHash("sha256").update(read(`node_modules/${vendor.name}/dist/cookieconsent.umd.js`)).digest("hex"), vendor.umdSha256);
  assert.ok(js.includes(umd), "the library is included byte for byte");
});

test("the library is pinned to the recorded version in package.json and the lockfile", () => {
  const pkg = JSON.parse(read("package.json").toString("utf8"));
  assert.equal(pkg.devDependencies[vendor.name], vendor.version);
  const lock = JSON.parse(read("package-lock.json").toString("utf8"));
  const entry = lock.packages[`node_modules/${vendor.name}`];
  assert.equal(entry.version, vendor.version);
  assert.equal(entry.integrity, vendor.npmIntegrity);
  assert.equal(entry.license, "MIT");
});
