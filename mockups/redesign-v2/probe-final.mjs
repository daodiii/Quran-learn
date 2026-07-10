import { chromium } from '@playwright/test';
import path from 'node:path';
const DIR = path.dirname(new URL(import.meta.url).pathname);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const issues = [];
for (const [w, h, mob] of [[1440, 900, false], [390, 844, true]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mob, hasTouch: mob });
  const p = await ctx.newPage();
  p.on('pageerror', e => issues.push(`${w}: ${String(e).slice(0, 120)}`));
  p.on('console', m => { if (m.type() === 'error') issues.push(`${w} console: ${m.text().slice(0, 120)}`); });
  await p.goto('file://' + path.join(DIR, 'landing-planetarium.html'), { waitUntil: 'networkidle' });
  await p.waitForTimeout(4000);
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(1200);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (ov > 2) issues.push(`${w}: overflow ${ov}px`);
  await ctx.close();
}
await browser.close();
console.log(issues.length ? 'ISSUES: ' + issues.join(' | ') : 'PLANETARIUM CLEAN');
