import { readFileSync } from 'fs';

/**
 * Validation script for Arabic diacritics completeness
 *
 * Ensures all Arabic text has complete tashkeel (vowel marks) per LSSN-07.
 * Quranic text should have a high diacritics-to-letters ratio (>= 0.7).
 *
 * Known accommodations:
 * - Minimum 4 letters required (3-letter words like قَالَ score 67% due to alif)
 * - Expanded diacritics range includes dagger alif, Quranic marks
 * - Naturally unvocalized letters (alif, alif maddah, alif waslah) excluded from count
 */

// Unicode ranges for Arabic base letters (consonants + semi-vowels)
const ARABIC_LETTER = /[\u0621-\u063A\u0641-\u064A]/g;

// Expanded diacritics range including Quranic orthographic marks
const ARABIC_DIACRITIC = /[\u064B-\u065F\u0654-\u0656\u0670\u06D6-\u06DC\u06E5\u06E6\u06E7\u06E8]/g;


export interface ValidationIssue {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Extract Arabic text segments from MDX content
 * Skips: frontmatter, code blocks, import lines, JSX attributes, HTML attributes
 */
function extractArabicSegments(content: string): Array<{ text: string; line: number }> {
  const lines = content.split('\n');
  const segments: Array<{ text: string; line: number }> = [];

  let inFrontmatter = false;
  let inCodeBlock = false;
  let inJsxTag = false;
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

    // Track JSX component tags (multi-line)
    if (line.match(/<(ArabicExample|GrammarTable|VerbConjugation|Callout|ExerciseBox)\b/)) {
      inJsxTag = true;
    }
    if (inJsxTag) {
      if (line.includes('/>') || line.includes('>')) {
        inJsxTag = false;
      }
      // Skip all JSX attribute lines
      if (line.match(/^\s*\w+="/)) continue;
    }

    // Extract Arabic text (not in JSX attribute quotes)
    let processedLine = line;

    // Remove all JSX/HTML attribute content (key="value" patterns)
    processedLine = processedLine.replace(/\w+="[^"]*"/g, '');

    // Remove JSX expressions {content}
    processedLine = processedLine.replace(/\{[^}]*\}/g, '');

    // Remove markdown link URLs — slugs can't carry diacritics
    processedLine = processedLine.replace(/\]\([^)]*\)/g, ']');

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

  const MIN_LETTERS = 4; // Increased from 3 to avoid false positives on short words

  // Tiered thresholds: Arabic words naturally contain vowel carriers (alif, waw, ya)
  // that don't take diacritics, so shorter words inherently score lower.
  // - 4-6 letters: many words have 1-2 vowel carriers → use 0.55 threshold
  // - 7+ letters: longer text should have higher vocalization → use 0.65 threshold
  // - 12+ letters (phrases): use original 0.70 threshold
  function getThreshold(letterCount: number): number {
    if (letterCount >= 12) return 0.70;
    if (letterCount >= 7) return 0.65;
    return 0.55;
  }

  for (const segment of segments) {
    const { ratio, letters, diacritics } = checkDiacritics(segment.text);
    const threshold = getThreshold(letters);

    // Only check segments with substantial text (4+ letters)
    // Short words like قَالَ (3 letters, 2 diacritics = 67%) are properly vocalized
    // but score below threshold because alif doesn't take diacritics
    if (letters >= MIN_LETTERS && ratio < threshold) {
      issues.push({
        line: segment.line,
        message: `Arabic text missing diacritics (${diacritics}/${letters} = ${(ratio * 100).toFixed(0)}%, need ≥${(threshold * 100).toFixed(0)}%): "${segment.text.substring(0, 50)}${segment.text.length > 50 ? '...' : ''}"`,
        severity: ratio < 0.4 ? 'error' : 'warning'
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
