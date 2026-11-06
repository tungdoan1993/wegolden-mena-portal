import { header } from './partials/header.js';
import { footer } from './partials/footer.js';
import { promoStrip } from './components.js';

const NO_PROMO_STRIP = ['promotions', 'partner-area'];

const FONTS = {
  en: 'family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700',
  ar: 'family=Cairo:wght@400;500;600;700;800&family=Poppins:wght@600;700;800',
  fa: 'family=Vazirmatn:wght@400;500;600;700;800&family=Poppins:wght@600;700;800',
};

/** Full HTML document shell shared by every page and language. */
export function layout({ ctx, title, body, scripts = [], noindex = false }) {
  const { t, lang, page, config } = ctx;
  const pageTitle = page === 'index' ? `${t.meta.siteName} — ${t.nav.index}` : `${title} — ${t.meta.siteName}`;
  const alternates = config.languages
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${config.siteUrl}/${l}/${page}.html">`)
    .join('\n  ');

  return `<!doctype html>
<html lang="${lang}" dir="${t.meta.dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${pageTitle}</title>
  <meta name="description" content="${t.meta.description}">
  <meta name="theme-color" content="#0a0a0a">${noindex ? '\n  <meta name="robots" content="noindex, nofollow">' : ''}
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${t.meta.description}">
  <meta property="og:image" content="${config.siteUrl}/assets/img/og-cover.png">
  ${alternates}
  <link rel="alternate" hreflang="x-default" href="${config.siteUrl}/">
  <link rel="icon" href="${ctx.asset('img/logo/wegolden-mark-yellow.png')}" type="image/png">
  <link rel="apple-touch-icon" href="${ctx.asset('img/logo/wegolden-app-icon-yellow.png')}">
  <link rel="canonical" href="${config.siteUrl}/${lang}/${page}.html">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?${FONTS[lang]}&display=swap">
  <link rel="stylesheet" href="${ctx.asset('css/tokens.css')}">
  <link rel="stylesheet" href="${ctx.asset('css/base.css')}">
  <link rel="stylesheet" href="${ctx.asset('css/layout.css')}">
  <link rel="stylesheet" href="${ctx.asset('css/components.css')}">
  <link rel="stylesheet" href="${ctx.asset('css/pages.css')}">
</head>
<body class="page-${page}">
  <a class="skip-link" href="#main">${t.common.skip}</a>
  ${header(ctx)}
  <main id="main">
${body}
${NO_PROMO_STRIP.includes(page) ? '' : promoStrip(ctx)}
  </main>
  ${footer(ctx)}
  <script src="${ctx.asset('js/main.js')}" defer></script>${scripts.map((s) => `\n  <script src="${ctx.asset(s)}" defer></script>`).join('')}
</body>
</html>
`;
}
