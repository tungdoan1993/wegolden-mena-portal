/**
 * Site health check — speed, errors, broken links, layout, confidentiality.
 *
 *   node tools/site-check.mjs                         # checks the live site (config.siteUrl)
 *   node tools/site-check.mjs --base http://localhost:8765   # checks a local dist/ server
 *   node tools/site-check.mjs --out report.json       # also write machine-readable results
 *
 * Optional: PARTNER_ID / PARTNER_PW env vars → also verifies the Partner Area login decrypts.
 * Requires Playwright (preinstalled in Claude's cloud workspace; `npm i -D playwright` elsewhere).
 * Exit code: 0 = no FAIL, 1 = at least one FAIL (WARNs never fail the run).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { config } from '../src/config.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  ({ chromium } = require(join(process.env.NODE_PATH || '/usr/local/lib/node_modules', 'playwright')));
}

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1]]] : a), []));
const BASE = (args.base || config.siteUrl).replace(/\/$/, '');
const T = JSON.parse(readFileSync(join(ROOT, 'tools/site-check.config.json'), 'utf8'));

const results = [];
const add = (level, area, where, msg) => results.push({ level, area, where, msg });
const ms = (n) => `${Math.round(n)} ms`;
const kb = (n) => `${Math.round(n / 1024)} KB`;

// ---------- 1. Static checks on the repo ----------
function staticChecks() {
  const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? flat(v, `${p}${k}.`) : [`${p}${k}`]));
  const en = new Set(flat(JSON.parse(readFileSync(join(ROOT, 'src/i18n/en.json'), 'utf8'))));
  for (const lang of config.languages.filter((l) => l !== 'en')) {
    const other = new Set(flat(JSON.parse(readFileSync(join(ROOT, `src/i18n/${lang}.json`), 'utf8'))));
    const missing = [...en].filter((k) => !other.has(k));
    if (missing.length) add('FAIL', 'i18n', `${lang}.json`, `missing ${missing.length} keys: ${missing.slice(0, 5).join(', ')}`);
  }
  for (const lang of Object.keys(config.brochures)) {
    if (lang === 'en') continue;
    const dict = JSON.parse(readFileSync(join(ROOT, `src/brochure-i18n/${lang}.json`), 'utf8'));
    if (Object.keys(dict).length < 50) add('WARN', 'brochure-i18n', `${lang}.json`, 'translation file looks incomplete');
  }
}

// ---------- 2. HTTP-level checks ----------
async function httpChecks() {
  const get = async (url, opts = {}) => {
    try { return await fetch(url, { redirect: 'manual', ...opts }); } catch (e) { return { status: 0, error: e.message, headers: new Map() }; }
  };
  for (const path of ['/', '/robots.txt', '/sitemap.xml']) {
    const r = await get(BASE + path, { redirect: 'follow' });
    if (r.status !== 200) add('FAIL', 'http', path, `status ${r.status}${r.error ? ` (${r.error})` : ''}`);
  }
  if (BASE.startsWith('https://')) {
    const host = new URL(BASE).host;
    const r = await get(`http://${host}/`);
    const loc = r.headers.get?.('location') || '';
    if (!(r.status >= 300 && r.status < 400 && loc.startsWith('https://'))) add('WARN', 'https', `http://${host}/`, 'does not redirect to https — tick "Enforce HTTPS" in GitHub Pages settings');
    const w = await get(`https://www.${host}/`, { redirect: 'follow' });
    if (w.status !== 200) add('WARN', 'http', `www.${host}`, `status ${w.status}`);
  }
}

// ---------- 3. Browser checks per page ----------
async function browserChecks(browser) {
  const pages = config.pages;
  const linkSet = new Map();
  const perf = [];
  for (const lang of config.languages) {
    for (const page of pages) {
      const url = `${BASE}/${lang}/${page}.html`;
      const where = `${lang}/${page}`;
      const ctx = await browser.newContext({ viewport: { width: 1366, height: 860 } });
      const p = await ctx.newPage();
      const errors = [];
      const failed = [];
      let bytes = 0;
      p.on('console', (m) => m.type() === 'error' && !/favicon/i.test(m.text()) && errors.push(m.text()));
      p.on('pageerror', (e) => errors.push(e.message));
      p.on('requestfailed', (r) => !/google-analytics|doubleclick/.test(r.url()) && failed.push(`${r.url()} (${r.failure()?.errorText})`));
      p.on('response', async (r) => {
        if (r.status() >= 400) failed.push(`${r.url()} → ${r.status()}`);
        const len = Number(r.headers()['content-length'] || 0);
        bytes += len;
      });
      await p.addInitScript(() => {
        window.__lcp = 0;
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) { /* unsupported */ }
      });
      let resp;
      try { resp = await p.goto(url, { waitUntil: 'load', timeout: 30000 }); } catch (e) { add('FAIL', 'load', where, `did not load: ${e.message.split('\n')[0]}`); await ctx.close(); continue; }
      if (!resp || resp.status() !== 200) add('FAIL', 'http', where, `status ${resp && resp.status()}`);
      await p.waitForTimeout(800);
      const m = await p.evaluate(() => {
        const n = performance.getEntriesByType('navigation')[0] || {};
        const imgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && !i.loading?.includes('lazy')).map((i) => i.src);
        const noAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).length;
        const links = [...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith('http'));
        return { ttfb: n.responseStart, dcl: n.domContentLoadedEventEnd, load: n.loadEventEnd, lcp: window.__lcp, imgs, noAlt, links, title: document.title };
      });
      perf.push({ where, ...m, bytes });
      if (m.ttfb > T.ttfbMs) add('WARN', 'speed', where, `slow first byte ${ms(m.ttfb)} (limit ${T.ttfbMs})`);
      if (m.lcp > T.lcpMs) add('WARN', 'speed', where, `largest content painted at ${ms(m.lcp)} (limit ${T.lcpMs})`);
      if (m.load > T.loadMs) add('WARN', 'speed', where, `page load ${ms(m.load)} (limit ${T.loadMs})`);
      if (bytes > T.pageWeightBytes) add('WARN', 'weight', where, `page weight ${kb(bytes)} (limit ${kb(T.pageWeightBytes)})`);
      if (!m.title) add('FAIL', 'seo', where, 'missing <title>');
      if (m.noAlt) add('WARN', 'a11y', where, `${m.noAlt} image(s) without alt text`);
      m.imgs.forEach((src) => add('FAIL', 'image', where, `broken image ${src}`));
      [...new Set(errors)].slice(0, 5).forEach((e) => add('FAIL', 'js', where, e.slice(0, 160)));
      [...new Set(failed)].slice(0, 5).forEach((f) => add('FAIL', 'request', where, f.slice(0, 200)));
      m.links.forEach((h) => { if (!linkSet.has(h)) linkSet.set(h, where); });

      // Layout: horizontal overflow at each width
      for (const w of T.widths) {
        await p.setViewportSize({ width: w, height: 800 });
        await p.waitForTimeout(150);
        const o = await p.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const off = [...document.querySelectorAll('body *')].filter((e) => {
            if (getComputedStyle(e).position === 'fixed' || e.closest('.table-wrap, .main-nav ul')) return false;
            const r = e.getBoundingClientRect();
            return r.width > 0 && (r.right > vw + 2 || r.left < -2);
          }).slice(0, 2).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]}`);
          return { sw: document.documentElement.scrollWidth, vw, off };
        });
        if (o.sw > o.vw || o.off.length) add('FAIL', 'layout', `${where} @${w}px`, `horizontal overflow (${o.off.join(', ') || `scrollWidth ${o.sw}`})`);
        const hdr = await p.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          return [...document.querySelectorAll('.site-header .btn, .site-header .brand, .main-nav ul a')].filter((e) => e.offsetParent).some((e) => e.getBoundingClientRect().right > vw + 1);
        });
        if (hdr) add('FAIL', 'layout', `${where} @${w}px`, 'header item cut off');
      }

      // Confidentiality: reward levels must not appear on public pages
      if (page !== 'partner-area') {
        const html = await p.content();
        for (const pat of T.confidentialPatterns) {
          const hit = html.match(new RegExp(pat));
          if (hit) add('FAIL', 'confidential', where, `public page shows "${hit[0]}"`);
        }
      }
      await ctx.close();
    }
  }

  // Broken links (unique, internal + external)
  const origin = new URL(BASE).origin;
  for (const [href, from] of linkSet) {
    if (/^mailto:|^tel:|#$/.test(href) || /t\.me\/?$/.test(href)) continue;
    const isInternal = href.startsWith(origin);
    try {
      const r = await fetch(href.split('#')[0], { method: 'GET', redirect: 'follow' });
      if (r.status >= 400) add(isInternal ? 'FAIL' : 'WARN', 'link', from, `${href} → ${r.status}`);
    } catch (e) {
      add(isInternal ? 'FAIL' : 'WARN', 'link', from, `${href} → ${e.message}`);
    }
  }
  return perf;
}

// ---------- 4. Brochures (flipbook works in each language) ----------
async function brochureChecks(browser) {
  for (const [lang, file] of Object.entries(config.brochures)) {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 860 } });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    try {
      await p.goto(`${BASE}/${file}`, { waitUntil: 'networkidle', timeout: 30000 });
      await p.waitForTimeout(1000);
      const before = await p.textContent('#count');
      await p.click('#next');
      await p.waitForTimeout(1200);
      const after = await p.textContent('#count');
      if (before === after) add('FAIL', 'brochure', lang, `Next button does not turn the page (${before})`);
      if (!/^1 \/ \d+/.test(before.trim())) add('WARN', 'brochure', lang, `unexpected start counter "${before}"`);
    } catch (e) {
      add('FAIL', 'brochure', lang, `flipbook failed: ${e.message.split('\n')[0]}`);
    }
    errs.forEach((e) => add('FAIL', 'brochure', lang, e.slice(0, 160)));
    await ctx.close();
  }
}

// ---------- 5. Partner Area login ----------
async function partnerAreaCheck(browser) {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.goto(`${BASE}/en/partner-area.html`, { waitUntil: 'networkidle' });
  const hasPayload = await p.evaluate(() => (document.getElementById('ib-payload')?.textContent || '').length > 100);
  if (!hasPayload) add('FAIL', 'partner-area', 'en', 'encrypted payload missing');
  await p.fill('input[name=id]', 'wrong-user');
  await p.fill('input[name=password]', 'wrong-password');
  await p.click('[data-partner-login] button[type=submit]');
  await p.waitForTimeout(2500);
  if (await p.isVisible('[data-partner-content]')) add('FAIL', 'partner-area', 'en', 'WRONG password opened the Partner Area');
  if (process.env.PARTNER_ID && process.env.PARTNER_PW) {
    await p.fill('input[name=id]', process.env.PARTNER_ID);
    await p.fill('input[name=password]', process.env.PARTNER_PW);
    await p.click('[data-partner-login] button[type=submit]');
    await p.waitForTimeout(3000);
    if (!(await p.isVisible('[data-partner-content]'))) add('FAIL', 'partner-area', 'en', 'correct credentials did not open the Partner Area');
  } else {
    add('INFO', 'partner-area', 'en', 'correct-password login not tested (PARTNER_ID/PARTNER_PW not set)');
  }
  await ctx.close();
}

// ---------- Run ----------
const started = Date.now();
staticChecks();
await httpChecks();
const browser = await chromium.launch();
const perf = await browserChecks(browser);
await brochureChecks(browser);
await partnerAreaCheck(browser);
await browser.close();

const count = (l) => results.filter((r) => r.level === l).length;
const slowest = [...perf].sort((a, b) => b.load - a.load).slice(0, 3);
const avg = (k) => perf.reduce((s, x) => s + (x[k] || 0), 0) / (perf.length || 1);
const summary = {
  base: BASE,
  date: new Date().toISOString(),
  durationSec: Math.round((Date.now() - started) / 1000),
  pagesChecked: perf.length,
  fail: count('FAIL'),
  warn: count('WARN'),
  speed: { avgTtfbMs: Math.round(avg('ttfb')), avgLcpMs: Math.round(avg('lcp')), avgLoadMs: Math.round(avg('load')), slowest: slowest.map((s) => `${s.where} ${ms(s.load)}`) },
};

console.log(`\nSITE CHECK ${BASE} — ${summary.pagesChecked} pages in ${summary.durationSec}s`);
console.log(`FAIL ${summary.fail} · WARN ${summary.warn} · avg first byte ${ms(summary.speed.avgTtfbMs)} · avg LCP ${ms(summary.speed.avgLcpMs)} · avg load ${ms(summary.speed.avgLoadMs)}`);
for (const lvl of ['FAIL', 'WARN', 'INFO']) {
  const rows = results.filter((r) => r.level === lvl);
  if (!rows.length) continue;
  console.log(`\n${lvl}`);
  rows.forEach((r) => console.log(`- [${r.area}] ${r.where}: ${r.msg}`));
}
if (args.out) writeFileSync(args.out, JSON.stringify({ summary, results, perf }, null, 2));
process.exit(summary.fail ? 1 : 0);
