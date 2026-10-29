// Screenshots the Learn mockups, headless.
//   CHR=<path to chrome-headless-shell.exe> node docs/redesign/mockups/learn/shots.mjs [a b c]
// Per mockup: desktop and phone (first screen + full page), a first-visit state, and a filtered state.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'shots');
mkdirSync(out, { recursive: true });
const files = { a: 'a-syllabus.html', b: 'b-route.html', c: 'c-index.html' };
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['a', 'b', 'c'];
const sizes = [['desk', 1440, 900, 1], ['phone', 390, 844, 2]];

const browser = await chromium.launch(process.env.CHR ? { executablePath: process.env.CHR, headless: true } : { channel: 'chrome', headless: true });
for (const n of names) {
  const url = pathToFileURL(join(here, files[n])).href;
  for (const [tag, w, h, dpr] of sizes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(700);
    await page.screenshot({ path: join(out, `${n}.${tag}.png`) });
    await page.screenshot({ path: join(out, `${n}.${tag}.full.png`), fullPage: true });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

    await page.evaluate(() => document.querySelector('.lvl[data-level="2"]').scrollIntoView());
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(out, `${n}.${tag}.mid.png`) });

    await page.goto(url + '?progress=0');
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(out, `${n}.${tag}.first.png`) });

    await page.goto(url);
    await page.fill('#q', 'verb');
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(out, `${n}.${tag}.filter.png`) });
    const shown = await page.evaluate(() => document.querySelector('#count').textContent);
    console.log(`${n} ${tag} ${w}x${h} overflow ${over}px; filter "verb": ${shown}${errors.length ? '; ERRORS ' + errors.join(' | ') : ''}`);
    await ctx.close();
  }
}
await browser.close();
