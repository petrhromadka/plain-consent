// Published releases of the Plain Consent banner (releases/v<version>/, built by scripts/build.mjs). Append
// only: a release, once listed, is never changed or removed, because every embedded snippet pins its files with
// these Subresource Integrity hashes. src/release.test.ts fails when a published file no longer matches its hash.

// The library the banner is built on, pinned in package.json devDependencies. umdSha256 and cssSha256 are the
// SHA-256 of dist/cookieconsent.umd.js and dist/cookieconsent.css, identical in the npm tarball and in the
// GitHub tag (checked 2026-11-09). 3.1.0 is the newest release older than two weeks on that date
// (3.2.1: 2026-10-30, 3.3.0: 2026-11-03).
export const vendor = {
  name: "vanilla-cookieconsent",
  version: "3.1.0",
  released: "2025-02-04",
  license: "MIT",
  repository: "https://github.com/orestbida/cookieconsent",
  gitTag: "v3.1.0",
  gitCommit: "e6279509aab5b96be198297b0283b321ad76b0a9",
  npmIntegrity: "sha512-/McNRtm/3IXzb9dhqMIcbquoU45SzbN2VB+To4jxEPqMmp7uVniP6BhGLjU8MC7ZCDsNQVOp27fhQTM/ruIXAA==",
  umdSha256: "bc6e2f2e6381fc025b27a6b0afb5a0e1fc689c6f9fc40a78708adb2054ef4575",
  cssSha256: "ca046b8b1b1094107205988e7096a687b241c8ef5f3fefe5e543ed28d26646c1",
} as const;

// The licence of the project's own part (runtime.ts and theme.css), at the top of every published file.
export const ownLicense = `MIT License

Copyright (c) 2026 Petr Hromádka (Socionet, https://socionet.cz)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

// A release is three files: <name>.js, <name>.css and LICENSE.txt.
export type ReleaseKind = "js" | "css" | "license";

export interface Release {
  version: string;
  published: string;
  vendorVersion: string;
  // The base name of the js and css files. 1.0.0 was published as cookie-lista (it is kept exactly as released);
  // every later release is plain-consent.
  name: string;
  // The directory URL (with the trailing slash) that serves this release's files, or null when no host is
  // committed to: the files are then meant to be self-hosted from releases/v<version>/.
  hostedAt: string | null;
  // sha384 Subresource Integrity of each file, keyed by file name, exactly as the snippet's integrity attribute
  // carries it.
  integrity: Record<string, string>;
}

export const releases: readonly Release[] = [
  {
    version: "1.0.0",
    published: "2026-11-09",
    vendorVersion: "3.1.0",
    name: "cookie-lista",
    hostedAt: "https://socionet.cz/cdn/cookie/v1.0.0/",
    integrity: {
      "cookie-lista.js": "sha384-lNw/B9f+GaXDVOdzQJJ6CdB4QTE47AcP4QwczbpnBpDoonfNuunOmuvpehBdATbo",
      "cookie-lista.css": "sha384-1x/H8XWRvjxxYWaAo/ip6oalhl4GP6woWs0UGbbfD0xbaSasuk0CLbmevbOR/6Lv",
      "LICENSE.txt": "sha384-Q3/LgG0LyClttbQ0PoWGaU+BLAdSPjC0CnLXhIN3NYgQoixCA2pkDMyVbJq5J0MK",
    },
  },
  {
    version: "2.0.0",
    published: "2026-11-09",
    vendorVersion: "3.1.0",
    name: "plain-consent",
    hostedAt: null,
    integrity: {
      "plain-consent.js": "sha384-5FU5bjr8XxrnlQ6PE9CN8YF1SMQTr0cU54y/EwnVyRjPKhoa8GEsUYh4pRlj0aPj",
      "plain-consent.css": "sha384-Q2cOPPvV3BauSPuRsd9k3+QwNRB6HZK4glR3pPPga2Qxj7/xzteDYdt3C+B7sXdz",
      "LICENSE.txt": "sha384-Q3/LgG0LyClttbQ0PoWGaU+BLAdSPjC0CnLXhIN3NYgQoixCA2pkDMyVbJq5J0MK",
    },
  },
];

export const latestRelease: Release = releases[releases.length - 1] as Release;

export const releaseFileName = (release: Release, kind: ReleaseKind) =>
  kind === "license" ? "LICENSE.txt" : `${release.name}.${kind}`;

// Where a snippet loads a file from when the site owner gave no URL of their own: the release's host, or a
// root-relative path to put the self-hosted files at.
export const releaseUrl = (release: Release, kind: ReleaseKind) =>
  `${release.hostedAt ?? `/${release.name}/v${release.version}/`}${releaseFileName(release, kind)}`;
