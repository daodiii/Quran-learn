import { test, expect } from '@playwright/test';

test('lesson shows its position within the level', async ({ page }) => {
  await page.goto('/learn/level-3/14-verb-form-iv/');
  await expect(page.locator('[data-lesson-position]')).toHaveText(/Lesson 14 of 22/);
});

test('desktop lesson shows a mini TOC tracking h2 sections', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/learn/level-3/14-verb-form-iv/');
  const toc = page.locator('[data-lesson-toc]');
  await expect(toc).toBeVisible();
  expect(await toc.locator('a').count()).toBeGreaterThan(2);
});

test('mobile hides the TOC', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/learn/level-3/14-verb-form-iv/');
  await expect(page.locator('[data-lesson-toc]')).toBeHidden();
});

test('floating course navigator toggle is labeled', async ({ page }) => {
  await page.goto('/learn/level-3/14-verb-form-iv/');
  await expect(page.locator('.navigator-toggle--floating')).toContainText(/lessons/i);
});
