import { test, expect } from '@playwright/test';

test('lesson links to the vocabulary review of its level', async ({ page }) => {
  await page.goto('/learn/level-1/01-arabic-script-vowels/');
  await expect(page.locator('a[href="/learn/level-1/vocabulary/"]')).toHaveCount(1);
});

test('stepped lessons render no per-lesson word list', async ({ page }) => {
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
