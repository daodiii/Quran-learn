import { test, expect } from '@playwright/test';

test('hub shows 11 cards (the finder and 10 guides) and every card link resolves to a real route', async ({ page }) => {
  await page.goto('/resources/');
  await expect(page.locator('#groups .card')).toHaveCount(11);
  const hrefs = await page.locator('#groups .card').evaluateAll(as => as.map(a => a.getAttribute('href')));
  expect(hrefs).toHaveLength(11);
  for (const href of hrefs) expect(href).toMatch(/^\/resources\/[a-z0-9-]+(\/[a-z0-9-]+)?\/$/);
  const statuses = await Promise.all(hrefs.map(h => page.request.get(h!).then(r => r.status())));
  for (const s of statuses) expect(s).toBe(200);
});

test('the finder card links to /resources/find/ and the two retired tools have no card', async ({ page }) => {
  await page.goto('/resources/');
  await expect(page.locator('[data-testid="resource-find"]')).toHaveAttribute('href', '/resources/find/');
  await expect(page.locator('a[href="/resources/word-lookup/"], a[href="/resources/verb-forms/"]')).toHaveCount(0);
});

test('counts under the title derive from the collection', async ({ page }) => {
  await page.goto('/resources/');
  await expect(page.locator('[data-hub-guides]')).toHaveText('10');
  await expect(page.locator('[data-hub-tools]')).toHaveText('1');
});

test('search hides cards that do not match', async ({ page }) => {
  await page.goto('/resources/');
  await page.fill('#hub-q', 'conjugation');
  await expect(page.locator('#groups .card:not([hidden])')).toHaveCount(1);
  await page.fill('#hub-q', 'zzzz');
  await expect(page.locator('#hub-none')).toBeVisible();
});
