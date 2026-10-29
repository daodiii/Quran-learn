import { test, expect } from '@playwright/test';

// Surah 80, ʿAbasa: a plain-English layer and a question for every verse, and the corrections made against al-Jadwal.
test('ʿAbasa: every verse has a question, a plain role for its first word, and the book’s parse', async ({ page }) => {
  await page.goto('/surahs/080-abasa/');
  await expect(page.locator('section.vs')).toHaveCount(42);
  await expect(page.locator('section.vs .try')).toHaveCount(42);
  for (let n = 1; n <= 42; n++) {
    const box = page.locator(`#v${n} [data-detail]`);
    await expect(box.locator('.role')).toHaveCount(1);
    await expect(box).toContainText('For the grammar book');
  }
});

test('ʿAbasa 80:3-4: yazzakkā is no subjunctive (it is the khabar of laʿalla) and the fa of tanfaʿahu is the fa of cause', async ({ page }) => {
  await page.goto('/surahs/080-abasa/');
  await page.locator('#v3 .verse .w').nth(4).click();
  await expect(page.locator('#v3 [data-detail]')).toContainText('predicate of laʿalla');
  await expect(page.locator('#v3 .layer[data-key="nahw"]')).toContainText('is not subjunctive');
  await page.locator('#v4 .verse .w').nth(2).click();
  await expect(page.locator('#v4 [data-detail]')).toContainText('Fa of cause');
  await expect(page.locator('#v4 .layer[data-key="nahw"]')).toContainText('so yadhdhakkaru is indicative');
});

test('ʿAbasa 80:5-10: istaghnā and jāʾaka are relative clauses, and the fa ties the answer to ammā', async ({ page }) => {
  await page.goto('/surahs/080-abasa/');
  await page.locator('#v5 .verse .w').nth(2).click();
  await expect(page.locator('#v5 [data-detail]')).toContainText('relative clause');
  await expect(page.locator('#v5 .layer[data-key="nahw"]')).toContainText('is not the predicate');
  await page.locator('#v6 .verse .w').nth(0).click();
  await expect(page.locator('#v6 [data-detail]')).toContainText('Fa that ties the answer to ammā');
  await expect(page.locator('#v10 .layer[data-key="nahw"]')).toContainText('is the khabar of man from verse 8');
});

test('ʿAbasa 80:7: the wa is a wāw of ḥāl and mā is negative', async ({ page }) => {
  await page.goto('/surahs/080-abasa/');
  await page.locator('#v7 .verse .w').nth(0).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('Wāw of ḥāl');
  await expect(page.locator('#v7 .layer[data-key="nahw"]')).toContainText('reads mā as a negative particle');
  expect(await page.content()).not.toContain('But what concern is it of yours');
});

test('ʿAbasa 80:17 and 80:20: mā is an indefinite noun, and al-sabīla is the object of an unspoken verb', async ({ page }) => {
  await page.goto('/surahs/080-abasa/');
  await expect(page.locator('#v17 .layer[data-key="nahw"]')).toContainText('exclamatory (taʿajjub) noun');
  await page.locator('#v20 .verse .w').nth(1).click();
  await expect(page.locator('#v20 [data-detail]')).toContainText('unspoken verb');
  await expect(page.locator('#v20 .layer[data-key="nahw"]')).toContainText('ishtighāl');
});

test('ʿAbasa 80:38-41: musfiratun is an adjective, ḍāḥikatun the predicate, and the dust clause an adjective of the faces', async ({ page }) => {
  await page.goto('/surahs/080-abasa/');
  await page.locator('#v38 .verse .w').nth(2).click();
  await expect(page.locator('#v38 [data-detail]')).toContainText('not as the predicate');
  await page.locator('#v39 .verse .w').nth(0).click();
  await expect(page.locator('#v39 [data-detail]')).toContainText('Predicate (khabar)');
  await expect(page.locator('#v40 .layer[data-key="nahw"]')).toContainText('the fronted khabar');
  await page.locator('#v41 .verse .w').nth(0).click();
  await expect(page.locator('#v41 [data-detail]')).toContainText('predicate of وُجُوهٌ');
  const html = await page.content();
  expect(html).not.toContain('seven-item enumeration');
  expect(html).not.toContain('four adjectives');
});
