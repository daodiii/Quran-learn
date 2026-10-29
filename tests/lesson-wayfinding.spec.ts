import { test, expect } from '@playwright/test';

// Stepped lessons: the position sits in the breadcrumb line, the step bar replaces the mini TOC,
// and the lesson has no sidebar navigator (the breadcrumb links back to its level on /learn/).
const LESSON = '/learn/level-3/13-verb-form-iv/';

test('lesson shows its position within the level', async ({ page }) => {
  await page.goto(LESSON);
  await expect(page.locator('[data-lesson-position]')).toHaveText(/Lesson 13 of 22/);
});

test('lesson crumb links back to its level on the Learn page', async ({ page }) => {
  await page.goto(LESSON);
  await expect(page.locator('.lx-crumb a')).toHaveAttribute('href', '/learn/#level-3');
});

test('step bar lists the steps of the lesson', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(LESSON);
  expect(await page.locator('.lx-bar button, .lx-bar a').count()).toBeGreaterThan(2);
});
