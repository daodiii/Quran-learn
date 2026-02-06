import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Validation script for Quranic verse references
 *
 * Ensures verse references follow the format: [Surah Name Chapter:Verse]
 * Validates surah numbers (1-114), verse ranges, and ayah counts.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ValidationIssue {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface SurahMetadata {
  number: number;
  name: string;
  nameArabic: string;
  ayahs: number;
  revelation: string;
}

/**
 * Load surah metadata from JSON file
 */
export function loadSurahMetadata(): SurahMetadata[] {
  const metadataPath = join(__dirname, '..', 'data', 'quran', 'surah-metadata.json');

  try {
    const content = readFileSync(metadataPath, 'utf-8');
    const data = JSON.parse(content);
    return data.surahs as SurahMetadata[];
  } catch (error) {
    console.error(`Error loading surah metadata: ${error}`);
    return [];
  }
}

/**
 * Parse verse reference string
 * Format: [Surah Name Chapter:Verse] or [Surah Name Chapter:Verse-Verse]
 */
function parseVerseReference(reference: string): {
  surahName: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
} | null {
  // Pattern: [Surah Name Chapter:Verse] or [Surah Name Chapter:Verse-Verse]
  const match = reference.match(/\[(.+?)\s+(\d+):(\d+)(?:-(\d+))?\]/);

  if (!match) return null;

  const surahName = match[1].trim();
  const chapter = parseInt(match[2], 10);
  const verseStart = parseInt(match[3], 10);
  const verseEnd = match[4] ? parseInt(match[4], 10) : undefined;

  return { surahName, chapter, verseStart, verseEnd };
}

/**
 * Validate verse reference against surah metadata
 */
function validateReference(
  parsed: ReturnType<typeof parseVerseReference>,
  metadata: SurahMetadata[]
): string | null {
  if (!parsed) return 'Invalid verse reference format';

  const { surahName, chapter, verseStart, verseEnd } = parsed;

  // Check chapter number range
  if (chapter < 1 || chapter > 114) {
    return `Invalid surah number ${chapter} (must be 1-114)`;
  }

  // Find surah by chapter number
  const surah = metadata.find(s => s.number === chapter);

  if (!surah) {
    return `Surah ${chapter} not found in metadata`;
  }

  // Validate surah name (allow case variations)
  if (surah.name.toLowerCase() !== surahName.toLowerCase()) {
    return `Surah name mismatch: expected "${surah.name}", got "${surahName}"`;
  }

  // Validate verse start
  if (verseStart < 1 || verseStart > surah.ayahs) {
    return `Verse ${verseStart} out of range for ${surah.name} (1-${surah.ayahs})`;
  }

  // Validate verse end (if range)
  if (verseEnd !== undefined) {
    if (verseEnd < verseStart) {
      return `Invalid verse range: ${verseStart}-${verseEnd} (end before start)`;
    }
    if (verseEnd > surah.ayahs) {
      return `Verse ${verseEnd} out of range for ${surah.name} (1-${surah.ayahs})`;
    }
  }

  return null; // Valid
}

/**
 * Validate verse references in MDX content
 * @param content - MDX file content
 * @param filename - File path for error reporting
 * @returns Array of validation issues
 */
export function validateVerses(content: string, filename: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const metadata = loadSurahMetadata();

  if (metadata.length === 0) {
    return [{
      line: 0,
      message: 'Error: Could not load surah metadata',
      severity: 'error'
    }];
  }

  const lines = content.split('\n');

  // Pattern to find verse references: [Something Number:Number]
  const verseReferencePattern = /\[.+?\s+\d+:\d+(?:-\d+)?\]/g;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    const matches = line.match(verseReferencePattern);

    if (matches) {
      for (const match of matches) {
        const parsed = parseVerseReference(match);
        const error = validateReference(parsed, metadata);

        if (error) {
          issues.push({
            line: lineNumber,
            message: `Verse reference "${match}": ${error}`,
            severity: 'error'
          });
        }
      }
    }
  }

  return issues;
}

/**
 * CLI usage
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/validate-verses.ts <file.mdx>');
    process.exit(1);
  }

  const filepath = args[0];

  try {
    const content = readFileSync(filepath, 'utf-8');
    const issues = validateVerses(content, filepath);

    if (issues.length === 0) {
      console.log(`✓ ${filepath}: All verse references are valid`);
      process.exit(0);
    } else {
      console.error(`✗ ${filepath}: Found ${issues.length} verse reference issue(s):\n`);
      for (const issue of issues) {
        console.error(`  Line ${issue.line}: ${issue.message}`);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    process.exit(1);
  }
}
