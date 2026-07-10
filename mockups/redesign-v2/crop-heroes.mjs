import { chromium } from '@playwright/test';
import path from 'node:path';
const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, 'shots');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const jobs = [
  ['a', { x: 100, y: 90, width: 1240, height: 360 }, 'ha-verse-detail'],
  ['b', { x: 60, y: 90, width: 1320, height: 480 }, 'hb-verse-detail'],
  ['b', { x: 60, y: 480, width: 1320, height: 400 }, 'hb-lower-detail'],
  ['c', { x: 160, y: 40, width: 1120, height: 560 }, 'hc-arch-detail'],
];
for (const [v, clip, name] of jobs) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
  const p = await ctx.newPage();
  await p.goto('file://' + path.join(DIR, `hero-${v}.html`), { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => document.fonts.ready.then(() => undefined));
  await p.waitForTimeout(5200);
  await p.screenshot({ path: `${OUT}/${name}.png`, clip });
  await ctx.close();
}
await browser.close();
console.log('crops done');
