import { test, expect, type Page } from '@playwright/test';

// The level quizzes and cumulative reviews share one layout (src/layouts/QuizLayout.astro).
// The tests read the questions from the page's own JSON, so they hold when a question is edited.

async function open(page: Page, path: string) {
  await page.addInitScript(() => localStorage.setItem('qg-cookie-consent', 'declined'));
  await page.goto(path);
  await expect(page.locator('#qz-card')).toBeVisible();
  return JSON.parse((await page.locator('#quiz-data').textContent()) ?? '{}');
}

async function answerAll(page: Page, data: any, pick: (correct: number, options: number) => number) {
  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    await expect(page.locator('.qz-n')).toHaveText(`Question ${i + 1} of ${data.questions.length}`);
    await page.locator('.qz-opt').nth(pick(q.correctAnswer, q.options.length)).click();
    await page.locator('#qz-next').click();
  }
}

test('a wrong answer shows its mark in words, the right answer, the reason and the lesson', async ({ page }) => {
  const data = await open(page, '/learn/level-1/quiz/');
  const q = data.questions[0];
  const wrong = (q.correctAnswer + 1) % q.options.length;
  await expect(page.locator('#qz-next')).toBeDisabled();
  await page.locator('.qz-opt').nth(wrong).click();
  await expect(page.locator('.qz-opt').nth(wrong)).toContainText('Your answer');
  await expect(page.locator('.qz-opt').nth(q.correctAnswer)).toContainText('Correct answer');
  await expect(page.locator('.qz-fb-h')).toContainText('Not quite');
  await expect(page.locator('.qz-fb-w')).toContainText(q.explanation.slice(0, 20));
  // Most questions name a lesson in their explanation; a few name none, and then no lesson line is shown.
  if (q.lessons.length > 0) await expect(page.locator('.qz-fb-l a').first()).toHaveAttribute('href', q.lessons[0].href);
  else await expect(page.locator('.qz-fb-l')).toHaveCount(0);
  await expect(page.locator('#qz-next')).toBeEnabled();
  // The answer is locked: a second click changes nothing.
  await page.locator('.qz-opt').nth(q.correctAnswer).click({ force: true });
  await expect(page.locator('.qz-fb-h')).toContainText('Not quite');
});

test('all right answers pass and offer the next step', async ({ page }) => {
  const data = await open(page, '/learn/level-2/quiz/');
  await answerAll(page, data, (c) => c);
  await expect(page.locator('.qz-res-h')).toHaveText('You passed.');
  await expect(page.getByTestId('quiz-score')).toHaveText(`${data.questions.length} of ${data.questions.length}`);
  await expect(page.locator('.qz-rev')).toContainText('Nothing to revisit');
  await expect(page.locator(`.qz-acts a[href="${data.next.href}"]`)).toBeVisible();
});

test('wrong answers fail with the lessons to revisit, and Try again starts over', async ({ page }) => {
  const data = await open(page, '/learn/level-3/quiz/');
  await answerAll(page, data, (c, n) => (c + 1) % n);
  await expect(page.locator('.qz-res-h')).toHaveText('Not yet.');
  await expect(page.getByTestId('quiz-score')).toHaveText(`0 of ${data.questions.length}`);
  expect(await page.locator('.qz-rev li a').count()).toBeGreaterThan(0);
  await page.getByTestId('retry-btn').click();
  await expect(page.locator('.qz-n')).toHaveText(`Question 1 of ${data.questions.length}`);
  await expect(page.locator('#qz-next')).toBeDisabled();
});

test('the pass mark is 70 percent: 7 right of 10 passes, 6 does not', async ({ page }) => {
  const data = await open(page, '/learn/level-3/review/');
  expect(data.questions).toHaveLength(10);
  let n = 0;
  await answerAll(page, data, (c, o) => (n++ < 7 ? c : (c + 1) % o));
  await expect(page.locator('.qz-res-h')).toHaveText('You passed.');
  await page.getByTestId('retry-btn').click();
  n = 0;
  await answerAll(page, data, (c, o) => (n++ < 6 ? c : (c + 1) % o));
  await expect(page.locator('.qz-res-h')).toHaveText('Not yet.');
});

test('a review links every question to the lesson its source names', async ({ page }) => {
  const data = await open(page, '/learn/level-4/review/');
  for (const q of data.questions) expect(q.lessons.length, `question ${q.id}`).toBeGreaterThan(0);
  await expect(page.locator('.qz-head h1')).toHaveText('Level 4 Cumulative Review');
});

test('without JavaScript the page prints every question with its answer', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/learn/level-1/quiz/');
  const items = page.locator('.qz-static > ol > li');
  expect(await items.count()).toBeGreaterThanOrEqual(10);
  await expect(items.first().locator('.qz-ans')).toContainText('Answer:');
  await context.close();
});

test('quiz and review pages do not scroll sideways at 390 px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/learn/level-5/quiz/', '/learn/level-5/review/']) {
    await open(page, path);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(over, path).toBeLessThanOrEqual(0);
  }
});
