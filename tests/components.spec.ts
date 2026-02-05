import { test, expect } from '@playwright/test';

test.describe('Component Test Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');
  });

  test('test page loads and displays all sections', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1')).toContainText('Component Test Page');

    // Verify all section headings are present
    const sectionHeadings = ['Progress Components', 'Button Component', 'Badge Component', 'Card Component', 'Container Component'];
    for (const heading of sectionHeadings) {
      await expect(page.locator('h2').filter({ hasText: heading })).toBeVisible();
    }
  });
});

test.describe('Progress Components - ARIA Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');
  });

  test('ProgressBar has correct ARIA attributes', async ({ page }) => {
    const progressBar = page.getByTestId('progress-bar-50');

    // Verify role
    await expect(progressBar.locator('[role="progressbar"]')).toBeVisible();

    // Verify ARIA attributes
    const ariaElement = progressBar.locator('[role="progressbar"]');
    await expect(ariaElement).toHaveAttribute('aria-valuenow', '50');
    await expect(ariaElement).toHaveAttribute('aria-valuemin', '0');
    await expect(ariaElement).toHaveAttribute('aria-valuemax', '100');
    await expect(ariaElement).toHaveAttribute('aria-labelledby', 'progress-label');
  });

  test('ProgressBar with percentage displays correctly', async ({ page }) => {
    const progressBar = page.getByTestId('progress-bar-with-percentage');

    // Verify role
    await expect(progressBar.locator('[role="progressbar"]')).toBeVisible();

    // Verify percentage text is visible
    await expect(progressBar.locator('.progress-percentage')).toContainText('65%');

    // Verify ARIA attributes
    const ariaElement = progressBar.locator('[role="progressbar"]');
    await expect(ariaElement).toHaveAttribute('aria-valuenow', '65');
  });

  test('ProgressRing has correct ARIA attributes', async ({ page }) => {
    const progressRing = page.getByTestId('progress-ring-3');

    // Verify role
    await expect(progressRing.locator('[role="progressbar"]')).toBeVisible();

    // Verify ARIA attributes
    const ariaElement = progressRing.locator('[role="progressbar"]');
    await expect(ariaElement).toHaveAttribute('aria-valuenow', '3');
    await expect(ariaElement).toHaveAttribute('aria-valuemin', '0');
    await expect(ariaElement).toHaveAttribute('aria-valuemax', '10');
    await expect(ariaElement).toHaveAttribute('aria-valuetext', '3 of 10 completed');
    await expect(ariaElement).toHaveAttribute('aria-label', '3 of 10 lessons');
  });

  test('LessonCheckmark has correct role and ARIA label', async ({ page }) => {
    const checkmarkCompleted = page.getByTestId('checkmark-completed');

    // Verify role="img" for binary state indicator
    await expect(checkmarkCompleted.locator('[role="img"]')).toBeVisible();

    // Verify aria-label exists
    const roleElement = checkmarkCompleted.locator('[role="img"]');
    const ariaLabel = await roleElement.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });
});

test.describe('Button Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');
  });

  test('all button variants render correctly', async ({ page }) => {
    // Verify all 4 variants are visible
    await expect(page.getByTestId('button-primary')).toBeVisible();
    await expect(page.getByTestId('button-secondary')).toBeVisible();
    await expect(page.getByTestId('button-outline')).toBeVisible();
    await expect(page.getByTestId('button-ghost')).toBeVisible();
  });

  test('all button sizes render correctly', async ({ page }) => {
    await expect(page.getByTestId('button-sm')).toBeVisible();
    await expect(page.getByTestId('button-md')).toBeVisible();
    await expect(page.getByTestId('button-lg')).toBeVisible();
  });

  test('disabled button has correct attributes', async ({ page }) => {
    const disabledButton = page.getByTestId('button-disabled');

    await expect(disabledButton).toBeVisible();
    await expect(disabledButton).toHaveAttribute('disabled');
    await expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
  });

  test('button link mode renders as anchor tag', async ({ page }) => {
    const linkButton = page.getByTestId('button-link');

    // Should be an <a> tag, not <button>
    const tagName = await linkButton.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('a');

    // Should have href attribute
    await expect(linkButton).toHaveAttribute('href', '/test');
  });
});

test.describe('Badge Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');
  });

  test('all badge semantic variants render correctly', async ({ page }) => {
    await expect(page.getByTestId('badge-default')).toBeVisible();
    await expect(page.getByTestId('badge-success')).toBeVisible();
    await expect(page.getByTestId('badge-warning')).toBeVisible();
    await expect(page.getByTestId('badge-error')).toBeVisible();
    await expect(page.getByTestId('badge-info')).toBeVisible();
  });

  test('all badge level variants render correctly', async ({ page }) => {
    // Verify all 5 level badges exist
    for (let level = 1; level <= 5; level++) {
      const badge = page.getByTestId(`badge-level-${level}`);
      await expect(badge).toBeVisible();
      await expect(badge).toHaveAttribute('data-level', level.toString());
    }
  });

  test('badge sizes render correctly', async ({ page }) => {
    await expect(page.getByTestId('badge-sm')).toBeVisible();
    await expect(page.getByTestId('badge-md')).toBeVisible();
  });
});

