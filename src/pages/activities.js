import { pageHero, sectionHead, updateCards, button, icon } from '../templates/components.js';

export default {
  title: (t) => t.pages.activities.title,
  render(ctx) {
    const { t, config } = ctx;
    const a = t.pages.activities;
    return `
    ${pageHero(a, ctx)}

    <section class="section">
      <div class="container">
        ${sectionHead({ eyebrow: t.updates.eyebrow, title: t.updates.title })}
        ${updateCards(t.updates.items)}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <article class="card tg-banner">
          <span class="icon-badge icon-badge--tg">${icon('telegram')}</span>
          <div>
            <h2>${a.tgTitle}</h2>
            <p>${a.tgBody}</p>
          </div>
          ${button(a.tgCta, config.links.telegram, 'telegram', { external: true })}
        </article>
      </div>
    </section>`;
  },
};
