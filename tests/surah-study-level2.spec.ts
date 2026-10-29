import { test, expect } from '@playwright/test';

// The seven surahs read after Level 2 have a plain-English layer and a question for every verse.
const LEVEL_2: [string, number][] = [
  ['104-al-humazah', 9],
  ['105-al-fil', 5],
  ['107-al-maun', 7],
  ['108-al-kawthar', 3],
  ['109-al-kafirun', 6],
  ['110-an-nasr', 3],
  ['111-al-masad', 5],
];

for (const [slug, verses] of LEVEL_2) {
  test(`${slug}: every verse has a question, a plain role for its first word, and the book's parse`, async ({ page }) => {
    await page.goto(`/surahs/${slug}/`);
    await expect(page.locator('section.vs')).toHaveCount(verses);
    await expect(page.locator('section.vs .try')).toHaveCount(verses);
    for (let n = 1; n <= verses; n++) {
      const box = page.locator(`#v${n} [data-detail]`);
      await expect(box.locator('.role')).toHaveCount(1);
      await expect(box).toContainText('For the grammar book');
    }
  });
}

test('Al-Humazah: alladhi is a badal of kull, the lam is the lam of the oath, and the wa in 104:5 is parenthetical', async ({ page }) => {
  await page.goto('/surahs/104-al-humazah/');
  await page.locator('#v2 .verse .w').nth(0).click();
  await expect(page.locator('#v2 [data-detail]')).toContainText('Badal of كُلِّ');
  await page.locator('#v4 .verse .w').nth(1).click();
  await expect(page.locator('#v4 [data-detail]')).toContainText('Lam of the oath');
  await page.locator('#v5 .verse .w').nth(0).click();
  await expect(page.locator('#v5 [data-detail]')).toContainText('Parenthetical wa');
  await expect(page.locator('#v5 .layer[data-key="nahw"]')).toContainText('second object');
});

test('Al-Humazah: the phrase in 104:9 belongs to a second khabar of inna, and adraka is from dara, not daraka', async ({ page }) => {
  await page.goto('/surahs/104-al-humazah/');
  await expect(page.locator('#v9 .layer[data-key="nahw"]')).toContainText('second khabar');
  await expect(page.locator('#v8 .layer[data-key="nahw"]')).toContainText('tied to مُؤْصَدَةٌ');
  const html = await page.content();
  expect(html).not.toContain('extended pillars');
  expect(html).not.toContain('دَرَكَ');
});

test('Al-Fil: ababil is an adjective of tayran and the tarmihim clause is a second adjective, not a hal', async ({ page }) => {
  await page.goto('/surahs/105-al-fil/');
  await page.locator('#v3 .verse .w').nth(4).click();
  await expect(page.locator('#v3 [data-detail]')).toContainText('Adjective (na');
  await expect(page.locator('#v3 [data-detail]')).not.toContainText('Hal (circumstantial');
  await expect(page.locator('#v4 .layer[data-key="nahw"]')).toContainText('second adjective');
  const html = await page.content();
  expect(html).not.toContain('bayāniyyah');
  expect(html).not.toContain('Hal (circumstantial state) or adjective');
});

test('Al-Fil: the clause after kayfa fills the place of two objects of tara', async ({ page }) => {
  await page.goto('/surahs/105-al-fil/');
  await expect(page.locator('#v1 .layer[data-key="nahw"]')).toContainText('two objects');
  await page.locator('#v1 .verse .w').nth(2).click();
  await expect(page.locator('#v1 [data-detail]')).toContainText('verbal noun');
});

test("Al-Ma'un: the fa in 107:2 answers an unspoken condition and the fa in 107:4 opens a new sentence", async ({ page }) => {
  await page.goto('/surahs/107-al-maun/');
  await page.locator('#v2 .verse .w').nth(0).click();
  await expect(page.locator('#v2 [data-detail]')).toContainText('unspoken condition');
  await expect(page.locator('#v2 .layer[data-key="nahw"]')).toContainText('unspoken condition');
  await page.locator('#v4 .verse .w').nth(0).click();
  await expect(page.locator('#v4 [data-detail]')).toContainText('Resumptive fa');
  const html = await page.content();
  expect(html).not.toContain('BECAUSE he denies');
});

test("Al-Ma'un: the second alladhina is a naʿt like the first, and the li phrase belongs to an unsaid khabar", async ({ page }) => {
  await page.goto('/surahs/107-al-maun/');
  await page.locator('#v6 .verse .w').nth(0).click();
  await expect(page.locator('#v6 [data-detail]')).toContainText('like the first');
  await expect(page.locator('#v4 .layer[data-key="nahw"]')).toContainText('left unsaid');
});

test('Al-Kawthar: fa links cause and result, and huwa can also be read as a subject', async ({ page }) => {
  await page.goto('/surahs/108-al-kawthar/');
  await expect(page.locator('#v2 .layer[data-key="nahw"]')).toContainText('unspoken sentence');
  await expect(page.locator('#v3 .layer[data-key="nahw"]')).toContainText('second reading');
  expect(await page.content()).not.toContain('quadriliteral');
});

test('Al-Kafirun: al-kafirun is a badal of ayyuha, ma is the object, and the negation is idle', async ({ page }) => {
  await page.goto('/surahs/109-al-kafirun/');
  await page.locator('#v1 .verse .w').nth(3).click();
  await expect(page.locator('#v1 [data-detail]')).toContainText('Badal of أَيُّهَا');
  await page.locator('#v2 .verse .w').nth(2).click();
  await expect(page.locator('#v2 [data-detail]')).toContainText('object of أَعْبُدُ');
  await expect(page.locator('#v3 .layer[data-key="nahw"]')).toContainText('idle negative');
  expect(await page.content()).not.toContain('Vocative apposition');
});

test('An-Nasr: idha has the clause as its mudaf ilayhi, and ra\'ayta is joined to that clause', async ({ page }) => {
  await page.goto('/surahs/110-an-nasr/');
  await expect(page.locator('#v1 .layer[data-key="nahw"]')).toContainText('muḍāf ilayhi');
  await expect(page.locator('#v2 .layer[data-key="nahw"]')).toContainText('coordinated with the clause');
  await expect(page.locator('#v3 .layer[data-key="nahw"]')).toContainText('khabar of إِنَّ');
  expect(await page.content()).not.toContain('governs the past tense verb');
});

test('Al-Masad: the second ma is a masdar particle, and hammalata is the object of an unspoken verb', async ({ page }) => {
  await page.goto('/surahs/111-al-masad/');
  await page.locator('#v2 .verse .w').nth(4).click();
  await expect(page.locator('#v2 [data-detail]')).toContainText('masdar particle');
  await expect(page.locator('#v2 .layer[data-key="nahw"]')).toContainText('masdar particle');
  await page.locator('#v4 .verse .w').nth(1).click();
  await expect(page.locator('#v4 [data-detail]')).toContainText('unspoken verb');
  const html = await page.content();
  expect(html).not.toContain('Apposition (badal) or predicate');
  expect(html).not.toContain('Context determines which');
});
