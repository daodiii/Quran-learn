import { test, expect } from '@playwright/test';

test.describe('mobile table overflow', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const path of ['/surahs/093-ad-duha/', '/learn/level-3/14-verb-form-iv/']) {
    test(`no page-level horizontal overflow on ${path}`, async ({ page }) => {
      await page.goto(path);
      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(docWidth).toBeLessThanOrEqual(390);
    });

    test(`markdown tables on ${path} are wrapped in scroll containers`, async ({ page }) => {
      await page.goto(path);
      // every markdown-emitted table must sit inside .table-scroll
      const bare = await page.locator('table').evaluateAll(tables =>
        tables.filter(t => !t.closest('.table-scroll') && !t.closest('.grammar-table-wrapper') && !t.closest('.grammar-table') && !t.closest('.table-wrapper')).length);
      expect(bare).toBe(0);
    });
  }
});
