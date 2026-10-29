import { test, expect } from '@playwright/test';

// Surah 78, An-Naba: every verse has a plain-English layer and a question, and the corrected parses show on the page.

test('An-Naba: every verse has a question, a plain role for its first word, and the book\'s parse', async ({ page }) => {
  await page.goto('/surahs/078-an-naba/');
  await expect(page.locator('section.vs')).toHaveCount(40);
  await expect(page.locator('section.vs .try')).toHaveCount(40);
  for (let n = 1; n <= 40; n++) {
    const box = page.locator(`#v${n} [data-detail]`);
    await expect(box.locator('.role')).toHaveCount(1);
    await expect(box).toContainText('For the grammar book');
  }
});

test('An-Naba: alladhi in 78:3 is a second adjective of al-naba, not a badal', async ({ page }) => {
  await page.goto('/surahs/078-an-naba/');
  await page.locator('#v3 .verse .w').nth(0).click();
  await expect(page.locator('#v3 [data-detail]')).toContainText('second adjective');
  await expect(page.locator('#v3 .layer[data-key="nahw"]')).toContainText('does not read it as a badal');
});

test('An-Naba: the wa in 78:7 joins the mountains to the earth under the verb of 78:6', async ({ page }) => {
  await page.goto('/surahs/078-an-naba/');
  await page.locator('#v7 .verse .w').nth(0).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('Joining word');
  await expect(page.locator('#v7 .layer[data-key="nahw"]')).toContainText('not a new sentence with its own verb');
});

test('An-Naba: yawma in 78:18 is a badal of miqatan, and the fa in 78:18 to 78:20 is a joining fa', async ({ page }) => {
  await page.goto('/surahs/078-an-naba/');
  await page.locator('#v18 .verse .w').nth(0).click();
  await expect(page.locator('#v18 [data-detail]')).toContainText('Badal of');
  await expect(page.locator('#v18 .layer[data-key="nahw"]')).toContainText('a badal from mīqātan in verse 17');
  await page.locator('#v18 .verse .w').nth(4).click();
  await expect(page.locator('#v18 [data-detail]')).toContainText('Joining word');
  await page.locator('#v19 .verse .w').nth(3).click();
  await expect(page.locator('#v19 [data-detail]')).toContainText('Joining word');
  const html = await page.content();
  expect(html).not.toContain('sababiyya');
});

test('An-Naba: the second la in 78:24 and 78:35 is extra and only stresses the denial', async ({ page }) => {
  await page.goto('/surahs/078-an-naba/');
  await page.locator('#v24 .verse .w').nth(4).click();
  await expect(page.locator('#v24 [data-detail]')).toContainText('extra');
  await expect(page.locator('#v24 .layer[data-key="nahw"]')).toContainText('is redundant');
  await page.locator('#v35 .verse .w').nth(4).click();
  await expect(page.locator('#v35 [data-detail]')).toContainText('extra');
  await expect(page.locator('#v35 .layer[data-key="nahw"]')).toContainText('is redundant');
});

test('An-Naba: kulla in 78:29 is the object of an unspoken verb, and 78:30 has no tamyiz', async ({ page }) => {
  await page.goto('/surahs/078-an-naba/');
  await expect(page.locator('#v29 .layer[data-key="nahw"]')).toContainText('ishtighāl');
  await page.locator('#v30 .verse .w').nth(0).click();
  await expect(page.locator('#v30 [data-detail]')).toContainText('unspoken condition');
  await page.locator('#v30 .verse .w').nth(6).click();
  await expect(page.locator('#v30 [data-detail]')).toContainText('Second object');
  const html = await page.content();
  expect(html).not.toContain('tamyīz');
  expect(html).not.toContain('tamyiiz');
});

test('An-Naba: hamiman in 78:25 is a badal of sharaban, and the fa in 78:39 answers an unspoken condition', async ({ page }) => {
  await page.goto('/surahs/078-an-naba/');
  await page.locator('#v25 .verse .w').nth(1).click();
  await expect(page.locator('#v25 [data-detail]')).toContainText('Badal of');
  await page.locator('#v39 .verse .w').nth(3).click();
  await expect(page.locator('#v39 [data-detail]')).toContainText('unspoken condition');
  await expect(page.locator('#v39 .layer[data-key="nahw"]')).toContainText('unspoken condition');
});
