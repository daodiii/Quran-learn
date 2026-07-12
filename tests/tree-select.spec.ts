import { test, expect } from '@playwright/test';

// The landing "tree of surahs": clicking a light must SELECT it into the plaque
// (a preview), not navigate. Only the plaque's Open link opens the surah. The
// preview pane can't exercise this (it runs the tab as hidden, so the canvas
// never draws) — a real headless browser reports visible and renders the tree.
test.describe('landing tree — light selects, Open navigates', () => {
  test('clicking a light selects it (no navigation); Open then opens it', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    // Bring the tree into view and let it grow so each light gets a screen position.
    await page.locator('#treestage').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const ls = (window as any).__treeLights as Array<any> | undefined;
      return !!ls && ls.some(l => !l.root && l.sx > 0 && l.sy > 0);
    }, { timeout: 8000 });

    // Pick a real surah light (not the Al-Fatiha root) that has a screen position.
    const light = await page.evaluate(() => {
      const ls = (window as any).__treeLights as Array<any>;
      const l = ls.find(x => !x.root && x.num > 1 && x.sx > 0 && x.sy > 0);
      const r = document.getElementById('treestage')!.getBoundingClientRect();
      return { num: l.num, name: l.name, x: r.left + l.sx, y: r.top + l.sy };
    });

    const urlBefore = page.url();
    await page.mouse.click(light.x, light.y);

    // 1) Clicking the light must NOT navigate…
    await page.waitForTimeout(400);
    expect(page.url(), 'clicking a light must not navigate').toBe(urlBefore);
    // …and it must have selected that surah into the plaque.
    await expect(page.locator('#plqEn')).toHaveText(light.name);
    await expect(page.locator('#plaque')).toHaveAttribute('href', new RegExp(`/surahs/0*${light.num}-`));

    // 2) Only the plaque's Open link navigates.
    await page.locator('#plaque').click();
    await page.waitForURL('**/surahs/**');
    expect(page.url()).toMatch(new RegExp(`/surahs/0*${light.num}-`));
  });
});
