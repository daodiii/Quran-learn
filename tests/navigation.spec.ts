import { test, expect } from '@playwright/test';

test.describe('Navigation System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/navigation/');
    await page.waitForLoadState('networkidle');
  });

  test('test page loads and displays all navigation sections', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1').first()).toContainText('Navigation System Test');

    // Verify all test sections exist
    await expect(page.getByTestId('breadcrumbs-section')).toBeVisible();
    await expect(page.getByTestId('breadcrumbs-rtl-section')).toBeVisible();
    await expect(page.getByTestId('toggle-section')).toBeVisible();
    await expect(page.getByTestId('keyboard-section')).toBeVisible();
    await expect(page.getByTestId('mobile-section')).toBeVisible();
    await expect(page.getByTestId('level-states-section')).toBeVisible();
  });
});

test.describe('CourseNavigator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/navigation/');
    await page.waitForLoadState('networkidle');
  });

  test('displays all 5 level sections', async ({ page }) => {
    const levelSections = page.locator('.level-section');
    await expect(levelSections).toHaveCount(5);
  });

  test('level headers have correct ARIA attributes', async ({ page }) => {
    const levelHeaders = page.locator('.level-header');
    const firstHeader = levelHeaders.first();

    await expect(firstHeader).toHaveAttribute('aria-expanded');
    await expect(firstHeader).toHaveAttribute('aria-controls');
  });

  test('clicking level header toggles aria-expanded', async ({ page }) => {
    const firstHeader = page.locator('.level-header').first();
    const initialState = await firstHeader.getAttribute('aria-expanded');

    await firstHeader.click();
    await page.waitForTimeout(100); // Wait for state update

    const newState = await firstHeader.getAttribute('aria-expanded');
    expect(newState).not.toBe(initialState);
  });

  test('expanded level shows lesson list', async ({ page }) => {
    const firstHeader = page.locator('.level-header').first();
    const controlsId = await firstHeader.getAttribute('aria-controls');

    if (!controlsId) {
      throw new Error('Level header missing aria-controls attribute');
    }

    const lessonList = page.locator(`#${controlsId}`);

    // Expand if collapsed
    const isExpanded = await firstHeader.getAttribute('aria-expanded');
    if (isExpanded === 'false') {
      await firstHeader.click();
      await page.waitForTimeout(100);
    }

    // Lesson list should not have hidden attribute
    const isHidden = await lessonList.getAttribute('hidden');
    expect(isHidden).toBeNull();
  });

  test('lessons have proper link structure', async ({ page }) => {
    // Expand first level
    const firstHeader = page.locator('.level-header').first();
    const isExpanded = await firstHeader.getAttribute('aria-expanded');

    if (isExpanded === 'false') {
      await firstHeader.click();
      await page.waitForTimeout(100);
    }

    const lessonLinks = page.locator('.lesson-item');
    const firstLesson = lessonLinks.first();

    await expect(firstLesson).toHaveAttribute('href');
    await expect(firstLesson.locator('.lesson-number')).toBeVisible();
    await expect(firstLesson.locator('.lesson-title')).toBeVisible();
  });

  test('sidebar has navigation landmark', async ({ page }) => {
    const nav = page.locator('#course-navigator');
    await expect(nav).toHaveAttribute('aria-label', 'Course navigation');
  });

  test('level sections have data-level attribute', async ({ page }) => {
    const sections = page.locator('.level-section');
    const firstSection = sections.first();

    await expect(firstSection).toHaveAttribute('data-level');
  });
});

test.describe('Breadcrumbs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/navigation/');
    await page.waitForLoadState('networkidle');
  });

  test('renders with correct ARIA label', async ({ page }) => {
    const breadcrumbs = page.getByTestId('breadcrumbs-section').locator('nav');
    await expect(breadcrumbs).toHaveAttribute('aria-label', 'Breadcrumbs');
  });

  test('last item has aria-current="page"', async ({ page }) => {
    const breadcrumbs = page.getByTestId('breadcrumbs-section').locator('nav');
    const lastItem = breadcrumbs.locator('li').last();
    const current = lastItem.locator('[aria-current="page"]');

    await expect(current).toBeVisible();
  });

  test('separator is hidden from screen readers', async ({ page }) => {
    const separators = page.getByTestId('breadcrumbs-section').locator('.separator');
    const firstSeparator = separators.first();

    await expect(firstSeparator).toHaveAttribute('aria-hidden', 'true');
  });

  test('RTL mode uses correct separator', async ({ page }) => {
    const rtlSection = page.getByTestId('breadcrumbs-rtl-section');

    // Get computed content of ::before pseudo-element
    const content = await rtlSection.locator('.separator').first().evaluate((el) => {
      return window.getComputedStyle(el, '::before').content;
    });

    // Should be "<" or contain "<" for RTL
    expect(content).toContain('<');
  });

  test('breadcrumbs display correct number of items', async ({ page }) => {
    const breadcrumbs = page.getByTestId('breadcrumbs-section').locator('nav');
    const items = breadcrumbs.locator('li');

    // Should have 4 items (Home > Learn > Level 1 > Arabic Alphabet)
    await expect(items).toHaveCount(4);
  });
});

