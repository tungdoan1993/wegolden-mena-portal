import { pageHero, sectionHead, dataTable, statList, leadForm, button } from '../templates/components.js';

export default {
  title: (t) => t.pages.partners.title,
  render(ctx) {
    const p = ctx.t.pages.partners;
    return `
    ${pageHero(p, ctx)}

    <section class="section">
      <div class="container split">
        <div>
          ${sectionHead({ title: p.rebateTitle, sub: p.rebateLead })}
          ${dataTable(p.rebateCols, p.rebateRows)}
        </div>
        <div>
          ${sectionHead({ title: p.levelsTitle })}
          ${statList(p.levels, 'stats--stack')}
        </div>
      </div>
    </section>

    <section class="section section--alt" id="mib">
      <div class="container">
        ${sectionHead({ title: p.mibTitle, sub: p.mibLead })}
        <div class="mib-grid">${dataTable(p.mibCols, p.mibRows, { highlightLast: true })}</div>
        <p class="footnote">${p.mibNote}</p>
      </div>
    </section>

    <section class="section">
      <div class="container narrow">
        <article class="card callout">
          <h3>${p.condTitle}</h3>
          <p>${p.condBody}</p>
        </article>
        <p class="footnote center">${p.legal}</p>
        <div class="center">${button(p.brochureCta, ctx.href('brochure'), 'primary', { arrow: true })}</div>
      </div>
    </section>

    ${leadForm(ctx)}`;
  },
};
