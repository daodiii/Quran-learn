// Screenshots the hero mockups at three widths, headless.
//   node docs/redesign/mockups/home/shots.mjs [a b c compare trust-a trust-b trust-c]
//   CHR=<path to a Chromium> uses that browser instead of Chrome.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'shots');
mkdirSync(out, { recursive: true });
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['a', 'b', 'c'];
const sizes = [
  ['desk', 1440, 900],
  ['tab', 768, 1024],
  ['phone', 390, 844],
];

const browser = await chromium.launch(process.env.CHR ? { executablePath: process.env.CHR, headless: true } : { channel: 'chrome', headless: true });
for (const n of names) {
  const file = n === 'compare' ? 'compare.html' : n.startsWith('trust-') ? `${n}.html` : `hero-${n}.html`;
  for (const [tag, w, h] of sizes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: tag === 'phone' ? 2 : 1 });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(join(here, file)).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(+process.env.WAIT || 1800);
    await page.screenshot({ path: join(out, `${n}.${tag}.png`) });
    await page.screenshot({ path: join(out, `${n}.${tag}.full.png`), fullPage: true });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${n} ${tag} ${w}x${h} horizontal overflow: ${over}px`);
    await ctx.close();
  }
}
await browser.close();
