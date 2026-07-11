import { test, expect } from '@playwright/test';

test('astrolabe builds 38 markers on three difficulty rings', async ({ page }) => {
  await page.goto('/surahs/');
  await expect(page.locator('#asvg .mk')).toHaveCount(38);
  await expect(page.locator('#asvg .mk.b')).toHaveCount(13);
  await expect(page.locator('#asvg .mk.i')).toHaveCount(14);
  await expect(page.locator('#asvg .mk.a')).toHaveCount(11);
});

test('plate server-renders Al-Fatiha and its CTA is a real link', async ({ page }) => {
  await page.goto('/surahs/');
  await expect(page.locator('#plate .p-name')).toContainText('Al-Fatiha');
  await expect(page.locator('#plate .p-cta')).toHaveAttribute('href', '/surahs/001-al-fatiha/');
});

test('stepping updates the plate and the CTA href', async ({ page }) => {
  await page.goto('/surahs/');
  await page.click('#next');
  await expect(page.locator('#plate .p-meta')).toContainText('SURAH 078');
  await expect(page.locator('#plate .p-cta')).toHaveAttribute('href', /\/surahs\/078-/);
});

test('sr-only index carries all 38 crawlable surah links', async ({ page }) => {
  await page.goto('/surahs/');
  const links = page.locator('nav[aria-label="All surah breakdowns"] a');
  await expect(links).toHaveCount(38);
  await expect(links.first()).toHaveAttribute('href', /^\/surahs\/001-/);
});

test('page keeps head landmarks and the strip jump buttons', async ({ page }) => {
  await page.goto('/surahs/');
  await expect(page.locator('main#main-content')).toBeAttached();
  await expect(page.locator('#strip button')).toHaveCount(38);
});
