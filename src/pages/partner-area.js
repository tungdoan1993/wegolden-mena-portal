import { readFileSync, existsSync } from 'node:fs';
import { icon, pageHero } from '../templates/components.js';

const PAYLOAD = new URL('../encrypted/ib-scheme.json', import.meta.url);

/**
 * Partner Area — login-gated detailed IB scheme.
 * The content ships encrypted (src/encrypted/ib-scheme.json) and is decrypted in the browser
 * by assets/js/partner-area.js once the partner enters the correct ID and password.
 */
export default {
  title: (t) => t.pages.partnerArea.title,
  scripts: ['js/partner-area.js'],
  noindex: true,
  render(ctx) {
    const p = ctx.t.pages.partnerArea;
    const payload = existsSync(PAYLOAD) ? readFileSync(PAYLOAD, 'utf8') : '';
    return `
    ${pageHero(p, ctx)}

    <section class="section">
      <div class="container narrow">
        <form class="card login-card" data-partner-login data-lang="${ctx.lang}" novalidate>
          <span class="icon-badge">${icon('shield')}</span>
          <h2>${p.loginTitle}</h2>
          <p class="footnote">${p.loginNote}</p>
          <label class="field"><span>${p.id}</span><input name="id" autocomplete="username" required dir="ltr"></label>
          <label class="field"><span>${p.password}</span><input name="password" type="password" autocomplete="current-password" required dir="ltr"></label>
          <button class="btn btn-primary btn-block" type="submit">${p.submit}</button>
          <p class="form-status" role="status" data-error="${p.error}" data-loading="${p.loading}"></p>
          <p class="footnote">${p.help} <a href="mailto:${ctx.config.contact.partners}">${ctx.config.contact.partners}</a></p>
        </form>

        <div class="partner-content" data-partner-content hidden>
          <div class="partner-bar">
            <button class="btn btn-ghost" type="button" data-partner-logout>${p.logout}</button>
            <button class="btn btn-ghost" type="button" onclick="window.print()">${p.print}</button>
          </div>
          <div data-partner-output></div>
        </div>
      </div>
    </section>
    <script type="application/json" id="ib-payload">${payload}</script>`;
  },
};
