import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Build-time Quran verse lookup helper
 *
 * This is a BUILD-TIME CLI tool for content authors to look up verse references
 * during lesson authoring. NOT a runtime API (per REQUIREMENTS.md).
 *
 * Usage:
 *   npx tsx scripts/fetch-quran-text.ts 2:255
 *   npx tsx scripts/fetch-quran-text.ts "Al-Baqarah 2:255"
 *   npx tsx scripts/fetch-quran-text.ts 1:1 --format mdx
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SurahMetadata {
  number: number;
  name: string;
  nameArabic: string;
  ayahs: number;
  revelation: string;
}

interface VerseInfo {
  surah: SurahMetadata;
  verse: number;
  reference: string;
}

/**
 * Load surah metadata
 */
function loadSurahMetadata(): SurahMetadata[] {
  const metadataPath = join(__dirname, '..', 'data', 'quran', 'surah-metadata.json');

  try {
    const content = readFileSync(metadataPath, 'utf-8');
    const data = JSON.parse(content);
    return data.surahs as SurahMetadata[];
  } catch (error) {
    console.error(`Error loading surah metadata: ${error}`);
    process.exit(1);
  }
}

/**
 * Parse verse reference
 * Accepts formats: "2:255" or "Al-Baqarah 2:255"
 */
function parseReference(input: string): { chapter: number; verse: number; surahName?: string } | null {
  // Format 1: "2:255" (chapter:verse)
  const simpleMatch = input.match(/^(\d+):(\d+)$/);
  if (simpleMatch) {
    return {
      chapter: parseInt(simpleMatch[1], 10),
      verse: parseInt(simpleMatch[2], 10)
    };
  }

  // Format 2: "Al-Baqarah 2:255" (surah name chapter:verse)
  const fullMatch = input.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (fullMatch) {
    return {
      surahName: fullMatch[1].trim(),
      chapter: parseInt(fullMatch[2], 10),
      verse: parseInt(fullMatch[3], 10)
    };
  }

  return null;
}

/**
 * Get verse information
 * @param reference - Verse reference in format "2:255" or "Al-Baqarah 2:255"
 * @returns Verse information with surah metadata
 */
export function getVerseInfo(reference: string): VerseInfo | null {
  const surahs = loadSurahMetadata();
  const parsed = parseReference(reference);

  if (!parsed) {
    console.error(`Invalid reference format: "${reference}"`);
    console.error('Expected: "2:255" or "Al-Baqarah 2:255"');
    return null;
  }

  const { chapter, verse, surahName } = parsed;

  // Validate chapter number
  if (chapter < 1 || chapter > 114) {
    console.error(`Invalid surah number: ${chapter} (must be 1-114)`);
    return null;
  }

  const surah = surahs.find(s => s.number === chapter);

  if (!surah) {
    console.error(`Surah ${chapter} not found`);
    return null;
  }

  // Validate surah name if provided
  if (surahName && surah.name.toLowerCase() !== surahName.toLowerCase()) {
    console.error(`Surah name mismatch: expected "${surah.name}", got "${surahName}"`);
    return null;
  }

  // Validate verse number
  if (verse < 1 || verse > surah.ayahs) {
    console.error(`Invalid verse number: ${verse} (${surah.name} has ${surah.ayahs} verses)`);
    return null;
  }

  return {
    surah,
    verse,
    reference: `${surah.name} ${chapter}:${verse}`
  };
}

/**
 * Format verse info as plain text
 */
function formatPlainText(info: VerseInfo): string {
  return `
📖 Verse Reference: ${info.reference}

Surah: ${info.surah.name} (${info.surah.nameArabic})
Chapter: ${info.surah.number}
Verse: ${info.verse}
Total verses in surah: ${info.surah.ayahs}
Revelation: ${info.surah.revelation.charAt(0).toUpperCase() + info.surah.revelation.slice(1)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT: Verse text must be sourced from an authoritative
Quran text (e.g., Tanzil.net simple format) and pasted with
full tashkeel (diacritical marks).

Recommended source:
- https://tanzil.net/docs/download (Simple Enhanced text)

Copy the fully-vocalized Arabic text and paste it into your
lesson's ArabicExample component.
`;
}

/**
 * Format verse info as MDX component template
 */
function formatMdx(info: VerseInfo): string {
  return `
<ArabicExample
  arabic="[PASTE FULLY-VOCALIZED VERSE TEXT HERE]"
  transliteration="[PASTE TRANSLITERATION HERE - see STYLE_GUIDE.md]"
  translation="[PASTE ENGLISH TRANSLATION HERE]"
  reference="${info.reference}"
/>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reference: ${info.reference}
Surah: ${info.surah.name} (${info.surah.nameArabic})

Next steps:
1. Get verse text from Tanzil.net (https://tanzil.net/docs/download)
2. Ensure text has complete tashkeel (every letter marked)
3. Add transliteration following STYLE_GUIDE.md rules
4. Add translation (Dr. Mustafa Khattab recommended)
5. Replace placeholders above

Transliteration level (per STYLE_GUIDE.md):
- Level 1-2: Full transliteration required
- Level 3: Partial (new/difficult words only)
- Level 4-5: Minimal (omit for Quranic verses)
`;
}

/**
 * CLI interface
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Quran Verse Lookup Helper (Build-time tool)

Usage:
  npx tsx scripts/fetch-quran-text.ts <reference> [--format mdx|text]

Examples:
  npx tsx scripts/fetch-quran-text.ts 1:1
  npx tsx scripts/fetch-quran-text.ts "Al-Fatiha 1:1"
  npx tsx scripts/fetch-quran-text.ts 2:255 --format mdx

Formats:
  text  - Show verse metadata (default)
  mdx   - Output ArabicExample component template for copy-paste

Purpose:
  This is a BUILD-TIME helper for lesson authors to look up verse
  references and generate MDX component templates. It does NOT fetch
  verse text at runtime (per REQUIREMENTS.md).
    `);
    process.exit(0);
  }

  const reference = args[0];
  const formatFlag = args.find(arg => arg === '--format');
  const format = formatFlag ? args[args.indexOf(formatFlag) + 1] : 'text';

  const info = getVerseInfo(reference);

  if (!info) {
    process.exit(1);
  }

  if (format === 'mdx') {
    console.log(formatMdx(info));
  } else {
    console.log(formatPlainText(info));
  }
}

// Run CLI if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
