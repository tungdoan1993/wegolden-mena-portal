import { icon } from '../components.js';
import { brand } from './header.js';

const QUICK = ['index', 'guides', 'promotions', 'partners', 'brochure', 'about', 'activities'];

export function footer(ctx) {
  const { t, config } = ctx;
  const year = new Date().getFullYear();
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        ${brand(ctx)}
        <p>${t.footer.tagline}</p>
        <a class="footer-link-ext" href="${config.links.mainSite}" target="_blank" rel="noopener">wegolden.com</a>
      </div>

      <div>
        <h4>${t.footer.quick}</h4>
        <ul class="footer-list">
          ${QUICK.map((p) => `<li><a href="${ctx.href(p)}">${t.nav[p]}</a></li>`).join('')}
        </ul>
      </div>

      <div>
        <h4>${t.footer.contact}</h4>
        <ul class="footer-list footer-list--icons">
          <li>${icon('pin')}<span><b>${t.footer.addressLabel}</b><br><span dir="ltr">${t.footer.address}</span></span></li>
          <li>${icon('mail')}<a href="mailto:${config.contact.support}">${config.contact.support}</a></li>
          <li>${icon('users')}<a href="mailto:${config.contact.partners}">${config.contact.partners}</a></li>
        </ul>
      </div>

      <div>
        <h4>${t.footer.follow}</h4>
        <a class="btn btn-telegram" href="${config.links.telegram}" target="_blank" rel="noopener">${icon('telegram')}Telegram</a>
      </div>
    </div>

    <div class="container footer-bottom">
      <p class="risk">${t.footer.risk}</p>
      <div class="footer-bottom__row">
        <span>© ${year} WeGolden. ${t.footer.rights}</span>
        <a href="#main" class="back-to-top">${t.common.backToTop} ↑</a>
      </div>
    </div>
  </footer>`;
}
