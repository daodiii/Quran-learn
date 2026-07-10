import { chromium } from '@playwright/test';
import path from 'node:path';
const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, 'shots');
const PAGE = process.env.PAGE || ('file://' + path.join(DIR, 'landing-final.html'));
const issues = [];
const notes = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--allow-file-access-from-files'] });

/* ── 1+2: hero — particle/text alignment + instant content ── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error') issues.push('console: ' + m.text().slice(0, 180)); });
  p.on('pageerror', e => issues.push('pageerror: ' + String(e).slice(0, 180)));
  await p.goto(PAGE, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForSelector('#veil.gone', { timeout: 15000 });

  // instant-content check: 1.3s after veil lift, H1 + CTA should be visible while particles still forming
  await p.waitForTimeout(1300);
  const early = await p.evaluate(() => {
    const op = s => parseFloat(getComputedStyle(document.querySelector(s)).opacity);
    return {
      h1: op('.hero-h1 .hw'), cta: op('.cta-row'), stats: op('.hero-stats'),
      basmalaVeiled: document.querySelector('#basmala').classList.contains('veiled')
    };
  });
  if (early.h1 < 0.4 || early.cta < 0.15) issues.push(`hero content not early: h1=${early.h1} cta=${early.cta}`);
  if (!early.basmalaVeiled) notes.push('basmala already unveiled at 1.3s (formation skipped?)');
  await p.screenshot({ path: `${OUT}/p-hero-early.png` });

  // formed particles (t≈2.9s), before unveil at ≈3.07s
  await p.waitForTimeout(1570);
  const band = await p.evaluate(() => {
    const r = document.querySelector('#basmala').getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  });
  await p.screenshot({ path: `${OUT}/p-hero-formed.png` });
  // settled text (formation released, glyphs shown)
  await p.waitForTimeout(4200);
  await p.screenshot({ path: `${OUT}/p-hero-settled.png` });

  // compare bright-pixel row/col centroids inside the basmala band
  const diff = await p.evaluate(async b => {
    async function centroid(src) {
      const img = new Image();
      img.src = src;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const pad = 10;
      const x0 = Math.max(0, b.x - pad) | 0, y0 = Math.max(0, b.y - pad) | 0;
      const w = Math.min(c.width - x0, b.w + 2 * pad) | 0, h = Math.min(c.height - y0, b.h + 2 * pad) | 0;
      const d = g.getImageData(x0, y0, w, h).data;
      let sy = 0, sx = 0, n = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const lum = d[i] * 0.5 + d[i + 1] * 0.4 + d[i + 2] * 0.1;
        if (lum > 90) { sy += y; sx += x; n++; }
      }
      return n ? { y: y0 + sy / n, x: x0 + sx / n, n } : null;
    }
    const a = await centroid('shots/p-hero-formed.png');
    const t = await centroid('shots/p-hero-settled.png');
    return { a, t };
  }, band).catch(e => ({ err: String(e).slice(0, 160) }));
  if (diff.err) notes.push('centroid readback failed (' + diff.err + ') — eyeball the two shots');
  else if (!diff.a || !diff.t) issues.push('centroid: no ink found ' + JSON.stringify(diff));
  else {
    const dy = Math.abs(diff.a.y - diff.t.y), dx = Math.abs(diff.a.x - diff.t.x);
    notes.push(`align: particles(y=${diff.a.y.toFixed(1)},n=${diff.a.n}) text(y=${diff.t.y.toFixed(1)},n=${diff.t.n}) dy=${dy.toFixed(1)}px dx=${dx.toFixed(1)}px`);
    if (dy > 7) issues.push(`particle/text vertical offset still ${dy.toFixed(1)}px`);
  }
  await ctx.close();
}

/* ── 3: constellation stage fits + boxes fully visible while pinned ── */
for (const vh of [900, 760]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: vh }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('pageerror', e => issues.push(`pageerror@${vh}: ` + String(e).slice(0, 160)));
  await p.goto(PAGE, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => document.fonts.ready.then(() => undefined));
  await p.waitForTimeout(4500);
  // scroll into the pin, most of the way through the timeline
  await p.evaluate(() => {
    const sec = document.querySelector('.constellation');
    window.scrollTo(0, sec.offsetTop + 1450);
  });
  await p.waitForTimeout(1400);
  const fit = await p.evaluate(() => {
    const ros = [...document.querySelectorAll('.ro')].map(r => r.getBoundingClientRect());
    const verse = document.querySelector('.c-verse').getBoundingClientRect();
    const head = document.querySelector('.c-head').getBoundingClientRect();
    return {
      maxBottom: Math.max(...ros.map(r => r.bottom)),
      minTop: head.top, verseH: verse.height,
      lit: document.querySelectorAll('.cw.lit').length,
      roOn: [...document.querySelectorAll('.ro')].filter(r => parseFloat(getComputedStyle(r).opacity) > 0.85).length
    };
  });
  notes.push(`cstage@${vh}: headTop=${fit.minTop.toFixed(0)} boxBottom=${fit.maxBottom.toFixed(0)} lit=${fit.lit} roOn=${fit.roOn}`);
  if (fit.maxBottom > vh - 8) issues.push(`constellation boxes cut at ${vh}h: bottom=${fit.maxBottom.toFixed(0)}`);
  if (fit.minTop < 60) issues.push(`constellation head under nav at ${vh}h: top=${fit.minTop.toFixed(0)}`);
  if (vh === 900) await p.screenshot({ path: `${OUT}/p-cstage-pinned.png` });

  // release point: how much scroll until section ends after last box lights
  const rel = await p.evaluate(() => {
    const sec = document.querySelector('.constellation');
    return { secTop: sec.offsetTop, secH: sec.offsetHeight, inner: innerHeight };
  });
  notes.push(`cstage@${vh}: section total height ${rel.secH}px (pin ≈ ${rel.secH - rel.inner}px of scroll)`);
  await ctx.close();
}

