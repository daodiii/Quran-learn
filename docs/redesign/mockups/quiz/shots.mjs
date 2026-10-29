// Screenshots the quiz mockups, headless (nothing opens on screen).
//   node docs/redesign/mockups/quiz/shots.mjs [a b c]
// Per mockup: first question, a wrong answer, passed result and failed result, at 1280 and 390 px.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'shots');
mkdirSync(out, { recursive: true });
const files = { a: 'a-stage.html', b: 'b-card.html', c: 'c-sheet.html' };
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['a', 'b', 'c'];
const states = [['first', ''], ['wrong', '?state=wrong'], ['pass', '?state=pass'], ['fail', '?state=fail']];
const sizes = [['desk', 1280, 800], ['phone', 390, 844]];
const exe = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright', 'chromium_headless_shell-1243', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
const browser = await chromium.launch({ headless: true, executablePath: exe });
for (const n of names) {
  for (const [tag, w, h] of sizes) {
    for (const [st, q] of states) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: tag === 'phone' ? 2 : 1 });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(pathToFileURL(join(here, files[n])).href + q);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      await page.screenshot({ path: join(out, `${n}.${tag}.${st}.png`), fullPage: st === 'pass' || st === 'fail' ? true : false });
      console.log(`${n} ${tag} ${st}: overflow ${over}px${errors.length ? ' ERR ' + errors.join('; ') : ''}`);
      await ctx.close();
    }
  }
}
await browser.close();
