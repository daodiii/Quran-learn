/**
 * scripts/render-ebook-pdf.ts
 *
 * Renders the sampler ebook (and listing preview images) to PDF/PNG
 * by serving the built static site locally and using Playwright.
 *
 * Uses the system Chrome installation via channel: 'chrome' to avoid
 * needing a separate Playwright Chromium download.
 *
 * Usage:
 *   npm run build            # produce dist/
 *   npx tsx scripts/render-ebook-pdf.ts
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
async function renderPdf(page: Page) {
  await page.emulateMedia({ media: 'print' });
  await page.goto(`http://localhost:${PORT}/ebooks/sampler/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(OUT_DIR, 'al-fatiha-sampler.pdf');
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

async function renderListingImages(page: Page) {
  const targets = [
    { route: '/ebooks/sampler-preview-cover/',    out: 'listing-cover.png',    width: 1600, height: 2400 },
    { route: '/ebooks/sampler-preview-spread-1/', out: 'listing-spread-1.png', width: 1200, height: 1500 },
    { route: '/ebooks/sampler-preview-spread-2/', out: 'listing-spread-2.png', width: 1200, height: 1500 },
    { route: '/ebooks/sampler-preview-spread-3/', out: 'listing-spread-3.png', width: 1200, height: 1500 },
  ];
  for (const t of targets) {
    await page.setViewportSize({ width: t.width, height: t.height });
    await page.goto(`http://localhost:${PORT}${t.route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(OUT_DIR, t.out);
    await page.screenshot({ path: out, fullPage: false, omitBackground: false });
    console.log(`Image written: ${out}`);
  }
}

// ---------- main ----------
async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const srv = await startServer();
  let browser: Browser | null = null;
  try {
    // Use system Chrome (channel: 'chrome') rather than downloading
    // a separate Playwright Chromium binary.
    browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage();
    await renderPdf(page);
    await renderListingImages(page);
  } finally {
    if (browser) await browser.close();
    srv.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
