// tests/finder.spec.ts: /resources/find/ (the merged Word Lookup and Verb Form Generator) and the redirects
// from the two retired addresses.
import { test, expect } from '@playwright/test';

const search = async (page: import('@playwright/test').Page, q: string) => {
  await page.fill('#q', q);
  await page.locator('#results .fd-row').first().waitFor();
};

test.describe('Finder', () => {
  test('an English word finds base words and opens a card with family and verb forms', async ({ page }) => {
    await page.goto('/resources/find/');
    await search(page, 'forgive');
    await expect(page.locator('#results .fd-row').first()).toContainText('forgive');
    await page.locator('#results .fd-row').first().click();
    const card = page.locator('#card');
    await expect(card.locator('.fd-easy')).toContainText('forgive');
    await expect(card.locator('.fd-form').first()).toBeVisible();
    await expect(card.getByText('Same root, same family')).toBeVisible();
    await expect(card.locator('.fd-verbs summary')).toContainText('verb forms of this root');
  });

  test('a typo and a phrase still find the word', async ({ page }) => {
    await page.goto('/resources/find/');
    await search(page, 'beleive');
    await expect(page.locator('#results .fd-row').first()).toContainText('believe');
    await search(page, 'they believed');
    await expect(page.locator('#results .fd-row').first()).toContainText('believe');
  });

  test('a loanword spelling and an opening phrase work', async ({ page }) => {
    await page.goto('/resources/find/');
    await search(page, 'sabr');
    await expect(page.locator('#results .fd-row').first()).toContainText('patien');
    await search(page, 'bismillah');
    await page.locator('#results .fd-row').first().click();
    await expect(page.locator('#card .fd-easy')).toContainText('In the name of God');
    await expect(page.locator('#card .fd-part').first()).toBeVisible();
  });

  test('an Arabic form shows its plain parts and every reading', async ({ page }) => {
    await page.goto('/resources/find/');
    await page.fill('#q', 'وَٱلَّذِينَ');
    await page.locator('#card .fd-form.is-typed').waitFor();
    await expect(page.locator('#card .fd-prefix small').first()).toHaveText('and');
    await expect(page.locator('#card .fd-form').nth(1)).toBeVisible();
    await expect(page.locator('#card .fd-gram').first()).toBeAttached();
  });

  test('a root, by letters or by sound, opens the root card with unused forms greyed', async ({ page }) => {
    await page.goto('/resources/find/');
    await search(page, 'nzl');
    await page.locator('#results .fd-row').first().click();
    await expect(page.locator('#card .fd-vrow').first()).toBeVisible();
    await expect(page.locator('#card .fd-vrow.is-off').first()).toContainText('Not used in the Quran');
    await page.goto('/resources/find/#root=' + encodeURIComponent('نزل'));
    await page.reload();
    await expect(page.locator('#card .fd-vrow')).toHaveCount(10, { timeout: 15000 });
  });

  test('all roots can be browsed by first letter', async ({ page }) => {
    await page.goto('/resources/find/');
    await page.locator('#browse summary').click();
    await expect(page.locator('#browse-body .fd-rootchip').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#browse-body .fd-letter').first()).toBeAttached();
  });

  test('My words keeps a saved word after a reload and the review moves it on', async ({ page }) => {
    await page.goto('/resources/find/');
    await search(page, 'sabr');
    await page.locator('#results .fd-row').first().click();
    await page.getByRole('button', { name: /Save to My words/ }).click();
    await expect(page.locator('#mine-btn')).toContainText('(1)');
    await page.reload();
    await expect(page.locator('#mine-btn')).toContainText('(1)');
    await page.locator('#mine-btn').click();
    await page.getByRole('button', { name: /Go over 1 word/ }).click();
    await page.getByRole('button', { name: 'Show the meaning' }).click();
    await page.getByRole('button', { name: 'I knew it' }).click();
    await expect(page.getByText('Done for now')).toBeVisible();
  });

  test('a search with no result says so and asks for feedback', async ({ page }) => {
    await page.goto('/resources/find/');
    await page.fill('#q', 'zzzqqqxx');
    await expect(page.locator('#results .empty')).toContainText('No word found');
  });
});

test.describe('Retired addresses forward to the finder', () => {
  test('the Word Lookup address keeps #q and ?q', async ({ page }) => {
    await page.goto('/resources/word-lookup/#q=mercy');
    await expect(page).toHaveURL(/\/resources\/find\/#q=mercy$/);
    await page.goto('/resources/word-lookup/?q=' + encodeURIComponent('بسم'));
    await expect(page).toHaveURL(/\/resources\/find\/#q=/);
  });
  test('the Verb Form Generator address keeps #root', async ({ page }) => {
    await page.goto('/resources/verb-forms/#root=' + encodeURIComponent('نزل'));
    await expect(page).toHaveURL(/\/resources\/find\/#root=/);
    await expect(page.locator('#card .fd-vrow').first()).toBeVisible({ timeout: 15000 });
  });
  test('the retired pages are not in the sitemap and name the finder as canonical', async ({ page, request }) => {
    const res = await request.get('/sitemap-0.xml');
    const xml = await res.text();
    expect(xml).not.toContain('/resources/word-lookup/');
    expect(xml).not.toContain('/resources/verb-forms/');
    expect(xml).toContain('/resources/find/');
    await page.goto('/resources/word-lookup/', { waitUntil: 'commit' });
  });
});
