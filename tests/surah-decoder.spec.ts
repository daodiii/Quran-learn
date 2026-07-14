import { test, expect } from '@playwright/test';

const SURAH = '/surahs/103-al-asr/';

test('decoder pre-selects a rooted word and shows a readout on load', async ({ page }) => {
  await page.goto(SURAH);
  const sel = page.locator('[data-surah-decoder] .recite .w.sel');
  await expect(sel).toHaveCount(1);
  await expect(sel).toHaveText('الْعَصْرِ'); // affordance skips the leading particle وَ
  await expect(page.locator('[data-surah-decoder] .d-readout')).toBeVisible();
  await expect(page.locator('[data-dec-count]')).toHaveText('0'); // affordance doesn't count
});

test('tapping a word decodes it, fills the 6-cell readout, and increments both counters', async ({ page }) => {
  await page.goto(SURAH);
  await page.locator('[data-surah-decoder] .recite .w').nth(3).click();
  await expect(page.locator('[data-dec-count]')).toHaveText('1');
  await expect(page.locator('[data-rail-touch]')).toHaveText('1'); // rail telemetry wired to lab:word-touched
  await expect(page.locator('[data-surah-decoder] .d-readout .r-k')).toHaveCount(6);
});

test('genitive lens dims non-matching words and highlights matches', async ({ page }) => {
  await page.goto(SURAH);
  const genChip = page.locator('.lens .chip[data-f="gen"]');
  await expect(genChip).toBeVisible();
  await genChip.click();
  await expect(genChip).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-surah-decoder] .recite .w.match').first()).toBeVisible();
  await expect(page.locator('[data-surah-decoder] .recite .w.dim').first()).toBeVisible();
});

test('station rail renders with the Words-decoded stat', async ({ page }) => {
  // .rail only displays at >=1280px (see lesson-lab.css); match the
  // desktop-viewport convention used by tests/lesson-wayfinding.spec.ts.
  await page.setViewportSize({ width: 1360, height: 900 });
  await page.goto(SURAH);
  await expect(page.locator('.rail [data-rail-pct]')).toBeVisible();
  await expect(page.locator('.rail')).toContainText('Words decoded');
});

test('Al-Fatiha (structural outlier) renders all 7 verses in the decoder', async ({ page }) => {
  await page.goto('/surahs/001-al-fatiha/');
  await expect(page.locator('[data-surah-decoder] .ayah-no')).toHaveCount(7);
  await expect(page.locator('[data-surah-decoder] .recite .w')).toHaveCount(29);
});

test('long surah: the breakdown stays in view with the word, no scroll round-trip', async ({ page }) => {
  // The Bench: on a 200-word surah the recitation is a fixed-height window and
  // the readout docks beneath it, so a word tapped deep in the surah and its
  // breakdown are on screen together instead of forcing a scroll-down-then-up.
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/surahs/078-an-naba/');
  await page.locator('#surah-decoder').scrollIntoViewIfNeeded();
  // tapping scrolls the recitation window internally, not the page
  await page.locator('[data-surah-decoder] .recite .w').nth(150).click();
  const selected = page.locator('[data-surah-decoder] .recite .w.sel');
  await expect(selected).toBeInViewport();
  await expect(page.locator('[data-surah-decoder] .d-readout')).toBeInViewport();
});

test('mobile: the breakdown docks as a bottom sheet pinned to the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/surahs/078-an-naba/');
  await page.locator('#surah-decoder').scrollIntoViewIfNeeded();
  const sheet = page.locator('[data-surah-decoder] .d-sheet');
  await expect(sheet).toHaveCSS('position', 'fixed');
  // decoding a word deep in the surah expands the sheet and brings its readout on
  // screen (centre the word first so it clears the peeking handle at the bottom)
  const word = page.locator('[data-surah-decoder] .recite .w').nth(150);
  await word.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await word.click();
  await expect(page.locator('[data-surah-decoder] .d-readout')).toBeInViewport();
  // the expanded sheet is pinned to the bottom edge of the viewport
  const box = await sheet.boundingBox();
  const vp = page.viewportSize()!;
  expect(box).not.toBeNull();
  expect(Math.abs(box!.y + box!.height - vp.height)).toBeLessThanOrEqual(2);
});
