import { chromium } from '@playwright/test';
import path from 'node:path';
const DIR = path.dirname(new URL(import.meta.url).pathname);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto('file://' + path.join(DIR, 'landing-final-b.html'), { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready.then(() => undefined));
await p.waitForTimeout(1800);
const st = await p.evaluate(() => {
  const svg = document.querySelector('#rosette');
  const r = svg.getBoundingClientRect();
  const lines = svg.querySelectorAll('line');
  const drawn = [...lines].filter(l => parseFloat(getComputedStyle(l).strokeDashoffset) < parseFloat(getComputedStyle(l).strokeDasharray) * 0.5).length;
  return {
    box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
    children: svg.childElementCount, linesDrawnHalfway: drawn,
    opacity: getComputedStyle(svg).opacity, cls: svg.className.baseVal,
    zi: getComputedStyle(svg).zIndex,
  };
});
console.log(JSON.stringify(st));
// zoomed screenshot of the rosette area
await p.screenshot({ path: path.join(DIR, 'shots', 'fb-rosette-zoom.png'), clip: { x: 300, y: 0, width: 840, height: 560 } });
await p.waitForTimeout(3000);
await p.screenshot({ path: path.join(DIR, 'shots', 'fb-rosette-settled-zoom.png'), clip: { x: 300, y: 0, width: 840, height: 560 } });
await browser.close();
