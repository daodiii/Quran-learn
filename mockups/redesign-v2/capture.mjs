// v2 landing capture: screenshots + console error collection.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const PAGE_URL = 'file://' + path.join(DIR, 'landing.html');

const errors = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function newPage(ctxOpts) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(`[console] ${m.text().slice(0, 300)}`); });
  page.on('pageerror', e => errors.push(`[pageerror] ${String(e).slice(0, 300)}`));
  return { ctx, page };
}

/* ---------- desktop ---------- */
{
  const { ctx, page } = await newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));

  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/d-hero-forming.png` });
  await page.waitForTimeout(3400);
  await page.screenshot({ path: `${OUT}/d-hero-settled.png` });

  const marks = await page.evaluate(() => {
    const top = s => {
      const el = document.querySelector(s);
      return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 0;
    };
    return {
      constellation: top('.constellation'),
      path: top('#pathsec'),
      band: top('.band'),
      atlas: top('#atlas'),
      instrument: top('#instrument'),
      why: top('#why'),
      finale: top('.finale'),
      docH: document.documentElement.scrollHeight,
    };
  });

  const jump = async (y, ms = 1000) => {
    await page.evaluate(v => window.scrollTo(0, v), Math.max(0, y));
    await page.waitForTimeout(ms);
  };

  await jump(marks.constellation + 500);  await page.screenshot({ path: `${OUT}/d-scrolly-1.png` });
  await jump(marks.constellation + 1300); await page.screenshot({ path: `${OUT}/d-scrolly-2.png` });
  await jump(marks.constellation + 2150); await page.screenshot({ path: `${OUT}/d-scrolly-3.png` });
  await jump(marks.constellation + 2790); await page.screenshot({ path: `${OUT}/d-scrolly-4.png` });

  await jump(marks.path - 120, 1300);       await page.screenshot({ path: `${OUT}/d-levels-1.png` });
  await jump(marks.path + 900, 1300);       await page.screenshot({ path: `${OUT}/d-levels-2.png` });
  await jump(marks.band - 200, 1200);       await page.screenshot({ path: `${OUT}/d-band.png` });
  await jump(marks.atlas - 60, 1400);       await page.screenshot({ path: `${OUT}/d-atlas.png` });
  await jump(marks.instrument - 60, 1800);  await page.screenshot({ path: `${OUT}/d-instrument.png` });
  await jump(marks.why - 80, 1300);         await page.screenshot({ path: `${OUT}/d-why.png` });
  await jump(marks.finale - 40, 1400);      await page.screenshot({ path: `${OUT}/d-finale.png` });
  await jump(marks.docH, 1200);             await page.screenshot({ path: `${OUT}/d-footer.png` });

  // hover states: card tilt + basmala gloss
  await jump(marks.atlas + 200, 800);
  await page.hover('.card:nth-child(2)').catch(() => {});
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/d-card-hover.png` });

  await jump(0, 1500);
  await page.hover('.bw:nth-child(1)').catch(() => {});
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/d-gloss-hover.png` });

  // full page (reveals forced on)
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('on')));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/d-full.jpg`, fullPage: true, type: 'jpeg', quality: 62 });

  await ctx.close();
}

/* ---------- mobile ---------- */
{
  const { ctx, page } = await newPage({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.4, isMobile: true, hasTouch: true,
  });
  await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${OUT}/m-hero.png` });
  for (const f of [0.18, 0.34, 0.5, 0.66, 0.82, 0.97]) {
    await page.evaluate(fr => window.scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * fr)), f);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/m-${Math.round(f * 100)}.png` });
  }
  await ctx.close();
}

await browser.close();
console.log(errors.length ? `ERRORS (${errors.length}):\n` + errors.join('\n') : 'CONSOLE CLEAN');
console.log('done -> ' + OUT);
