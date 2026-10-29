// Browser checks for one stepped lesson, run headless against the preview server (npm run preview, port 4321).
// For every step at 390 px and 1280 px: axe-core violations and anything wider than the screen.
// Then a no-JavaScript render: every step and every word-by-word card must show.
//
//   node scripts/lesson-qa/qa.mjs level-2/01-nominal-sentence
//
// Uses the Playwright chromium headless shell already on this machine (build 1243); nothing is downloaded.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import path from 'node:path';

const slug = process.argv[2];
if (!slug) throw new Error('usage: node scripts/lesson-qa/qa.mjs <level-n/NN-name>');
const exe = path.join(process.env.LOCALAPPDATA ?? '', 'ms-playwright', 'chromium_headless_shell-1243', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
const browser = await chromium.launch({ headless: true, executablePath: exe });
const url = `http://localhost:${process.env.LESSON_PORT ?? '4321'}/learn/${slug}/`; // LESSON_PORT=4323 for the app-lessons server
let problems = 0;

for (const width of [390, 1280]) {
  const ids = await (async () => {
    const page = await (await browser.newContext({ viewport: { width, height: 900 } })).newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const list = await page.$$eval('.lx-step', (s) => s.map((x) => x.dataset.stepId));
    await page.close();
    return list;
  })();
  for (const id of ids) {
    // A fresh page per step: axe leaves nodes behind that would make later width checks wrong.
    const page = await (await browser.newContext({ viewport: { width, height: 900 } })).newPage();
    await page.goto(`${url}#${id}`, { waitUntil: 'networkidle' });
    const over = await page.evaluate(() => {
      const W = document.documentElement.clientWidth;
      const bad = [...document.querySelectorAll('.lx *')].filter((e) => {
        if (e.closest('[hidden]')) return false;
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.right > W + 1;
      });
      return { sw: document.documentElement.scrollWidth, W, bad: bad.slice(0, 3).map((e) => `${e.tagName}.${e.className}`.slice(0, 60)) };
    });
    if (over.sw > over.W || over.bad.length) {
      problems++;
      console.log(`WIDE ${width}px #${id}`, JSON.stringify(over));
    }
    const r = await new AxeBuilder({ page }).include('.lx').analyze();
    for (const v of r.violations) {
      problems++;
      console.log(`AXE ${width}px #${id} ${v.id} (${v.impact}): ${v.help} at ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`);
    }
    await page.close();
  }
  console.log(`${width}px: ${ids.length} steps checked`);
}

const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
const p = await ctx.newPage();
await p.goto(url);
const nojs = await p.evaluate(() => {
  const shown = (sel) => [...document.querySelectorAll(sel)].filter((e) => getComputedStyle(e).display !== 'none').length;
  return { steps: document.querySelectorAll('.lx-step').length, stepsShown: shown('.lx-step'), cards: document.querySelectorAll('.lx-pcard').length, cardsShown: shown('.lx-pcard') };
});
if (nojs.steps !== nojs.stepsShown || nojs.cards !== nojs.cardsShown) problems++;
console.log('no JavaScript:', JSON.stringify(nojs));
await browser.close();
console.log(problems ? `${problems} problem(s)` : 'no problems');
process.exit(problems ? 1 : 0);
