import { pageHero, sectionHead, dataTable, noteList, icon, button } from '../templates/components.js';

export default {
  title: (t) => t.pages.promotions.title,
  render(ctx) {
    const p = ctx.t.pages.promotions;
    return `
    ${pageHero(p, ctx)}

    <section class="section">
      <div class="container">
        <div class="grid grid-2 promo-detail">
          ${[
            { id: 'goldflash', title: p.goldTitle, lead: p.goldLead, points: p.goldPoints, item: ctx.t.promos.items[0] },
            { id: 'bonus', title: p.bonusTitle, lead: p.bonusLead, points: p.bonusPoints, item: ctx.t.promos.items[1] },
          ]
            .map(
              (x) => `
          <article class="card promo-detail__card" id="${x.id}">
            <div class="promo-card__top"><span class="tag">${x.item.tag}</span><span class="promo-card__value" dir="ltr">${x.item.value}</span></div>
            <h2>${x.title}</h2>
            <p>${x.lead}</p>
            ${noteList(x.points)}
            ${button(p.termsCta, ctx.config.promoTerms[x.id], 'link', { arrow: true, external: true })}
          </article>`,
            )
            .join('')}
        </div>
        <p class="footnote">${ctx.t.promos.note}</p>
      </div>
    </section>

    <section class="section section--alt" id="freeswap">
      <div class="container split">
        <div>
          ${sectionHead({ title: p.swapTitle, sub: p.swapLead })}
          ${noteList(p.swapNotes)}
          ${button(p.termsCta, ctx.config.promoTerms.freeswap, 'link', { arrow: true, external: true })}
        </div>
        ${dataTable(p.swapCols, p.swapRows, { highlightLast: true })}
      </div>
    </section>

    <section class="section" id="savings">
      <div class="container">
        ${sectionHead({ title: p.savingsTitle, sub: p.savingsLead })}
        ${dataTable(p.savingsCols, p.savingsRows, { highlightLast: true })}
        <p class="footnote">${p.savingsNote}</p>
      </div>
    </section>

    <section class="section" id="league">
      <div class="container">
        <article class="card promo-banner">
          <span class="icon-badge icon-badge--lg">${icon('trophy')}</span>
          <div>
            <span class="tag">${ctx.t.common.comingSoon}</span>
            <h2>${p.leagueTitle}</h2>
            <p>${p.leagueBody}</p>
          </div>
        </article>
      </div>
    </section>`;
  },
};
