import { test, expect } from '@playwright/test';

// At-Takwir (81): spot checks on the points that were corrected against al-Jadwal.
const URL = '/surahs/081-at-takwir/';

test('At-Takwir: every verse has a question and a study line for its words', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('section.vs')).toHaveCount(29);
  await expect(page.locator('section.vs .try')).toHaveCount(29);
  for (const n of [1, 9, 16, 29]) {
    const box = page.locator(`#v${n} [data-detail]`);
    await expect(box.locator('.role')).toHaveCount(1);
    await expect(box).toContainText('For the grammar book');
  }
});

test('At-Takwir 81:1: the noun after idha is the doer of an unspoken verb, not a mubtada', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#v1 .verse .w').nth(1).click();
  await expect(page.locator('#v1 [data-detail]')).toContainText('Subject (fāʿil) of an unspoken verb');
  await expect(page.locator('#v1 .layer[data-key="nahw"]')).toContainText('adverb of time for the future');
  const html = await page.content();
  expect(html).not.toContain('Nominal Sentence with Passive Verb');
});

test('At-Takwir 81:9: the question clause is the object of the verb of asking, and the second word is the mudaf ilayhi', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#v9 .verse .w').nth(2).click();
  await expect(page.locator('#v9 [data-detail]')).toContainText('Second part of a possession');
  await expect(page.locator('#v9 .layer[data-key="nahw"]')).toContainText('verb of asking');
});

test('At-Takwir 81:16: the first word is a badal of al-khunnas and the second is its adjective', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#v16 .verse .w').nth(0).click();
  await expect(page.locator('#v16 [data-detail]')).toContainText('Substitute (badal)');
  await page.locator('#v16 .verse .w').nth(1).click();
  await expect(page.locator('#v16 [data-detail]')).toContainText('Adjective (naʿt) of');
  await expect(page.locator('#v16 .layer[data-key="nahw"]')).toContainText('a badal of');
});

test('At-Takwir 81:17: the wa joins the night to al-khunnas, it is not a new oath wa', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#v17 .verse .w').nth(0).click();
  await expect(page.locator('#v17 [data-detail]')).toContainText('Joining wa');
  await expect(page.locator('#v17 .layer[data-key="nahw"]')).toContainText('not a new oath wa');
});

test('At-Takwir 81:22: ma works like laysa and the bi is extra', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#v22 .verse .w').nth(1).click();
  await expect(page.locator('#v22 [data-detail]')).toContainText('Negation working like');
  await page.locator('#v22 .verse .w').nth(3).click();
  await expect(page.locator('#v22 [data-detail]')).toContainText('Extra preposition');
  await expect(page.locator('#v22 .layer[data-key="nahw"]')).toContainText('accusative in place');
});

test('At-Takwir 81:26 and 81:29: the fa answers an unspoken condition, and rabb is an adjective of Allah', async ({ page }) => {
  await page.goto(URL);
  await page.locator('#v26 .verse .w').nth(0).click();
  await expect(page.locator('#v26 [data-detail]')).toContainText('Fa that links an answer');
  await expect(page.locator('#v26 .layer[data-key="nahw"]')).toContainText('unspoken condition');
  await page.locator('#v29 .verse .w').nth(7).click();
  await expect(page.locator('#v29 [data-detail]')).toContainText('Adjective (naʿt)');
  const html = await page.content();
  expect(html).not.toContain('Triple Emphasis Stack');
});
