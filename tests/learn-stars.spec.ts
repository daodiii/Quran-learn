import { test, expect } from '@playwright/test';

// Desktop-only feature: every star in the constellation is a clickable link to
// its lesson. Verified against the live canvas hit-test (the preview pane can't
// exercise this because it cold-starts at width 0 and latches mobile mode).
test.describe('learn — clickable constellation stars (desktop)', () => {
  test('desktop initialises the sky tour, not the flat/mobile fallback', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/learn/');
    await expect(page.locator('html.js')).toBeVisible();
    // width > 760 and no reduced-motion => the interactive path, never flat.
    await expect(page.locator('html')).not.toHaveClass(/flat/);
  });

  test('clicking a star navigates to that exact lesson', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/learn/');

    // Scroll so Level 1 is the exactly-centred constellation (u === 1.0).
    await page.evaluate(() => {
      const d = document.getElementById('driver')!;
      const total = d.offsetHeight - window.innerHeight;
      window.scrollTo(0, Math.round(total * (1.0 / 6)));
    });

    // Poll each frame (in-page, so no cross-call timing gap while the camera eases)
    // until a Level 1 star is genuinely clickable — inside the viewport and with the
    // canvas as the top-most element under it (not behind the fixed nav) — then fire
    // the real click handler at its live position: pick() → navigation.
    const id = await page.evaluate(async () => {
      const cv = document.getElementById('skycv')!;
      const W = window.innerWidth, H = window.innerHeight;
      for (let i = 0; i < 200; i++) {
        const stars = (window as any).__learnStars as Array<any> | undefined;
        const s = stars && stars.find(st => st.lv === 1 && st.id && st.sx != null
          && st.sx > 90 && st.sx < W - 90 && st.sy > 90 && st.sy < H - 90
          && document.elementFromPoint(st.sx, st.sy) === cv);
        if (s) {
          cv.dispatchEvent(new MouseEvent('click', { clientX: s.sx, clientY: s.sy, bubbles: true }));
          return s.id as string;
        }
        await new Promise(r => requestAnimationFrame(() => r(null)));
      }
      return null;
    });
    expect(id, 'a clickable Level 1 star must appear on the canvas').toContain('level-1/');
    await page.waitForURL(`**/learn/${id}/`);
    expect(page.url()).toContain(`/learn/${id}/`);
  });
});
