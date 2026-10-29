import { test, expect } from '@playwright/test';

// Surah 79, An-Naziʿat: all 46 verses have a plain-English layer and a question.
test('079-an-naziat: every verse has a question, a plain role for its first word, and the book’s parse', async ({ page }) => {
  await page.goto('/surahs/079-an-naziat/');
  await expect(page.locator('section.vs')).toHaveCount(46);
  await expect(page.locator('section.vs .try')).toHaveCount(46);
  for (let n = 1; n <= 46; n++) {
    const box = page.locator(`#v${n} [data-detail]`);
    await expect(box.locator('.role')).toHaveCount(1);
    await expect(box).toContainText('For the grammar book');
  }
});

test('An-Naziʿat 79:8-9: wajifa is an adjective of qulub, and the predicate is the clause in verse 9', async ({ page }) => {
  await page.goto('/surahs/079-an-naziat/');
  await page.locator('#v8 .verse .w').nth(2).click();
  await expect(page.locator('#v8 [data-detail]')).toContainText('Adjective (naʿt)');
  await expect(page.locator('#v8 .layer[data-key="nahw"]')).toContainText('whose predicate comes in verse 9');
  await page.locator('#v9 .verse .w').nth(1).click();
  await expect(page.locator('#v9 [data-detail]')).toContainText('whole clause is the predicate');
});

test('An-Naziʿat 79:13: innama stops inna from working, so hiya is a plain subject', async ({ page }) => {
  await page.goto('/surahs/079-an-naziat/');
  await page.locator('#v13 .verse .w').nth(1).click();
  await expect(page.locator('#v13 [data-detail]')).toContainText('Subject (mubtadaʾ)');
  await expect(page.locator('#v13 .layer[data-key="nahw"]')).toContainText('from working');
});

test('An-Naziʿat 79:19: the fa in fa-takhsha gives a reason, so the verb is indicative, not subjunctive', async ({ page }) => {
  await page.goto('/surahs/079-an-naziat/');
  await page.locator('#v19 .verse .w').nth(3).click();
  await expect(page.locator('#v19 [data-detail]')).toContainText('Reason-fāʾ + verb, present');
  await expect(page.locator('#v19 [data-detail]')).toContainText('indicative, not subjunctive');
  await expect(page.locator('#v19 .layer[data-key="nahw"]')).toContainText('not subjunctive');
});

test('An-Naziʿat 79:30 and 79:32: the earth and the mountains are objects of unspoken verbs (ishtighal), not fronted objects', async ({ page }) => {
  await page.goto('/surahs/079-an-naziat/');
  await page.locator('#v30 .verse .w').nth(0).click();
  await expect(page.locator('#v30 [data-detail]')).toContainText('Object of an unspoken verb');
  await expect(page.locator('#v30 .layer[data-key="nahw"]')).toContainText('ishtighal');
  await expect(page.locator('#v32 .layer[data-key="nahw"]')).toContainText('ishtighal');
  const html = await page.content();
  expect(html).not.toContain('fronted direct object');
});

test('An-Naziʿat 79:35 and 79:39: ma in ma sa‘a is a masdar particle, and the fa-inna clause gives the reason for an unspoken predicate', async ({ page }) => {
  await page.goto('/surahs/079-an-naziat/');
  await page.locator('#v35 .verse .w').nth(3).click();
  await expect(page.locator('#v35 [data-detail]')).toContainText('Verbal-noun particle');
  await expect(page.locator('#v35 .layer[data-key="nahw"]')).toContainText('masdar particle, not a relative pronoun');
  await expect(page.locator('#v39 .layer[data-key="nahw"]')).toContainText('that gives a reason');
});
