/**
 * scripts/render-ebook-pdf.ts
 *
 * Renders ebook(s) (and listing preview images) to PDF/PNG
 * by serving the built static site locally and using Playwright.
 *
 * Uses the system Chrome installation via channel: 'chrome' to avoid
 * needing a separate Playwright Chromium download.
 *
 * Usage:
 *   npm run build                                  # produce dist/
 *   npx tsx scripts/render-ebook-pdf.ts            # render all ebooks
 *   npx tsx scripts/render-ebook-pdf.ts sampler   # render a single ebook by slug
 */

import { chromium, type Browser, type Page } from 'playwright';
import { createServer } from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const OUT_DIR = path.resolve(__dirname, '..', 'dist', 'ebooks');
const PORT = 4322;

interface EbookTarget {
  slug: string;          // route slug under /ebooks/
  pdfName: string;       // output filename in dist/ebooks/
  listingPrefix: string; // prefix for listing PNGs
}

const EBOOKS: EbookTarget[] = [
  {
    slug: 'sampler',
    pdfName: 'al-fatiha-sampler.pdf',
    listingPrefix: 'listing',
  },
  {
    slug: 'reference-companion',
    pdfName: 'reference-companion.pdf',
    listingPrefix: 'reference-companion-listing',
  },
];

// ---------- mini static file server ----------
async function startServer(): Promise<{ close: () => void }> {
  const types: Record<string, string> = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.woff2': 'font/woff2',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
  };
  const server = createServer(async (req, res) => {
    let url = req.url || '/';
    if (url.endsWith('/')) url += 'index.html';
    const filePath = path.join(DIST, decodeURIComponent(url));
    try {
      const data = await fs.readFile(filePath);
      res.setHeader('Content-Type', types[path.extname(filePath)] ?? 'application/octet-stream');
      res.end(data);
    } catch {
      res.statusCode = 404;
      res.end('Not found');
    }
  });
  await new Promise<void>((resolve) => server.listen(PORT, resolve));
  return { close: () => server.close() };
}

// ---------- render targets ----------
async function extractPageNumbers(page: Page, target: EbookTarget): Promise<Record<string, number>> {
  await page.emulateMedia({ media: 'print' });
  await page.goto(`http://localhost:${PORT}/ebooks/${target.slug}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  // 5.5" x 8.5" at 96dpi = 528 x 816 CSS pixels per page.
  return await page.evaluate(() => {
    const PAGE_HEIGHT_PX = 816;
    const map: Record<string, number> = {};
    const anchors = document.querySelectorAll('[data-toc-anchor]');
    anchors.forEach(el => {
      const anchor = el.getAttribute('data-toc-anchor');
      if (!anchor) return;
      const rect = (el as HTMLElement).getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const pageNumber = Math.floor(top / PAGE_HEIGHT_PX) + 1;
      map[anchor] = pageNumber;
    });
    return map;
  });
}

async function renderPdfWithToc(page: Page, target: EbookTarget) {
  let pageMap: Record<string, number> = {};
  try {
    pageMap = await extractPageNumbers(page, target);
    console.log(`Extracted ${Object.keys(pageMap).length} TOC anchors for ${target.slug}`);
  } catch (err) {
    console.warn(`Pass 1 (TOC extraction) failed for ${target.slug}; rendering without TOC page numbers.`, err);
  }

  await page.emulateMedia({ media: 'print' });
  await page.goto(`http://localhost:${PORT}/ebooks/${target.slug}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  if (Object.keys(pageMap).length > 0) {
    await page.evaluate((map) => {
      const slots = document.querySelectorAll('[data-toc-page-for]');
      slots.forEach(s => {
        const anchor = s.getAttribute('data-toc-page-for');
        if (!anchor) return;
        const num = map[anchor];
        if (num != null) s.textContent = String(num);
      });
    }, pageMap);
  }

  const out = path.join(OUT_DIR, target.pdfName);
  await page.pdf({
    path: out,
    width: '5.5in',
    height: '8.5in',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log(`PDF written: ${out}`);
}

async function renderPdf(page: Page, target: EbookTarget) {
  await page.emulateMedia({ media: 'print' });
  await page.goto(`http://localhost:${PORT}/ebooks/${target.slug}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(OUT_DIR, target.pdfName);
  await page.pdf({
    path: out,
    width: '5.5in',
    height: '8.5in',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log(`PDF written: ${out}`);
}

async function renderListingImages(page: Page, target: EbookTarget) {
  const sizes = [
    { suffix: 'cover',    out: `${target.listingPrefix}-cover.png`,    width: 1600, height: 2400 },
    { suffix: 'spread-1', out: `${target.listingPrefix}-spread-1.png`, width: 1200, height: 1500 },
    { suffix: 'spread-2', out: `${target.listingPrefix}-spread-2.png`, width: 1200, height: 1500 },
    { suffix: 'spread-3', out: `${target.listingPrefix}-spread-3.png`, width: 1200, height: 1500 },
  ];
  for (const s of sizes) {
    await page.setViewportSize({ width: s.width, height: s.height });
    await page.goto(
      `http://localhost:${PORT}/ebooks/${target.slug}-preview-${s.suffix}/`,
      { waitUntil: 'networkidle' }
    );
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(OUT_DIR, s.out);
    await page.screenshot({ path: out, fullPage: false, omitBackground: false });
    console.log(`Image written: ${out}`);
  }
}

// ---------- main ----------
async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const slugFilter = process.argv[2];

  const targets = slugFilter
    ? EBOOKS.filter(e => e.slug === slugFilter)
    : EBOOKS;

  if (targets.length === 0) {
    throw new Error(`No ebook target matches slug "${slugFilter}". Known: ${EBOOKS.map(e => e.slug).join(', ')}`);
  }

  const srv = await startServer();
  let browser: Browser | null = null;
  try {
    // Use system Chrome (channel: 'chrome') rather than downloading
    // a separate Playwright Chromium binary.
    browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage();
    for (const t of targets) {
      console.log(`\n=== Rendering: ${t.slug} ===`);
      if (t.slug === 'sampler') {
        await renderPdf(page, t);
      } else {
        await renderPdfWithToc(page, t);
      }
      await renderListingImages(page, t);
    }
  } finally {
    if (browser) await browser.close();
    srv.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
