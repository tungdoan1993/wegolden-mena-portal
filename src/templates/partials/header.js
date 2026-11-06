import { icon } from '../components.js';

const NAV = ['index', 'guides', 'promotions', 'partners', 'brochure', 'about', 'activities'];

export function brand(ctx) {
  return `
    <a class="brand" href="${ctx.href('index')}" aria-label="WeGolden MENA">
      <img src="${ctx.asset('img/logo/wegolden-mena-logo-white.png')}" alt="WeGolden MENA" width="660" height="288">
    </a>`;
}

function languageSwitch(ctx) {
  return `
    <nav class="lang-switch" aria-label="${ctx.t.common.language}">
      ${icon('globe')}
      ${ctx.languages
        .map(
          (l) =>
            `<a href="${ctx.altLang(l.code)}" hreflang="${l.code}" lang="${l.code}" data-lang="${l.code}"${
              l.code === ctx.lang ? ' aria-current="true"' : ''
            }>${l.label}</a>`,
        )
        .join('')}
    </nav>`;
}

export function header(ctx) {
  const { t, page, config } = ctx;
  return `
  <div class="topbar">
    <div class="container topbar__inner">
      <span>${t.topbar.text}</span>
      <a href="${ctx.href('promotions')}">${t.topbar.cta}</a>
    </div>
  </div>

  <div class="utility">
    <div class="container utility__inner">
      <span class="utility__region">${t.utility.region}</span>
      <div class="utility__links">
        <a href="${config.links.telegram}" target="_blank" rel="noopener">${icon('telegram')}${t.utility.telegram}</a>
        <a href="mailto:${config.contact.support}">${icon('mail')}${t.utility.email}</a>
        ${languageSwitch(ctx)}
      </div>
    </div>
  </div>

  <header class="site-header" data-header>
    <div class="container site-header__inner">
      ${brand(ctx)}
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" data-nav-toggle>
        ${icon('menu')}<span class="sr-only">${t.common.menu}</span>
      </button>
      <nav class="main-nav" id="main-nav" data-nav>
        <ul>
          ${NAV.map(
            (p) => `<li><a href="${ctx.href(p)}"${p === page ? ' aria-current="page"' : ''}>${t.nav[p]}</a></li>`,
          ).join('')}
        </ul>
        <div class="main-nav__actions">
          <a class="btn btn-ghost" href="${config.links.clientArea}" target="_blank" rel="noopener">${t.nav.login}</a>
          <a class="btn btn-primary" href="${config.links.openAccount}" target="_blank" rel="noopener">${t.nav.openAccount}</a>
        </div>
      </nav>
    </div>
  </header>`;
}
