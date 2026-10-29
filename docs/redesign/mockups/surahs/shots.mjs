// Screenshots and checks the Surahs mockups, headless.
//   CHR=<path to chrome-headless-shell.exe> node docs/redesign/mockups/surahs/shots.mjs [a b c d e f]
// Per mockup and size (desktop 1440, phone 390): first screen, full page, a filtered state, the empty state.
// Also reports horizontal overflow, console errors, small touch targets and an axe scan (needs @axe-core/playwright).
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'shots');
mkdirSync(out, { recursive: true });
const files = { a: 'a-reading.html', b: 'b-map.html', c: 'c-index.html', d: 'd-reader.html', e: 'e-command.html', f: 'f-ladder.html' };
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['a', 'b', 'c', 'd', 'e', 'f'];
const sizes = [['desk', 1440, 900, 1], ['phone', 390, 844, 2]];

// axe cannot read stylesheets from file://, so serve the worktree root on a free local port for the run.
const root = join(here, '..', '..', '..', '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const path = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!path.startsWith(root)) throw new Error('outside');
    res.writeHead(200, { 'content-type': types[path.slice(path.lastIndexOf('.'))] || 'application/octet-stream' });
    res.end(await readFile(path));
  } catch { res.writeHead(404); res.end(); }
}).listen(0, '127.0.0.1');
await new Promise(r => server.once('listening', r));
const base = `http://127.0.0.1:${server.address().port}/docs/redesign/mockups/surahs/`;

const browser = await chromium.launch(process.env.CHR ? { executablePath: process.env.CHR, headless: true } : { channel: 'chrome', headless: true });
for (const n of names) {
  const url = base + files[n];
  for (const [tag, w, h, dpr] of sizes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, hasTouch: tag === 'phone', isMobile: tag === 'phone' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1900);
    await page.screenshot({ path: join(out, `${n}.${tag}.png`) });
    await page.screenshot({ path: join(out, `${n}.${tag}.full.png`), fullPage: true });
    const pageH = await page.evaluate(() => document.documentElement.scrollHeight);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const small = await page.evaluate(() => [...document.querySelectorAll('a,button,input,select,summary,[role=button]')]
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !e.closest('[inert],[hidden]') && (r.width < 44 || r.height < 44) && getComputedStyle(e).visibility !== 'hidden'; })
      .map(e => `${e.tagName.toLowerCase()}${e.className ? '.' + String(e.className).split(' ')[0] : ''} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`));
    const axe = await new AxeBuilder({ page }).analyze();
    const bad = axe.violations.map(v => `${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 2).map(x => x.target.join(' ')).join(' | ')}`);

    // a state: filter by an Arabic word (the opening "qul") and show what is left
    await page.fill('#q', 'قل');
    await page.waitForTimeout(350);
    await page.screenshot({ path: join(out, `${n}.${tag}.filter.png`) });
    const shown = await page.evaluate(() => document.querySelector('#count')?.textContent);
    await page.fill('#q', 'zzz');
    await page.waitForTimeout(350);
    await page.screenshot({ path: join(out, `${n}.${tag}.empty.png`) });
    const axe2 = await new AxeBuilder({ page }).analyze();
    axe2.violations.forEach(v => bad.push(`[empty state] ${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 2).map(x => x.target.join(' ')).join(' | ')}`));

    console.log(`${n} ${tag} ${w}x${h}: page height ${pageH}px; overflow ${over}px; filter "قل": ${shown}; axe violations ${bad.length}${bad.length ? '\n   ' + bad.join('\n   ') : ''}; targets under 44px: ${small.length}${small.length ? ' [' + [...new Set(small)].slice(0, 6).join(', ') + ']' : ''}${errors.length ? '; ERRORS ' + errors.join(' | ') : '; no console errors'}`);
    await ctx.close();
  }
}
await browser.close();
server.close();
