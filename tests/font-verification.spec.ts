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
    // Use surahs page which has Arabic content with arabic-xl class
    await page.goto('/surahs/001-al-fatiha/');
    await page.waitForLoadState('networkidle');

    // Ensure light mode
    await page.evaluate(() => {
      document.documentElement.removeAttribute('data-theme');
    });

    // Wait for fonts to fully render
    await page.waitForTimeout(500);

    // Visual regression snapshot of Arabic Quranic text
    const arabicContent = page.locator('.arabic-xl').first();
    await expect(arabicContent).toHaveScreenshot('arabic-light-mode.png', {
      maxDiffPixelRatio: 0.02, // 2% tolerance for anti-aliasing
    });
  });

  test('Arabic text renders correctly in dark mode', async ({ page }) => {
    // Use surahs page which has Arabic content
    await page.goto('/surahs/001-al-fatiha/');
    await page.waitForLoadState('networkidle');

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    // Wait for transition and fonts to render
    await page.waitForTimeout(500);

    // Visual regression snapshot
    const arabicContent = page.locator('.arabic-xl').first();
    await expect(arabicContent).toHaveScreenshot('arabic-dark-mode.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Dark Mode Contrast', () => {
  test('dark mode CSS variables are applied correctly', async ({ page }) => {
    await page.goto('/learn/');

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    await page.waitForTimeout(300);

    // Verify dark mode is activated
    const themeAttr = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    expect(themeAttr).toBe('dark');

    // Get CSS variable values from the document
    const cssVars = await page.evaluate(() => {
      const root = document.documentElement;
      const style = window.getComputedStyle(root);
      return {
        bgPrimary: style.getPropertyValue('--bg-primary').trim(),
        textPrimary: style.getPropertyValue('--text-primary').trim(),
        colorScheme: style.colorScheme,
      };
    });

    // Log for manual verification
    console.log('Dark mode CSS variables:', cssVars);

    // Verify dark mode CSS variables are set (dark background, light text)
    // --bg-primary in dark mode should be #0f0f0f or similar dark color
    // --text-primary in dark mode should be white or near-white
    expect(cssVars.bgPrimary).toMatch(/#0f0f0f|rgb\(15,\s*15,\s*15\)/i);
    expect(cssVars.textPrimary).toMatch(/#fff|#ffffff|#fafafa|rgb\(255,\s*255,\s*255\)|rgb\(250,\s*250,\s*250\)/i);
  });
});
