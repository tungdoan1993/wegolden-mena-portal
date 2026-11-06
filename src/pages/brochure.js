import { pageHero, button } from '../templates/components.js';

/** Embeds the partner flipbook (public/brochure/*). Falls back to the English edition. */
export default {
  title: (t) => t.pages.brochure.title,
  render(ctx) {
    const b = ctx.t.pages.brochure;
    const file = ctx.config.brochures[ctx.lang] || ctx.config.brochures.en;
    const src = `../${file}`;
    const note = ctx.config.brochures[ctx.lang] ? '' : b.editionNote;
    return `
    ${pageHero(b, ctx)}

    <section class="section">
      <div class="container">
        <div class="brochure-bar">
          <p class="footnote">${note ? `<span class="tag">${note}</span> ` : ''}${b.hint}</p>
          ${button(b.open, src, 'outline', { arrow: true, external: true })}
        </div>
        <div class="brochure-frame">
          <iframe src="${src}" title="${b.title}" loading="lazy" allowfullscreen></iframe>
        </div>
      </div>
    </section>`;
  },
};
