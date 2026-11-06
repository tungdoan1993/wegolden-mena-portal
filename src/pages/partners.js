import { pageHero, button, icon, leadForm } from '../templates/components.js';

/**
 * Public Partners page = the partner brochure (flipbook, no reward amounts)
 * + a pointer to the login-only Partner Area for the confidential reward levels.
 */
export default {
  title: (t) => t.pages.partners.title,
  render(ctx) {
    const p = ctx.t.pages.partners;
    const src = `../${ctx.config.brochures[ctx.lang] || ctx.config.brochures.en}`;
    return `
    ${pageHero(p, ctx)}

    <section class="section">
      <div class="container">
        <div class="brochure-bar">
          <p class="footnote">${p.hint}</p>
          ${button(p.open, src, 'outline', { arrow: true, external: true })}
        </div>
        <div class="brochure-frame">
          <iframe src="${src}" title="${p.title}" loading="lazy" allowfullscreen></iframe>
        </div>
        <p class="footnote center">${p.legal}</p>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container narrow">
        <article class="card locked-card">
          <span class="icon-badge icon-badge--lg">${icon('shield')}</span>
          <div>
            <h2>${p.lockedTitle}</h2>
            <p>${p.lockedBody}</p>
            <div class="btn-row">
              ${button(p.loginCta, ctx.href('partner-area'), 'primary', { arrow: true })}
              ${button(p.requestCta, '#partner-form', 'outline')}
            </div>
          </div>
        </article>
      </div>
    </section>

    ${leadForm(ctx)}`;
  },
};
