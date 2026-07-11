import { test, expect } from '@playwright/test';

test('renders all 81 lessons as rows grouped in 5 levels', async ({ page }) => {
  await page.goto('/learn/');
  await expect(page.locator('[data-lesson-row]')).toHaveCount(81);
  await expect(page.locator('section.level-section')).toHaveCount(5);
});

test('checkpoints are visually distinct rows', async ({ page }) => {
  await page.goto('/learn/');
  await expect(page.locator('[data-lesson-row][data-checkpoint]')).toHaveCount(5);
});

test('every level ends with a reading-track block; all 38 analyses are placed', async ({ page }) => {
  await page.goto('/learn/');
  await expect(page.locator('[data-reading-track]')).toHaveCount(5);
  await expect(page.locator('[data-reading-row]')).toHaveCount(38);
  const firstRow = page.locator('[data-reading-row]').first();
  await expect(firstRow).toHaveAttribute('href', /^\/surahs\/\d{3}-/);
});

test('heading hierarchy has no skips', async ({ page }) => {
  await page.goto('/learn/');
  const levels = await page.locator('h1, h2, h3').evaluateAll(hs => hs.map(h => Number(h.tagName[1])));
  levels.reduce((prev, cur) => { expect(cur - prev).toBeLessThanOrEqual(1); return Math.max(prev, cur); }, 1);
});

test('resume band appears for a returning user and targets first incomplete lesson', async ({ page }) => {
  await page.goto('/learn/');
  await page.evaluate(() => localStorage.setItem('quran-learn-progress', JSON.stringify({
    completedLessons: ['level-1/01-arabic-script-vowels', 'level-1/02-reading-marks'],
    lastUpdated: new Date().toISOString(),
  })));
  await page.reload();
  const band = page.locator('[data-resume-band]');
  await expect(band).toBeVisible();
  await expect(band.locator('[data-resume-title]')).toContainText('Lesson 3 of 11');
  await expect(band.locator('[data-resume-link]')).toHaveAttribute('href', /03-reading-bismillah/);
});

test('completed lessons show state in the catalog', async ({ page }) => {
  await page.goto('/learn/');
  await page.evaluate(() => localStorage.setItem('quran-learn-progress', JSON.stringify({
    completedLessons: ['level-1/01-arabic-script-vowels'], lastUpdated: new Date().toISOString(),
  })));
  await page.reload();
  await expect(page.locator('[data-lesson-row].completed')).toHaveCount(1);
});

test('sky tour: level cards carry real counts and finale resume targets first incomplete lesson', async ({ page }) => {
  await page.goto('/learn/');
  await expect(page.locator('.card[data-stop]')).toHaveCount(5);
  await expect(page.locator('.card[data-stop="1"] .rn')).toContainText('11 lessons');
  // fresh visitor: solid CTA starts at lesson 1.1, and the resume band stays hidden
  await expect(page.locator('[data-resume-cta]')).toHaveAttribute('href', /level-1\/01-/);
  await expect(page.locator('[data-resume-band]')).toBeHidden();
  await page.evaluate(() => localStorage.setItem('quran-learn-progress', JSON.stringify({
    completedLessons: ['level-1/01-arabic-script-vowels', 'level-1/02-reading-marks'],
    lastUpdated: new Date().toISOString(),
  })));
  await page.reload();
  await expect(page.locator('[data-resume-cta]')).toHaveAttribute('href', /03-reading-bismillah/);
  await expect(page.locator('[data-resume-cta]')).toContainText('1.3');
  await expect(page.locator('.card[data-stop="1"] .ct')).toContainText('2 of 11');
});

test('sky tour: browse CTA anchors to the server-rendered catalog', async ({ page }) => {
  await page.goto('/learn/');
  await expect(page.locator('a[href="#curriculum"]').first()).toBeAttached();
  await expect(page.locator('#curriculum [data-lesson-row]')).toHaveCount(81);
});