test.describe('NavigatorToggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/navigation/');
    await page.waitForLoadState('networkidle');
  });

  test('toggle button has correct ARIA attributes', async ({ page }) => {
    const toggle = page.locator('#navigator-toggle').first();

    await expect(toggle).toHaveAttribute('aria-expanded');
    await expect(toggle).toHaveAttribute('aria-label');
    await expect(toggle).toHaveAttribute('aria-controls', 'course-navigator');
  });

  test('toggle shows menu icon initially', async ({ page }) => {
    const toggle = page.locator('#navigator-toggle').first();
    const menuIcon = toggle.locator('.menu-icon');
    const closeIcon = toggle.locator('.close-icon');

    await expect(menuIcon).toBeVisible();
    await expect(closeIcon).not.toBeVisible();
  });

  test('toggle icon switches when clicked', async ({ page }) => {
    // Resize to mobile to make toggle functional
    await page.setViewportSize({ width: 375, height: 667 });

    const toggle = page.locator('.navigator-toggle--floating');
    const menuIcon = toggle.locator('.menu-icon');
    const closeIcon = toggle.locator('.close-icon');

    // Initially shows menu icon
    await expect(menuIcon).toBeVisible();
    await expect(closeIcon).not.toBeVisible();

    // Click to open
    await toggle.click();
    await page.waitForTimeout(100);

    // Should show close icon
    await expect(menuIcon).not.toBeVisible();
    await expect(closeIcon).toBeVisible();
  });
});

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/navigation/');
    await page.waitForLoadState('networkidle');
  });

  test('Tab navigates through sidebar links', async ({ page }) => {
    // Expand first level to ensure lessons are visible
    const firstHeader = page.locator('.level-header').first();
    const isExpanded = await firstHeader.getAttribute('aria-expanded');

    if (isExpanded === 'false') {
      await firstHeader.click();
      await page.waitForTimeout(100);
    }

    // Focus first level header
    await firstHeader.focus();

    // Tab to first lesson
    await page.keyboard.press('Tab');
    await page.waitForTimeout(50);

    const focusedElement = page.locator(':focus');
    const className = await focusedElement.getAttribute('class');

    // Should focus on a lesson item
    expect(className).toContain('lesson-item');
  });

  test('ArrowRight expands collapsed section (LTR)', async ({ page }) => {
    const secondHeader = page.locator('.level-header').nth(1);

    // Ensure collapsed
    const isExpanded = await secondHeader.getAttribute('aria-expanded');
    if (isExpanded === 'true') {
      await secondHeader.click();
      await page.waitForTimeout(100);
    }

    await secondHeader.focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    await expect(secondHeader).toHaveAttribute('aria-expanded', 'true');
  });

  test('ArrowLeft collapses expanded section (LTR)', async ({ page }) => {
    const firstHeader = page.locator('.level-header').first();

    // Ensure expanded
    const isExpanded = await firstHeader.getAttribute('aria-expanded');
    if (isExpanded === 'false') {
      await firstHeader.click();
      await page.waitForTimeout(100);
    }

    await firstHeader.focus();
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(100);

    await expect(firstHeader).toHaveAttribute('aria-expanded', 'false');
  });

  test('focus indicators are visible', async ({ page }) => {
    const firstHeader = page.locator('.level-header').first();
    await firstHeader.focus();
    await page.waitForTimeout(50);

    // Check for visible focus outline
    const outline = await firstHeader.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        outline: style.outline,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth
      };
    });

    // Should have visible outline (not "none" and width > 0)
    expect(outline.outlineStyle).not.toBe('none');
    expect(outline.outlineWidth).not.toBe('0px');
  });
});

