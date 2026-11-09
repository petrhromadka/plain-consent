# Contributing

Thanks for looking. Issues and pull requests are welcome, in Czech or English.

## Setup

Node.js 24 or newer (the tests run TypeScript directly, no build step).

```sh
npm ci
npm test         # banner runtime, generator, and the immutability of published releases
npm run check    # tsc --noEmit
```

## The one rule: published releases never change

Every site that embeds the banner pins the files with a Subresource Integrity hash (`integrity="sha384-..."`). One changed byte in `releases/vN.N.N/` breaks every one of them, so:

- Never edit, rebuild or delete anything under `releases/` for a version that is already listed in `src/versions.ts`. That includes `releases/v1.0.0/`, which was published as cookie-lista v1.0.0 and keeps its original file names and bytes. `src/release.test.ts` and CI fail if you do.
- A change to `src/runtime.ts`, `src/theme.css` or the library version is a **new version** (new path, new git tag). This includes comments in `src/runtime.ts`: it is compiled with its comments into the released file.
- Changes to `src/generator.ts`, the tests, the scripts and the documentation do not touch the released files.

## Releasing a new version

1. Change the source. If you change the library, pin the new version exactly in `package.json`, take the newest release that is at least two weeks old, and update `vendor` in `src/versions.ts` (version, date, git tag and commit, npm integrity, SHA-256 of `dist/cookieconsent.umd.js` and `dist/cookieconsent.css`).
2. Build: `node scripts/build.mjs 2.1.0`. It writes `releases/v2.1.0/` and refuses a version that already exists. It prints the three SRI hashes.
3. Append the release with those hashes to `releases` in `src/versions.ts` (append only).
4. `npm test` must pass: the newest release must equal what the source builds.
5. Tag the commit `v2.1.0`.

`node scripts/build.mjs 2.1.0 --out <dir>` makes a trial build elsewhere without touching `releases/`.

## Browser test

A real cross-site page under a strict Content-Security-Policy without `'unsafe-inline'`:

1. Serve the newest release directory with CORS, for example `npx http-server releases/v2.0.0 -p 18787 --cors`.
2. `node scripts/test-page.mjs /tmp/site http://localhost:18787/ releases/v2.0.0` writes the test page (the second argument is the directory URL the files are served from, ending in `/`) and says whether its integrity values equal `src/versions.ts`.
3. Serve `/tmp/site` from another origin (for example `python3 -m http.server 18081 --bind 127.0.0.1 --directory /tmp/site`) and open `http://127.0.0.1:18081/` in Chrome started with `--disable-blink-features=AutomationControlled` (the library hides the banner from `navigator.webdriver`).

Expect: before a choice no probe script is requested, no cookie exists and `window.__probe.dataLayerAtTag` holds the denied Consent Mode default; after "Přijmout vše" the probes ran and the last `dataLayer` entry is a granted update; after a reload the update precedes the tag; withdrawing in the settings deletes `_ga` and `_fbp` and sends a denied update; `/sri-mismatch.html` is blocked by the browser and nothing runs.

## Style

TypeScript with erasable syntax only (no enums, namespaces or parameter properties), because the build only strips types. `src/runtime.ts` runs on other people's sites: no network, no `eval`, no inline styles, every configured text escaped, fail closed. Keep it that way.