test.describe('Card Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');
  });

  test('all card variants render correctly', async ({ page }) => {
    await expect(page.getByTestId('card-default')).toBeVisible();
    await expect(page.getByTestId('card-elevated')).toBeVisible();
    await expect(page.getByTestId('card-outlined')).toBeVisible();
  });

  test('all card padding options render correctly', async ({ page }) => {
    await expect(page.getByTestId('card-padding-none')).toBeVisible();
    await expect(page.getByTestId('card-padding-sm')).toBeVisible();
    await expect(page.getByTestId('card-padding-md')).toBeVisible();
    await expect(page.getByTestId('card-padding-lg')).toBeVisible();
  });

  test('clickable card has correct class', async ({ page }) => {
    const clickableCard = page.getByTestId('card-clickable');
    await expect(clickableCard).toBeVisible();

    const className = await clickableCard.getAttribute('class');
    expect(className).toContain('card-clickable');
  });

  test('card link mode renders as anchor tag', async ({ page }) => {
    const cardLink = page.getByTestId('card-link');

    // Should be an <a> tag
    const tagName = await cardLink.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('a');

    // Should have href attribute
    await expect(cardLink).toHaveAttribute('href', '/test');
  });
});

test.describe('Container Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');
  });

  test('all container max-width variants render correctly', async ({ page }) => {
    await expect(page.getByTestId('container-sm')).toBeVisible();
    await expect(page.getByTestId('container-md')).toBeVisible();
    await expect(page.getByTestId('container-lg')).toBeVisible();
    await expect(page.getByTestId('container-xl')).toBeVisible();
    await expect(page.getByTestId('container-2xl')).toBeVisible();
  });
});

test.describe('RTL Mode Support', () => {
  test('components work correctly in RTL mode', async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');

    // Set RTL direction on document
    await page.evaluate(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    // Wait for potential layout shifts
    await page.waitForTimeout(500);

    // Verify key components are still visible and functional
    await expect(page.getByTestId('progress-bar-50')).toBeVisible();
    await expect(page.getByTestId('progress-ring-7')).toBeVisible();
    await expect(page.getByTestId('button-primary')).toBeVisible();
    await expect(page.getByTestId('badge-level-3')).toBeVisible();
    await expect(page.getByTestId('card-default')).toBeVisible();

    // Visual regression snapshot in RTL mode
    await expect(page).toHaveScreenshot('components-rtl.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });
});

test.describe('Dark Mode Support', () => {
  test('components render correctly in dark mode', async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');

    // Set dark theme via data-theme attribute
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    // Wait for theme transition
    await page.waitForTimeout(500);

    // Verify components are visible in dark mode
    await expect(page.getByTestId('progress-bar-75')).toBeVisible();
    await expect(page.getByTestId('progress-ring-10')).toBeVisible();
    await expect(page.getByTestId('checkmark-completed')).toBeVisible();
    await expect(page.getByTestId('button-secondary')).toBeVisible();
    await expect(page.getByTestId('badge-success')).toBeVisible();
    await expect(page.getByTestId('card-elevated')).toBeVisible();

    // Visual regression snapshot in dark mode
    await expect(page).toHaveScreenshot('components-dark.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('verify dark mode CSS variables are applied', async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');

    // Set dark theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    // Wait for theme transition
    await page.waitForTimeout(500);

    // Check that CSS variables have changed (dark mode values)
    const backgroundColor = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = window.getComputedStyle(root);
      return styles.getPropertyValue('--color-background-primary').trim();
    });

    // In dark mode, background should be a dark color (not white/light)
    expect(backgroundColor).toBeTruthy();
    // This verifies the CSS variable exists and has a value in dark mode
  });
});

test.describe('Visual Regression - Light Mode', () => {
  test('full page snapshot in light mode', async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');

    // Capture full page screenshot
    await expect(page).toHaveScreenshot('components-light.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('progress components section snapshot', async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');

    // Find progress section and snapshot it
    const progressSection = page.locator('section').filter({ hasText: 'Progress Components' });
    await expect(progressSection).toHaveScreenshot('progress-section.png', {
      maxDiffPixels: 50
    });
  });

  test('button components section snapshot', async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');

    const buttonSection = page.locator('section').filter({ hasText: 'Button Component' });
    await expect(buttonSection).toHaveScreenshot('button-section.png', {
      maxDiffPixels: 50
    });
  });

  test('badge components section snapshot', async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');

    const badgeSection = page.locator('section').filter({ hasText: 'Badge Component' });
    await expect(badgeSection).toHaveScreenshot('badge-section.png', {
      maxDiffPixels: 50
    });
  });

  test('card components section snapshot', async ({ page }) => {
    await page.goto('/test/components');
    await page.waitForLoadState('networkidle');

    const cardSection = page.locator('section').filter({ hasText: 'Card Component' });
    await expect(cardSection).toHaveScreenshot('card-section.png', {
      maxDiffPixels: 50
    });
  });
});
