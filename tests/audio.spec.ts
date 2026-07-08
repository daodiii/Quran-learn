import { test, expect } from '@playwright/test';

test('examples with verse references get a listen button with a valid CDN url', async ({ page }) => {
  await page.goto('/learn/level-1/03-reading-bismillah/');
  const btn = page.locator('.ayah-play').first();
  await expect(btn).toBeVisible();
  const src = await btn.getAttribute('data-audio-src');
  expect(src).toMatch(/^https:\/\/everyayah\.com\/data\/Alafasy_128kbps\/\d{6}\.mp3$/);
});

test('listen button count never exceeds reference count', async ({ page }) => {
  await page.goto('/learn/level-3/14-verb-form-iv/');
  const counts = await page.evaluate(() => ({
    buttons: document.querySelectorAll('.ayah-play').length,
    refs: document.querySelectorAll('.arabic-example .reference').length,
  }));
  expect(counts.buttons).toBeGreaterThan(0);
  expect(counts.buttons).toBeLessThanOrEqual(counts.refs);
});
