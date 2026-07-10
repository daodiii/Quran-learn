import { chromium } from '@playwright/test';
import path from 'node:path';
const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, 'shots');
const issues = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });

const LIST = process.argv.slice(2).length ? process.argv.slice(2) : ['a-observatory', 'b-astrolabe', 'c-galaxy'];
for (const v of LIST) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error') issues.push(`[${v}] console: ${m.text().slice(0, 200)}`); });
  p.on('pageerror', e => issues.push(`[${v}] pageerror: ${String(e).slice(0, 200)}`));
  await p.goto('file://' + path.join(DIR, `atlas-${v}.html`), { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => document.fonts.ready.then(() => undefined));
  await p.waitForTimeout(2600);
  await p.screenshot({ path: `${OUT}/atlas-${v}-1.png` });

  if (v === 'b-astrolabe') {
    // hover a specific pointer: An-Naziʿat (index 2) — alidade should sweep to it
    const r = await p.locator('.ptr[data-i="2"] .hit').boundingBox();
    if (r) { await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2); }
    await p.waitForTimeout(1700);
  } else {
    // drift the pointer through the field to trigger a hover selection
    await p.mouse.move(720, 430); await p.waitForTimeout(400);
    await p.mouse.move(900, 380, { steps: 14 }); await p.waitForTimeout(1400);
  }
  await p.screenshot({ path: `${OUT}/atlas-${v}-2.png` });

  // idle auto-tour state
  await p.mouse.move(4, 4);
  await p.waitForTimeout(6500);
  await p.screenshot({ path: `${OUT}/atlas-${v}-3.png` });

  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (ov > 2) issues.push(`[${v}] overflow ${ov}px`);
  await ctx.close();
}
await browser.close();
console.log(issues.length ? 'ISSUES:\n' + issues.join('\n') : 'CLEAN');