/* ── 4: instrument fits one 900px screen; 5: dua ink gap; sweep + overflow ── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error') issues.push('console: ' + m.text().slice(0, 180)); });
  p.on('pageerror', e => issues.push('pageerror: ' + String(e).slice(0, 180)));
  await p.goto(PAGE, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => document.fonts.ready.then(() => undefined));
  await p.waitForTimeout(4500);

  const inst = await p.evaluate(() => {
    const inner = document.querySelector('.instrument .act-inner');
    const r = inner.getBoundingClientRect();
    return { h: r.height, top: r.top + scrollY };
  });
  notes.push(`instrument content height=${inst.h.toFixed(0)}px`);
  if (inst.h > 810) issues.push(`instrument too tall for one screen: ${inst.h.toFixed(0)}px`);
  await p.evaluate(t => window.scrollTo(0, t - 70), inst.top);
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `${OUT}/p-instrument.png` });

  const dua = await p.evaluate(() => {
    const el = document.querySelector('.dua'), tr = document.querySelector('.dua-tr');
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    const cs = getComputedStyle(el);
    const c = document.createElement('canvas').getContext('2d');
    c.font = cs.fontSize + ' "Amiri Quran"';
    const m = c.measureText(el.textContent);
    const r = el.getBoundingClientRect(), rt = tr.getBoundingClientRect();
    // baseline of the single line: box center + (asc-desc)/2 within the line box
    const lineH = parseFloat(cs.lineHeight);
    const asc = m.fontBoundingBoxAscent ?? parseFloat(cs.fontSize) * 0.8;
    const desc = m.fontBoundingBoxDescent ?? parseFloat(cs.fontSize) * 0.2;
    const baseline = r.top + (r.height - (asc + desc)) / 2 + asc;
    const inkBottom = baseline + (m.actualBoundingBoxDescent ?? desc);
    return { inkBottom, trTop: rt.top, gap: rt.top - inkBottom };
  });
  notes.push(`dua ink gap to translation = ${dua.gap.toFixed(1)}px`);
  if (dua.gap < 8) issues.push(`dua still crowding translation: gap=${dua.gap.toFixed(1)}px`);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${OUT}/p-dua.png` });

  for (const f of [0.16, 0.3, 0.44, 0.58, 0.72, 0.86, 0.96]) {
    await p.evaluate(fr => window.scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * fr)), f);
    await p.waitForTimeout(1000);
    await p.screenshot({ path: `${OUT}/p-sweep-${Math.round(f * 100)}.png` });
  }
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (ov > 2) issues.push(`horizontal overflow ${ov}px`);
  await ctx.close();
}

/* mobile smoke */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => issues.push('mobile pageerror: ' + String(e).slice(0, 160)));
  await p.goto(PAGE, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => document.fonts.ready.then(() => undefined));
  await p.waitForTimeout(2500);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (ov > 2) issues.push(`mobile overflow ${ov}px`);
  await p.screenshot({ path: `${OUT}/p-mobile-hero.png` });
  await ctx.close();
}

await browser.close();
console.log('NOTES:\n' + notes.join('\n'));
console.log(issues.length ? '\nISSUES:\n' + issues.join('\n') : '\nCLEAN');