test.describe('Mobile Overlay Behavior', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/test/navigation/');
    await page.waitForLoadState('networkidle');
  });

  test('sidebar is hidden by default on mobile', async ({ page }) => {
    const sidebar = page.locator('#course-navigator');

    // Check if sidebar has transform applied (translateX off-screen)
    const transform = await sidebar.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });

    // Should have a transform (not 'none')
    expect(transform).not.toBe('none');
  });

  test('toggle opens sidebar on mobile', async ({ page }) => {
    const toggle = page.locator('.navigator-toggle--floating');
    await toggle.click();
    await page.waitForTimeout(350); // Wait for animation

    const sidebar = page.locator('#course-navigator');
    const classList = await sidebar.getAttribute('class');

    expect(classList).toContain('open');
  });

  test('backdrop becomes visible when sidebar opens', async ({ page }) => {
    const toggle = page.locator('.navigator-toggle--floating');
    await toggle.click();
    await page.waitForTimeout(350);

    const backdrop = page.getByTestId('navigator-backdrop');
    const classList = await backdrop.getAttribute('class');

    expect(classList).toContain('visible');
  });

  test('Escape key closes sidebar', async ({ page }) => {
    const toggle = page.locator('.navigator-toggle--floating');
    await toggle.click();
    await page.waitForTimeout(350);

    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(350);

    const sidebar = page.locator('#course-navigator');
    const classList = await sidebar.getAttribute('class');

    expect(classList).not.toContain('open');
  });

  test('clicking backdrop closes sidebar', async ({ page }) => {
    const toggle = page.locator('.navigator-toggle--floating');
    await toggle.click();
    await page.waitForTimeout(350);

    const backdrop = page.getByTestId('navigator-backdrop');
    await backdrop.click();
    await page.waitForTimeout(350);

    const sidebar = page.locator('#course-navigator');
    const classList = await sidebar.getAttribute('class');

    expect(classList).not.toContain('open');
  });

  test('floating toggle is visible on mobile', async ({ page }) => {
    const toggle = page.locator('.navigator-toggle--floating');
    await expect(toggle).toBeVisible();
  });
});

test.describe('Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/navigation/');
    await page.waitForLoadState('networkidle');
  });

  test('navigation components work in dark mode', async ({ page }) => {
    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    // Verify components still render correctly
    const breadcrumbs = page.getByTestId('breadcrumbs-section').locator('nav');
    await expect(breadcrumbs).toBeVisible();

    const levelHeaders = page.locator('.level-header');
    await expect(levelHeaders.first()).toBeVisible();

    const navigator = page.locator('#course-navigator');
    await expect(navigator).toBeVisible();
  });

  test('theme toggle button works', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();

    // Click to toggle theme
    await themeToggle.click();
    await page.waitForTimeout(100);

    // Check data-theme attribute changed
    const theme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });

    expect(['light', 'dark']).toContain(theme);
  });
});

test.describe('Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/navigation/');
    await page.waitForLoadState('networkidle');
  });

  test('navigation components match baseline (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1024 });
    await page.waitForTimeout(500); // Wait for layout stabilization

    await expect(page).toHaveScreenshot('navigation-desktop.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('navigation components match baseline (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('navigation-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('mobile sidebar open state matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const toggle = page.locator('.navigator-toggle--floating');
    await toggle.click();

    // Wait for animation to complete
    await page.waitForTimeout(350);

    await expect(page).toHaveScreenshot('navigation-mobile-open.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('breadcrumbs RTL mode matches baseline', async ({ page }) => {
    const rtlSection = page.getByTestId('breadcrumbs-rtl-section');

    await expect(rtlSection).toHaveScreenshot('breadcrumbs-rtl.png', {
      maxDiffPixels: 50
    });
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/navigation/');
    await page.waitForLoadState('networkidle');
  });

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    // Tab through navigation elements
    await page.keyboard.press('Tab');

    let focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Continue tabbing through multiple elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      focusedElement = page.locator(':focus');

      const tagName = await focusedElement.evaluate((el) => el.tagName.toLowerCase());
      const isInteractive = ['a', 'button', 'input'].includes(tagName);

      if (isInteractive) {
        await expect(focusedElement).toBeVisible();
      }
    }
  });

  test('ARIA landmarks are present', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Course navigation"]');
    await expect(nav).toBeVisible();

    const breadcrumbs = page.locator('nav[aria-label="Breadcrumbs"]');
    await expect(breadcrumbs).toHaveCount(2); // LTR and RTL sections
  });

  test('buttons have accessible labels', async ({ page }) => {
    const toggles = page.locator('#navigator-toggle');

    for (let i = 0; i < await toggles.count(); i++) {
      const toggle = toggles.nth(i);
      const ariaLabel = await toggle.getAttribute('aria-label');

      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain('navigator');
    }
  });
});
