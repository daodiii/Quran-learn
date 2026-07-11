// Screenshot harness for the ported Anatomy Lab lesson pages (Phase A).
// Adapted from ../shoot.mjs: real preview server instead of file:// URLs.
// System Chrome only (channel:'chrome') — never download Chromium on this machine.
// Usage: node shoot-port.mjs          (expects `npm run preview` on :4321,
//        or starts one itself if the port is free)
import { chromium } from '/Users/daodilyas/quran-learn/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = '/Users/daodilyas/quran-learn';
const OUT = resolve(ROOT, '.planning/redesign-v4-lessons/port/shots');
mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:4321';

const PAGES = [
  { slug: 'l1-06-definite-article', path: '/learn/level-1/06-definite-article/' },
  { slug: 'l3-03-past-tense', path: '/learn/level-3/03-past-tense/' },
  { slug: 'l5-17-capstone-cold-read', path: '/learn/level-5/17-capstone-cold-read/' }, // no-words edge case
];

// ---------- ensure preview server ----------
async function serverUp() {
  try {
    const res = await fetch(BASE + '/learn/', { redirect: 'manual' });
    return res.status < 500;
  } catch {
    return false;
  }
}

let previewProc = null;
if (!(await serverUp())) {
  console.log('starting npm run preview…');
  previewProc = spawn('npm', ['run', 'preview'], { cwd: ROOT, stdio: 'ignore', detached: true });
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await serverUp()) break;
    if (i === 59) { console.error('preview server never came up'); process.exit(1); }
  }
}

const browser = await chromium.launch({ channel: 'chrome' });
const report = [];

for (const { slug, path } of PAGES) {
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1.25 });
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.waitForTimeout(2500);

  await page.screenshot({ path: `${OUT}/${slug}-1-top.png` });

  const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (const [frac, name] of [[0.22, '2-a'], [0.45, '3-b'], [0.68, '4-c'], [1.0, '5-end']]) {
    await page.evaluate((h) => scrollTo(0, h), H * frac);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/${slug}-${name}.png` });
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(600);

  // ---------- interaction probes ----------
  try {
    // 1. rail station click → scrolls to section
    const stations = page.locator('.rail .station');
    const stationCount = await stations.count();
    if (stationCount > 2) {
      await stations.nth(2).click();
      await page.waitForTimeout(1400);
      const scrolled = await page.evaluate(() => scrollY);
      if (scrolled < 50) errors.push('probe: rail station click did not scroll');
      await page.screenshot({ path: `${OUT}/${slug}-6-rail-jump.png` });
    }

    // 2. console word click → readout populates (only on pages with words)
    const word = page.locator('.console .c-ar[data-words] .w').first();
    if (await word.count()) {
      await word.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await word.click();
      await page.waitForTimeout(500);
      const ro = await page
        .locator('.console .readout [data-ro="en"]')
        .first()
        .textContent();
      if (!ro || ro.trim() === '—') errors.push('probe: readout did not populate after word click');
      const touched = await page.locator('[data-rail-touch]').textContent().catch(() => null);
      if (touched !== null && touched.trim() === '0') errors.push('probe: words-touched counter did not increment');
      await page.screenshot({ path: `${OUT}/${slug}-7-readout.png` });
    }

    // 3. DIAG accordion toggle
    const diag = page.locator('.exercise-box .toggle-answer').first();
    if (await diag.count()) {
      await diag.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await diag.click();
      await page.waitForTimeout(600);
      const expanded = await diag.getAttribute('aria-expanded');
      if (expanded !== 'true') errors.push('probe: DIAG accordion did not expand (aria-expanded=' + expanded + ')');
      const answerVisible = await page.locator('.exercise-box .exercise-answer').first().isVisible();
      if (!answerVisible) errors.push('probe: DIAG answer not visible after expand');
      await page.screenshot({ path: `${OUT}/${slug}-8-diag.png` });
    }

    // 4. completion button
    const done = page.locator('#complete-btn');
    if (await done.count()) {
      await done.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await done.click();
      await page.waitForTimeout(800);
      const statusVisible = await page.locator('#complete-status').isVisible();
      if (!statusVisible) errors.push('probe: completion status not shown after click');
      await page.screenshot({ path: `${OUT}/${slug}-9-complete.png` });
    }
  } catch (e) {
    errors.push('probe: ' + e.message.split('\n')[0]);
  }

  await page.close();
  report.push({ slug, errors });
}

await browser.close();
if (previewProc) process.kill(-previewProc.pid);

let fail = false;
for (const r of report) {
  console.log(`${r.errors.length === 0 ? 'OK ' : 'ERR'} ${r.slug}${r.errors.length ? '\n    ' + r.errors.join('\n    ') : ''}`);
  if (r.errors.length) fail = true;
}
process.exit(fail ? 1 : 0);
