// Screenshots of the built quiz and review pages, headless, into docs/redesign/screens/quiz-redesign/.
//   QUIZ_PORT=4341 node scripts/lesson-qa/quiz-shots.mjs
// For each page: first question, a wrong answer, the passed result and the failed result, at 1280 and 390 px.
// The cookie banner is declined with localStorage['qg-cookie-consent'] = 'declined'.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const pages = [['level-1', 'quiz'], ['level-5', 'quiz'], ['level-3', 'review']];
const sizes = [['desktop', 1280, 800, 1], ['phone', 390, 844, 2]];
const states = ['first', 'wrong', 'pass', 'fail'];
const out = 'docs/redesign/screens/quiz-redesign';
mkdirSync(out, { recursive: true });
const exe = path.join(process.env.LOCALAPPDATA ?? '', 'ms-playwright', 'chromium_headless_shell-1243', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
const browser = await chromium.launch({ headless: true, executablePath: exe });
const base = `http://localhost:${process.env.QUIZ_PORT ?? '4321'}`;

for (const [level, kind] of pages) {
  for (const [tag, w, h, dpr] of sizes) {
    for (const state of states) {
      if (level === 'level-1' && state !== 'first' && state !== 'wrong') continue;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
      const page = await ctx.newPage();
      await page.addInitScript(() => localStorage.setItem('qg-cookie-consent', 'declined'));
      await page.goto(`${base}/learn/${level}/${kind}/`, { waitUntil: 'networkidle' });
      await page.locator('#qz-card').waitFor({ state: 'visible' });
      const answers = await page.locator('#quiz-data').evaluate((e) => JSON.parse(e.textContent).questions.map((q) => [q.correctAnswer, q.options.length]));
      const click = async (i, right) => page.locator('.qz-opt').nth(right ? answers[i][0] : (answers[i][0] + 1) % answers[i][1]).click();
      if (state === 'wrong') {
        await click(0, true); await page.locator('#qz-next').click();
        await click(1, false);
      } else if (state === 'pass' || state === 'fail') {
        for (let i = 0; i < answers.length; i++) { await click(i, state === 'pass' ? true : i % 2 !== 0); await page.locator('#qz-next').click(); }
      }
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${out}/${level}-${kind}-${state}-${tag}.png`, fullPage: state === 'pass' || state === 'fail' });
      await ctx.close();
      console.log(`${level}/${kind} ${state} ${tag}`);
    }
  }
}
await browser.close();
