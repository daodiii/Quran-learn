/** Run with npx tsx scripts/build-brand-assets.ts after changing the master mark. */
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { HARAKAT_COLOR, HARAKAT_PATHS, HARAKAT_VIEWBOX } from '../src/lib/brand';
const paths = HARAKAT_PATHS.map((d) => `<path d="${d}"/>`).join('');
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${HARAKAT_VIEWBOX}" fill="${HARAKAT_COLOR}" role="img" aria-label="Quranic Grammar Harakat mark">${paths}</svg>\n`;
mkdirSync('public/brand', { recursive: true });
writeFileSync('public/brand/harakat.svg', mark);
// A light canvas keeps the coral visible in both light and dark browser tab bars.
writeFileSync('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#fbfcfd"/><g transform="translate(5.55 4.7) scale(.094)" fill="${HARAKAT_COLOR}">${paths}</g></svg>\n`);
// All artwork stays inside the central 80% safe zone for maskable app icons.
const app = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="#fbfcfd"/><g transform="translate(120 112) scale(.85)" fill="${HARAKAT_COLOR}">${paths}</g></svg>`;
mkdirSync('public/icons', { recursive: true });
for (const size of [192, 512]) await sharp(Buffer.from(app)).resize(size, size).png().toFile(`public/icons/harakat-${size}.png`);
console.log('Generated Harakat SVG, favicon and 192/512 px app icons.');
