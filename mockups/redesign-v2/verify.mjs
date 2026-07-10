// Robustness verification: reduced-motion, JS-off, overflow, focus.
import { chromium } from '@playwright/test';
import path from 'node:path';
const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, 'shots');
const PAGE_URL = 'file://' + path.join(DIR, 'landing.html');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const issues = [];

// 1. prefers-reduced-motion
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  p.on('pageerror', e => issues.push('[rm pageerror] ' + e));
  await p.goto(PAGE_URL, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const vis = await p.evaluate(() => {
    const b = document.querySelector('#basmala');
    const h = document.querySelector('.hero-h1');
    const gone = document.querySelector('#gl') === null && document.querySelector('#dust') === null;
    return { basmalaOpacity: getComputedStyle(b).opacity, h1Opacity: getComputedStyle(h).opacity, canvasesRemoved: gone };
  });
  if (vis.basmalaOpacity !== '1' || vis.h1Opacity !== '1') issues.push('RM: hero content hidden ' + JSON.stringify(vis));
  await p.screenshot({ path: OUT + '/v-reduced-motion.png' });
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight * 0.35));
  await p.waitForTimeout(800);
  await p.screenshot({ path: OUT + '/v-rm-mid.png' });
  await ctx.close();
}

// 2. JS disabled
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(PAGE_URL, { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  const vis = await p.evaluate(() => ({
    basmala: getComputedStyle(document.querySelector('#basmala')).opacity,
    h1: getComputedStyle(document.querySelector('.hero-h1')).opacity,
    ro: getComputedStyle(document.querySelector('.ro')).opacity,
  }));
  if (vis.basmala !== '1' || vis.h1 !== '1' || vis.ro !== '1') issues.push('NOJS: content hidden ' + JSON.stringify(vis));
  await p.screenshot({ path: OUT + '/v-nojs.png' });
  await ctx.close();
}

// 3. horizontal overflow + focus visibility
for (const [w, h, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile'], [1920, 1080, 'wide']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto(PAGE_URL, { waitUntil: 'networkidle' });
  await p.waitForTimeout(5200); // let load sequence finish
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (ov > 2) issues.push(`OVERFLOW ${tag}: ${ov}px`);
  if (tag === 'desktop') {
    for (let i = 0; i < 4; i++) await p.keyboard.press('Tab');
    const focused = await p.evaluate(() => document.activeElement.textContent.trim().slice(0, 30));
    if (!focused) issues.push('FOCUS: nothing focused after tabbing');
    await p.screenshot({ path: OUT + '/v-focus.png' });
  }
  await ctx.close();
}

await browser.close();
console.log(issues.length ? 'ISSUES:\n' + issues.join('\n') : 'ALL VERIFY CHECKS PASSED');
