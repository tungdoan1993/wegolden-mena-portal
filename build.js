/**
 * WeGolden MENA portal — static build (no dependencies).
 *   src/i18n/*.json   → copy per language
 *   src/pages/*.js    → page templates (one file per page)
 *   src/templates/    → layout, partials, components
 *   public/           → static assets, copied as-is
 * Output: dist/{en,ar,fa}/*.html + dist/assets + dist/index.html (language redirect)
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './src/config.js';
import { layout } from './src/templates/layout.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

const dictionaries = Object.fromEntries(
  config.languages.map((l) => [l, JSON.parse(readFileSync(join(ROOT, 'src/i18n', `${l}.json`), 'utf8'))]),
);
const languages = config.languages.map((code) => ({ code, label: dictionaries[code].meta.label }));

rmSync(DIST, { recursive: true, force: true });
cpSync(join(ROOT, 'public'), DIST, { recursive: true });

let count = 0;
for (const lang of config.languages) {
  const t = dictionaries[lang];
  mkdirSync(join(DIST, lang), { recursive: true });

  for (const page of config.pages) {
    const { default: tpl } = await import(`./src/pages/${page}.js`);
    const ctx = {
      t,
      lang,
      page,
      config,
      languages,
      href: (p) => `${p}.html`,
      asset: (p) => `../assets/${p}`,
      altLang: (l) => `../${l}/${page}.html`,
    };
    const html = layout({ ctx, title: tpl.title(t), body: tpl.render(ctx) });
    writeFileSync(join(DIST, lang, `${page}.html`), html);
    count++;
  }
}

// Root: send visitors to their saved or browser language.
writeFileSync(
  join(DIST, 'index.html'),
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>WeGolden MENA</title>
<script>
  (function () {
    var langs = ${JSON.stringify(config.languages)}, pick = '${config.defaultLanguage}';
    try { var saved = localStorage.getItem('wg-lang'); if (langs.indexOf(saved) > -1) pick = saved; else throw 0; }
    catch (e) { var nav = (navigator.language || '').slice(0, 2); if (langs.indexOf(nav) > -1) pick = nav; }
    location.replace(pick + '/index.html');
  })();
</script></head>
<body style="background:#0a0a0a;color:#f5f5f5;font-family:system-ui;text-align:center;padding:4rem">
${languages.map((l) => `<a style="color:#ffc400;margin:0 1rem" href="${l.code}/index.html">${l.label}</a>`).join('')}
</body></html>
`,
);

// Hosting files: custom domain (GitHub Pages), robots, sitemap.
writeFileSync(join(DIST, 'CNAME'), `${config.domain}\n`);
writeFileSync(join(DIST, '.nojekyll'), '');
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
const urls = config.languages.flatMap((l) =>
  config.pages.map((p) => {
    const alts = config.languages
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${config.siteUrl}/${a}/${p}.html"/>`)
      .join('\n');
    return `  <url>\n    <loc>${config.siteUrl}/${l}/${p}.html</loc>\n${alts}\n  </url>`;
  }),
);
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
);

console.log(`✔ Built ${count} pages (${config.languages.join(', ')}) → dist/`);
