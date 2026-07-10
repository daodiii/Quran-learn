import { chromium } from '@playwright/test';
import path from 'node:path';
const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, 'shots');
const errors = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });

for (const v of ['final-c']) {
  const url = 'file://' + path.join(DIR, `landing-${v}.html`);
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    p.on('console', m => { if (m.type() === 'error') errors.push(`[${v}] ${m.text().slice(0, 200)}`); });
    p.on('pageerror', e => errors.push(`[${v}] pageerror ${String(e).slice(0, 200)}`));
    await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await p.evaluate(() => document.fonts.ready.then(() => undefined));
    await p.waitForTimeout(5000);
    for (const f of [0.14, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74, 0.84, 0.93]) {
      await p.evaluate(fr => window.scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * fr)), f);
      await p.waitForTimeout(1100);
      await p.screenshot({ path: `${OUT}/b-${v}-${Math.round(f * 100)}.png` });
    }
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (ov > 2) errors.push(`[${v}] overflow desktop ${ov}px`);
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.3, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    p.on('pageerror', e => errors.push(`[${v} mobile] ${String(e).slice(0, 200)}`));
    await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await p.evaluate(() => document.fonts.ready.then(() => undefined));
    await p.waitForTimeout(2500);
    for (const f of [0.3, 0.6, 0.9]) {
      await p.evaluate(fr => window.scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * fr)), f);
      await p.waitForTimeout(900);
      await p.screenshot({ path: `${OUT}/b-${v}-m${Math.round(f * 100)}.png` });
    }
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (ov > 2) errors.push(`[${v}] overflow mobile ${ov}px`);
    await ctx.close();
  }
}
await browser.close();
console.log(errors.length ? 'ISSUES:\n' + errors.join('\n') : 'CLEAN');
