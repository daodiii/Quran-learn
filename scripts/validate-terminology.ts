import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Validation script for canonical bilingual terminology enforcement
 *
 * Ensures consistent use of Arabic grammar terms per TERMINOLOGY.md (PDGY-03).
 * Checks that first-mention format is used: "English (transliteration / عَرَبِي)"
 *
 * Bug fixes applied:
 * - Special regex characters in term.english are now escaped
 * - Single/two-character Arabic terms (hamza forms) are filtered out
 * - JSX component content and markdown headings are skipped
 * - Improved context awareness to reduce false positives
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ValidationIssue {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface CanonicalTerm {
  english: string;
  arabic: string;
  transliteration: string;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Count base Arabic letters (excluding diacritics) in a string
 */
function countBaseArabicLetters(str: string): number {
  const baseLetters = str.replace(/[\u064B-\u065F\u0670\u0654-\u0656]/g, '');
  return (baseLetters.match(/[\u0621-\u064A]/g) || []).length;
}

/**
 * Parse TERMINOLOGY.md to extract canonical terms
 */
export function loadTerminology(): CanonicalTerm[] {
  const terminologyPath = join(__dirname, '..', 'docs', 'TERMINOLOGY.md');

  try {
    const content = readFileSync(terminologyPath, 'utf-8');
    const terms: CanonicalTerm[] = [];

    const lines = content.split('\n');

    for (const line of lines) {
      // Detect table rows (contain | separators)
      if (line.includes('|')) {
        const cells = line.split('|').map(cell => cell.trim());

        // Skip header and separator rows
        if (cells.length >= 4 && cells[1] !== 'English' && !cells[1].includes('---')) {
          const english = cells[1];
          const arabic = cells[2];
          const transliteration = cells[3];

          if (english && arabic && transliteration) {
            // Filter out terms with fewer than 3 base Arabic letters
            // Single/two-char terms like أَ, إِ, أَل match everywhere and cause false positives
            if (countBaseArabicLetters(arabic) >= 3) {
              terms.push({ english, arabic, transliteration });
            }
          }
        }
      }
    }

    return terms;
  } catch (error) {
    console.error(`Warning: Could not load TERMINOLOGY.md: ${error}`);
    return [];
  }
}

/**
 * Check if a line is inside a JSX component or is a heading
 */
function shouldSkipLine(line: string): boolean {
  const trimmed = line.trim();

  // Skip markdown headings (terms in headings don't need bilingual format)
  if (trimmed.startsWith('#')) return true;

  // Skip JSX component attribute lines
  if (trimmed.match(/^\s*<(ArabicExample|GrammarTable|VerbConjugation|Callout|ExerciseBox)/)) return true;
  if (trimmed.match(/^\s*\w+="/)) return true;

  // Skip import lines
  if (trimmed.startsWith('import ')) return true;

  // Skip code blocks content (handled by caller)
  // Skip HTML tags
  if (trimmed.startsWith('<') && !trimmed.startsWith('<Callout') && !trimmed.startsWith('<ExerciseBox')) return true;

  return false;
}

/**
 * Validate terminology usage in MDX content
 * @param content - MDX file content
 * @param filename - File path for error reporting
 * @returns Array of validation issues
 */
export function validateTerminology(content: string, filename: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const terms = loadTerminology();

  if (terms.length === 0) {
    return [{
      line: 0,
      message: 'Warning: Could not load canonical terminology from TERMINOLOGY.md',
      severity: 'warning'
    }];
  }

  const lines = content.split('\n');

  // Track which terms have been introduced with bilingual format
  const introducedTerms = new Set<string>();

  // Track frontmatter and code blocks
  let inFrontmatter = false;
  let inCodeBlock = false;
  let frontmatterCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Track frontmatter
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

    // Skip certain line types
    if (shouldSkipLine(line)) continue;

    // Check each canonical term
    for (const term of terms) {
      // Check if Arabic term appears in this line (in prose content)
      if (line.includes(term.arabic)) {
        const termKey = term.arabic;

        // If this is the first mention, check for bilingual format
        if (!introducedTerms.has(termKey)) {
          // Expected formats:
          // 1. "English (transliteration / عَرَبِي)"
          // 2. "[English](/path) (transliteration / عَرَبِي)"
          // 3. "English (عَرَبِي)" shorthand (acceptable)

          const escapedEnglish = escapeRegex(term.english);

          const pattern1 = new RegExp(
            `${escapedEnglish}\\s*\\([^)]*${escapeRegex(term.arabic)}[^)]*\\)`
          );

          const pattern2 = new RegExp(
            `\\[${escapedEnglish}\\]\\([^)]+\\)\\s*\\([^)]*${escapeRegex(term.arabic)}[^)]*\\)`
          );

          // Also accept: term appears in a parenthetical with the English term nearby
          const pattern3 = new RegExp(
            `${escapedEnglish}[^.]*\\(.*${escapeRegex(term.arabic)}.*\\)`
          );

          if (pattern1.test(line) || pattern2.test(line) || pattern3.test(line)) {
            // Valid bilingual format found
            introducedTerms.add(termKey);
          } else {
            // Arabic term used without proper bilingual introduction
            issues.push({
              line: lineNumber,
              message: `First mention of "${term.arabic}" should use bilingual format: "${term.english} (${term.transliteration} / ${term.arabic})"`,
              severity: 'warning'
            });
            introducedTerms.add(termKey); // Mark as seen to avoid duplicate warnings
          }
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
    console.error('Usage: npx tsx scripts/validate-terminology.ts <file.mdx>');
    process.exit(1);
  }

  const filepath = args[0];

  try {
    const content = readFileSync(filepath, 'utf-8');
    const issues = validateTerminology(content, filepath);

    if (issues.length === 0) {
      console.log(`✓ ${filepath}: All terminology follows canonical format`);
      process.exit(0);
    } else {
      console.error(`✗ ${filepath}: Found ${issues.length} terminology issue(s):\n`);
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
