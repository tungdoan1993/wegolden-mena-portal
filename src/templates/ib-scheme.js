import { dataTable, statList, noteList } from './components.js';

/**
 * Renders the detailed IB scheme (one language) to HTML.
 * Used only by tools/encrypt-ib-scheme.mjs — the output is encrypted before it reaches the repo.
 */
export function renderScheme(s, version) {
  const block = (inner, alt = false) => `<section class="ib-block${alt ? ' ib-block--alt' : ''}">${inner}</section>`;
  return `
  <header class="ib-head">
    <span class="tag">${s.badge}</span>
    <h2>${s.title}</h2>
    <p class="lead">${s.welcome}</p>
    <p class="footnote" dir="ltr">v${version}</p>
  </header>

  ${block(`<h3>${s.rebate.title}</h3><p>${s.rebate.lead}</p>${dataTable(s.rebate.cols, s.rebate.rows)}<p class="footnote">${s.rebate.note}</p>`)}

  ${block(`<h3>${s.share.title}</h3><p>${s.share.lead}</p>
    <p class="ib-label">${s.share.example}</p>
    <ol class="ib-flow">${s.share.steps.map((x) => `<li><b dir="ltr">${x.value}</b><span>${x.label}</span></li>`).join('')}</ol>`, true)}

  ${block(`<h3>${s.levels.title}</h3><p>${s.levels.lead}</p>${statList(s.levels.items, 'stats--stack ib-levels')}<p class="ib-example">${s.levels.example}</p>`)}

  ${block(`<h3>${s.payout.title}</h3>${noteList(s.payout.items)}`, true)}

  ${block(`<h3>${s.nd.title}</h3><p class="ib-formula">${s.nd.formula}</p>${noteList(s.nd.items)}
    <ul class="ib-calc">${s.nd.examples.map((e) => `<li dir="ltr">${e}</li>`).join('')}</ul>`)}

  ${block(`<h3>${s.mib.title}</h3><p>${s.mib.lead}</p>${dataTable(s.mib.cols, s.mib.rows, { highlightLast: true })}${noteList(s.mib.rules)}`, true)}

  ${block(`<h3>${s.extra.title}</h3><p>${s.extra.body}</p>`)}

  ${block(`<h3>${s.tools.title}</h3>${noteList(s.tools.items)}`, true)}

  <p class="risk ib-legal">${s.legal}</p>`;
}
