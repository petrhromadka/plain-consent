# Plain Consent

A free, open-source, dependency-free cookie consent banner. It is built on [vanilla-cookieconsent](https://github.com/orestbida/cookieconsent) (MIT, Orest Bida) and adds a validated JSON configuration, [Google Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent), Subresource Integrity and a runtime that works under a strict Content-Security-Policy.

The banner interface is in Czech (it was written for Czech websites) and every banner text is configurable, so you can translate it. [Česká verze níže](#česky).

- Licence: MIT, see [LICENSE](LICENSE) and [NOTICE](NOTICE)
- Current release: [`releases/v2.0.0/`](releases/v2.0.0/)
- Hosted code generator by the author (Czech; it currently offers v1.0.0): <https://socionet.cz/nastroje/cookie-lista/>

## What it does

- **Opt-in.** Nothing optional is enabled in advance. "Accept all" and "Reject all" sit side by side in the first layer with equal styling. No cookie wall: the site stays usable after a refusal.
- **Scripts managed by category.** Tag a script with `type="text/plain"` and `data-category="analytics"` (or `marketing`, `preferences`) and it runs only after consent for that category.
- **Clean-up after a refusal.** Known cookies of Google Analytics, Clarity, Hotjar, Meta Pixel, Google Ads, TikTok, Microsoft Ads and Pinterest are deleted when their category is refused or withdrawn.
- **Google Consent Mode v2.** Everything is denied by default (`wait_for_update` 500 ms, `ads_data_redaction`) and updated on every choice. A returning visitor's stored choice is sent before any Google tag runs.
- **Withdrawing is as easy as giving.** After the first choice a round settings button appears at the bottom left. You can also add your own footer link.
- **No network, no `eval`, no inline styles.** The banner loads nothing and sends nothing, and sets colours through CSSOM. A strict Content-Security-Policy needs only the two file URLs.
- **Safe configuration.** Every configured text is HTML-escaped, every link is checked (only `http(s)` and same-site paths), and a broken configuration falls back to the defaults, so the banner still asks.
- **Size.** `plain-consent.js` 46 kB (18 kB gzip), `plain-consent.css` 36 kB (7 kB gzip).

It is a technical aid, not legal advice. You are responsible for assessing what the law requires for your website (for Czech sites, for example section 89(3) of Act No. 127/2005 Coll. and the GDPR).

## Quick start

1. Download `plain-consent.js` and `plain-consent.css` from [`releases/v2.0.0/`](releases/v2.0.0/) and put them on your site.
2. Put the snippet in the `<head>`, **before** every other script, in particular before the Google tag. The URLs below assume the files are at `/plain-consent/v2.0.0/` on your site; change only those two URLs if you put them elsewhere. The `integrity` hashes stay valid because the files are byte-identical.
3. Tag the scripts that need consent (below).

```html
<link rel="stylesheet" href="/plain-consent/v2.0.0/plain-consent.css" integrity="sha384-Q2cOPPvV3BauSPuRsd9k3+QwNRB6HZK4glR3pPPga2Qxj7/xzteDYdt3C+B7sXdz" crossorigin="anonymous">
<script type="application/json" id="plain-consent-config">
{
  "accent": "#1f2937",
  "categories": ["analytics", "marketing"],
  "privacyUrl": "/privacy/",
  "consentMode": true,
  "credit": false,
  "revision": 0
}
</script>
<script src="/plain-consent/v2.0.0/plain-consent.js" integrity="sha384-5FU5bjr8XxrnlQ6PE9CN8YF1SMQTr0cU54y/EwnVyRjPKhoa8GEsUYh4pRlj0aPj" crossorigin="anonymous"></script>
```

The `integrity` attribute makes the browser run a file only if it is exactly the one that was published. The hashes of every release are in [`src/versions.ts`](src/versions.ts). Make sure your server or build pipeline does not modify the files (minification, script injection): one changed byte and the browser blocks them.

`generate()` in [`src/generator.ts`](src/generator.ts) produces this snippet from a configuration object, with the same validation the banner applies.

### Tagging scripts

A script that may run only after consent gets `type="text/plain"` and `data-category`:

```html
<!-- Google Analytics 4 (replace G-XXXXXXX with your ID) -->
<script type="text/plain" data-category="analytics" data-src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script type="text/plain" data-category="analytics">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>
```

The categories are `preferences`, `analytics` and `marketing`. The necessary category is always on; leave scripts that belong to it untagged.

### Footer link

```html
<button type="button" data-cc="show-preferencesModal">Nastavení cookies</button>
```

It opens the same settings window as the round button. Style it to match your site.

## Configuration

The configuration is JSON in `<script type="application/json" id="plain-consent-config">`. Unknown keys are dropped, an invalid value falls back to its default, and the banner says so in the console.

| Key | Default | Meaning |
| --- | --- | --- |
| `accent` | `#1f2937` | Colour of buttons and switches, `#rrggbb` only. Button text is black or white, chosen for contrast. |
| `categories` | `["analytics", "marketing"]` | The optional categories your site uses: `preferences`, `analytics`, `marketing`. |
| `privacyUrl` | `""` | Link to your privacy policy: an `http(s)` URL or a path starting with `/`. Empty means no link. |
| `consentMode` | `true` | Google Consent Mode v2. |
| `credit` | `false` | A small "Vytvořeno Socionet" link in the banner footer. Optional, off by default. |
| `revision` | `0` | Raise it by 1 when you add a service or purpose; everyone is then asked again. |
| `texts` | see code | Overrides for the banner texts (title, descriptions, buttons, category names, 17 keys). Each is one line of plain text within a length limit; defaults and limits are in [`src/runtime.ts`](src/runtime.ts) (`defaultTexts`, `textLimits`). |

Fixed, not configurable: opt-in, equal buttons in the first layer, one box at the bottom left, no cookie wall, and the choice is stored in the cookie `cc_cookie` for 182 days.

### Content-Security-Policy

If your site sends a CSP header, allow the two files (the JSON block is not executed and colours are set without inline styles, so the banner does not need `'unsafe-inline'`). When you serve the files from your own origin, `'self'` is enough:

```
script-src 'self'
style-src 'self'
```

Tagged inline scripts run as inline scripts after consent: give them a `nonce` or add their hash to the CSP, or move the code into a file.

## Versions

Release paths `vN.N.N` are **immutable**. A published release is never rebuilt or edited, because every embedded snippet pins its bytes with `integrity`. Any change to the code, the styles or the library is a new version in a new directory, and your banner stays as it is until you replace the snippet. Each release lives in `releases/vN.N.N/` and has a git tag of the same name. The list with all hashes is in [`src/versions.ts`](src/versions.ts).

| Version | Date | Files | Library |
| --- | --- | --- | --- |
| 2.0.0 | 2026-11-09 | `plain-consent.js`, `plain-consent.css` | vanilla-cookieconsent 3.1.0 |
| 1.0.0 | 2026-11-09 | `cookie-lista.js`, `cookie-lista.css` | vanilla-cookieconsent 3.1.0 |

**v1.0.0 is a historical release.** It was published under the project's former name, cookie-lista, and is served from <https://socionet.cz/cdn/cookie/v1.0.0/>. Its files are kept untouched in [`releases/v1.0.0/`](releases/v1.0.0/), byte for byte as published, so the Subresource Integrity hashes in existing embeds stay valid. It keeps its original file names.

**v2.0.0 is the same banner under the name Plain Consent.** The behaviour is unchanged, but the build is not byte-identical to v1.0.0, so it is a new version. The identifiers that carried the old name changed, which makes it a major version:

| | 1.x | 2.0.0 |
| --- | --- | --- |
| Files | `cookie-lista.js`, `cookie-lista.css` | `plain-consent.js`, `plain-consent.css` |
| Configuration element id | `cookie-lista-nastaveni` | `plain-consent-config` |
| CSS classes | `cookie-lista-credit`, `cookie-lista-nastaveni` | `plain-consent-credit`, `plain-consent-settings` |
| Console prefix | `Cookie lišta:` | `Plain Consent:` |

To move from 1.x, replace the snippet (new URLs, new `integrity` values) and rename the `id` of the configuration block; the keys inside it are unchanged. If you restyle the settings button or the credit link, rename those classes too.

## Privacy

The banner sends nothing to anyone and does not track visitors. A visitor's choice is stored only in their own browser, in the technical cookie `cc_cookie` on your site, for 182 days. This repository has no analytics and no database of visitors.

If you load v1.0.0 from socionet.cz, the visitor's browser contacts that server (behind Cloudflare), which technically sees the IP address and browser data of the request, as any server does. Self-host the files if you do not want that.

## Development

Node.js 24 or newer.

```sh
npm ci
npm test         # banner runtime, generator, and the immutability of published releases
npm run check    # type check
```

The banner source is [`src/runtime.ts`](src/runtime.ts) and [`src/theme.css`](src/theme.css), the generator logic is [`src/generator.ts`](src/generator.ts), and the build is [`scripts/build.mjs`](scripts/build.mjs). Details, including how to release a new version, are in [CONTRIBUTING.md](CONTRIBUTING.md). Security reports: [SECURITY.md](SECURITY.md).

## Licence and attribution

MIT, Copyright (c) 2026 Petr Hromádka ([Socionet](https://socionet.cz)). See [LICENSE](LICENSE).

Every released file contains, unmodified, files of [vanilla-cookieconsent](https://github.com/orestbida/cookieconsent) 3.1.0, MIT, Copyright (c) 2020-2025 Orest Bida. Its licence and provenance are in [NOTICE](NOTICE), in the header of every released file and in `releases/vN.N.N/LICENSE.txt`. Thanks to its author for the library this banner stands on. Plain Consent is an independent project and is not affiliated with the author of that library.

---

## Česky

**Plain Consent** je zdarma, open source a bez závislostí: banner pro souhlas s cookies. Stojí na knihovně [vanilla-cookieconsent](https://github.com/orestbida/cookieconsent) (MIT, Orest Bida) a přidává kontrolované nastavení v jednom bloku JSON, Google Consent Mode v2, otisky Subresource Integrity a běh pod přísnou Content-Security-Policy. Rozhraní banneru je česky a všechny texty jdou přepsat.

- **Souhlas předem (opt-in).** Nic volitelného není předem zapnuté, „Přijmout vše“ a „Odmítnout vše“ jsou v první vrstvě vedle sebe a vypadají stejně. Žádná „cookie wall“.
- **Skripty podle kategorií.** Skript označený `type="text/plain"` a `data-category` se spustí až po souhlasu s danou kategorií.
- **Úklid po odmítnutí.** Známé cookies běžných analytických a reklamních služeb se při odmítnutí nebo odvolání smažou.
- **Odvolání souhlasu stejně snadné jako udělení.** Po první volbě se vlevo dole objeví tlačítko s nastavením.
- **Žádná síť, žádný `eval`, žádné inline styly.** Banner nic nenačítá a nic neodesílá.

Banner je technická pomůcka, ne právní poradenství. Co zákon vyžaduje (§ 89 odst. 3 zákona č. 127/2005 Sb., GDPR), musíte pro svůj web posoudit sami.

### Použití

1. Stáhněte `plain-consent.js` a `plain-consent.css` z [`releases/v2.0.0/`](releases/v2.0.0/) a nahrajte je na svůj web.
2. Vložte kód z části [Quick start](#quick-start) do `<head>` **před** všechny ostatní skripty, zejména před značku Google. Změňte jen adresy `href` a `src`, otisky `integrity` zůstávají, protože soubory jsou stejné do posledního bajtu.
3. Skripty, které potřebují souhlas, označte podle části [Tagging scripts](#tagging-scripts).

Klíče nastavení (`accent`, `categories`, `privacyUrl`, `consentMode`, `credit`, `revision`, `texts`) a jejich výchozí hodnoty jsou v tabulce v části [Configuration](#configuration), texty a jejich limity v [`src/runtime.ts`](src/runtime.ts).

### Verze

Cesty `vN.N.N` jsou **neměnné**: zveřejněná verze se nikdy nepřestavuje ani neupravuje, protože každý vložený kód ji připíná otiskem `integrity`. Změna je vždy nová verze v nové složce `releases/vN.N.N/`.

Verze 1.0.0 vyšla pod dřívějším názvem projektu, cookie-lista, a je zde beze změny (včetně původních názvů souborů) kvůli platnosti otisků v existujících vloženích. Verze 2.0.0 je stejný banner pod názvem Plain Consent. Mění se identifikátory (soubory, `id` bloku s nastavením, CSS třídy), proto je to nová hlavní verze. Při přechodu z 1.x vyměňte celý vložený kód a přejmenujte `id` bloku s nastavením na `plain-consent-config`, klíče uvnitř zůstávají.

### Soukromí

Banner nic neodesílá a návštěvníky nesleduje. Volba návštěvníka se ukládá jen v jeho prohlížeči do technické cookie `cc_cookie` na vašem webu, na 182 dní. Načítáte-li verzi 1.0.0 ze serveru socionet.cz, prohlížeč návštěvníka se na tento server (za sítí Cloudflare) obrací a ten technicky vidí IP adresu a údaje prohlížeče. Nechcete-li to, soubory si hostujte sami.

### Licence

MIT, Copyright (c) 2026 Petr Hromádka ([Socionet](https://socionet.cz)). Každý vydaný soubor obsahuje beze změny soubory knihovny vanilla-cookieconsent 3.1.0, MIT, Copyright (c) 2020-2025 Orest Bida, viz [NOTICE](NOTICE). Plain Consent je samostatný projekt a není s autorem knihovny nijak spojený.
