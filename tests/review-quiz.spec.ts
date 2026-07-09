import { test, expect } from '@playwright/test';

test('cumulative review page renders a 10-question quiz', async ({ page }) => {
  await page.goto('/learn/level-3/review/');
  await expect(page.locator('#quiz-data')).toHaveCount(1);
  const data = JSON.parse(await page.locator('#quiz-data').textContent() ?? '{}');
  expect(data.questions?.length).toBe(10);
  expect(data.totalQuestions).toBe(10);
  for (const q of data.questions) {
    expect(q.options).toHaveLength(4);
    expect(q.source).toBeUndefined();
  }
});

test('review pages exist for levels 2-5 only', async ({ page }) => {
  for (const level of [2, 3, 4, 5]) {
    const res = await page.goto(`/learn/level-${level}/review/`);
    expect(res?.status(), `level ${level} review`).toBe(200);
  }
  const missing = await page.goto('/learn/level-1/review/');
  expect(missing?.status()).toBe(404);
});

test('review links appear on /learn for levels 2-5', async ({ page }) => {
  await page.goto('/learn/');
  await expect(page.locator('a[href="/learn/level-3/review/"]')).toBeVisible();
  await expect(page.locator('a[href="/learn/level-1/review/"]')).toHaveCount(0);
});
