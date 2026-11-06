import { pageHero, sectionHead, dataTable, icon } from '../templates/components.js';

export default {
  title: (t) => t.pages.about.title,
  render(ctx) {
    const a = ctx.t.pages.about;
    return `
    ${pageHero(a, ctx)}

    <section class="section" id="licences">
      <div class="container">
        ${sectionHead({ title: a.licTitle })}
        ${dataTable(a.licCols, a.licRows)}
        <p class="footnote">${a.licNote}</p>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        ${sectionHead({ title: a.groupTitle }, 'center')}
        <div class="grid grid-3">
          ${a.group
            .map((g) => `<article class="card group-card"><h3 dir="ltr">${g.title}</h3><p>${g.body}</p></article>`)
            .join('')}
        </div>
      </div>
    </section>

    <section class="section" id="offices">
      <div class="container">
        ${sectionHead({ title: a.officesTitle })}
        <div class="grid grid-3">
          ${a.offices
            .map(
              (o) => `
            <article class="card office-card">
              <span class="icon-badge">${icon('pin')}</span>
              <h3>${o.title}</h3><p>${o.body}</p>
            </article>`,
            )
            .join('')}
        </div>
      </div>
    </section>`;
  },
};
