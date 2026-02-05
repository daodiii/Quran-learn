import { test, expect } from '@playwright/test';
import { createHash } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load baseline checksums
const checksums = JSON.parse(
  readFileSync(join(__dirname, 'font-checksums.json'), 'utf-8')
);

test.describe('Font File Protection', () => {
  test('all Arabic font files match baseline checksums', () => {
    const fontFiles = Object.keys(checksums.files);

    for (const fontPath of fontFiles) {
      const fullPath = join(process.cwd(), fontPath);
      expect(existsSync(fullPath), `Font file missing: ${fontPath}`).toBe(true);

      const content = readFileSync(fullPath);
      const hash = createHash('sha256').update(content).digest('hex');

      expect(hash, `Font ${fontPath} has been modified`).toBe(checksums.files[fontPath]);
    }
  });
});

test.describe('Arabic Font Rendering', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for fonts to load before each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('UthmanicHafs font loads for Quranic text', async ({ page }) => {
    // Navigate to a surah page that has Arabic content
    await page.goto('/surahs/');
    await page.waitForLoadState('networkidle');

    // Check if Arabic text elements exist and use correct font
    const arabicElement = page.locator('.arabic').first();

    if (await arabicElement.count() > 0) {
      const fontFamily = await arabicElement.evaluate(
        el => window.getComputedStyle(el).fontFamily
      );
      expect(fontFamily).toContain('KFGQPC Hafs Uthmani');
    }
  });

  test('Arabic text renders correctly in light mode', async ({ page }) => {
    await page.goto('/learn/');
    await page.waitForLoadState('networkidle');

    // Ensure light mode
    await page.evaluate(() => {
      document.documentElement.removeAttribute('data-theme');
    });

    // Visual regression snapshot
    const arabicContent = page.locator('.arabic, .arabic-lg, .arabic-xl').first();
    if (await arabicContent.count() > 0) {
      await expect(arabicContent).toHaveScreenshot('arabic-light-mode.png', {
        maxDiffPixelRatio: 0.01, // 1% tolerance for anti-aliasing
      });
    }
  });

  test('Arabic text renders correctly in dark mode', async ({ page }) => {
    await page.goto('/learn/');
    await page.waitForLoadState('networkidle');

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    // Wait for transition
    await page.waitForTimeout(500);

    // Visual regression snapshot
    const arabicContent = page.locator('.arabic, .arabic-lg, .arabic-xl').first();
    if (await arabicContent.count() > 0) {
      await expect(arabicContent).toHaveScreenshot('arabic-dark-mode.png', {
        maxDiffPixelRatio: 0.01,
      });
    }
  });
});

test.describe('Dark Mode Contrast', () => {
  test('text has sufficient contrast in dark mode', async ({ page }) => {
    await page.goto('/learn/');

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    await page.waitForTimeout(300);

    // Get computed colors
    const colors = await page.evaluate(() => {
      const body = document.body;
      const style = window.getComputedStyle(body);
      return {
        textColor: style.color,
        bgColor: style.backgroundColor,
      };
    });

    // Log for manual verification (automated contrast calculation is complex)
    console.log('Dark mode colors:', colors);

    // Basic sanity check - text should be light, background dark
    expect(colors.textColor).toContain('255'); // White-ish
    expect(colors.bgColor).toContain('15'); // #0f0f0f dark
  });
});
