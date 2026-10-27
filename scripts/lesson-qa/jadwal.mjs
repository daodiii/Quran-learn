// Print the i'rab of verses from the i'rab books on tafsir.app (Al-Baheth Al-Qurani), read headless.
// The site is rendered by JavaScript, so plain fetching (WebFetch, curl) only returns its menu.
//
//   node scripts/lesson-qa/jadwal.mjs 3:68 2:10            al-Jadwal (the source for every parse)
//   node scripts/lesson-qa/jadwal.mjs --book aldur-almasoon 2:10   al-Durr al-Masun (for disputed points)
//
// Other books: iraab-aldarweesh, iraab-daas, iraab-alnahas. al-Jadwal sometimes says a clause is "like" one in an
// earlier verse (مثل ... في الآية السابقة): read that verse too. Its online copy has gaps (2:286 jumps mid-sentence).
// The text is copyrighted: use it to check a parse, cite the book, do not copy its wording into a lesson.
import { chromium } from 'playwright';
import path from 'node:path';

const args = process.argv.slice(2);
let book = 'aljadwal';
const bi = args.indexOf('--book');
if (bi >= 0) book = args.splice(bi, 2)[1];
if (!args.length) throw new Error('usage: node scripts/lesson-qa/jadwal.mjs [--book slug] <surah:verse> ...');
const exe = path.join(process.env.LOCALAPPDATA ?? '', 'ms-playwright', 'chromium_headless_shell-1243', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
const browser = await chromium.launch({ headless: true, executablePath: exe });
const page = await browser.newPage();
for (const ref of args) {
  const [s, v] = ref.split(':');
  await page.goto(`https://tafsir.app/${book}/${s}/${v}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const text = await page.evaluate(() => {
    // The book's text is the smallest block that holds the verse heading and the commentary.
    const cand = [...document.querySelectorAll('div,p')].filter((e) => /﴿/.test(e.innerText || '') && e.children.length < 40);
    cand.sort((a, b) => a.innerText.length - b.innerText.length);
    const t = cand.find((e) => e.innerText.length > 200)?.innerText ?? '';
    const end = t.indexOf('أغلق');
    return end > 0 ? t.slice(0, end) : t;
  });
  console.log(`===== ${book} ${ref} =====\n${text.trim() || '(nothing found)'}\n`);
}
await browser.close();
