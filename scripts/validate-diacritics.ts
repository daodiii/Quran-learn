import { readFileSync } from 'fs';

/**
 * Validation script for Arabic diacritics completeness
 *
 * Ensures all Arabic text has complete tashkeel (vowel marks) per LSSN-07.
 * Quranic text should have a high diacritics-to-letters ratio (>= 0.7).
 */

// Unicode ranges
const ARABIC_LETTER = /[\u0621-\u063A\u0641-\u064A]/g;
const ARABIC_DIACRITIC = /[\u064B-\u065F]/g;

export interface ValidationIssue {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Extract Arabic text segments from MDX content
 * Skips: frontmatter, code blocks, import lines, JSX attributes
 */
function extractArabicSegments(content: string): Array<{ text: string; line: number }> {
  const lines = content.split('\n');
  const segments: Array<{ text: string; line: number }> = [];

  let inFrontmatter = false;
  let inCodeBlock = false;
  let frontmatterCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Track frontmatter (between --- delimiters)
    if (line.trim() === '---') {
      frontmatterCount++;
      if (frontmatterCount <= 2) {
        inFrontmatter = !inFrontmatter;
        continue;
      }
    }

    if (inFrontmatter) continue;

    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    // Skip import lines
    if (line.trim().startsWith('import ')) continue;

    // Extract Arabic text (not in JSX attribute quotes)
    // Simple approach: find Arabic text outside of quotes
    let processedLine = line;

    // Remove JSX attribute content (between quotes)
    processedLine = processedLine.replace(/(arabic|transliteration|translation|reference)="[^"]*"/g, '');

    // Find Arabic text
    const arabicMatches = processedLine.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+/g);

    if (arabicMatches) {
      for (const match of arabicMatches) {
        if (match.trim().length > 0) {
          segments.push({ text: match, line: lineNumber });
        }
      }
    }
  }

  return segments;
}

/**
 * Check if Arabic text has sufficient diacritics
 * Returns true if diacritics ratio >= threshold
 */
function checkDiacritics(text: string): { ratio: number; letters: number; diacritics: number } {
  const letters = (text.match(ARABIC_LETTER) || []).length;
  const diacritics = (text.match(ARABIC_DIACRITIC) || []).length;

  const ratio = letters > 0 ? diacritics / letters : 0;

  return { ratio, letters, diacritics };
}

/**
 * Validate Arabic diacritics in MDX content
 * @param content - MDX file content
 * @param filename - File path for error reporting
 * @returns Array of validation issues
 */
export function validateDiacritics(content: string, filename: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const segments = extractArabicSegments(content);

  const DIACRITIC_THRESHOLD = 0.7;

  for (const segment of segments) {
    const { ratio, letters, diacritics } = checkDiacritics(segment.text);

    // Only check segments with substantial text (3+ letters)
    if (letters >= 3 && ratio < DIACRITIC_THRESHOLD) {
      issues.push({
        line: segment.line,
        message: `Arabic text missing diacritics (${diacritics}/${letters} = ${(ratio * 100).toFixed(0)}%, need ≥70%): "${segment.text.substring(0, 50)}${segment.text.length > 50 ? '...' : ''}"`,
        severity: 'error'
      });
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
    console.error('Usage: npx tsx scripts/validate-diacritics.ts <file.mdx>');
    process.exit(1);
  }

  const filepath = args[0];

  try {
    const content = readFileSync(filepath, 'utf-8');
    const issues = validateDiacritics(content, filepath);

    if (issues.length === 0) {
      console.log(`✓ ${filepath}: All Arabic text has complete diacritics`);
      process.exit(0);
    } else {
      console.error(`✗ ${filepath}: Found ${issues.length} diacritics issue(s):\n`);
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
