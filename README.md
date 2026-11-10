# Plain Consent

A free, lightweight, dependency-free cookie consent banner with Google Consent Mode v2, Subresource Integrity, and strict Content-Security-Policy compliance. Built on [vanilla-cookieconsent](https://github.com/orestbida/cookieconsent) (MIT).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

The default banner interface is in Czech (written for Czech websites) and every text is fully configurable so you can easily translate it into English, German, or any other language. [Česká verze níže](#česky).

- **Licence:** MIT (see [LICENSE](LICENSE) and [NOTICE](NOTICE))
- **Current release:** [`releases/v2.0.0/`](releases/v2.0.0/)
- **Hosted generator (Czech):** <https://socionet.cz/nastroje/cookie-lista/>

---

## Why Plain Consent?

- **True opt-in without dark patterns.** Nothing optional is pre-enabled. "Accept all" and "Reject all" sit side by side in the first layer with identical styling and equal visual prominence. No cookie wall: visitors who decline non-essential cookies can use the site without hindrance.
- **Lightweight and dependency-free.** Just two files: `plain-consent.js` (46 kB / 17.8 kB gzip) and `plain-consent.css` (36 kB / 6.8 kB gzip). Zero runtime dependencies.
- **Google Consent Mode v2 built-in.** Denies all consent parameters (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`, `functionality_storage`, `personalization_storage`) by default (`wait_for_update: 500`, `ads_data_redaction: true`) before any Google tag executes. Updates synchronously on consent, and applies a returning visitor's stored choice before Google tags load.
- **Strict Content-Security-Policy friendly.** Zero network requests from the banner, no `eval` or `new Function`, and no inline styles (colors are applied through CSSOM custom properties on the root element). A strict CSP requires only the two file URLs.
- **Subresource Integrity (SRI).** Every release is immutable and cryptographically pinned with sha384 hashes in the embed snippet, guaranteeing that scripts cannot be modified or tampered with.
- **Script management and cookie cleanup.** Tag third-party scripts with `type="text/plain"` and `data-category="analytics"` (or `marketing`, `preferences`) so they only run after consent. When a visitor refuses or withdraws consent, known cookies of major tracking services (Google Analytics, Clarity, Hotjar, Meta Pixel, Google Ads, TikTok, Microsoft Ads, Pinterest) are automatically purged.
- **Frictionless consent withdrawal.** Once a choice is made, an accessible floating settings button appears at the bottom-left, allowing visitors to change or revoke consent at any time as required by GDPR and ePrivacy regulations. You can also trigger settings from your own footer link.
- **Fail-closed, safe configuration.** Configured via a single JSON block. Every text string is HTML-escaped, links are verified (only `http(s)` URLs and same-origin paths allowed), and invalid values safely fall back to defaults so the banner always asks.
- **Built on battle-tested foundation.** Powered by the widely adopted [vanilla-cookieconsent](https://github.com/orestbida/cookieconsent) v3.1.0 engine by Orest Bida.

---

## Preview

![Plain Consent Cookie Banner](docs/plain-consent-banner.png)

Visitors can review and manage individual categories in the preferences modal:

![Plain Consent Preferences Modal](docs/plain-consent-preferences.png)

---

## Quick Start

### 1. Embed the Banner

You can self-host the release files (recommended for v2.0.0) or use the hosted endpoint for v1.0.0.

#### Option A: Self-hosted (Recommended for v2.0.0)

1. Download `plain-consent.js` and `plain-consent.css` from [`releases/v2.0.0/`](releases/v2.0.0/) and place them on your web server (for example at `/plain-consent/v2.0.0/`).
2. Add this snippet inside the `<head>` of your page, **before** all other scripts (especially before the Google tag):

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

> [!NOTE]
> If you host the files under a different path, update the `href` and `src` attributes. The `integrity` hashes remain unchanged because the files are byte-identical. Make sure your web server or CDN does not modify the files (such as automatic minification or script injection), or the browser will block them.

#### Option B: Hosted CDN (socionet.cz - v1.0.0)

For websites using the author's hosted CDN endpoint (historical release v1.0.0 under the former name `cookie-lista`):

```html
<link rel="stylesheet" href="https://socionet.cz/cdn/cookie/v1.0.0/cookie-lista.css" integrity="sha384-1x/H8XWRvjxxYWaAo/ip6oalhl4GP6woWs0UGbbfD0xbaSasuk0CLbmevbOR/6Lv" crossorigin="anonymous">
<script type="application/json" id="cookie-lista-nastaveni">
{
  "accent": "#1f2937",
  "categories": ["analytics", "marketing"],
  "privacyUrl": "/privacy/",
  "consentMode": true,
  "credit": false,
  "revision": 0
}
</script>
<script src="https://socionet.cz/cdn/cookie/v1.0.0/cookie-lista.js" integrity="sha384-lNw/B9f+GaXDVOdzQJJ6CdB4QTE47AcP4QwczbpnBpDoonfNuunOmuvpehBdATbo" crossorigin="anonymous"></script>
```

You can also use the online configuration generator at <https://socionet.cz/nastroje/cookie-lista/>.

---

### 2. Tag Scripts Requiring Consent

To prevent tracking scripts from executing before consent is granted, set `type="text/plain"` and specify `data-category`:

```html
<!-- Google Analytics 4 (replace G-XXXXXXX with your measurement ID) -->
<script type="text/plain" data-category="analytics" data-src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script type="text/plain" data-category="analytics">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>

<!-- Marketing scripts (e.g. Meta Pixel) -->
<script type="text/plain" data-category="marketing">
  /* your marketing script here */
</script>

<!-- Functional scripts (e.g. chat widget) -->
<script type="text/plain" data-category="preferences" data-src="https://example.com/widget.js"></script>
```

Available optional categories:
- `preferences` - functional preferences (e.g. language or chat widgets)
- `analytics` - audience and traffic measurement
- `marketing` - ad targeting and conversion tracking

Essential scripts belonging to the `necessary` category run normally without any tags.

---

### 3. Add a Footer Link (Consent Withdrawal)

In addition to the floating cookie settings button that appears after a choice, you can provide a link in your website footer:

```html
<button type="button" data-cc="show-preferencesModal">Cookie settings</button>
```

This button opens the category preferences modal where visitors can review or withdraw consent at any time.

---

## Configuration

The banner is configured through the `<script type="application/json" id="plain-consent-config">` element. Unknown keys are dropped, invalid values fall back to defaults, and any fallback is logged to the browser console.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `accent` | `string` | `"#1f2937"` | Button and switch color in `#rrggbb` hex format. Button text color (`#000000` or `#ffffff`) is computed automatically to ensure WCAG contrast. |
| `categories` | `string[]` | `["analytics", "marketing"]` | Optional categories used by your site: `"preferences"`, `"analytics"`, `"marketing"`. |
| `privacyUrl` | `string` | `""` | Link to your privacy policy: an `http(s)` URL or a path starting with `/`. If empty, no link is displayed. |
| `consentMode` | `boolean` | `true` | Enables Google Consent Mode v2 default denied state and consent updates. |
| `credit` | `boolean` | `false` | Shows a subtle "Vytvořeno Socionet" link in the banner footer. |
| `revision` | `number` | `0` | Configuration revision integer (0-9999). Increment by 1 when adding new services or cookies to prompt returning visitors again. |
| `texts` | `object` | *see below* | Text overrides for titles, descriptions, and buttons. |

Non-configurable design standards: opt-in mode, equal button weights in the first layer, box positioned at the bottom-left, no cookie wall, and consent state preserved in `cc_cookie` for 182 days.

### Real Example: Custom Accent & English Texts

```html
<script type="application/json" id="plain-consent-config">
{
  "accent": "#0f766e",
  "categories": ["analytics", "marketing"],
  "privacyUrl": "/privacy-policy/",
  "consentMode": true,
  "revision": 1,
  "texts": {
    "title": "We value your privacy",
    "description": "We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic.",
    "acceptAll": "Accept all",
    "rejectAll": "Reject all",
    "settings": "Preferences",
    "save": "Save preferences",
    "privacyLabel": "Privacy Policy",
    "preferencesTitle": "Cookie Preferences",
    "preferencesDescription": "Manage your cookie preferences. Essential cookies are always active.",
    "necessaryTitle": "Essential",
    "necessaryDescription": "Required for basic website functionality and remembering your consent.",
    "analyticsTitle": "Analytics",
    "analyticsDescription": "Help us measure audience traffic and improve our services.",
    "marketingTitle": "Marketing",
    "marketingDescription": "Used to deliver targeted advertisements across websites."
  }
}
</script>
```

### Content-Security-Policy (CSP)

Plain Consent is designed for strict CSP environments. Because the banner sets colors via CSSOM custom properties and contains no inline scripts, `'unsafe-inline'` is not needed for the banner itself:

```http
script-src 'self'
style-src 'self'
```

If you load the files from another origin (or socionet.cz), specify the exact file URLs:

```http
script-src https://socionet.cz/cdn/cookie/v1.0.0/cookie-lista.js
style-src https://socionet.cz/cdn/cookie/v1.0.0/cookie-lista.css
```

> [!TIP]
> Tagged inline scripts that execute upon consent run as inline scripts. For these, include their cryptographic hash in `script-src`, supply a `nonce`, or move the code into an external file.

---

## Language Versions & Text Customization

The default texts are in Czech. Every text key in the `texts` object can be customized or translated. Long texts exceeding their limit are automatically truncated at word boundaries to preserve banner layout.

| Key | Max chars | Czech default | English translation example |
| --- | :---: | --- | --- |
| `title` | 80 | Používáme cookies | We use cookies |
| `description` | 600 | Nezbytné cookies potřebujeme, aby web fungoval. Ostatní použijeme, jen když s nimi souhlasíte. Svou volbu můžete kdykoli změnit. | Necessary cookies keep our site working. We only use other cookies with your consent. You can change your choice anytime. |
| `acceptAll` | 40 | Přijmout vše | Accept all |
| `rejectAll` | 40 | Odmítnout vše | Reject all |
| `settings` | 40 | Nastavení | Customize |
| `save` | 40 | Uložit výběr | Save choices |
| `privacyLabel` | 80 | Zásady ochrany osobních údajů | Privacy Policy |
| `preferencesTitle` | 80 | Nastavení cookies | Cookie Settings |
| `preferencesDescription` | 600 | Vyberte, které cookies smíme používat. Nezbytné jsou zapnuté vždy, bez nich web nefunguje. Souhlas můžete kdykoli změnit nebo odvolat. | Choose which cookies you allow. Essential cookies cannot be turned off. You can change or revoke consent anytime. |
| `necessaryTitle` | 60 | Nezbytné | Essential |
| `necessaryDescription` | 300 | Zajišťují základní funkce webu a zapamatují si vaši volbu cookies. Nejdou vypnout. | Required for core functionality and saving your consent choices. Always active. |
| `preferencesCategoryTitle` | 60 | Funkční | Preferences |
| `preferencesCategoryDescription` | 300 | Pamatují si vaše nastavení, například jazyk nebo region. | Remember settings such as preferred language and region. |
| `analyticsTitle` | 60 | Analytické | Analytics |
| `analyticsDescription` | 300 | Měří návštěvnost a ukazují, jak lidé web používají, abychom ho mohli zlepšovat. | Help us understand site usage and visitor interactions to improve performance. |
| `marketingTitle` | 60 | Marketingové | Marketing |
| `marketingDescription` | 300 | Měří a cílí reklamu, i na jiných webech a sociálních sítích. | Used for relevant advertising and marketing campaigns across websites. |

---

## Accessibility

Plain Consent prioritizes accessibility for all users:

- **Keyboard navigation:** Full keyboard support with focus trapping inside active modals, logical tab order, and modal dismissal with the `Escape` key.
- **Automated contrast checks:** Button text color dynamically chooses between `#000000` and `#ffffff` to guarantee at least a 4.5:1 WCAG contrast ratio against your configured `accent` color. Policy links take the accent color only if contrast against white exceeds 4.5:1, otherwise falling back to high-contrast dark text (`#2c2f31`).
- **Visible focus indicators:** Clear `:focus-visible` outlines on buttons, toggles, and the persistent settings button.
- **Screen reader protection:** Category titles are strictly validated against HTML special characters (`&`, `<`, `>`, `"`, `'`) so screen readers never read escaped entity names (such as `&amp;`) aloud.
- **Accessible iconography:** The floating settings toggle includes an explicit `aria-label`, `title`, and `aria-hidden="true"` on the SVG icon.

---

## Privacy & GDPR Notes

> [!IMPORTANT]
> Plain Consent is a technical tool, not legal advice. Website operators are responsible for verifying compliance with applicable regulations, including the EU GDPR, the ePrivacy Directive, and national legislation (such as Act No. 127/2005 Coll. § 89(3) in the Czech Republic).

Key technical privacy guarantees:

- **Zero telemetry:** The banner executes entirely in the user's browser. It makes zero network requests, sends no analytics, and does not contact any external servers.
- **True opt-in:** No non-essential cookie categories are pre-ticked or enabled prior to user action.
- **Equal button prominence:** Rejecting cookies is as effortless as accepting them. "Reject all" and "Accept all" are positioned side-by-side with equal visual weight.
- **No cookie wall:** The website remains completely accessible and interactive if a visitor rejects cookies.
- **Consent storage:** Stored locally in a first-party cookie named `cc_cookie` for 182 days (approx. 6 months).
- **Automatic cookie deletion:** When a category is refused or consent is withdrawn, known first-party cookies from major platforms are automatically removed:
  - Analytics: `_ga`, `_gid`, `_gat`, `_clck`, `_clsk`, `_hj*`
  - Marketing: `_fbp`, `_fbc`, `_gcl_*`, `_ttp`, `_uet*`, `_pin_unauth`
- **Hosted CDN requests:** If you load release files from `socionet.cz`, the visitor's browser connects to that server (proxied by Cloudflare), which naturally receives the client's IP address and user-agent string as with any web request. Self-host the release files if you prefer complete autonomy.

---

## Versions & Immutability

Published releases under `releases/vN.N.N/` are **immutable**. A published release is never altered, rebuilt, or overwritten, ensuring that Subresource Integrity hashes in existing embeds remain permanently valid. Any updates to the runtime, styling, or vendor library result in a new version in a new directory with a new git tag. The complete hash ledger is maintained in [`src/versions.ts`](src/versions.ts).

| Version | Released | JavaScript | CSS | Vendor Library |
| --- | --- | --- | --- | --- |
| **2.0.0** | 2026-11-09 | `plain-consent.js` | `plain-consent.css` | vanilla-cookieconsent 3.1.0 |
| **1.0.0** | 2026-11-09 | `cookie-lista.js` | `cookie-lista.css` | vanilla-cookieconsent 3.1.0 |

### Migrating from v1.x to v2.x

Release v1.0.0 was published under the original project name, `cookie-lista`. It is preserved intact in [`releases/v1.0.0/`](releases/v1.0.0/) to keep existing embed hashes valid.

Release v2.0.0 is the identical banner under the name **Plain Consent**. Because public identifiers were updated, v2.0.0 is a major version:

| Identifier | v1.x (`cookie-lista`) | v2.0.0 (`plain-consent`) |
| --- | --- | --- |
| Release files | `cookie-lista.js`, `cookie-lista.css` | `plain-consent.js`, `plain-consent.css` |
| Config element ID | `cookie-lista-nastaveni` | `plain-consent-config` |
| CSS classes | `cookie-lista-credit`, `cookie-lista-nastaveni` | `plain-consent-credit`, `plain-consent-settings` |
| Console log prefix | `Cookie lišta:` | `Plain Consent:` |

To upgrade:
1. Update script and stylesheet URLs to `plain-consent.js` and `plain-consent.css` with the v2.0.0 SRI hashes.
2. Change the JSON script element ID to `id="plain-consent-config"`.
3. If custom CSS referenced `cookie-lista-*` classes, rename them to `plain-consent-*`.

---

## Development

Requirements: Node.js 24 or newer.

```sh
npm ci
npm test         # runs tests: runtime, generator, and release immutability
npm run check    # typescript check (tsc --noEmit)
```

- Runtime source: [`src/runtime.ts`](src/runtime.ts)
- Theme styles: [`src/theme.css`](src/theme.css)
- Generator logic: [`src/generator.ts`](src/generator.ts)
- Release build script: [`scripts/build.mjs`](scripts/build.mjs)
- Test page generator: [`scripts/test-page.mjs`](scripts/test-page.mjs)
- Security reporting: see [SECURITY.md](SECURITY.md)
- Contribution guidelines: see [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Licence & Attribution

Plain Consent is open source under the MIT License. Copyright (c) 2026 Petr Hromádka ([Socionet](https://socionet.cz)). See [LICENSE](LICENSE).

Every release bundle contains, unmodified and verbatim, files from [vanilla-cookieconsent](https://github.com/orestbida/cookieconsent) 3.1.0 (MIT, Copyright (c) 2020-2025 Orest Bida). Its full license and provenance are recorded in [NOTICE](NOTICE), in the header of each released file, and in `releases/vN.N.N/LICENSE.txt`.

Plain Consent is an independent project and is not affiliated with or endorsed by the author of vanilla-cookieconsent.

---

## Česky

**Plain Consent** je bezplatný, open-source cookie banner bez závislostí. Je postavený na knihovně [vanilla-cookieconsent](https://github.com/orestbida/cookieconsent) (MIT, Orest Bida) a doplňuje kontrolovanou konfiguraci v jednom JSON bloku, Google Consent Mode v2, otisky Subresource Integrity a provoz pod přísnou Content-Security-Policy bez `'unsafe-inline'`.

- **Skutečný opt-in bez manipulace.** Nic volitelného není předem zaškrtnuté. „Přijmout vše“ a „Odmítnout vše“ jsou v první vrstvě vedle sebe se stejným vizuálním stylem. Žádná cookie wall.
- **Rychlý a lehký.** `plain-consent.js` má 46 kB (17,8 kB gzip), `plain-consent.css` 36 kB (6,8 kB gzip). Žádné další knihovny.
- **Google Consent Mode v2.** Výchozí stav je odepřený (`wait_for_update: 500`, `ads_data_redaction: true`) před spuštěním jakékoliv Google značky. Uložená volba vracejícího se návštěvníka se odešle před načtením značek.
- **Úklid po odmítnutí.** Při odmítnutí nebo odvolání souhlasu banner automaticky smaže známé cookies měřicích a reklamních nástrojů (Google Analytics, Clarity, Hotjar, Meta Pixel, Google Ads, TikTok, Microsoft Ads, Pinterest).
- **Snadné odvolání souhlasu.** Po první volbě se vlevo dole zobrazí plovoucí tlačítko se symbolem cookies pro změnu nastavení. Banner lze otevřít i vlastním odkazem v patičce (`data-cc="show-preferencesModal"`).
- **Bezpečná konfigurace.** Veškerý text se escapuje jako HTML, odkazy se ověřují (povoleny jsou jen protokoly `http(s)` a relativní cesty `/`), chybné hodnoty bezpečně přecházejí na výchozí.

### Rychlé vložení na web

1. Stáhněte `plain-consent.js` a `plain-consent.css` ze složky [`releases/v2.0.0/`](releases/v2.0.0/) na svůj server (např. do `/plain-consent/v2.0.0/`).
2. Vložte kód do `<head>` před ostatní skripty:

```html
<link rel="stylesheet" href="/plain-consent/v2.0.0/plain-consent.css" integrity="sha384-Q2cOPPvV3BauSPuRsd9k3+QwNRB6HZK4glR3pPPga2Qxj7/xzteDYdt3C+B7sXdz" crossorigin="anonymous">
<script type="application/json" id="plain-consent-config">
{
  "accent": "#1f2937",
  "categories": ["analytics", "marketing"],
  "privacyUrl": "/zasady-cookies/",
  "consentMode": true,
  "credit": false,
  "revision": 0
}
</script>
<script src="/plain-consent/v2.0.0/plain-consent.js" integrity="sha384-5FU5bjr8XxrnlQ6PE9CN8YF1SMQTr0cU54y/EwnVyRjPKhoa8GEsUYh4pRlj0aPj" crossorigin="anonymous"></script>
```

3. Skripty vyžadující souhlas označte atributem `type="text/plain"` a kategorií `data-category="analytics"` (nebo `marketing`, `preferences`).
4. Tlačítko pro odvolání v patičce: `<button type="button" data-cc="show-preferencesModal">Nastavení cookies</button>`.

### Neměnné verze

Zveřejněné verze v `releases/vN.N.N/` jsou **neměnné**. Jednou vydaný soubor se nikdy nepřestavuje ani neupravuje, aby zůstaly platné otisky Subresource Integrity. Verze 1.0.0 je zachována pod původním názvem `cookie-lista`. Přechod na 2.0.0 vyžaduje aktualizaci vloženého kódu a přejmenování `id="plain-consent-config"`.

### Právní upozornění a licence

Banner je technická pomůcka, nikoliv právní poradenství. Posouzení souladu s právními předpisy (§ 89 odst. 3 zákona č. 127/2005 Sb., GDPR) je odpovědností provozovatele webu.

MIT Licence, Copyright (c) 2026 Petr Hromádka ([Socionet](https://socionet.cz)), viz [LICENSE](LICENSE) a [NOTICE](NOTICE). Obsahuje neměnné soubory z knihovny [vanilla-cookieconsent](https://github.com/orestbida/cookieconsent) 3.1.0, MIT, Copyright (c) 2020-2025 Orest Bida.
