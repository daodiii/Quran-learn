// Browser checks for one quiz or review page, headless, against the preview server (port 4321, or QUIZ_PORT).
// At 390 px and 1280 px, in four states (first question, a wrong answer, passed result, failed result):
// axe-core violations and anything wider than the screen. Then a no-JavaScript render.
//
//   node scripts/lesson-qa/quiz-qa.mjs level-5/quiz
//   node scripts/lesson-qa/quiz-qa.mjs level-3/review
//
// Uses the Playwright chromium headless shell already on this machine (build 1243); nothing is downloaded.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import path from 'node:path';

const slug = process.argv[2];
if (!slug) throw new Error('usage: node scripts/lesson-qa/quiz-qa.mjs <level-n/quiz|level-n/review>');
const exe = path.join(process.env.LOCALAPPDATA ?? '', 'ms-playwright', 'chromium_headless_shell-1243', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
const browser = await chromium.launch({ headless: true, executablePath: exe });
const url = `http://localhost:${process.env.QUIZ_PORT ?? '4321'}/learn/${slug}/`;
let problems = 0;

// Drive the page to a state by clicking, so the check sees the real markup.
async function reach(page, state) {
  const n = await page.locator('#quiz-data').evaluate((e) => JSON.parse(e.textContent).questions.length);
  const answers = await page.locator('#quiz-data').evaluate((e) => JSON.parse(e.textContent).questions.map((q) => [q.correctAnswer, q.options.length]));
  if (state === 'first') return;
  const answer = async (i, right) => {
    const [c, o] = answers[i];
    await page.locator('.qz-opt').nth(right ? c : (c + 1) % o).click();
  };
  if (state === 'wrong') return answer(0, false);
  for (let i = 0; i < n; i++) {
    await answer(i, state === 'pass' ? true : i % 2 === 0 ? false : true);
    await page.locator('#qz-next').click();
  }
}

for (const width of [390, 1280]) {
  for (const state of ['first', 'wrong', 'pass', 'fail']) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => localStorage.setItem('qg-cookie-consent', 'declined'));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.locator('#qz-card').waitFor({ state: 'visible' });
    await reach(page, state);
    await page.waitForTimeout(400);
    // Can the page really scroll sideways? (document.scrollWidth creeps by 1 to 4 px after a few seconds on lesson
    // pages too, from no element we can find, so it is not used. Trying to scroll is the test that matters.)
    const over = await page.evaluate(() => {
      scrollTo(200, 0);
      const W = document.documentElement.clientWidth;
      const bad = [...document.querySelectorAll('.qz *')].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.right > W + 1;
      });
      // Nothing inside the card may poke out of it (the 14 progress dots did at 390 px, inside the screen but outside the card).
      const card = document.querySelector('#qz-card').getBoundingClientRect();
      const out = [...document.querySelectorAll('#qz-card *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && !e.classList.contains('qz-vh') && (r.right > card.right + 0.5 || r.left < card.left - 0.5); });
      bad.push(...out);
      return { scrolledTo: scrollX, W, bad: bad.slice(0, 3).map((e) => `${e.tagName}.${e.className}`.slice(0, 60)) };
    });
    if (over.scrolledTo > 0 || over.bad.length) {
      problems++;
      console.log(`WIDE ${width}px ${state}`, JSON.stringify(over));
    }
    // Targets smaller than 44 px (links inside running text are exempt).
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('.qz button, .qz summary, .qz .qz-btn, .qz-nav a')]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width > 0 && (r.height < 44 || r.width < 44);
        })
        .map((e) => `${e.tagName}.${e.className} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`)
    );
    if (small.length) {
      problems++;
      console.log(`SMALL TARGET ${width}px ${state}`, small.slice(0, 4).join(', '));
    }
    const r = await new AxeBuilder({ page }).include('.qz').analyze();
    for (const v of r.violations) {
      problems++;
      console.log(`AXE ${width}px ${state} ${v.id} (${v.impact}): ${v.help} at ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`);
    }
    console.log(`${width}px ${state}: checked`);
    await ctx.close();
  }
}

const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
const p = await ctx.newPage();
await p.goto(url);
const nojs = await p.evaluate(() => ({ items: document.querySelectorAll('.qz-static > ol > li').length, answers: document.querySelectorAll('.qz-ans').length }));
if (nojs.items === 0 || nojs.items !== nojs.answers) problems++;
console.log('no JavaScript:', JSON.stringify(nojs));
await browser.close();
console.log(problems ? `${problems} problem(s)` : 'no problems');
process.exit(problems ? 1 : 0);
