import { test, expect } from '@playwright/test';

// The eight surahs read after Level 3 have a plain-English layer and a question for every verse.
const LEVEL_3: [string, number][] = [
  ['094-ash-sharh', 8],
  ['095-at-tin', 8],
  ['097-al-qadr', 5],
  ['099-az-zalzalah', 8],
  ['100-al-adiyat', 11],
  ['101-al-qariah', 11],
  ['102-at-takathur', 8],
  ['103-al-asr', 3],
];

for (const [slug, verses] of LEVEL_3) {
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

test('Ash-Sharh: in 94:5 maʿa is an adverb tied to the unsaid khabar, yusran is the ism of inna, and the fa is resumptive', async ({ page }) => {
  await page.goto('/surahs/094-ash-sharh/');
  await page.locator('#v5 .verse .w').nth(2).click();
  await expect(page.locator('#v5 [data-detail]')).toContainText('tied to the predicate of inna');
  await page.locator('#v5 .verse .w').nth(4).click();
  await expect(page.locator('#v5 [data-detail]')).toContainText('Noun of inna (ism)');
  await page.locator('#v5 .verse .w').nth(0).click();
  await expect(page.locator('#v5 [data-detail]')).toContainText('Resumptive fa');
  await expect(page.locator('#v5 .layer[data-key="nahw"]')).toContainText('tied to the khabar of إِنَّ');
  const html = await page.content();
  expect(html).not.toContain('Predicate (khabar) of inna');
  expect(html).not.toContain('resultative conjunction');
});

test('Ash-Sharh: the clause after idha is its mudaf ilayhi, and the fa in 94:8 ties the answer of an unspoken condition', async ({ page }) => {
  await page.goto('/surahs/094-ash-sharh/');
  await page.locator('#v7 .verse .w').nth(1).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('does not make the verb jussive');
  await page.locator('#v8 .verse .w').nth(3).click();
  await expect(page.locator('#v8 [data-detail]')).toContainText('unspoken condition');
  await expect(page.locator('#v8 .layer[data-key="nahw"]')).toContainText('a condition that is not said');
});

test('At-Tin: the later wa words are conjunctions, asfala is a hal, baʿdu is built on damma, and the fa in 95:6 is extra', async ({ page }) => {
  await page.goto('/surahs/095-at-tin/');
  await page.locator('#v1 .verse .w').nth(2).click();
  await expect(page.locator('#v1 [data-detail]')).toContainText('Conjunction wa');
  await page.locator('#v5 .verse .w').nth(2).click();
  await expect(page.locator('#v5 [data-detail]')).toContainText('Hal (state) from the pronoun hu');
  await page.locator('#v6 .verse .w').nth(6).click();
  await expect(page.locator('#v6 [data-detail]')).toContainText('Extra fa');
  await page.locator('#v7 .verse .w').nth(3).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('mabni on damma');
  const html = await page.content();
  expect(html).not.toContain('but here nominative as subject');
  expect(html).not.toContain('or second object');
});

test('Al-Qadr: the wa in 97:2 is parenthetical, the second ma clause is the second object of adraka, and the verb in 97:4 lost one ta', async ({ page }) => {
  await page.goto('/surahs/097-al-qadr/');
  await page.locator('#v2 .verse .w').nth(0).click();
  await expect(page.locator('#v2 [data-detail]')).toContainText('Parenthetical wa');
  await page.locator('#v2 .verse .w').nth(3).click();
  await expect(page.locator('#v2 [data-detail]')).toContainText('second object of adrāka');
  await expect(page.locator('#v2 .layer[data-key="nahw"]')).toContainText('parenthetical');
  await page.locator('#v4 .verse .w').nth(0).click();
  await expect(page.locator('#v4 [data-detail]')).toContainText('one tā');
  const html = await page.content();
  expect(html).not.toContain('broken plurals of non-humans');
  expect(html).not.toContain('The past tense كَ pronoun');
  expect(html).not.toContain('just three words');
});

test('Al-Qadr: matlaʿ is a masdar mimi in al-Jadwal, and hiya may be the night or the angels', async ({ page }) => {
  await page.goto('/surahs/097-al-qadr/');
  await page.locator('#v5 .verse .w').nth(3).click();
  await expect(page.locator('#v5 [data-detail]')).toContainText('maṣdar mīmī');
  await page.locator('#v5 .verse .w').nth(1).click();
  await expect(page.locator('#v5 [data-detail]')).toContainText('the angels');
});

test('Az-Zalzalah: idha takes its clause as muḍāf ilayhi, the answer is not a jussive, and the lam in 99:6 is not a maful li-ajlihi', async ({ page }) => {
  await page.goto('/surahs/099-az-zalzalah/');
  await page.locator('#v1 .verse .w').nth(1).click();
  await expect(page.locator('#v1 [data-detail]')).toContainText('muḍāf ilayhi of idhā');
  await page.locator('#v4 .verse .w').nth(0).click();
  await expect(page.locator('#v4 [data-detail]')).toContainText('badal of idhā');
  await page.locator('#v7 .verse .w').nth(1).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('Conditional noun');
  await expect(page.locator('#v6 .layer[data-key="nahw"]')).toContainText('It is not a مَفْعُول لِأَجْلِهِ');
  const html = await page.content();
  expect(html).not.toContain('causal adjunct');
  expect(html).not.toContain('conditional particle (أَدَاة');
  expect(html).not.toContain('just five words');
  expect(html).not.toContain('fourteen words');
});

test("Al-'Adiyat: jam'an is a plain direct object, the lam in 8 is a lam of strengthening, and idha is a time word with a muddaf ilayhi clause", async ({ page }) => {
  await page.goto('/surahs/100-al-adiyat/');
  await page.locator('#v5 .verse .w').nth(3).click();
  await expect(page.locator('#v5 [data-detail]')).toContainText("Direct object (maf'ūl bihi)");
  await expect(page.locator('#v5 [data-detail]')).not.toContainText('adverbial');
  await page.locator('#v8 .verse .w').nth(2).click();
  await expect(page.locator('#v8 [data-detail]')).toContainText('Lam of strengthening');
  await page.locator('#v9 .verse .w').nth(4).click();
  await expect(page.locator('#v9 [data-detail]')).toContainText('muḍāf ilayhi');
  await expect(page.locator('#v9 .layer[data-key="nahw"]')).toContainText('unspoken verb');
});

test("Al-'Adiyat: the fa in 2-5 joins, atharna is Form IV from th-w-r, and the old five-oath and consequence claims are gone", async ({ page }) => {
  await page.goto('/surahs/100-al-adiyat/');
  await page.locator('#v4 .verse .w').nth(1).click();
  await expect(page.locator('#v4 [data-detail]')).toContainText('joined to the participles');
  await expect(page.locator('#v4 .layer[data-key="sarf"]')).toContainText('Form IV');
  const html = await page.content();
  expect(html).not.toContain('five-oath');
  expect(html).not.toContain('introduces the consequence of the charge');
  expect(html).not.toContain('adverbial of place');
});

test('At-Takathur: the doer of alhakum is al-takathur, the lam in 6 is the lam of the oath, and the verb is marfu not mabni', async ({ page }) => {
  await page.goto('/surahs/102-at-takathur/');
  await page.locator('#v1 .verse .w').nth(0).click();
  await expect(page.locator('#v1 [data-detail]')).toContainText('its doer is');
  await page.locator('#v6 .verse .w').nth(0).click();
  await expect(page.locator('#v6 [data-detail]')).toContainText('Lam of the oath');
  await page.locator('#v7 .verse .w').nth(3).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('standing in for the verbal noun');
  await expect(page.locator('#v6 .layer[data-key="nahw"]')).toContainText('unspoken oath');
  const html = await page.content();
  expect(html).not.toContain('subject concealed (huwa)');
  expect(html).not.toContain('The verb is مَبْنِي (indeclinable) due to the emphatic nun');
  expect(html).not.toContain('appears four times');
});

test('Al-Qariah: the khabar of verse 1 is the question of verse 2, and ma is the subject of that question', async ({ page }) => {
  await page.goto('/surahs/101-al-qariah/');
  await page.locator('#v1 .verse .w').nth(0).click();
  await expect(page.locator('#v1 [data-detail]')).toContainText('its khabar is the question in verse 2');
  await expect(page.locator('#v1 .layer[data-key="nahw"]')).toContainText('its khabar (predicate) is the clause');
  await page.locator('#v2 .verse .w').nth(1).click();
  await expect(page.locator('#v2 [data-detail]')).toContainText('Predicate (khabar) of mā');
  const html = await page.content();
  expect(html).not.toContain('Mubtada Without Khabar');
  expect(html).not.toContain('wajib al-taqdim');
  expect(html).not.toContain('Surah 56');
});

test('Al-Qariah: the wa in 101:3 is parenthetical, yawm is tied to an unspoken verb, and the waw of yakunu shows in the present', async ({ page }) => {
  await page.goto('/surahs/101-al-qariah/');
  await page.locator('#v3 .verse .w').nth(0).click();
  await expect(page.locator('#v3 [data-detail]')).toContainText('parenthetical');
  await expect(page.locator('#v3 .layer[data-key="nahw"]')).toContainText('second maf');
  await page.locator('#v4 .verse .w').nth(0).click();
  await expect(page.locator('#v4 [data-detail]')).toContainText('unspoken verb');
  await expect(page.locator('#v4 .layer[data-key="sarf"]')).toContainText('turns into alif');
  const html = await page.content();
  expect(html).not.toContain('zarf zaman or badal');
});

test('Al-Qariah: the first fa of amma is resumptive, the answer is the khabar of man, and the word in 101:10 ends in the pausal ha', async ({ page }) => {
  await page.goto('/surahs/101-al-qariah/');
  await page.locator('#v6 .verse .w').nth(0).click();
  await expect(page.locator('#v6 [data-detail]')).toContainText('starts a new sentence');
  await page.locator('#v7 .verse .w').nth(1).click();
  await expect(page.locator('#v7 [data-detail]')).toContainText('khabar of man');
  await page.locator('#v10 .verse .w').nth(4).click();
  await expect(page.locator('#v10 [data-detail]')).toContainText('hāʾ al-sakt');
  const html = await page.content();
  expect(html).not.toContain('مَا هِىَۡ');
});

test('Al-Asr: the verbs in 103:3 are mabni past verbs joined to the sila, not indicative predicates', async ({ page }) => {
  await page.goto('/surahs/103-al-asr/');
  await page.locator('#v3 .verse .w').nth(2).click();
  await expect(page.locator('#v3 [data-detail]')).toContainText('mabni on damma');
  await expect(page.locator('#v3 [data-detail]')).not.toContainText('indicative');
  await page.locator('#v1 .verse .w').nth(0).click();
  await expect(page.locator('#v1 [data-detail]')).toContainText('aqsimu');
  const html = await page.content();
  expect(html).not.toContain('causative: to cause belief');
  expect(html).not.toContain('a concrete noun used abstractly');
});
