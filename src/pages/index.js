import { button, sectionHead, featureCard, statList, updateCards, leadForm, icon, mascot } from '../templates/components.js';

/** Home page. Section order mirrors the portal blueprint: hero → intro → trust → accounts → markets → why → IB → updates → form. */
export default {
  title: (t) => t.nav.index,
  render(ctx) {
    const { t, config } = ctx;
    const video = config.introVideoYoutubeId
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${config.introVideoYoutubeId}" title="${t.intro.videoLabel}" allowfullscreen loading="lazy"></iframe>`
      : `<div class="video-placeholder">
           ${mascot(ctx, { width: 110 }) || `<img src="${ctx.asset('img/logo/wegolden-app-icon-yellow.png')}" alt="" width="90" height="90">`}
           <span class="play">${icon('play')}</span>
           <b>${t.intro.videoLabel}</b><small>${t.intro.videoSoon}</small>
         </div>`;

    const heroMascot = mascot(ctx, { cls: 'hero__mascot', alt: t.hero.mascotAlt, width: 380, lazy: false });
    const heroArt = heroMascot
      ? `<p class="speech">${t.hero.bubble}</p>${heroMascot}`
      : `<img class="hero__mark" src="${ctx.asset('img/logo/wegolden-app-icon-yellow.png')}" alt="WeGolden" width="270" height="270">`;

    return `
    <!-- HERO -->
    <section class="hero">
      <div class="container hero__grid">
        <div class="hero__copy">
          <p class="eyebrow">${t.hero.eyebrow}</p>
          <h1>${t.hero.title}</h1>
          <p class="lead">${t.hero.lead}</p>
          <div class="btn-row">
            ${button(t.hero.ctaPrimary, config.links.openAccount, 'primary', { arrow: true, external: true })}
            ${button(t.hero.ctaSecondary, ctx.href('partners'), 'outline')}
          </div>
        </div>
        <div class="hero__art">
          <div class="hero__glow" aria-hidden="true"></div>
          <span class="coin coin--1" aria-hidden="true"></span>
          <span class="coin coin--2" aria-hidden="true"></span>
          <span class="coin coin--3" aria-hidden="true"></span>
          ${heroArt}
        </div>
      </div>
      <div class="container">
        ${statList(t.hero.stats, 'stats--hero')}
        <p class="footnote">${t.hero.footnote}</p>
      </div>
    </section>

    <!-- INTRO -->
    <section class="section">
      <div class="container split">
        <div>
          ${sectionHead(t.intro)}
          ${t.intro.body.map((p) => `<p class="body-text">${p}</p>`).join('')}
          ${button(t.intro.cta, ctx.href('about'), 'link', { arrow: true })}
        </div>
        <div class="video-frame">${video}</div>
      </div>
    </section>

    <!-- TRUST -->
    <section class="section section--alt">
      <div class="container">
        ${sectionHead(t.trust, 'center')}
        <div class="grid grid-3">${t.trust.items.map(featureCard).join('')}</div>
      </div>
    </section>

    <!-- ACCOUNTS -->
    <section class="section">
      <div class="container">
        ${sectionHead(t.accounts, 'center')}
        <div class="grid grid-4">
          ${t.accounts.items
            .map(
              (a) => `
            <article class="card account-card${a.featured ? ' account-card--featured' : ''}">
              <span class="tag">${a.tag}</span>
              <h3 dir="ltr">${a.name}</h3>
              <ul class="check-list">${a.points.map((p) => `<li>${icon('check')}${p}</li>`).join('')}</ul>
            </article>`,
            )
            .join('')}
        </div>
        <p class="footnote center">${t.accounts.note}</p>
        <div class="center">${button(t.accounts.cta, `${ctx.href('guides')}#accounts`, 'outline')}</div>
      </div>
    </section>

    <!-- MARKETS -->
    <section class="section section--alt">
      <div class="container">
        ${sectionHead(t.markets, 'center')}
        <ul class="market-strip">
          ${t.markets.items
            .map((m) => `<li><span class="ticker">${m.code}</span><b>${m.name}</b><small>${m.desc}</small></li>`)
            .join('')}
        </ul>
      </div>
    </section>

    <!-- WHY -->
    <section class="section">
      <div class="container split split--art">
        ${mascot(ctx, { cls: 'why-mascot', width: 320 }) || `<img class="why-mark" src="${ctx.asset('img/logo/wegolden-app-icon-yellow.png')}" alt="" width="220" height="220" loading="lazy">`}
        <div>
          ${sectionHead(t.why)}
          <div class="grid grid-2">${t.why.items.map(featureCard).join('')}</div>
        </div>
      </div>
    </section>

    <!-- IB -->
    <section class="section section--gold">
      <div class="container">
        ${sectionHead(t.ib, 'center')}
        ${statList(t.ib.items, 'stats--ib')}
        <div class="center">${button(t.ib.cta, ctx.href('partners'), 'dark', { arrow: true })}</div>
        <p class="footnote center">${t.ib.note}</p>
      </div>
    </section>

    <!-- UPDATES -->
    <section class="section">
      <div class="container">
        ${sectionHead(t.updates)}
        ${updateCards(t.updates.items)}
        <div class="center">${button(t.updates.more, ctx.href('activities'), 'link', { arrow: true })}</div>
      </div>
    </section>

    ${leadForm(ctx)}`;
  },
};
