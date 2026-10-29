// Screenshots and checks the surah-page mockups, headless.
//   CHR=<path to chrome-headless-shell.exe> node docs/redesign/mockups/surah-page/shots.mjs [a b c]
// Per mockup and size (desktop 1440, phone 390): first screen, full page, and one working state. Also reports horizontal
// overflow, console errors, touch targets under 44 px and an axe scan (needs @axe-core/playwright). shots/ is not committed.
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
const files = { a: 'a-sheet.html', b: 'b-workbench.html', c: 'c-steps.html' };
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['a', 'b', 'c'];
const sizes = [['desk', 1440, 900, 1], ['phone', 390, 844, 2]];

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
await new Promise((r) => server.once('listening', r));
const base = `http://127.0.0.1:${server.address().port}/docs/redesign/mockups/surah-page/`;

// what each mockup does when a learner uses it
const states = {
  a: async (p) => { await p.click('#v1 .w >> nth=0'); await p.click('#v1 .tab >> nth=1'); await p.click('#v1 .opt >> nth=1'); await p.locator('#v1 .why').scrollIntoViewIfNeeded(); },
  b: async (p, tag0) => { await p.click('#seg [data-n="4"]'); await p.click('#words .w >> nth=3'); await p.click('#right .tab >> text=Worth knowing'); await p.waitForTimeout(250); await p.screenshot({ path: join(out, `b.${tag0}.note.png`) }); await p.click('#right .tab >> text=Try it'); await p.click('#right .opt >> nth=0'); },
  c: async (p) => { await p.click('#next'); await p.click('#words .w >> nth=2'); },
};
const extra = {
  c: async (p, shot) => { await p.click('#next'); await shot('why'); await p.click('#next'); await p.click('#cq-fb', { force: true }).catch(() => {}); await p.click('.opt >> nth=1'); await shot('try'); await p.click('#dots [data-i="review"]'); await shot('review'); },
};

const browser = await chromium.launch(process.env.CHR ? { executablePath: process.env.CHR, headless: true } : { channel: 'chrome', headless: true });
for (const n of names) {
  for (const [tag, w, h, dpr] of sizes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, hasTouch: tag === 'phone', isMobile: tag === 'phone' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(base + files[n]);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(out, `${n}.${tag}.png`) });
    await page.screenshot({ path: join(out, `${n}.${tag}.full.png`), fullPage: true });
    const pageH = await page.evaluate(() => document.documentElement.scrollHeight);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const small = await page.evaluate(() => [...document.querySelectorAll('a,button,input,summary,[role=button]')]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44) && getComputedStyle(e).visibility !== 'hidden'; })
      .map((e) => `${e.tagName.toLowerCase()}${e.className ? '.' + String(e.className).split(' ')[0] : ''} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`));
    const axe = await new AxeBuilder({ page }).analyze();
    const bad = axe.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 2).map((x) => x.target.join(' ')).join(' | ')}`);
    await states[n](page, tag);
    await page.waitForTimeout(450);
    await page.screenshot({ path: join(out, `${n}.${tag}.state.png`) });
    const axe2 = await new AxeBuilder({ page }).analyze();
    axe2.violations.forEach((v) => bad.push(`[after use] ${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 2).map((x) => x.target.join(' ')).join(' | ')}`));
    if (extra[n]) await extra[n](page, async (name) => { await page.waitForTimeout(350); await page.screenshot({ path: join(out, `${n}.${tag}.${name}.png`) }); const a = await new AxeBuilder({ page }).analyze(); a.violations.forEach((v) => bad.push(`[${name}] ${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 2).map((x) => x.target.join(' ')).join(' | ')}`)); });
    console.log(`${n} ${tag} ${w}x${h}: page height ${pageH}px; overflow ${over}px; axe violations ${bad.length}${bad.length ? '\n   ' + bad.join('\n   ') : ''}; targets under 44px: ${small.length}${small.length ? ' [' + [...new Set(small)].slice(0, 8).join(', ') + ']' : ''}${errors.length ? '; ERRORS ' + errors.join(' | ') : '; no console errors'}`);
    await ctx.close();
  }
}
await browser.close();
server.close();
