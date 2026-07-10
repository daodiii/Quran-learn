import { test, expect } from '@playwright/test';

test('rack renders 12 modules, all stretched links resolve to real routes', async ({ page }) => {
  await page.goto('/resources/');
  await expect(page.locator('#rack .mod')).toHaveCount(12);
  const hrefs = await page.locator('#rack .mod a.go').evaluateAll(as => as.map(a => a.getAttribute('href')));
  expect(hrefs).toHaveLength(12);
  for (const href of hrefs) expect(href).toMatch(/^\/resources\/[a-z0-9-]+(\/[a-z0-9-]+)?\/$/);
  const statuses = await Promise.all(hrefs.map(h => page.request.get(h!).then(r => r.status())));
  for (const s of statuses) expect(s).toBe(200);
});

test('live-tool testids kept for existing suites', async ({ page }) => {
  await page.goto('/resources/');
  await expect(page.locator('[data-testid="resource-verb-forms"]')).toBeAttached();
  await expect(page.locator('[data-testid="resource-word-lookup"]')).toBeAttached();
});

test('HUD counts derive from the collection', async ({ page }) => {
  await page.goto('/resources/');
  await expect(page.locator('#hud [data-hud-guides]')).toHaveText('10');
  await expect(page.locator('#hud [data-hud-tools]')).toHaveText('2');
});
