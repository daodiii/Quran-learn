// Screenshots of stepped lessons for a rollout report, headless, against the preview server.
// For each lesson: NN-desktop.png (1280 px, the second step) and NN-phone.png (390 px, the first word-by-word panel,
// or the second step if the lesson has none). The cookie banner is declined first.
//
//   LESSON_PORT=4323 node scripts/lesson-qa/shots.mjs docs/redesign/screens/l5-rollout level-5 01-full-irab-analysis 02-surah-al-fatiha ...
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const [outDir, level, ...slugs] = process.argv.slice(2);
if (!outDir || !level || !slugs.length) throw new Error('usage: node shots.mjs <outDir> <level-n> <NN-name>...');
fs.mkdirSync(outDir, { recursive: true });
const exe = path.join(process.env.LOCALAPPDATA ?? '', 'ms-playwright', 'chromium_headless_shell-1243', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
const browser = await chromium.launch({ headless: true, executablePath: exe });
const base = `http://localhost:${process.env.LESSON_PORT ?? '4321'}/learn/${level}/`;

for (const slug of slugs) {
  const nn = slug.slice(0, 2);
  for (const [name, width, height] of [['desktop', 1280, 900], ['phone', 390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width, height } });
    await ctx.addInitScript(() => { try { localStorage.setItem('qg-cookie-consent', 'declined'); } catch {} });
    const page = await ctx.newPage();
    await page.goto(`${base}${slug}/`, { waitUntil: 'networkidle' });
    const ids = await page.$$eval('.lx-step', (s) => s.map((x) => x.dataset.stepId));
    await page.goto(`${base}${slug}/#${ids[1] ?? ids[0]}`, { waitUntil: 'networkidle' });
    if (name === 'phone') {
      const panel = await page.$('.lx-step:not([hidden]) .lx-parse');
      if (panel) await panel.scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, `${nn}-${name}.png`) });
    await ctx.close();
  }
  console.log('shot', slug);
}
await browser.close();
