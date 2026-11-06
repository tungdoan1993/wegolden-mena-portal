import { pageHero, sectionHead, dataTable, noteList, icon } from '../templates/components.js';

export default {
  title: (t) => t.pages.promotions.title,
  render(ctx) {
    const p = ctx.t.pages.promotions;
    return `
    ${pageHero(p, ctx)}

    <section class="section" id="swap-free">
      <div class="container split">
        <div>
          ${sectionHead({ title: p.swapTitle, sub: p.swapLead })}
          ${noteList(p.swapNotes)}
        </div>
        ${dataTable(p.swapCols, p.swapRows, { highlightLast: true })}
      </div>
    </section>

    <section class="section section--alt" id="savings">
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
