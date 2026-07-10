import { chromium } from '@playwright/test';
import path from 'node:path';
const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, 'shots');
const PAGE = 'file://' + path.join(DIR, 'landing-final.html');
const issues = [];
const notes = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });

{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error') issues.push('console: ' + m.text().slice(0, 180)); });
  p.on('pageerror', e => issues.push('pageerror: ' + String(e).slice(0, 180)));
  await p.goto(PAGE, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => document.fonts.ready.then(() => undefined));
  await p.waitForTimeout(4500);

  // scroll the atlas/tree section into view → growth should trigger
  await p.evaluate(() => {
    const s = document.querySelector('#treestage');
    window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 180);
  });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/g-tree-growing.png` });
  await p.waitForTimeout(3600);
  await p.screenshot({ path: `${OUT}/g-tree-grown.png` });

  const state1 = await p.evaluate(() => ({
    ar: document.querySelector('#plqAr').textContent,
    en: document.querySelector('#plqEn').textContent,
    href: document.querySelector('#plaque').getAttribute('href'),
    revealed: document.querySelector('#treestage').classList.contains('on')
  }));
  notes.push('plaque after grow: ' + JSON.stringify(state1));
  if (!state1.revealed) issues.push('tree stage not revealed');
  if (!/^\/surahs\/\d{3}-/.test(state1.href)) issues.push('plaque href malformed: ' + state1.href);

  // hover sweep across the canopy; expect a pointer-driven selection at some point
  const box = await p.locator('#treestage').boundingBox();
  let hovered = false;
  for (let i = 0; i <= 14 && !hovered; i++) {
    await p.mouse.move(box.x + box.width * (0.22 + 0.045 * i), box.y + box.height * 0.34, { steps: 3 });
    await p.waitForTimeout(120);
    hovered = await p.evaluate(() => getComputedStyle(document.querySelector('#treestage')).cursor === 'pointer');
  }
  notes.push('hover selection via pointer: ' + hovered);
  if (!hovered) issues.push('no light hoverable along canopy sweep');
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/g-tree-hover.png` });

  // idle auto-tour: stop moving, wait, plaque should change by itself
  const before = await p.evaluate(() => document.querySelector('#plqMeta').textContent);
  await p.mouse.move(4, 4);
  await p.waitForTimeout(8600);
  const after = await p.evaluate(() => document.querySelector('#plqMeta').textContent);
  notes.push(`auto-tour: "${before}" -> "${after}"`);
  if (before === after) notes.push('auto-tour did not change selection in window (may be random-same)');

  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (ov > 2) issues.push(`overflow ${ov}px`);
  await ctx.close();
}

/* mobile smoke */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => issues.push('mobile pageerror: ' + String(e).slice(0, 160)));
  await p.goto(PAGE, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => document.fonts.ready.then(() => undefined));
  await p.waitForTimeout(2500);
  await p.evaluate(() => {
    const s = document.querySelector('#treestage');
    window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 120);
  });
  await p.waitForTimeout(4200);
  await p.screenshot({ path: `${OUT}/g-tree-mobile.png` });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (ov > 2) issues.push(`mobile overflow ${ov}px`);
  await ctx.close();
}

await browser.close();
console.log('NOTES:\n' + notes.join('\n'));
console.log(issues.length ? '\nISSUES:\n' + issues.join('\n') : '\nCLEAN');
