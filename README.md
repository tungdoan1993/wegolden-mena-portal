# WeGolden MENA Portal — mena.wegolden.com

Multilingual portal (English · العربية · فارسی) for WeGolden in the Middle East & North Africa.
Static site, zero dependencies — Node 18+ only.

```bash
npm run build     # → dist/
npm run serve     # build + preview at http://localhost:3000
```

Pushing to `main` builds and deploys automatically to GitHub Pages (`.github/workflows/deploy.yml`).

## Structure
```
wegolden-portal/
├── build.js                  # static generator: i18n × pages → dist/ (+ CNAME, sitemap, robots)
├── src/
│   ├── config.js             # domain, links, contacts, mascot, brochures, form endpoint  ← edit here
│   ├── i18n/                 # ALL copy — en.json, ar.json (RTL), fa.json (RTL), same keys
│   ├── pages/                # one template per page, shared by all languages
│   │   └── index · guides · promotions · partners · brochure · about · activities
│   └── templates/            # layout.js, components.js, partials/header.js, partials/footer.js
├── public/                   # copied as-is into dist/
│   ├── assets/css/           # tokens.css (MENA brand) · base · layout · components · pages
│   ├── assets/js/main.js     # mobile nav, language memory, lead form
│   ├── assets/img/           # logo/ (MENA lockups, mark, app icon) · mascot/ · patterns/ · og-cover.png
│   └── brochure/             # partner flipbook(s), embedded on the Brochure page
└── .github/workflows/        # GitHub Pages deploy
```

## Common tasks
| Task | Where |
|---|---|
| Change text / translation | `src/i18n/<lang>.json` |
| Links, Telegram, emails, domain | `src/config.js` |
| Show the mascot on Farsi pages | add `'fa'` to `mascot.languages` in `src/config.js` |
| Add an Arabic/Farsi brochure | put the file in `public/brochure/`, add it to `brochures` in `src/config.js` |
| Connect lead form to HubSpot | `leadFormEndpoint` in `src/config.js` |
| Brand colours / fonts | `public/assets/css/tokens.css` (source: brand-assets/brand.json → mena) |
| Add a page | file in `src/pages/`, add to `config.pages`, add `nav.<key>` + `pages.<key>` in each i18n file, add to NAV in header/footer |

RTL: Arabic and Farsi set `dir="rtl"`; CSS uses logical properties, so there is no separate RTL stylesheet.

## Custom domain
`dist/CNAME` is generated from `config.domain`. DNS (Cloudflare, zone wegolden.com):
`CNAME  mena  →  <github-user>.github.io` (DNS only until the GitHub certificate is issued), then
GitHub → Settings → Pages → Custom domain `mena.wegolden.com` → Enforce HTTPS.
