import { chromium } from '@playwright/test';
import path from 'node:path';
const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, 'shots');
const errors = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  p.on('pageerror', e => errors.push('pageerror ' + String(e).slice(0, 200)));
  await p.goto('file://' + path.join(DIR, 'landing-final-b.html'), { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => document.fonts.ready.then(() => undefined));
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `${OUT}/fb-constructing.png` });
  await p.waitForTimeout(1000);
  await p.screenshot({ path: `${OUT}/fb-mid.png` });
  await p.waitForTimeout(3200);
  await p.screenshot({ path: `${OUT}/fb-settled.png` });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (ov > 2) errors.push('overflow desktop ' + ov);
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.4, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push('m pageerror ' + String(e).slice(0, 200)));
  await p.goto('file://' + path.join(DIR, 'landing-final-b.html'), { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2800);
  await p.screenshot({ path: `${OUT}/fb-mobile.png` });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (ov > 2) errors.push('overflow mobile ' + ov);
  await ctx.close();
}
await browser.close();
console.log(errors.length ? 'ISSUES:\n' + errors.join('\n') : 'CLEAN');
