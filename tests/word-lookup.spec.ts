// tests/word-lookup.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Word Lookup', () => {
  test('uthmani paste and modern typing reach the same word', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.fill('#wl-search', 'ٱلصَّلَوٰةَ');
    await page.press('#wl-search', 'Enter');
    const result = page.locator('#wl-result');
    await expect(result).toBeVisible();
    await expect(result.locator('.wl-word').first()).toContainText('لصَّلَو');
    await expect(result.locator('.wl-root-chip').first()).toContainText('ص · ل · و');

    await page.fill('#wl-search', 'الصلاة');
    await page.press('#wl-search', 'Enter');
    await expect(result.locator('.wl-word').first()).toContainText('لصَّلَو');
  });

  test('verb card: gloss, grammar, breakdown, generator deep link', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.fill('#wl-search', 'يؤمنون');
    await page.press('#wl-search', 'Enter');
    const result = page.locator('#wl-result');
    await expect(result).toBeVisible();
    await expect(result.locator('.wl-meaning').first()).toContainText('believe');
    await expect(result.locator('.wl-badge').first()).toHaveText('IV');
    await expect(result.locator('.wl-morpheme').first()).toBeVisible();
    await result.locator('a.wl-root-chip').first().click();
    await expect(page).toHaveURL(/\/resources\/verb-forms\/#root=/);
    await expect(page.locator('#vf-result .vf-row-attested').first()).toBeVisible();
  });

  test('noun card shows curated gloss instead of placeholder', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.fill('#wl-search', 'بسم');
    await page.press('#wl-search', 'Enter');
    const card = page.locator('#wl-result .wl-card').first();
    await expect(card).toBeVisible();
    await expect(card.locator('.wl-meaning')).toContainText('name');
    await expect(card.locator('.wl-meaning-soon')).toHaveCount(0);
  });

  test('homograph lists multiple written forms', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.fill('#wl-search', 'ملك');
    await page.press('#wl-search', 'Enter');
    const cards = page.locator('#wl-result .wl-card');
    await expect(cards.nth(1)).toBeVisible(); // auto-waits until at least two cards rendered
    expect(await cards.count()).toBeGreaterThanOrEqual(2);
  });

  test('latin input: sound and meaning groups with highlighted meanings', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.fill('#wl-search', 'yuminuna');
    await expect(page.locator('.wl-group-label').first()).toContainText('by sound');
    await page.fill('#wl-search', 'believed');   // stemmed form
    const meaningRow = page.locator('.wl-sug').first();
    await expect(page.locator('.wl-group-label', { hasText: 'by meaning' })).toBeVisible();
    await expect(meaningRow.locator('mark')).toContainText('believe');
    await expect(meaningRow.locator('.wl-sug-sub')).toContainText('·');
  });

  test('no match shows did-you-mean guidance', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.fill('#wl-search', 'يؤمنوننن');
    await page.press('#wl-search', 'Enter');
    await expect(page.locator('.wl-empty')).toBeVisible();
  });

  test('deep link #q= renders on load', async ({ page }) => {
    await page.goto('/resources/word-lookup/#q=' + encodeURIComponent('بسم'));
    await expect(page.locator('#wl-result .wl-word').first()).toContainText('بِسْمِ');
  });

  test('english example chip opens the meaning group', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.locator('.wl-chip', { hasText: 'mercy' }).click();
    await expect(page.locator('.wl-group-label', { hasText: 'by meaning' })).toBeVisible();
  });
  test('arabic example chip still renders a card without typing', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.locator('.wl-chip', { hasText: 'بِسْمِ' }).click();
    await expect(page.locator('#wl-result .wl-card').first()).toBeVisible();
  });

  test('resources index card navigates here', async ({ page }) => {
    await page.goto('/resources/');
    await page.click('[data-testid="resource-word-lookup"]');
    await expect(page).toHaveURL(/\/resources\/word-lookup\/$/);
    await expect(page.locator('h1')).toContainText('Word Lookup');
  });

  test('card order: meaning precedes breakdown; morpheme grid is aligned', async ({ page }) => {
    await page.goto('/resources/word-lookup/#q=' + encodeURIComponent('بسم'));
    const analysis = page.locator('#wl-result .wl-analysis').first();
    await expect(analysis).toBeVisible();
    const first = analysis.locator('.wl-meaning, .wl-breakdown').first();
    await expect(first).toHaveClass(/wl-meaning/);   // meaning now renders first
    const morpheme = analysis.locator('.wl-morpheme').first();
    await expect(morpheme.locator('.wl-morpheme-label')).toBeVisible();
    await expect(morpheme.locator('[lang="ar"]')).toBeVisible();
  });
});
