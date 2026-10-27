import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SHORT = '/hadith/01-actions-by-intentions/';
const LONG = '/hadith/24-prohibition-of-injustice/';
const WIDTHS = [390, 768, 1440];

async function scanAA(page: Page) {
  return new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
}

test.describe('Hadith section', () => {
  test('the index lists all 42 hadith and links the free PDF', async ({ page, request }) => {
    await page.goto('/hadith/');
    await expect(page.locator('.hadith-item')).toHaveCount(42);
    await expect(page.locator('.meta', { hasText: 'Added by Ibn Rajab' })).toHaveCount(2);

    const href = await page.locator('a[download]').getAttribute('href');
    expect(href).toBe('/downloads/forty-hadith.pdf');
    const res = await request.get(href!);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('pdf');
    expect((await res.body()).subarray(0, 5).toString()).toBe('%PDF-');
  });

  test('the index and two hadith pages have no WCAG A/AA violations', async ({ page }) => {
    for (const url of ['/hadith/', SHORT, LONG]) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      const results = await scanAA(page);
      expect(results.violations.map((v) => `${url}: ${v.id} (${v.nodes.length})`)).toEqual([]);
    }
  });

  for (const width of WIDTHS) {
    test(`no sideways scrolling at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const url of ['/hadith/', SHORT, LONG]) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth, `${url} at ${width}px`).toBeLessThanOrEqual(clientWidth);
      }
    });
  }

  test('on a phone each word is a stacked card, and on desktop it is a table', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(SHORT);
    expect(await page.locator('tbody tr').first().evaluate((el) => getComputedStyle(el).display)).toBe('grid');
    expect(await page.locator('thead').first().evaluate((el) => getComputedStyle(el).display)).toBe('none');

    await page.setViewportSize({ width: 1440, height: 900 });
    expect(await page.locator('tbody tr').first().evaluate((el) => getComputedStyle(el).display)).toBe('table-row');
  });

  test('the page scrolls with the wheel over the word cards on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(LONG);
    await page.waitForLoadState('networkidle');
    const row = page.locator('tbody tr').nth(5);
    await row.scrollIntoViewIfNeeded();
    const box = (await row.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  });

  test('every page links to the feedback form and to its neighbours', async ({ page }) => {
    await page.goto(LONG);
    await expect(page.locator('.hadith-feedback a')).toHaveAttribute('href', '/about/#feedback');
    await expect(page.locator('.pager a.prev')).toHaveAttribute('href', /\/hadith\/23-/);
    await expect(page.locator('.pager a.next')).toHaveAttribute('href', /\/hadith\/25-/);
  });
});
