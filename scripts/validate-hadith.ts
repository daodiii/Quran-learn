import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

/**
 * Validation for src/content/hadith (al-Nawawi's Forty Hadith, 42 with Ibn Rajab's two).
 *
 * Per file: frontmatter number matches the filename prefix, hadith 41 and 42 (and only
 * those) are flagged ibnRajabAddition, the Arabic carries vowel marks, and the word
 * table has numbered rows of exactly five non-empty cells.
 * Per set: numbers are unique and run from 1 with no gaps; --complete demands exactly 42.
 *
 * Usage: npx tsx scripts/validate-hadith.ts [--complete]
 */

export interface HadithIssue {
  file: string;
  message: string;
}

const ARABIC_LETTER = /[ء-غف-ي]/g;
const ARABIC_DIACRITIC = /[ً-ٰٟ]/g;
const MIN_DIACRITIC_RATIO = 0.5;
const TOTAL_HADITH = 42;
const FIRST_IBN_RAJAB = 41;
const WORD_COLUMNS = 5;

export function diacriticRatio(text: string): number {
  const letters = text.match(ARABIC_LETTER)?.length ?? 0;
  if (letters === 0) return 1;
  return (text.match(ARABIC_DIACRITIC)?.length ?? 0) / letters;
}

function frontmatterField(content: string, key: string): string | null {
  const block = content.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const m = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^"|"$/g, '') : null;
}

export function validateHadithFile(rawContent: string, filename: string): HadithIssue[] {
  // Windows tools can write CRLF; the frontmatter and table parsing below expect LF.
  const content = rawContent.replace(/\r\n/g, '\n');
  const issues: HadithIssue[] = [];
  const add = (message: string) => issues.push({ file: filename, message });

  const number = Number(frontmatterField(content, 'number'));
  const prefix = Number(filename.match(/^(\d+)-/)?.[1]);
  if (!Number.isInteger(number) || number !== prefix) {
    add(`frontmatter number (${number}) does not match the filename prefix (${prefix})`);
  }

  const isIbnRajab = frontmatterField(content, 'ibnRajabAddition') === 'true';
  if (number >= FIRST_IBN_RAJAB && !isIbnRajab) add(`hadith ${number} must set ibnRajabAddition: true (Ibn Rajab addition)`);
  if (number < FIRST_IBN_RAJAB && isIbnRajab) add(`hadith ${number} must not set ibnRajabAddition (not an Ibn Rajab addition)`);

  // A long hadith may be split into sections, each with its own Arabic block and table.
  const arabicBlocks = [...content.matchAll(/arabic="([^"]*)"/g)].map((m) => m[1]);
  if (arabicBlocks.length === 0) add('no arabic="..." found in the ArabicExample');
  arabicBlocks.forEach((arabic, i) => {
    if (diacriticRatio(arabic) < MIN_DIACRITIC_RATIO) add(`Arabic block ${i + 1} is missing vowel marks (tashkeel)`);
  });

  const tables = [...content.matchAll(/<GrammarTable>([\s\S]*?)<\/GrammarTable>/g)].map((m) => m[1]);
  if (tables.length === 0) {
    add('no word table (<GrammarTable>) found');
    return issues;
  }

  tables.forEach((table, t) => {
    const where = tables.length > 1 ? `table ${t + 1}, ` : '';
    const rows = table.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('|')).slice(2); // skip header + separator
    if (rows.length === 0) add(`${where}word table has no data rows`);
    rows.forEach((row, i) => {
      const cells = row.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      if (cells.length !== WORD_COLUMNS) {
        add(`${where}word row ${i + 1} has ${cells.length} cells, expected ${WORD_COLUMNS}`);
        return;
      }
      if (cells.some((c) => c === '')) add(`${where}word row ${i + 1} has an empty cell`);
      if (Number(cells[0]) !== i + 1) add(`${where}word row number ${cells[0]} should be ${i + 1}`);
    });
  });

  return issues;
}

export function validateHadithSet(numbers: number[], complete: boolean): HadithIssue[] {
  const issues: HadithIssue[] = [];
  const add = (message: string) => issues.push({ file: '(set)', message });

  const seen = new Set<number>();
  for (const n of numbers) {
    if (seen.has(n)) add(`duplicate hadith number ${n}`);
    seen.add(n);
  }
  const max = Math.max(0, ...numbers);
  for (let n = 1; n <= max; n++) if (!seen.has(n)) add(`missing hadith number ${n}`);
  if (complete && seen.size !== TOTAL_HADITH) add(`expected ${TOTAL_HADITH} hadith, found ${seen.size}`);
  return issues;
}

function main() {
  const dir = 'src/content/hadith';
  const complete = process.argv.includes('--complete');
  const files = readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).sort();

  const issues: HadithIssue[] = [];
  const numbers: number[] = [];
  for (const f of files) {
    const content = readFileSync(join(dir, f), 'utf-8');
    numbers.push(Number(frontmatterField(content, 'number')));
    issues.push(...validateHadithFile(content, f));
  }
  issues.push(...validateHadithSet(numbers, complete));

  for (const i of issues) console.error(`${i.file}: ${i.message}`);
  console.log(`${files.length} hadith file(s) checked, ${issues.length} issue(s)`);
  process.exit(issues.length > 0 ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
