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

  test('search combobox exposes expanded state to assistive tech', async ({ page }) => {
    await page.goto('/resources/verb-forms/');
    const search = page.locator('#vf-search');
    await expect(search).toHaveAttribute('role', 'combobox');
    await expect(search).toHaveAttribute('aria-autocomplete', 'list');
    await expect(search).toHaveAttribute('aria-controls', 'vf-suggestions');
    await expect(search).toHaveAttribute('aria-expanded', 'false');
    await search.fill('نزل');
    await expect(page.locator('.vf-sug').first()).toBeVisible();
    await expect(search).toHaveAttribute('aria-expanded', 'true');
    await search.press('Escape');
    await expect(page.locator('#vf-suggestions')).toBeHidden();
    await expect(search).toHaveAttribute('aria-expanded', 'false');
  });

  test('suggestions support arrow-key navigation with focus return', async ({ page }) => {
    await page.goto('/resources/verb-forms/');
    const search = page.locator('#vf-search');
    await search.fill('نز');
    await expect(page.locator('.vf-sug').nth(1)).toBeVisible();
    await search.press('ArrowDown');
    await expect(page.locator('.vf-sug').first()).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.vf-sug').nth(1)).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('.vf-sug').first()).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(search).toBeFocused();
    await search.press('ArrowDown');
    await page.keyboard.press('Escape');
    await expect(page.locator('#vf-suggestions')).toBeHidden();
    await expect(search).toBeFocused();
    await expect(search).toHaveAttribute('aria-expanded', 'false');
  });

  test('selecting a suggestion closes the listbox', async ({ page }) => {
    await page.goto('/resources/verb-forms/');
    const search = page.locator('#vf-search');
    await search.fill('نزل');
    await page.locator('.vf-sug').first().click();
    await expect(page.locator('#vf-result')).toBeVisible();
    await expect(page.locator('#vf-suggestions')).toBeHidden();
    await expect(search).toHaveAttribute('aria-expanded', 'false');
  });
});
