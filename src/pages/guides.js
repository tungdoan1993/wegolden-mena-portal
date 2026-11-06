import { pageHero, sectionHead, dataTable, noteList, button } from '../templates/components.js';

export default {
  title: (t) => t.pages.guides.title,
  render(ctx) {
    const g = ctx.t.pages.guides;
    return `
    ${pageHero(g, ctx)}

    <section class="section">
      <div class="container">
        ${sectionHead({ title: g.stepsTitle })}
        <ol class="steps">
          ${g.steps.map((s) => `<li class="card step"><h3>${s.title}</h3><p>${s.body}</p></li>`).join('')}
        </ol>
        <div class="center">${button(ctx.t.nav.openAccount, ctx.config.links.openAccount, 'primary', { arrow: true, external: true })}</div>
      </div>
    </section>

    <section class="section section--alt" id="accounts">
      <div class="container">
        ${sectionHead({ title: g.accountsTitle })}
        ${dataTable(g.accountsCols, g.accountsRows)}
      </div>
    </section>

    <section class="section" id="leverage">
      <div class="container split">
        <div>
          ${sectionHead({ title: g.leverageTitle, sub: g.leverageLead })}
          ${noteList(g.leverageNotes)}
        </div>
        ${dataTable(g.leverageCols, g.leverageRows)}
      </div>
    </section>

    <section class="section section--alt" id="faq">
      <div class="container narrow">
        ${sectionHead({ title: g.faqTitle }, 'center')}
        <div class="faq">
          ${g.faq.map((f) => `<details class="card"><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}
        </div>
      </div>
    </section>`;
  },
};
