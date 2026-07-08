import { test, expect } from '@playwright/test';

test('lesson with vocab shows the words section', async ({ page }) => {
  await page.goto('/learn/level-1/01-arabic-script-vowels/');
  const section = page.locator('[data-vocab-section]');
  await expect(section).toBeVisible();
  const rows = section.locator('[data-vocab-row]');
  expect(await rows.count()).toBeGreaterThan(0);
  await expect(section.locator('h2')).toContainText(/words from this lesson/i);
});

test('lesson with no new vocab renders no section', async ({ page }) => {
  await page.goto('/learn/level-1/03-reading-bismillah/');
  await expect(page.locator('[data-vocab-section]')).toHaveCount(0);
});

test('level vocabulary review page lists cumulative words with recall toggle', async ({ page }) => {
  await page.goto('/learn/level-1/vocabulary/');
  const rows = page.locator('[data-vocab-row]');
  expect(await rows.count()).toBeGreaterThan(10);
  // recall mode: glosses hidden until a row is revealed
  await page.locator('[data-recall-toggle]').click();
  const first = rows.first();
  await expect(first.locator('[data-vocab-gloss]')).toBeHidden();
  await first.click();
  await expect(first.locator('[data-vocab-gloss]')).toBeVisible();
});
