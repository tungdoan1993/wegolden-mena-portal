/**
 * Small, reusable HTML building blocks.
 * Every function returns a string; no page should hand-write these patterns twice.
 */

const ICONS = {
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z M9 12l2 2 4-4',
  license: 'M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6',
  bank: 'M3 10l9-6 9 6 M5 10v8 M9.5 10v8 M14.5 10v8 M19 10v8 M3 21h18',
  platform: 'M3 4h18v12H3z M8 20h8 M12 16v4 M6.5 12l3-3 3 2 5-5',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2',
  chat: 'M4 5h16v11H9l-5 4z M8 9.5h8 M8 12.5h5',
  coins: 'M12 4c4 0 7 1.3 7 3s-3 3-7 3-7-1.3-7-3 3-3 7-3z M5 7v5c0 1.7 3 3 7 3s7-1.3 7-3V7 M5 12v5c0 1.7 3 3 7 3s7-1.3 7-3v-5',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z M4 20.5V5.5 M8 7.5h8',
  layers: 'M12 3l9 5-9 5-9-5z M3 13l9 5 9-5',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0z M8 6H4a3 3 0 0 0 4 4 M16 6h4a3 3 0 0 1-4 4 M12 13v4 M8 21h8 M9 17h6v4H9z',
  telegram: 'M21 4L3 11l6 2 2 6 3-4 5 4z M9 13l9-6',
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  pin: 'M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z M12 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  play: 'M8 5l11 7-11 7z',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7 M16 3.5a4 4 0 0 1 0 7.5 M18 14.5c2.4.9 4 3.2 4 6.5',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c3 3.5 3 14.5 0 18 M12 3c-3 3.5-3 14.5 0 18',
};

export function icon(name, cls = '') {
  const d = ICONS[name];
  if (!d) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="icon icon-${name} ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
}

/** Official MENA mascot (brand-assets/mena/mascot). Returns '' where config hides it for a language. */
export function mascot(ctx, { cls = '', alt = '', width = 300, lazy = true } = {}) {
  if (!ctx.config.mascot.languages.includes(ctx.lang)) return '';
  const height = Math.round(width / ctx.config.mascot.ratio);
  return `<img class="mascot ${cls}" src="${ctx.asset(ctx.config.mascot.src)}" alt="${alt}" width="${width}" height="${height}"${lazy ? ' loading="lazy"' : ''}>`;
}

export function button(label, href, variant = 'primary', { arrow = false, external = false } = {}) {
  const ext = external ? ' target="_blank" rel="noopener"' : '';
  return `<a class="btn btn-${variant}" href="${href}"${ext}>${label}${arrow ? icon('arrow') : ''}</a>`;
}

export function sectionHead({ eyebrow, title, sub }, align = 'start') {
  return `
    <header class="section-head section-head--${align}">
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
      <h2 class="section-title">${title}</h2>
      ${sub ? `<p class="section-sub">${sub}</p>` : ''}
    </header>`;
}

export function featureCard({ icon: ic, title, body }) {
  return `
    <article class="card feature-card">
      <span class="icon-badge">${icon(ic)}</span>
      <h3>${title}</h3>
      <p>${body}</p>
    </article>`;
}

export function statList(items, cls = '') {
  return `
    <dl class="stats ${cls}">
      ${items.map((s) => `<div class="stat"><dt>${s.value}</dt><dd>${s.label}</dd></div>`).join('')}
    </dl>`;
}

export function dataTable(cols, rows, { highlightLast = false } = {}) {
  return `
    <div class="table-wrap">
      <table class="data-table${highlightLast ? ' data-table--hl' : ''}">
        <thead><tr>${cols.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

export function noteList(notes) {
  return `<ul class="note-list">${notes.map((n) => `<li>${n}</li>`).join('')}</ul>`;
}

export function pageHero({ title, lead }, ctx) {
  return `
    <section class="page-hero">
      <div class="container page-hero__inner">
        <div>
          <p class="eyebrow">${ctx.t.meta.siteName}</p>
          <h1>${title}</h1>
          <p class="lead">${lead}</p>
        </div>
        ${mascot(ctx, { cls: 'page-hero__mascot', width: 150, lazy: false })}
      </div>
    </section>`;
}

export function updateCards(items) {
  return `
    <div class="grid grid-3">
      ${items
        .map(
          (u) => `
        <article class="card update-card">
          <div class="update-card__top">${icon(u.icon)}<span class="tag">${u.tag}</span></div>
          <h3>${u.title}</h3>
          <p>${u.body}</p>
        </article>`,
        )
        .join('')}
    </div>`;
}

/** IB lead form — posts to config.leadFormEndpoint if set (see src/config.js). */
export function leadForm(ctx) {
  const f = ctx.t.form;
  const field = (name, label, type = 'text', req = true) => `
    <label class="field">
      <span>${label}</span>
      <input name="${name}" type="${type}" ${req ? 'required' : ''} autocomplete="${name === 'name' ? 'name' : name === 'phone' ? 'tel' : name}">
    </label>`;
  return `
    <section class="section section--form" id="partner-form">
      <div class="container form-wrap">
        <div class="form-intro">
          ${sectionHead({ eyebrow: f.eyebrow, title: f.title, sub: f.sub })}
          ${mascot(ctx, { cls: 'form-mascot', alt: ctx.t.hero.mascotAlt, width: 230 })}
        </div>
        <form class="card lead-form" data-lead-form data-endpoint="${ctx.config.leadFormEndpoint}" novalidate>
          <input type="hidden" name="language" value="${ctx.lang}">
          <div class="form-grid">
            ${field('name', f.name)}
            ${field('email', f.email, 'email')}
            ${field('phone', f.phone, 'tel')}
            ${field('country', f.country)}
          </div>
          <label class="field">
            <span>${f.type}</span>
            <select name="profile">${f.typeOptions.map((o) => `<option>${o}</option>`).join('')}</select>
          </label>
          <label class="field">
            <span>${f.message}</span>
            <textarea name="message" rows="3"></textarea>
          </label>
          <label class="check"><input type="checkbox" name="consent" required> <span>${f.consent}</span></label>
          <button class="btn btn-primary btn-block" type="submit">${f.submit}</button>
          <p class="form-status" role="status" data-success="${f.success}" data-error="${f.error}"></p>
        </form>
      </div>
    </section>`;
}
