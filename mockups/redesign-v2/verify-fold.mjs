import { chromium } from '@playwright/test';
import path from 'node:path';
const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, 'shots');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const issues = [];

for (const file of ['landing', 'hero-a']) {
  for (const [w, h] of [[1440, 900], [1440, 760], [1280, 720], [1920, 1080]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    p.on('pageerror', e => issues.push(`[${file} ${w}x${h}] pageerror ${String(e).slice(0, 150)}`));
    p.on('console', m => { if (m.type() === 'error') issues.push(`[${file} ${w}x${h}] console ${m.text().slice(0, 150)}`); });
    await p.goto('file://' + path.join(DIR, `${file}.html`), { waitUntil: 'networkidle', timeout: 60000 });
    await p.evaluate(() => document.fonts.ready.then(() => undefined));
    await p.waitForTimeout(5200); // full load sequence
    const m = await p.evaluate(() => {
      const cta = document.querySelector('.cta-row').getBoundingClientRect();
      const stats = document.querySelector('.hero-stats').getBoundingClientRect();
      const b = document.querySelector('#basmala');
      return {
        ctaBottom: Math.round(cta.bottom), statsBottom: Math.round(stats.bottom),
        vh: innerHeight, fs: getComputedStyle(b).fontSize,
        oneLine: b.getBoundingClientRect().height < parseFloat(getComputedStyle(b).fontSize) * 2.2,
        overflowX: document.documentElement.scrollWidth - innerWidth,
      };
    });
    if (m.ctaBottom > m.vh) issues.push(`[${file} ${w}x${h}] CTA below fold: ${m.ctaBottom} > ${m.vh}`);
    if (!m.oneLine) issues.push(`[${file} ${w}x${h}] basmala wrapped to 2+ lines`);
    if (m.overflowX > 2) issues.push(`[${file} ${w}x${h}] overflow ${m.overflowX}px`);
    console.log(`${file} ${w}x${h}: font ${m.fs}, cta@${m.ctaBottom}/${m.vh}, stats@${m.statsBottom}/${m.vh}`);
    if (h === 760 || h === 900) await p.screenshot({ path: `${OUT}/fold-${file}-${w}x${h}.png` });
    await ctx.close();
  }
}
await browser.close();
console.log(issues.length ? 'ISSUES:\n' + issues.join('\n') : 'ALL FOLD CHECKS PASSED');
