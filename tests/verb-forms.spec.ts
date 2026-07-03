import { test, expect } from '@playwright/test';

test.describe('Verb Form Generator', () => {
  test('search + grid render real corpus data', async ({ page }) => {
    await page.goto('/resources/verb-forms/');
    await page.fill('#vf-search', 'نزل');
    await page.click('.vf-sug');
    const result = page.locator('#vf-result');
    await expect(result).toBeVisible();
    await expect(result.locator('.vf-row')).toHaveCount(10);
    await expect(result.locator('.vf-row-attested .vf-verb').first()).toContainText('نَزَ');
    await expect(result.locator('.vf-row-empty').first()).toContainText('not used in the Quran');
    await expect(result.locator('.vf-count').first()).toContainText('× in the Quran');
  });

  test('latin transliteration search and deep link', async ({ page }) => {
    await page.goto('/resources/verb-forms/');
    await page.fill('#vf-search', 'gh-f-r');
    await page.click('.vf-sug');
    await expect(page).toHaveURL(/#root=/);
    await page.reload();
    await expect(page.locator('#vf-result')).toBeVisible();
    await expect(page.locator('#vf-result .vf-row-attested').first()).toBeVisible();
  });

  test('quick chips work without search', async ({ page }) => {
    await page.goto('/resources/verb-forms/');
    await page.locator('.vf-chip').first().click();
    await expect(page.locator('#vf-result .vf-row-attested').first()).toBeVisible();
  });

  test('rare Form XII root renders beyond the ten-row grid', async ({ page }) => {
    await page.goto('/resources/verb-forms/#root=' + encodeURIComponent('طمن'));
    const result = page.locator('#vf-result');
    await expect(result).toBeVisible();
    await expect(result.locator('.vf-row')).toHaveCount(11);
    await expect(result.locator('.vf-row-attested .vf-verb').first()).toContainText('اطْمَأَنَّ'.slice(1, 4));
  });

  test('resources index card navigates to the generator', async ({ page }) => {
    await page.goto('/resources/');
    await page.click('[data-testid="resource-verb-forms"]');
    await expect(page).toHaveURL(/\/resources\/verb-forms\/$/);
    await expect(page.locator('h1')).toContainText('Verb Form Generator');
  });
});
