// Phase C full-sweep screenshot harness for the ported Anatomy Lab lesson pages.
// Broader page sample than shoot-port.mjs's 4 Phase A/B pilots: 2+ lessons per level
// (10 total), plus the 4 level-4 weak-verb lessons whose VerbConjugation tables were
// just fixed, plus dense GrammarTable lessons.
// System Chrome only (channel:'chrome') — never download Chromium on this machine.
// Usage: node shoot-sweep.mjs   (expects `npm run preview` on :4321, or starts one itself)
import { chromium } from '/Users/daodilyas/quran-learn/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = '/Users/daodilyas/quran-learn';
const OUT = resolve(ROOT, '.planning/redesign-v4-lessons/port/shots-sweep');
mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:4321';

const PAGES = [
  // level 1
  { slug: 'l1-06-definite-article', path: '/learn/level-1/06-definite-article/' }, // engines (MorphTransformer/SpecimenChips)
  { slug: 'l1-08-singular-dual-plural', path: '/learn/level-1/08-singular-dual-plural/' }, // dense GrammarTable
  // level 2
  { slug: 'l2-06-genitive-case', path: '/learn/level-2/06-genitive-case/' }, // dense GrammarTable
  { slug: 'l2-11-kaana-sisters', path: '/learn/level-2/11-kaana-sisters/' },
  // level 3
  { slug: 'l3-03-past-tense', path: '/learn/level-3/03-past-tense/' }, // ConjugationEngine
  { slug: 'l3-14-verb-form-iv', path: '/learn/level-3/14-verb-form-iv/' }, // dense GrammarTable + remaining VerbConjugation usage
  // level 4 — all 4 weak-verb lessons just fixed
  { slug: 'l4-12-hollow-verbs', path: '/learn/level-4/12-hollow-verbs/' },
  { slug: 'l4-13-defective-verbs', path: '/learn/level-4/13-defective-verbs/' },
  { slug: 'l4-14-assimilated-verbs', path: '/learn/level-4/14-assimilated-verbs/' },
  { slug: 'l4-15-hamzated-verbs', path: '/learn/level-4/15-hamzated-verbs/' },
  // level 5
  { slug: 'l5-17-capstone-cold-read', path: '/learn/level-5/17-capstone-cold-read/' }, // no-words edge case
  { slug: 'l5-14-word-order-emphasis', path: '/learn/level-5/14-word-order-emphasis/' }, // dense GrammarTable
];

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
  await page.waitForTimeout(2000);

  await page.screenshot({ path: `${OUT}/${slug}-1-top.png` });

  const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (const [frac, name] of [[0.25, '2-a'], [0.5, '3-b'], [0.75, '4-c'], [1.0, '5-end']]) {
    await page.evaluate((h) => scrollTo(0, h), H * frac);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${slug}-${name}.png` });
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);

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
