import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
p.on('pageerror', e => console.log('PAGEERROR', String(e).slice(0, 150)));
await p.goto('file:///Users/daodilyas/quran-learn/mockups/redesign-v2/landing-reel.html', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready.then(() => undefined));
await p.waitForTimeout(4500);
// crawl slowly through the whole page so triggers get a chance to fire
for (let f = 0; f <= 1.001; f += 0.05) {
  await p.evaluate(fr => window.scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * fr)), f);
  await p.waitForTimeout(320);
}
await p.waitForTimeout(2500);
const state = await p.evaluate(() => ({
  horiz: document.documentElement.classList.contains("cine"),
  litWords: document.querySelectorAll('.cw.lit').length,
  roVisible: [...document.querySelectorAll('.ro')].filter(r => getComputedStyle(r).opacity > 0.5).length,
  lpathDrawn: (() => { const p2 = document.querySelector('#lpath path'); return p2 ? getComputedStyle(p2).strokeDashoffset : 'none'; })(),
  clineDrawn: (() => { const p2 = document.querySelector('#clines path'); return p2 ? getComputedStyle(p2).strokeDashoffset : 'none'; })(),
  passLevels: document.querySelectorAll('.level.pass').length,
  prog: document.querySelector('#cprog b')?.textContent,
}));
console.log(JSON.stringify(state, null, 1));
await browser.close();
